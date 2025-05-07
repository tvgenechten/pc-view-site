const categorieen = [
    'Algemeen',
    'Behuizing',
    'Processor',
    'Processor koeler',
    'Videokaart',
    'Harde schijf',
    'Moederbord',
    'Netwerk kaart',
    'Voeding',
    'RAM stick',
    'SSD'
];

const scoreList = document.getElementById('scoreList');


scoreList.innerHTML = "";

// Generate items
categorieen.forEach(cat => {
    const data = localStorage.getItem(cat);
    let icoon, scoreText;

    if (data) {
        const parsed = JSON.parse(data);
        icoon = '<i class="fa-solid fa-check text-success"></i>';
        scoreText = `${parsed.juistCount}/${parsed.totaalVragen}`;
    } else {
        icoon = '<i class="fa-solid fa-xmark text-danger"></i>';
        scoreText = '';
    }

    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'd-flex', 'align-items-center', 'gap-2');

    li.innerHTML = `
    ${icoon}
    <a class="link-info" href="/pages/quiz.html?classname=${encodeURIComponent(cat)}">${cat}</a>
    <span class="ms-auto">${scoreText}</span>
  `;

    scoreList.appendChild(li);
});

// Reset knop
document.querySelector('button.btn-danger').addEventListener('click', () => {
    categorieen.forEach(cat => localStorage.removeItem(cat));
    location.reload(); // pagina refreshen
});
