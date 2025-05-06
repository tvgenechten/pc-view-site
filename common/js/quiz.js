const url = "http://127.0.0.1:8000/quiz";
let vragen = [];
let huidigeVraagIndex = 0;
let juistCount = 0;

function getQuiz() {
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            vragen = data["lijst met vragen"].sort(() => Math.random() - 0.5);
            console.log(vragen)
            toonVraag();
        })
        .catch((error) => console.log(error));
}

function toonVraag() {
    const quizDiv = document.getElementById('quiz');
    const vraag = vragen[huidigeVraagIndex];
    const juisteAantal = vraag.antwoorden.filter(a => a.juist).length;
    const inputType = juisteAantal > 1 ? 'checkbox' : 'radio';
    const keuzeTekst = juisteAantal > 1
        ? 'Kies 1 of meerdere antwoorden:'
        : 'Kies 1 antwoord:';

    let antwoordenHTML = '';
    vraag.antwoorden.forEach((antwoord, index) => {
        antwoordenHTML += `      
        <div class="col-xl-5 col-12 m-2">
            <input type="${inputType}" class="bvg-btn btn-check col-12" id="input-${index}" name="antwoord" autocomplete="off" data-juist="${antwoord.juist}">
            <label class="btn bvg-btn col-12 antwoord-label" for="input-${index}" id="label-${index}">${antwoord.antwoord}</label>
        </div>
    `;
    });


    quizDiv.innerHTML = `
        <H3 class="bvg-titel">${vraag.vraag}</H3>
        <p>${keuzeTekst}</p>

        <div class="d-flex gap-2 flex-wrap align-items-center justify-content-center">
        ${antwoordenHTML}            
        </div>
      `;

    document.getElementById('checkBtn').style.display = 'inline';
    document.getElementById('nextBtn').style.display = 'none';
}

function controleerAntwoord() {
    const inputs = document.getElementsByName('antwoord');
    if (inputs.length === 0) return;

    let geselecteerd = false;
    let vraagJuist = true;

    inputs.forEach((input, index) => {
        const label = document.getElementById(`label-${index}`);
        input.disabled = false;

        if (input.checked) {
            geselecteerd = true;

            if (input.dataset.juist === 'true') {
                input.classList.add('bvg-btn-juist');
                label.classList.add('bvg-btn-juist');
            } else {
                input.classList.add('bvg-btn-fout');
                label.classList.add('bvg-btn-fout');
                vraagJuist = false;
            }
        }
    });

    if (!geselecteerd) {
        appendAlert('Gelieve een antwoord te selecteren.', 'warning');
        return;
    }

    // Als het antwoord fout is → toon alsnog de juiste antwoorden
    if (!vraagJuist) {
        inputs.forEach((input, index) => {
            const label = document.getElementById(`label-${index}`);
            if (input.dataset.juist === 'true') {
                input.classList.add('bvg-btn-juist');
                label.classList.add('bvg-btn-juist');
            }
        });
    }

    // Disable inputs na controle
    inputs.forEach(input => {
        input.disabled = true;
    });

    // Labels disablen
    document.querySelectorAll('label').forEach(l => l.classList.add('disabled'));

    // Score verhogen als de vraag volledig juist beantwoord is
    if (vraagJuist) juistCount++;

    document.getElementById('checkBtn').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'inline';
}




function volgendeVraag() {
    huidigeVraagIndex++;

    if (huidigeVraagIndex < vragen.length) {
        toonVraag();
    } else {
        document.getElementById('quiz').innerHTML = '';
        document.getElementById('checkBtn').style.display = 'none';
        document.getElementById('nextBtn').style.display = 'none';
        document.getElementById('stopBtn').style.display = 'none';
        let quizInner = document.getElementById('quizInner');
        quizInner.classList.replace('justify-content-between', 'justify-content-center');
        quizInner.classList.add('align-items-center');
        document.getElementById('resultaat').textContent = `Je had ${juistCount} van de ${vragen.length} vragen juist.`;
    }
}

// Start quiz ophalen bij laden
getQuiz();






//verbetering:
const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
}

const alertTrigger = document.getElementById('liveAlertBtn')
if (alertTrigger) {
    alertTrigger.addEventListener('click', () => {
        appendAlert('In het hart van de stad, waar lichten nooit doven en dromen blijven leven, loopt een jongen met vuur in z’n ogen. Elke stap is een strijd, maar hij blijft gaan. Niet voor roem, maar voor respect. Want op straat telt alleen wie echt is. En hij? Hij is echt.', 'warning')
    })
}

// Klasse juist en fout bestaan. Zorgen ervoor dat de knop rood bij fout antwoord en groen bij juist antwoord.