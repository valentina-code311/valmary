import firebase_admin
from firebase_admin import firestore

_db = None


def get_db():
    """Devuelve el cliente de Firestore (inicializa la app en el primer uso)."""
    global _db
    if _db is None:
        if not firebase_admin._apps:
            # Usa GOOGLE_APPLICATION_CREDENTIALS del entorno
            firebase_admin.initialize_app()
        _db = firestore.client()
    return _db
