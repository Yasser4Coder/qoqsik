from typing import Optional
from fastapi import APIRouter
from pydantic import BaseModel, Field

from ..services import rag

router = APIRouter(prefix="/rag", tags=["rag"])


class RAGQuery(BaseModel):
    query: str = Field(min_length=1, description="The question or query to search for")
    top_k: Optional[int] = Field(default=4, ge=1, le=20, description="Number of documents to retrieve")


class RAGResponse(BaseModel):
    answer: str
    sources: str
    documents: list


@router.post("/query", response_model=RAGResponse)
async def query_rag(payload: RAGQuery):
    """Query the RAG system with a question and get an answer with sources."""
    # Search for relevant documents
    docs = rag.search_qdrant(payload.query, top_k=payload.top_k)
    
    # Build the prompt with context
    prompt = rag.build_prompt(payload.query, docs)
    
    # Call the LLM to get an answer
    answer = rag.call_llm(prompt)
    
    # Format sources
    sources = rag.format_sources(docs)
    
    return RAGResponse(
        answer=answer,
        sources=sources,
        documents=docs
    )

