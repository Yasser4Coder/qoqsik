from typing import Optional
from fastapi import APIRouter
from pydantic import BaseModel, Field

from ..services import rag
from ..services.Qdrant import fix_all_collections

router = APIRouter(prefix="/rag", tags=["rag"])


class RAGQuery(BaseModel):
    collection_name: str = Field(default="sba", description="The collection name to search in")
    query: str = Field(min_length=1, description="The question or query to search for")
    top_k: Optional[int] = Field(default=4, ge=1, le=20, description="Number of documents to retrieve")


class RAGResponse(BaseModel):
    answer: str
    sources: str
    documents: list


@router.post("/query", response_model=RAGResponse)
async def query_rag(payload: RAGQuery):
    """Query the RAG system with a question and get an answer with sources."""
    try:
        # Search across multiple collections
        docs = await rag.search_multiple_collections(
            query=payload.query,
            top_k_per_collection=payload.top_k // 4  # Distribute top_k across collections
        )
        
        # Build the prompt with context (no conversation history for standalone query)
        prompt = rag.build_prompt(payload.query, docs, conversation_history=None)
        
        # Call the LLM to get an answer
        answer = await rag.call_llm(prompt)
        
        # Format sources
        sources = rag.format_sources(docs)
        
        return RAGResponse(
            answer=answer,
            sources=sources,
            documents=docs
        )
    except ValueError as e:
        # Handle configuration errors gracefully
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(e)
        )


@router.post("/fix-collections")
async def fix_qdrant_collections():
    """
    Fix all Qdrant collections by recreating them with the correct embedding dimension.
    WARNING: This will delete all existing vectors in all collections!
    
    Use this endpoint if you're getting dimension mismatch errors.
    """
    try:
        results = await fix_all_collections()
        return {
            "message": "Collections fixed successfully",
            "results": results
        }
    except Exception as e:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fixing collections: {str(e)}"
        )

