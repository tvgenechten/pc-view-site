// const video = document.getElementById('video');
// const canvas = document.getElementById('canvas');
// const snapButton = document.getElementById('snap');
// const fileInput = document.getElementById('fileInput');
// const uploadButton = document.getElementById('upload');
// const removeButton = document.getElementById('removePreview');
// const preview = document.getElementById('preview');
// const actionButtons = document.getElementById('actionButtons');
// const context = canvas.getContext('2d');

// let imageBlob = null;
//
// function updateUI(show) {
//
//
//     preview.style.display = show ? 'block' : 'none';
//     actionButtons.style.display = show ? 'block' : 'none';
//     const placeholders = document.querySelectorAll('.removepreview, .placeholder-glow, .placeholder');
//     placeholders.forEach(function (element) {
//         if (show) {
//             element.classList.remove('d-none');  // Verwijder de 'd-none' class als 'show' waar is
//         } else {
//             element.classList.add('d-none');     // Voeg de 'd-none' class toe als 'show' niet waar is
//         }
//     });
// }
//
// // Zorg ervoor dat je de initiële staat van de placeholders aanpast bij het laden van de pagina
// document.addEventListener('DOMContentLoaded', function () {
//     // Zet de initiële zichtbaarheid van de placeholders, bijvoorbeeld gebaseerd op een startwaarde van show
//     const show = false;  // Zet hier de gewenste startwaarde voor show (bijvoorbeeld true of false)
//     updateUI(show);
// });
//
// // Start webcam
// navigator.mediaDevices.getUserMedia({video: true})
//     .then((stream) => {
//         video.srcObject = stream;
//     })
//     .catch((err) => {
//         console.error("Kan webcam niet starten:", err);
//     });
//
// // Foto nemen
// snapButton.addEventListener('click', () => {
//     context.drawImage(video, 0, 0, canvas.width, canvas.height);
//     canvas.toBlob((blob) => {
//         imageBlob = blob;
//         preview.src = URL.createObjectURL(blob);
//         updateUI(true);
//     }, 'image/png');
//
//     document.querySelector('#resultClass').innerHTML = '<span class="placeholder col-6"></span>';
//     document.querySelector('#resultScore').innerHTML = '<span class="placeholder col-6"></span>';
//
// });
//
// // Handmatige afbeelding uploaden
// fileInput.addEventListener('change', () => {
//     const file = fileInput.files[0];
//     if (file && file.type.startsWith('image/')) {
//         imageBlob = file;
//         preview.src = URL.createObjectURL(file);
//         updateUI(true);
//     }
// });
//
// // Preview verwijderen
// removeButton.addEventListener('click', () => {
//     preview.src = '';
//     imageBlob = null;
//     fileInput.value = '';
//     updateUI(false);
// });
//
// // Upload naar backend
// uploadButton.addEventListener('click', () => {
//     if (!imageBlob) {
//         alert("Geen afbeelding geselecteerd of genomen.");
//         return;
//     }
//
//     const reader = new FileReader();
//     reader.onloadend = () => {
//         const base64Data = reader.result.split(',')[1]; // verwijder 'data:image/png;base64,...'
//
//         fetch('http://localhost:8000/upload', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 "filename": "foto.jpg",
//                 "image": base64Data
//             })
//         })
//             .then(response => response.json())  // Verander naar .json() om de JSON-respons te parsen
//             .then(result => {
//                 // Resultaat wordt als een object binnengekomen, dus je kunt er nu toegang toe krijgen.
//                 console.log(result);
//
//                 // De gewenste data is nu beschikbaar in result.result.class en result.result.score
//                 const cpuClass = result.result.class;
//                 const score = result.result.score;
//
//                 // Toon het resultaat bijvoorbeeld in een alert of op de pagina
//                 // alert(`Class: ${cpuClass}, Score: ${score}`);
//
//                 // Of toon het resultaat in een HTML-element
//                 document.querySelector('#resultClass').innerText = `Class: ${cpuClass}`;
//                 document.querySelector('#resultScore').innerText = `Score: ${score}`;
//             })
//             .catch(error => {
//                 console.error("Upload mislukt:", error);
//             });
//     };
//
//     reader.readAsDataURL(imageBlob); // start base64 conversie
// });



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
navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
        video.srcObject = stream;
    })
    .catch((err) => {
        console.error("Kan webcam niet starten:", err);
    });

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

        fetch('http://localhost:8000/upload', {
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

                document.querySelector('#resultClass').innerText = `Class: ${cpuClass}`;
                document.querySelector('#resultScore').innerText = `Score: ${roundedScore}`;

                const progressBar = document.querySelector('#progressBar');
                progressBar.style.width = `${roundedScore}%`;
                progressBar.classList.replace('d-none','d-block');
                progressBar.innerText = `${roundedScore}%`;
                document.querySelector('#progressBarOuter').classList.replace('d-none','d-block');
            })
            .catch(error => {
                console.error("Upload mislukt:", error);
            });
    };

    reader.readAsDataURL(imageBlob);
});


function resetResult() {
    document.querySelector('#resultClass').innerHTML = '<span class="placeholder col-6"></span>';
    document.querySelector('#resultScore').innerHTML = '<span class="placeholder col-6"></span>';
    document.querySelector('#progressBar').classList.replace('d-block', 'd-none');
    document.querySelector('#progressBarOuter').classList.replace('d-block', 'd-none');


}

