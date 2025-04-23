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