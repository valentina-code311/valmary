from fastapi import APIRouter, HTTPException
from utils.firebase_client import get_db


def build_crud_router(collection_name: str) -> APIRouter:
    """Crea un router CRUD estándar sobre una colección de Firestore."""
    router = APIRouter()

    @router.get("/")
    def list_documents():
        db = get_db()
        docs = db.collection(collection_name).stream()
        return [{"id": doc.id, **doc.to_dict()} for doc in docs]

    @router.get("/{document_id}")
    def get_document(document_id: str):
        db = get_db()
        doc = db.collection(collection_name).document(document_id).get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Document not found")
        return {"id": doc.id, **doc.to_dict()}

    @router.post("/")
    def create_document(data: dict):
        db = get_db()
        document_id = data.pop("id", None)
        if document_id:
            ref = db.collection(collection_name).document(document_id)
        else:
            ref = db.collection(collection_name).document()
        ref.set(data)
        return {"id": ref.id, **data}

    @router.patch("/{document_id}")
    def update_document(document_id: str, data: dict):
        db = get_db()
        ref = db.collection(collection_name).document(document_id)
        if not ref.get().exists:
            raise HTTPException(status_code=404, detail="Document not found")
        ref.update(data)
        doc = ref.get()
        return {"id": doc.id, **doc.to_dict()}

    @router.delete("/{document_id}")
    def delete_document(document_id: str):
        db = get_db()
        ref = db.collection(collection_name).document(document_id)
        if not ref.get().exists:
            raise HTTPException(status_code=404, detail="Document not found")
        ref.delete()
        return {"deleted": True}

    return router
