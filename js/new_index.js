document.querySelectorAll('.bottom-nav a').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

async function displayTodaysSchedule() {
    const todaysList = document.getElementById('todays-events-list');
    const events = await loadJSON('events.json');
    events.forEach(event => {
        const eventItem = document.createElement('div');
        eventItem.textContent = event.name;
        todaysList.appendChild(eventItem);
    });
}

async function loadJSON(url) {
    const response = await fetch(url);
    return response.json();
}

document.addEventListener('DOMContentLoaded', () => {
    displayTodaysSchedule();
});
