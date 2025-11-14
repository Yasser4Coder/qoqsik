import hashlib
from typing import Optional
from ..database import connect_qdrant
from ..config import get_settings
from qdrant_client.models import (
    PointStruct,
    VectorParams,
    Distance,
)
from ..utils.embedding import get_embedding

# Get embedding dimension dynamically (Qwen/Qwen3-Embedding-0.6B outputs 768 dimensions)
# We test with a dummy string to get the actual dimension
try:
    _test_embedding = get_embedding("test")
    EMBEDDING_DIMENSION = len(_test_embedding)
except Exception:
    # Fallback to default if embedding model not loaded
    EMBEDDING_DIMENSION = 768

settings = get_settings()

# Collection name mapping for Qdrant
QDRANT_COLLECTIONS = {
    "documents": "documents",
    "chat_messages": "chat_messages",
    "users": "users",
    "employees": "employees",
    # Add more collections as needed
}


def _generate_qdrant_id(doc_id: str) -> int:
    """
    Generate a consistent integer ID for Qdrant from MongoDB ObjectId string.
    Uses SHA256 hash to avoid collisions and converts to positive int64.
    """
    hash_bytes = hashlib.sha256(doc_id.encode()).digest()
    # Take first 8 bytes and convert to unsigned int64, then ensure it's positive
    qdrant_id = int.from_bytes(hash_bytes[:8], byteorder="big")
    # Ensure it's within int64 positive range (0 to 2^63-1)
    return qdrant_id % (2**63 - 1)


def _init_qdrant_collection_if_needed(client, collection_name: str, vector_size: Optional[int] = None):
    """Initialize Qdrant collection if it doesn't exist"""
    if vector_size is None:
        vector_size = EMBEDDING_DIMENSION
    try:
        if not client.collection_exists(collection_name):
            client.create_collection(
                collection_name=collection_name,
                vectors_config=VectorParams(
                    size=vector_size,
                    distance=Distance.COSINE
                )
            )
    except Exception as e:
        # If collection already exists or other error, log and continue
        print(f"Note: Qdrant collection '{collection_name}' initialization: {e}")


async def insert_vector(collection_name: str, doc_id: str, text: str) -> bool:
    """
    Insert a vector embedding into Qdrant for semantic search.
    
    Args:
        collection_name: Name of the MongoDB collection (will map to Qdrant collection)
        doc_id: MongoDB document ID (ObjectId as string)
        text: Text content to embed and store
        
    Returns:
        True if successful, False otherwise (fails silently if Qdrant not configured)
    """
    # Skip if Qdrant is not configured
    if not settings.qdrant_url:
        return False
    
    try:
        # Get Qdrant client
        client = connect_qdrant()
        
        # Map MongoDB collection name to Qdrant collection name
        qdrant_collection = QDRANT_COLLECTIONS.get(collection_name, collection_name)
        
        # Initialize collection if needed
        _init_qdrant_collection_if_needed(client, qdrant_collection)
        
        # Generate embedding
        vector = get_embedding(text)
        
        # Generate consistent Qdrant ID from MongoDB ID
        qdrant_id = _generate_qdrant_id(doc_id)
        
        # Insert/update vector in Qdrant
        client.upsert(
            collection_name=qdrant_collection,
            points=[
                PointStruct(
                    id=qdrant_id,
                    vector=vector,
                    payload={
                        "mongo_id": doc_id,
                        "collection": collection_name,
                    }
                )
            ]
        )
        return True
    except Exception as e:
        # Log error but don't fail the request
        print(f"Error inserting vector into Qdrant: {e}")
        return False


async def semantic_search(collection_name: str, query: str, limit: int = 2):
    """
    Perform semantic search in Qdrant.
    
    Args:
        collection_name: Name of the MongoDB collection
        query: Search query text
        limit: Maximum number of results
        
    Returns:
        List of search results or empty list if Qdrant not configured
    """
    if not settings.qdrant_url:
        return []
    
    try:
        client = connect_qdrant()
        qdrant_collection = QDRANT_COLLECTIONS.get(collection_name, collection_name)
        
        if not client.collection_exists(qdrant_collection):
            return []
        
        vector = get_embedding(query)
        results = client.search(
            collection_name=qdrant_collection,
            query_vector=vector,
            limit=limit
        )
        return results
    except Exception as e:
        print(f"Error performing semantic search: {e}")
        return []

async def create_text_index(db, collection: str):
    if "text_index" not in await db[collection].index_information():
        db[collection].create_index(
            [("title", "text"), ("content", "text")],
            name="text_index"
        )
        print(f"Text index created for {collection} collection.")
    else:
        print(f"Text index already exists for {collection} collection.")
    return True