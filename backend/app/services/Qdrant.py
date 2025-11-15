import hashlib
from typing import Optional
from ..database import connect_qdrant
from ..config import get_settings
from qdrant_client.models import (
    PointStruct,
    VectorParams,
    Distance,
)
from ..utils.embedding import get_embedding, get_embedding_dimension

# Get embedding dimension dynamically - will be set on first use
# Default to 1024 as that seems to be the actual dimension of the model
EMBEDDING_DIMENSION = 1024  # Updated based on actual model output

settings = get_settings()

# Collection name mapping for Qdrant
QDRANT_COLLECTIONS = {
    "documents": "documents",
    "chat_messages": "chat_messages",
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
        # Get actual embedding dimension dynamically
        try:
            vector_size = get_embedding_dimension()
        except Exception:
            vector_size = EMBEDDING_DIMENSION
    
    try:
        if not client.collection_exists(collection_name):
            print(f"Creating Qdrant collection '{collection_name}' with dimension {vector_size}")
            client.create_collection(
                collection_name=collection_name,
                vectors_config=VectorParams(
                    size=vector_size,
                    distance=Distance.COSINE
                )
            )
            print(f"Created Qdrant collection '{collection_name}' with dimension {vector_size}")
    except Exception as e:
        # If collection already exists, we need to check if it has the right dimension
        if "already exists" in str(e).lower() or "exists" in str(e).lower():
            # Collection exists - check dimension match
            try:
                collection_info = client.get_collection(collection_name)
                existing_size = collection_info.config.params.vectors.size
                if existing_size != vector_size:
                    print(f"WARNING: Qdrant collection '{collection_name}' exists with dimension {existing_size}, but we're trying to use {vector_size}.")
                    print(f"Please recreate the collection or update it to use dimension {vector_size}.")
            except Exception:
                pass
        else:
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
        
        # Get actual embedding dimension
        try:
            actual_dimension = get_embedding_dimension()
        except Exception:
            actual_dimension = EMBEDDING_DIMENSION
        
        # Check if collection exists and verify dimension
        collection_exists = False
        correct_dimension = True
        try:
            if client.collection_exists(qdrant_collection):
                collection_exists = True
                collection_info = client.get_collection(qdrant_collection)
                existing_size = collection_info.config.params.vectors.size
                if existing_size != actual_dimension:
                    correct_dimension = False
                    print(f"ERROR: Qdrant collection '{qdrant_collection}' has dimension {existing_size}, but model outputs {actual_dimension}.")
                    print(f"Please delete and recreate the collection '{qdrant_collection}' with dimension {actual_dimension}.")
                    return False
        except Exception as e:
            # If we can't check, try to create/initialize anyway
            print(f"Could not check collection info: {e}")
        
        # Initialize collection if needed (will only create if doesn't exist)
        _init_qdrant_collection_if_needed(client, qdrant_collection, vector_size=actual_dimension)
        
        # Generate embedding
        vector = get_embedding(text)
        
        # Verify vector dimension matches
        if len(vector) != actual_dimension:
            print(f"ERROR: Generated vector has dimension {len(vector)}, but expected {actual_dimension}.")
            return False
        
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
        
        # Get actual embedding dimension and verify collection dimension
        try:
            actual_dimension = get_embedding_dimension()
        except Exception:
            actual_dimension = EMBEDDING_DIMENSION
        
        # Check collection dimension
        try:
            collection_info = client.get_collection(qdrant_collection)
            existing_size = collection_info.config.params.vectors.size
            if existing_size != actual_dimension:
                print(f"ERROR: Qdrant collection '{qdrant_collection}' has dimension {existing_size}, but model outputs {actual_dimension}.")
                print(f"Please delete and recreate the collection '{qdrant_collection}' with dimension {actual_dimension}.")
                return []
        except Exception as e:
            print(f"Could not verify collection dimension: {e}")
        
        vector = get_embedding(query)
        
        # Verify vector dimension
        if len(vector) != actual_dimension:
            print(f"ERROR: Generated vector has dimension {len(vector)}, but expected {actual_dimension}.")
            return []
        
        results = client.search(
            collection_name=qdrant_collection,
            query_vector=vector,
            limit=limit
        )
        return results
    except Exception as e:
        print(f"Error performing semantic search: {e}")
        return []

async def recreate_collection_with_correct_dimension(collection_name: str) -> bool:
    """
    Delete and recreate a Qdrant collection with the correct embedding dimension.
    WARNING: This will delete all existing vectors in the collection!
    
    Args:
        collection_name: Name of the Qdrant collection to recreate
        
    Returns:
        True if successful, False otherwise
    """
    if not settings.qdrant_url:
        print("Qdrant is not configured. Cannot recreate collection.")
        return False
    
    try:
        client = connect_qdrant()
        qdrant_collection = QDRANT_COLLECTIONS.get(collection_name, collection_name)
        
        # Get actual embedding dimension
        try:
            actual_dimension = get_embedding_dimension()
        except Exception:
            actual_dimension = EMBEDDING_DIMENSION
        
        # Check if collection exists
        if client.collection_exists(qdrant_collection):
            try:
                collection_info = client.get_collection(qdrant_collection)
                existing_size = collection_info.config.params.vectors.size
                
                if existing_size == actual_dimension:
                    print(f"Collection '{qdrant_collection}' already has correct dimension {actual_dimension}. No action needed.")
                    return True
                
                print(f"Deleting collection '{qdrant_collection}' with incorrect dimension {existing_size}...")
                client.delete_collection(qdrant_collection)
                print(f"Collection '{qdrant_collection}' deleted successfully.")
            except Exception as e:
                print(f"Error deleting collection '{qdrant_collection}': {e}")
                return False
        
        # Create collection with correct dimension
        print(f"Creating collection '{qdrant_collection}' with dimension {actual_dimension}...")
        client.create_collection(
            collection_name=qdrant_collection,
            vectors_config=VectorParams(
                size=actual_dimension,
                distance=Distance.COSINE
            )
        )
        print(f"Collection '{qdrant_collection}' created successfully with dimension {actual_dimension}.")
        return True
        
    except Exception as e:
        print(f"Error recreating collection '{qdrant_collection}': {e}")
        return False


async def fix_all_collections() -> dict[str, bool]:
    """
    Fix all Qdrant collections by recreating them with the correct dimension.
    WARNING: This will delete all existing vectors in all collections!
    
    Returns:
        Dictionary mapping collection names to success status
    """
    results = {}
    collections_to_fix = list(QDRANT_COLLECTIONS.keys())
    
    print("=" * 60)
    print("Fixing Qdrant collections with correct embedding dimension...")
    print("=" * 60)
    
    for collection_name in collections_to_fix:
        print(f"\nFixing collection: {collection_name}")
        results[collection_name] = await recreate_collection_with_correct_dimension(collection_name)
        print()
    
    print("=" * 60)
    print("Collection fix completed!")
    print("=" * 60)
    
    return results


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

async def create_collection(collection_name: str , vectors_config: VectorParams):
    client = connect_qdrant()
    await client.create_collection(collection_name=collection_name, vectors_config=VectorParams(size=1536, distance=Distance.COSINE))