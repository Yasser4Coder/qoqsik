import logging
from cryptography.fernet import Fernet

from ..config import get_settings

_settings = get_settings()
_raw_key = (_settings.encryption_key or "").strip().strip('"').strip("'")


def _initialize_fernet() -> tuple[str, Fernet]:
  if _raw_key:
    try:
      key_bytes = _raw_key.encode()
      return _raw_key, Fernet(key_bytes)
    except ValueError:
      logging.warning("Invalid ENCRYPTION_KEY detected. Generating a temporary key instead.")
  generated = Fernet.generate_key().decode()
  return generated, Fernet(generated.encode())


_key, _fernet = _initialize_fernet()


def encrypt(value: str) -> str:
  return _fernet.encrypt(value.encode()).decode()


def decrypt(value: str) -> str:
  return _fernet.decrypt(value.encode()).decode()

