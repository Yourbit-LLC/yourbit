const cookie = document.cookie;
const csrf = document.getElementById('csrf-token').value;

function getCSRF() {
    let cookie = document.cookie;
    let csrf = document.getElementById('csrf-token').value;
    return csrf
}