const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snapButton = document.getElementById('snap');
const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('upload');
const removeButton = document.getElementById('removePreview');
const preview = document.getElementById('preview');
const actionButtons = document.getElementById('actionButtons');
const context = canvas.getContext('2d');

let imageBlob = null;

function updateUI(show) {
    preview.style.display = show ? 'block' : 'none';
    video.style.display = show ? 'none' : 'block';
    snapButton.style.display = show ? 'none' : 'block';
    const placeholders = document.querySelectorAll('.removepreview, .placeholder-glow, .placeholder');
    placeholders.forEach(function (element) {
        if (show) {
            element.classList.remove('d-none');
        } else {
            element.classList.add('d-none');
        }
    });
}

// Bij opstart
document.addEventListener('DOMContentLoaded', function () {
    updateUI(false);
});

// Webcam starten
let currentFacingMode = 'user';

function startWebcam(facingMode = 'user') {
    if (window.currentStream) {
        window.currentStream.getTracks().forEach(track => track.stop());
    }

    navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode }
    })
        .then((stream) => {
            document.getElementById('video').srcObject = stream;
            window.currentStream = stream;
        })
        .catch((err) => {
            console.error("Kan webcam niet starten:", err);
        });
}

function switchCamera() {
    currentFacingMode = (currentFacingMode === 'user') ? 'environment' : 'user';
    startWebcam(currentFacingMode);
}

// Start met frontcamera
startWebcam(currentFacingMode);

// PNG of JPEG omzetten naar JPG
function convertToJPG(fileOrBlob, callback) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            const tmpCanvas = document.createElement('canvas');
            tmpCanvas.width = img.width;
            tmpCanvas.height = img.height;
            const ctx = tmpCanvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            tmpCanvas.toBlob((jpgBlob) => {
                callback(jpgBlob, tmpCanvas.toDataURL('image/jpeg', 0.92));
            }, 'image/jpeg', 0.92);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(fileOrBlob);
}

// Foto nemen met webcam
snapButton.addEventListener('click', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
        convertToJPG(blob, (jpgBlob, dataUrl) => {
            imageBlob = jpgBlob;
            preview.src = dataUrl;
            updateUI(true);
        });
    }, 'image/png');
});

// Upload van bestand
fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file && file.type.startsWith('image/')) {
        convertToJPG(file, (jpgBlob, dataUrl) => {
            imageBlob = jpgBlob;
            preview.src = dataUrl;
            updateUI(true);
        });
    }
});

// Preview verwijderen
removeButton.addEventListener('click', () => {
    preview.src = '';
    imageBlob = null;
    fileInput.value = '';
    updateUI(false);

    resetResult();


});

// Uploaden naar backend
uploadButton.addEventListener('click', () => {
    if (!imageBlob) {
        alert("Geen afbeelding geselecteerd of genomen.");
        return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
        const base64Data = reader.result.split(',')[1];

        fetch('http://127.0.0.1:8000/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "filename": "foto.jpg",
                "image": base64Data
            })
        })
            .then(response => response.json())
            .then(result => {
                const cpuClass = result.result.class;
                const score = result.result.score;
                let roundedScore = score.toFixed(2);

                document.querySelector('#resultClass').innerHTML = `
                <a href="/pages/explain.html?type=${cpuClass}"> ${cpuClass} </a>`;
                // document.querySelector('#resultScore').innerText = `Score: ${roundedScore}`;
                document.querySelector('#removeresult').classList.replace('d-none', 'd-block');
                const progressBar = document.querySelector('#progressBar');
                progressBar.style.width = `${roundedScore}%`;
                progressBar.innerText = `${roundedScore}%`;
            })
            .catch(error => {
                console.error("Upload mislukt:", error);
            });
    };

    reader.readAsDataURL(imageBlob);
});


function resetResult() {
    document.querySelector('#removeresult').classList.replace('d-block', 'd-none');
}

