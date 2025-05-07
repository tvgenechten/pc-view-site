fetch('https://pcview.tiboit.org/funfact')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const titel = data.titel;
        const inhoud = data.inhoud;

        document.getElementById("funfact-title").innerText = titel;
        document.getElementById("funfact-text").innerText = inhoud;
    })
    .catch(error => {
        const errorMessage = error.message || "Onbekende fout";
        document.getElementById("funfact-title").innerText = "Funfact";
        document.getElementById("funfact-text").innerText = "De API heeft het opgegeven :( \n" + errorMessage;
        console.error('Fout bij ophalen funfact:', error);
    });
