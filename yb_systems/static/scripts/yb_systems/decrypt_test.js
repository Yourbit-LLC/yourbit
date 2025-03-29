import init, { decrypt_post } from "./wasm_post_decryptor/wasm_post_decryptor.js";

const friendKey = new Uint8Array(32); // Replace with actual friend key
const postId = new TextEncoder().encode("example-post-id");
const nonce = new Uint8Array(12); // Replace with the nonce used for AES-GCM
const ciphertext = new Uint8Array([]); // Your AES-encrypted bytes
const tag = new Uint8Array(16); // AES-GCM authentication tag

document.getElementById("decryptBtn").addEventListener("click", async () => {
  await init(); // load wasm module

  try {
    const plaintextBytes = decrypt_post(friendKey, postId, nonce, ciphertext, tag);
    const text = new TextDecoder().decode(plaintextBytes);
    document.getElementById("output").textContent = text;
  } catch (e) {
    document.getElementById("output").textContent = `Error: ${e}`;
  }
  
});