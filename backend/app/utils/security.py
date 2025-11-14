from passlib.context import CryptContext

# Use pbkdf2_sha256 instead of bcrypt to avoid the 72-byte limit issue
# pbkdf2_sha256 is secure and doesn't have password length limitations
# Support both pbkdf2_sha256 (new) and bcrypt_sha256/bcrypt (old) for backward compatibility
pwd_context = CryptContext(
  schemes=["pbkdf2_sha256", "bcrypt_sha256", "bcrypt"],
  deprecated="auto",
  pbkdf2_sha256__rounds=29000,  # Recommended rounds for pbkdf2_sha256
  bcrypt_sha256__rounds=12,
  bcrypt__rounds=12,
)


def hash_password(password: str) -> str:
  """Hash a password using pbkdf2_sha256 (no password length limitations)"""
  if not password:
    raise ValueError("Password cannot be empty")
  return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
  """Verify a password against a hash"""
  if not plain_password or not hashed_password:
    return False
  try:
    return pwd_context.verify(plain_password, hashed_password)
  except Exception as e:
    # Log the error for debugging (remove in production)
    print(f"Password verification error: {e}")
    return False

