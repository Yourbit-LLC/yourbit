import init, { decrypt_post } from './wasm_post_decryptor/wasm_post_decryptor.js';

async function decryptBitWithWasm({ friendKey, postId, encryptedPost }) {
  await init(); // only needs to run once per session

  // Convert post ID to a Uint8Array if it’s a string
  const postIdBytes = new TextEncoder().encode(postId);

  // Split the encrypted payload
  const nonce = encryptedPost.slice(0, 12);
  const tag = encryptedPost.slice(encryptedPost.length - 16);
  const ciphertext = encryptedPost.slice(12, encryptedPost.length - 16);

  const plaintextBytes = decrypt_post(friendKey, postIdBytes, nonce, ciphertext, tag);
  return new TextDecoder().decode(plaintextBytes);
}
