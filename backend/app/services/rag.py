import requests
import json
from typing import List, Dict, Any
from ..config import get_settings
from ..database import connect_qdrant
from ..embedding import get_embedding



def search_qdrant(query: str, top_k: int = 4) -> List[Dict[str, Any]]:
    """Embed the query, search Qdrant, and return a list of hit dicts with text and metadata."""
    client = connect_qdrant()
    vec = get_embedding(query)

    hits = client.search(collection_name=QDRANT_COLLECTION, query_vector=vec, limit=top_k)

    results: List[Dict[str, Any]] = []
    for h in hits:
        payload = getattr(h, "payload", None) or h.payload if hasattr(h, "payload") else h["payload"] if isinstance(h, dict) and "payload" in h else {}
        # payload may contain 'text', 'content', 'body', 'source' etc. pick best available
        text = None
        for k in ("text", "content", "body", "title"):
            if isinstance(payload, dict) and k in payload and payload[k]:
                text = payload[k]
                break
        if text is None:
            # fallback to a stringified payload
            text = json.dumps(payload)

        results.append({
            "id": getattr(h, "id", h.get("id") if isinstance(h, dict) else None),
            "score": getattr(h, "score", h.get("score") if isinstance(h, dict) else None),
            "payload": payload,
            "text": text,
        })

    return results


def build_prompt(query: str, docs: List[Dict[str, Any]]) -> str:
    """Create a prompt combining retrieved docs and the user query.

    The LLM should use the provided context to answer and cite sources.
    """
    context_parts = []
    for i, d in enumerate(docs, start=1):
        header = f"[DOC {i} | id={d.get('id')} | score={d.get('score')}]"
        context_parts.append(header + "\n" + d.get("text", "") + "\n")

    context = "\n---\n".join(context_parts)

    system = (
        "You are an assistant that answers user questions using the provided context. "
        "Use only the context when possible; if you must speculate, label it clearly. "
        "Cite sources by referencing the DOC number like [DOC 1]."
    )

    prompt = (
        system
        + "\n\nCONTEXT:\n"
        + context
        + "\nUser question: "
        + query
        + "\n\nAnswer concisely and include citations to the document numbers used.\n"
    )

    return prompt


def call_llm(prompt: str) -> str:
    """Call the Qwen generate endpoint and return the assistant response as text."""
    url = QWEN_API_URL.rstrip("/") + QWEN_GENERATE_PATH
    headers = {"Content-Type": "application/json"}
    if QWEN_API_KEY:
        headers["Authorization"] = f"Bearer {QWEN_API_KEY}"

    payload = {"prompt": prompt, "model": LLM_MODEL, "max_tokens": 1024, "temperature": 0.0}
    resp = requests.post(url, headers=headers, json=payload, timeout=120)
    resp.raise_for_status()
    data = resp.json()

    # Common return shapes
    if isinstance(data, dict):
        for key in ("text", "output", "result", "generated_text", "answer"):
            if key in data and data[key]:
                return data[key]

        # Some servers return {outputs: [{text: ...}]}
        outputs = data.get("outputs") or data.get("choices")
        if isinstance(outputs, list) and outputs:
            first = outputs[0]
            for key in ("text", "output", "generated_text", "content"):
                if key in first:
                    return first[key]

    # Fallback: try to stringify common nested locations
    if isinstance(data, str):
        return data

    return json.dumps(data)


def format_sources(docs: List[Dict[str, Any]]) -> str:
    parts = []
    for i, d in enumerate(docs, start=1):
        src = d.get("payload", {}).get("source") or d.get("payload", {}).get("url") or d.get("payload", {}).get("filename")
        parts.append(f"[DOC {i}] id={d.get('id')} score={d.get('score')} source={src}")
    return "\n".join(parts)