from sentence_transformers import SentenceTransformer
from typing import Optional

# Lazy load the model to avoid blocking startup
_model: Optional[SentenceTransformer] = None
_embedding_dimension: Optional[int] = None

def _get_model() -> SentenceTransformer:
    """Lazy load the embedding model"""
    global _model
    if _model is None:
        try:
            _model = SentenceTransformer("Qwen/Qwen3-Embedding-0.6B")
            # Get actual embedding dimension from the model
            global _embedding_dimension
            test_embedding = _model.encode("test").tolist()
            _embedding_dimension = len(test_embedding)
            print(f"Embedding model loaded. Dimension: {_embedding_dimension}")
        except Exception as e:
            print(f"Warning: Could not load embedding model: {e}")
            print("Embedding functionality will be disabled.")
            raise
    return _model

def get_embedding_dimension() -> int:
    """Get the actual embedding dimension from the model"""
    global _embedding_dimension
    if _embedding_dimension is None:
        try:
            model = _get_model()
            test_embedding = model.encode("test").tolist()
            _embedding_dimension = len(test_embedding)
        except Exception:
            # Fallback to default if model can't be loaded
            _embedding_dimension = 1024  # Updated default based on actual model
    return _embedding_dimension

def get_embedding(text: str) -> list[float]:
    """Get embedding for text, with error handling"""
    try:
        model = _get_model()
        embedding = model.encode(text).tolist()
        # Update dimension if not set
        global _embedding_dimension
        if _embedding_dimension is None:
            _embedding_dimension = len(embedding)
        return embedding
    except Exception as e:
        print(f"Error generating embedding: {e}")
        # Return a dummy embedding with correct dimension
        dim = get_embedding_dimension()
        return [0.0] * dim
