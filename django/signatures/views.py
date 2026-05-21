from django.shortcuts import get_object_or_404
from documents.models import Document
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import DocumentSignature
from .services import SignatureService


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sign_document_view(request, document_id):
    document = get_object_or_404(Document, id=document_id)

    if document.owner != request.user:
        return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

    try:
        signature = SignatureService.sign_document(document, request.user)
        return Response({
            "message": "Document successfully signed and sealed.",
            "signature_id": signature.id,
            "status": document.signing_status
        }, status=status.HTTP_201_CREATED)

    except ValueError as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def verify_document_view(request, document_id):
    document = get_object_or_404(Document, id=document_id)
    signature = DocumentSignature.objects.filter(document=document).first()

    if not signature:
         return Response({"status": "unsigned"})

    is_valid = SignatureService.verify_signature(signature)

    return Response({
        "status": "verified" if is_valid else "tampered",
        "signed_by": signature.signer.email if signature.signer else "Unknown",
        "signed_at": signature.signed_at
    })
