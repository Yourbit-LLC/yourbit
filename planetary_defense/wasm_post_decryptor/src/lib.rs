// wasm_post_decryptor/src/lib.rs
use wasm_bindgen::prelude::*;
use aes_gcm::aead::{Aead, KeyInit, OsRng, AeadCore, generic_array::GenericArray};
use aes_gcm::{Aes256Gcm, Nonce};
use hkdf::Hkdf;
use sha2::Sha256;

#[wasm_bindgen]
pub fn decrypt_post(
    friend_key: &[u8],   // 32 bytes
    post_id: &[u8],      // arbitrary length, used as salt/info
    nonce: &[u8],        // 12 bytes for AES-GCM
    ciphertext: &[u8],
    tag: &[u8],          // 16 bytes GCM tag
) -> Result<Vec<u8>, JsValue> {
    // Derive a 32-byte Post Key from the Friend Key + Post ID using HKDF
    let hk = Hkdf::<Sha256>::new(Some(post_id), friend_key);
    let mut post_key = [0u8; 32];
    hk.expand(b"post key", &mut post_key).map_err(|_| JsValue::from("HKDF expand failed"))?;

    // Build AES-GCM key
    let key = GenericArray::from_slice(&post_key);
    let cipher = Aes256Gcm::new(key);

    // Build nonce and ciphertext+tag buffer
    let nonce = Nonce::from_slice(nonce);
    let mut data = ciphertext.to_vec();
    data.extend_from_slice(tag);

    // Attempt decryption
    let decrypted = cipher
        .decrypt(nonce, data.as_ref())
        .map_err(|_| JsValue::from("Decryption failed"))?;

    // Zero out the key from memory as a precaution
    for b in post_key.iter_mut() { *b = 0; }

    Ok(decrypted)
}
