let sessionId = getSessionId()

// Functie om een veilige sessionId te genereren
function generateSessionId() {
    // Maak een sessionID
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);

    let sessionId = '';
    for (let i = 0; i < array.length; i++) {
        sessionId += array[i].toString(16).padStart(2, '0');
    }

    return sessionId;
}

// Functie om de cookie in te stellen met een sessionId
function setSessionCookie(sessionId) {
    const expireDate = new Date();
    expireDate.setTime(expireDate.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 dagen van nu

    // Stel de cookie in met de sessionId en vervaldatum
    document.cookie = `sessionId=${sessionId}; expires=${expireDate.toUTCString()}; path=/;`; //secure, httponly er weer in na testen
    // document.cookie = `sessionId=${sessionId}; expires=${expireDate.toUTCString()}; path=/; secure; HttpOnly`;
}

// Functie om de sessionId cookie op te halen
function getSessionCookie() {
    const name = 'sessionId=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length); // Return de waarde van de sessionId cookie
        }
    }
    return ''; // Geen cookie gevonden
}

// Functie die checkt of er al een sessionId is, anders een nieuwe aanmaakt
function checkAndSetSession() {
    const sessionId = getSessionCookie();
    if (sessionId === '') {
        // Geen sessionId cookie gevonden, maak een nieuwe sessionId en stel het in
        const newSessionId = generateSessionId();
        setSessionCookie(newSessionId);
        console.log('Nieuwe sessionId ingesteld:', newSessionId);
    } else {
        // Er is al een sessionId cookie
        console.log('Session ID bestaat al:', sessionId);
    }
}

// Roep de functie aan om de sessie te controleren en een nieuwe in te stellen indien nodig
checkAndSetSession();

function getSessionId() {
    // Check of er al een sessionId cookie bestaat
    let session = getCookie('sessionId');
    if (!session) {
        session = generateSessionId();
        setCookie('sessionId', session, 30);  // Stel de cookie in voor 30 dagen
    }
    return session;
}

function getCookie(name) {
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}


console.error(sessionId)