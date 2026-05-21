import base64
import hashlib
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding, rsa, ec
from cryptography.hazmat.backends import default_backend
from cryptography import x509
from cryptography.x509.oid import NameOID
from cryptography.fernet import Fernet
from datetime import datetime, timedelta
from django.conf import settings

def get_fernet():
    derived = hashlib.sha256(settings.SECRET_KEY.encode("utf-8")).digest()
    return Fernet(base64.urlsafe_b64encode(derived))

def encrypt_private_key(private_key: str) -> str:
    return get_fernet().encrypt(private_key.encode("utf-8")).decode("utf-8")

def decrypt_private_key(encrypted_private_key: str) -> str:
    return get_fernet().decrypt(encrypted_private_key.encode("utf-8")).decode("utf-8")

def create_rsa_pem_pair():
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
        backend=default_backend(),
    )
    private_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption(),
    ).decode("utf-8")
    public_pem = private_key.public_key().public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo,
    ).decode("utf-8")
    return private_pem, public_pem

def create_self_signed_cert(private_key_pem: str, username: str) -> str:
    private_key = serialization.load_pem_private_key(
        private_key_pem.encode("utf-8"), password=None
    )
    
    if not isinstance(private_key, rsa.RSAPrivateKey):
        raise ValueError("Key must be an RSA private key")
        
    subject = issuer = x509.Name([
        x509.NameAttribute(NameOID.ORGANIZATION_NAME, "DocuSign Digital Signature"),
        x509.NameAttribute(NameOID.COMMON_NAME, username),
    ])
    cert = (
        x509.CertificateBuilder()
        .subject_name(subject)
        .issuer_name(issuer)
        .public_key(private_key.public_key())
        .serial_number(x509.random_serial_number())
        .not_valid_before(datetime.utcnow())
        .not_valid_after(datetime.utcnow() + timedelta(days=365))
        .sign(private_key, hashes.SHA256())
    )
    return cert.public_bytes(serialization.Encoding.PEM).decode("utf-8")

# --- 3. Core Signing & Verifying Algorithms ---
def sign_data_with_algorithm(data_bytes: bytes, private_pem: str, algorithm: str) -> bytes:
    private_key = serialization.load_pem_private_key(
        private_pem.encode("utf-8"), password=None, backend=default_backend()
    )
    
    if algorithm == "RSA-SHA256":
        if not isinstance(private_key, rsa.RSAPrivateKey):
            raise ValueError("Loaded key is not an RSA private key")
            
        return private_key.sign(data_bytes, padding.PKCS1v15(), hashes.SHA256())
        
    raise ValueError(f"Unsupported algorithm: {algorithm}")

def verify_signature_with_algorithm(public_key_pem: str, signature_base64: str, data_bytes: bytes, algorithm: str) -> bool:
    try:
        public_key = serialization.load_pem_public_key(
            public_key_pem.encode("utf-8"), backend=default_backend()
        )
        signature = base64.b64decode(signature_base64, validate=True)
        
        if algorithm == "RSA-SHA256":
            if not isinstance(public_key, rsa.RSAPublicKey):
                return False
                
            public_key.verify(signature, data_bytes, padding.PKCS1v15(), hashes.SHA256())
            return True
            
        return False
    except Exception:
        return False

def ensure_user_profile(user):
    """Creates persisted keys + self-signed cert per user if they don't exist."""
    from .models import SignerProfile 
    
    profile = SignerProfile.objects.filter(user=user).first()
    if profile:
        return profile

    priv, pub = create_rsa_pem_pair()
    cert_pem = create_self_signed_cert(priv, user.email or user.username)

    return SignerProfile.objects.create(
        user=user,
        private_key=encrypt_private_key(priv),
        public_key=pub,
        certificate=cert_pem,
        signature_algorithm="RSA-SHA256",
    )