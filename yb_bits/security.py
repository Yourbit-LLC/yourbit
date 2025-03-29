import os
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.asymmetric.x25519 import X25519PrivateKey
from cryptography.hazmat.primitives.serialization import Encoding, PublicFormat


def encrypt_bit(plaintext: str, post_key: bytes):
    iv = os.urandom(12)
    cipher = Cipher(algorithms.AES(post_key), modes.GCM(iv))
    encryptor = cipher.encryptor()
    ciphertext = encryptor.update(plaintext.encode()) + encryptor.finalize()
    
    return iv + encryptor.tag + ciphertext

def decrypt_bit(encrypted_post, post_key):
    """Decrypt a post using the post key."""
    iv = encrypted_post[:12]
    tag = encrypted_post[12:28]
    ciphertext = encrypted_post[28:]

    cipher = Cipher(algorithms.AES(post_key), modes.GCM(iv, tag))
    decryptor = cipher.decryptor()
    return decryptor.update(ciphertext) + decryptor.finalize()

def generate_friend_key():
    """Generate a new 256-bit AES key for a friend."""
    return os.urandom(32)


def encrypt_friend_key(friend_key, user_private_key, friend_public_key):
    """Encrypt the friend key using ECDH key exchange."""
    shared_secret = user_private_key.exchange(ec.ECDH(), friend_public_key)
    derived_key = HKDF(
        algorithm=hashes.SHA256(),
        length=32,
        salt=None,
        info=b"friend-key-exchange"
    ).derive(shared_secret)
    
    return encrypt_bit(friend_key.hex(), derived_key)  # Encrypt friend key

def derive_post_key(friend_key, post_id):
    """Derive a unique encryption key for each post."""
    return HKDF(
        algorithm=hashes.SHA256(),
        length=32,
        salt=str(post_id).encode(),
        info=b"post-key-derivation"
    ).derive(friend_key)


def decrypt_friend_key(encrypted_friend_key, friend_private_key, user_public_key):
    """Decrypt the friend's shared key using ECDH."""
    shared_secret = friend_private_key.exchange(ec.ECDH(), user_public_key)
    derived_key = HKDF(
        algorithm=hashes.SHA256(),
        length=32,
        salt=None,
        info=b"friend-key-exchange"
    ).derive(shared_secret)

    decrypted_key_hex = decrypt_bit(encrypted_friend_key, derived_key)
    return bytes.fromhex(decrypted_key_hex.decode())  # Convert back to bytes

def decrypt_post_for_friend(encrypted_post, decrypted_friend_key, post_id):
    """Decrypt a post using the derived post key."""
    post_key = derive_post_key(decrypted_friend_key, post_id)
    return decrypt_bit(encrypted_post, post_key).decode()

