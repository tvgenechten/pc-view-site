function validateFileSize() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    // Maximaal 5 MB
    const maxSize = 2 * 1024 * 1024;

    if (file && file.size > maxSize) {
        alert('Bestand is te groot! Maximaal toegestaan is 2 MB.');
        fileInput.value = '';  // Verwijder geselecteerd bestand
    }
}