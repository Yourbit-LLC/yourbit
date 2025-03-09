function storeFriendKey(friendId, friendKey) {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open("YourbitKeys", 1);
        request.onupgradeneeded = (event) => {
            let db = event.target.result;
            if (!db.objectStoreNames.contains("friendKeys")) {
                db.createObjectStore("friendKeys", { keyPath: "friendId" });
            }
        };
        request.onsuccess = (event) => {
            let db = event.target.result;
            let transaction = db.transaction("friendKeys", "readwrite");
            let store = transaction.objectStore("friendKeys");
            store.put({ friendId, friendKey });
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject();
        };
    });
}

function getFriendKey(friendId) {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open("YourbitKeys", 1);
        request.onsuccess = (event) => {
            let db = event.target.result;
            let transaction = db.transaction("friendKeys", "readonly");
            let store = transaction.objectStore("friendKeys");
            let getRequest = store.get(friendId);
            getRequest.onsuccess = () => resolve(getRequest.result?.friendKey);
            getRequest.onerror = () => reject();
        };
    });
}

async function generateECDHKeyPair() {
    let keyPair = await crypto.subtle.generateKey(
        { name: "ECDH", namedCurve: "P-256" },
        true, ["deriveKey"]
    );
    let publicKey = await crypto.subtle.exportKey("spki", keyPair.publicKey);
    let privateKey = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

    localStorage.setItem("privateKey", btoa(String.fromCharCode(...new Uint8Array(privateKey))));
    return publicKey; // Send this public key to the server
}

async function getPrivateKey() {
    let keyData = localStorage.getItem("privateKey");
    if (!keyData) return null;

    let binaryData = Uint8Array.from(atob(keyData), c => c.charCodeAt(0));
    return await crypto.subtle.importKey(
        "pkcs8", binaryData, { name: "ECDH", namedCurve: "P-256" },
        true, ["deriveKey"]
    );
}

async function computeSharedSecret(friendPublicKeyData) {
    let privateKey = await getPrivateKey();
    let friendPublicKey = await crypto.subtle.importKey(
        "spki", friendPublicKeyData,
        { name: "ECDH", namedCurve: "P-256" },
        true, []
    );

    let sharedSecret = await crypto.subtle.deriveBits(
        { name: "ECDH", public: friendPublicKey },
        privateKey, 256
    );

    return crypto.subtle.digest("SHA-256", sharedSecret); // Hash for consistency
}

async function computeSharedSecret(friendPublicKeyData) {
    let privateKey = await getPrivateKey();
    let friendPublicKey = await crypto.subtle.importKey(
        "spki", friendPublicKeyData,
        { name: "ECDH", namedCurve: "P-256" },
        true, []
    );

    let sharedSecret = await crypto.subtle.deriveBits(
        { name: "ECDH", public: friendPublicKey },
        privateKey, 256
    );

    return crypto.subtle.digest("SHA-256", sharedSecret); // Hash for consistency
}

async function derivePostKey(friendKey, postId) {
    let encoder = new TextEncoder();
    let hkdf = await crypto.subtle.importKey(
        "raw", friendKey,
        { name: "HKDF" }, false, ["deriveKey"]
    );

    return await crypto.subtle.deriveKey(
        { name: "HKDF", salt: encoder.encode(postId), info: encoder.encode("post-key-derivation"), hash: "SHA-256" },
        hkdf, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]
    );
}

async function encryptPost(plaintext, postKey) {
    let encoder = new TextEncoder();
    let iv = crypto.getRandomValues(new Uint8Array(12));

    let ciphertext = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        postKey, encoder.encode(plaintext)
    );

    return { iv, ciphertext };
}

async function decryptPost(encryptedData, iv, postKey) {
    let decoder = new TextDecoder();

    let plaintext = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        postKey, encryptedData
    );

    return decoder.decode(plaintext);
}

async function decryptFeedPost(postId, friendId, encryptedData, iv) {
    let friendKey = await getFriendKey(friendId);
    let postKey = await derivePostKey(friendKey, postId);
    return await decryptPost(encryptedData, iv, postKey);
}

async function grantNewFriendAccess(userId, newFriendId, newFriendPublicKey) {
    let friendKey = await getFriendKey(userId);
    let encryptedKey = await encryptFriendKeyForFriend(friendKey, newFriendPublicKey);

    await fetch(`/api/friends/${newFriendId}/add`, {
        method: "POST",
        body: JSON.stringify({ encryptedKey }),
        headers: { "Content-Type": "application/json" }
    });
}

async function encryptPrivateKey(privateKey, password) {
    let encoder = new TextEncoder();
    let keyMaterial = await crypto.subtle.importKey(
        "raw", encoder.encode(password),
        { name: "PBKDF2" }, false, ["deriveKey"]
    );

    let derivedKey = await crypto.subtle.deriveKey(
        { name: "PBKDF2", salt: encoder.encode("yourbit-salt"), iterations: 100000, hash: "SHA-256" },
        keyMaterial, { name: "AES-GCM", length: 256 }, false, ["encrypt"]
    );

    let exportedKey = await crypto.subtle.exportKey("pkcs8", privateKey);
    let iv = crypto.getRandomValues(new Uint8Array(12));

    let encryptedKey = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv }, derivedKey, exportedKey
    );

    return { encryptedKey, iv }; // Store these securely on the server
}

async function decryptPrivateKey(encryptedKey, iv, password) {
    let encoder = new TextEncoder();
    let keyMaterial = await crypto.subtle.importKey(
        "raw", encoder.encode(password),
        { name: "PBKDF2" }, false, ["deriveKey"]
    );

    let derivedKey = await crypto.subtle.deriveKey(
        { name: "PBKDF2", salt: encoder.encode("yourbit-salt"), iterations: 100000, hash: "SHA-256" },
        keyMaterial, { name: "AES-GCM", length: 256 }, false, ["decrypt"]
    );

    let decryptedKey = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv }, derivedKey, encryptedKey
    );

    return await crypto.subtle.importKey("pkcs8", decryptedKey, { name: "ECDH", namedCurve: "P-256" }, true, ["deriveKey"]);
}
