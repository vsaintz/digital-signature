# django/signatures/services.py
import base64
import hashlib
import json
from documents.models import Document
from .models import DocumentSignature
from .crypto import (
    ensure_user_profile, 
    decrypt_private_key, 
    sign_data_with_algorithm, 
    verify_signature_with_algorithm
)

class SignatureService:
    @staticmethod
    def compute_document_hash(document: Document) -> bytes:
        data = document.get_normalized_data()
        if not data:
            raise ValueError("Document has no normalized data to sign.")
        data_string = json.dumps(data.normalized_data, sort_keys=True)
        return hashlib.sha256(data_string.encode('utf-8')).digest()

    @classmethod
    def sign_document(cls, document: Document, user) -> DocumentSignature:
        doc_hash = cls.compute_document_hash(document)
        
        profile = ensure_user_profile(user)
        
        private_key_pem = decrypt_private_key(profile.private_key)
        
        raw_signature = sign_data_with_algorithm(
            data_bytes=doc_hash, 
            private_pem=private_key_pem, 
            algorithm=profile.signature_algorithm
        )
        
        doc_signature = DocumentSignature.objects.create(
            document=document,
            signer=user,
            document_hash=doc_hash.hex(),
            cryptographic_signature=base64.b64encode(raw_signature).decode('utf-8'),
            public_key=profile.public_key,
            certificate=profile.certificate,
            algorithm=profile.signature_algorithm
        )

        return doc_signature

    @classmethod
    def verify_signature(cls, signature: DocumentSignature) -> bool:
        current_hash = cls.compute_document_hash(signature.document)
        
        return verify_signature_with_algorithm(
            public_key_pem=signature.public_key,
            signature_base64=signature.cryptographic_signature,
            data_bytes=current_hash,
            algorithm=signature.algorithm
        )