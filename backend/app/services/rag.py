import httpx
import json
from typing import List, Dict, Any, Optional
from ..config import get_settings
from ..utils.embedding import get_embedding
from ..services.Qdrant import semantic_search
from huggingface_hub import InferenceClient
settings = get_settings()

QWEN_API_URL = settings.qwen_api_url
QWEN_API_KEY = settings.qwen_api_key
QWEN_GENERATE_PATH = settings.qwen_generate_path
LLM_MODEL = settings.llm_model
client = InferenceClient(api_key=get_settings().qwen_api_key)

async def search_multiple_collections(query: str, top_k_per_collection: int = 2) -> List[Dict[str, Any]]:
    """Search across multiple collections (documents, employees, users, chat_messages) and combine results."""
    collections = ["documents", "employees", "users", "chat_messages"]
    all_results: List[Dict[str, Any]] = []
    
    for collection_name in collections:
        try:
            hits = await semantic_search(collection_name, query, limit=top_k_per_collection)
            for h in hits:
                if hasattr(h, "payload"):
                    payload = h.payload or {}
                    result_id = getattr(h, "id", None)
                    score = getattr(h, "score", None)
                elif isinstance(h, dict):
                    payload = h.get("payload", {})
                    result_id = h.get("id")
                    score = h.get("score")
                else:
                    continue

                # Extract text content
                text = None
                for k in ("text", "content", "body", "title", "full_name", "email"):
                    if isinstance(payload, dict) and k in payload and payload[k]:
                        text = str(payload[k])
                        break
                
                if text is None:
                    mongo_id = payload.get("mongo_id")
                    if mongo_id:
                        text = f"[{collection_name}:{mongo_id}]"
                    else:
                        text = json.dumps(payload) if payload else ""

                all_results.append({
                    "id": result_id,
                    "score": score,
                    "payload": {**payload, "collection": collection_name},
                    "text": text,
                    "collection": collection_name,
                })
        except Exception as e:
            # Continue searching other collections if one fails
            print(f"Error searching collection {collection_name}: {e}")
            continue
    
    # Sort by score (descending) and return top results
    all_results.sort(key=lambda x: x.get("score", 0), reverse=True)
    return all_results[:top_k_per_collection * len(collections)]


async def search_qdrant(query: str, top_k: int = 4, collection_name: str = "documents") -> List[Dict[str, Any]]:
    """Embed the query, search Qdrant, and return a list of hit dicts with text and metadata."""
    # Call async semantic_search
    hits = await semantic_search(collection_name, query, limit=top_k)

    results: List[Dict[str, Any]] = []
    for h in hits:
        # Handle Qdrant search result object or dict
        if hasattr(h, "payload"):
            payload = h.payload or {}
            result_id = getattr(h, "id", None)
            score = getattr(h, "score", None)
        elif isinstance(h, dict):
            payload = h.get("payload", {})
            result_id = h.get("id")
            score = h.get("score")
        else:
            continue

        # payload may contain 'text', 'content', 'body', 'source' etc. pick best available
        text = None
        for k in ("text", "content", "body", "title"):
            if isinstance(payload, dict) and k in payload and payload[k]:
                text = str(payload[k])
                break
        
        if text is None:
            # Try to get mongo_id and fetch original content
            mongo_id = payload.get("mongo_id")
            collection = payload.get("collection", collection_name)
            if mongo_id:
                text = f"[{collection}:{mongo_id}]"
            else:
                # fallback to a stringified payload
                text = json.dumps(payload) if payload else ""

        results.append({
            "id": result_id,
            "score": score,
            "payload": payload,
            "text": text,
        })

    return results


def build_prompt(query: str, docs: List[Dict[str, Any]], conversation_history: Optional[List[Dict[str, str]]] = None) -> str:
    """Create a prompt combining retrieved docs, conversation history, and the user query.

    The LLM should use the provided context to answer and cite sources.
    """
    # Build context from retrieved documents
    context_parts = []
    if docs:
        for i, d in enumerate(docs, start=1):
            score = d.get("score", 0)
            text = d.get("text", "")
            header = f"[DOC {i} | score={score:.3f}]"
            context_parts.append(header + "\n" + text + "\n")
        context = "\n---\n".join(context_parts)
    else:
        context = "No relevant documents found in the knowledge base."

    # Build conversation history context
    history_context = ""
    if conversation_history and len(conversation_history) > 0:
        history_parts = []
        # Include last few exchanges for context (reverse to show most recent first, then reverse again)
        recent_history = conversation_history[-6:]  # Last 3 exchanges (user + assistant pairs)
        for msg in recent_history:
            role_label = "User" if msg.get("role") == "user" else "Assistant"
            history_parts.append(f"{role_label}: {msg.get('content', '')}")
        history_context = "\n\nRECENT CONVERSATION:\n" + "\n".join(history_parts)

    system = (
        "You are a helpful AI assistant. Answer user questions using the provided context from the knowledge base. "
        "Use only the information from the context when possible. If the context doesn't contain relevant information, "
        "you can provide a general answer but clearly state that it's based on general knowledge, not the knowledge base. "
        "Cite sources by referencing the DOC number like [DOC 1] when using information from the context."
    )

    prompt = (
        system
        + "\n\nKNOWLEDGE BASE CONTEXT:\n"
        + context
        + history_context
        + "\n\nUser question: "
        + query
        + "\n\nAssistant:"
    )

    return prompt


def call_llm(prompt: str) -> str:
    """Call the Qwen generate endpoint and return the assistant response as text."""
    url = QWEN_API_URL.rstrip("/") + QWEN_GENERATE_PATH
    response = client.conversational(
        prompt=prompt,
        model="Qwen/Qwen3-14B"   # or the exact Qwen3 model you want
    )
    # Fallback: try to stringify common nested locations
    if isinstance(response, str):
        return response

    return json.dumps(response)

def format_sources(docs: List[Dict[str, Any]]) -> str:
    parts = []
    for i, d in enumerate(docs, start=1):
        src = d.get("payload", {}).get("source") or d.get("payload", {}).get("url") or d.get("payload", {}).get("filename")
        parts.append(f"[DOC {i}] id={d.get('id')} score={d.get('score')} source={src}")
    return "\n".join(parts)