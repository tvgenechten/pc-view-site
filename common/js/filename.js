function updateFileName() {
    const input = document.getElementById('fileInput');
    const fileName = input.files.length > 0 ? input.files[0].name : "";
    document.getElementById('fileName').textContent = fileName;
}

function fileNameSetSnap() {
    document.getElementById('fileName').textContent = "foto.jpg"
}

function fileNameReset() {
    document.getElementById('fileName').textContent = ""
}