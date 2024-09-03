// グローバル変数として宣言
let onsite_events = [];
let streaming_events = [];
let contents = {};
let locations = {};
let holidays = [];
let persons = []; // persons用の変数

// JSONファイルを非同期に読み込む関数
async function loadJSON() {
    try {
        const onsiteEventsResponse = await fetch('json/onsite_events.json');
        const streamingEventsResponse = await fetch('json/streaming_events.json');
        const contentsResponse = await fetch('json/contents.json');
        const locationsResponse = await fetch('json/locations.json');
        const holidaysResponse = await fetch('json/holidays.json');
        const personsResponse = await fetch('json/persons.json'); // persons JSONの読み込み

        onsite_events = await onsiteEventsResponse.json();
        streaming_events = await streamingEventsResponse.json();
        contents = await contentsResponse.json();
        locations = await locationsResponse.json();
        holidays = await holidaysResponse.json();
        persons = await personsResponse.json(); // personsデータの格納

        // JSONが読み込まれた後にカレンダーを作成
        const { month, year } = getMonthYearFromURL();
        currentMonth = month;
        currentYear = year;
        createCalendar(currentYear, currentMonth);

    } catch (error) {
        console.error('JSONの読み込み中にエラーが発生しました:', error);
    }
}

// ページが読み込まれたときにJSONをロードする
window.onload = loadJSON;

const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const closeButton = document.querySelector(".close-button");
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function closeModal() {
    modal.style.display = "none";
}

function openModal(content) {
    modalBody.innerHTML = content;
    modal.style.display = "block";
}

closeButton.addEventListener("click", closeModal);

window.addEventListener("click", (event) => {
    if (event.target == modal) {
        closeModal();
    }
});

function getMonthYearFromURL() {
    const params = new URLSearchParams(window.location.search);
    const month = params.get('month');
    const year = params.get('year');
    return { month: month ? parseInt(month) - 1 : new Date().getMonth(), year: year ? parseInt(year) : new Date().getFullYear() };
}

// カレンダーを作成する関数
function createCalendar(year, month) {
    const calendar = document.getElementById('calendar');
    const calendarYear = document.getElementById('calendar-year');
    const calendarMonth = document.getElementById('calendar-month');
    calendar.innerHTML = '';  // カレンダーをクリア

    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

    // 年と月を表示
    calendarYear.textContent = `${year}年`;
    calendarMonth.textContent = `${month + 1}月`;

    // 曜日の行を作成
    weekdays.forEach((day, index) => {
        const weekdayCell = document.createElement('div');
        weekdayCell.className = `calendar-weekday ${index === 6 ? 'saturday' : index === 0 ? 'sunday' : ''}`;
        weekdayCell.textContent = day;
        calendar.appendChild(weekdayCell);
    });

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const numDays = lastDay.getDate();
    const startDay = firstDay.getDay();
    const today = new Date(); // 現在の日付を取得

    // 1日の位置までの空白セルを作成
    for (let i = 0; i < startDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-day empty';
        calendar.appendChild(emptyCell);
    }

    // 各日のセルを作成
    for (let date = 1; date <= numDays; date++) {
        const dayCell = document.createElement('div');
        const dayDate = new Date(year, month, date);
        const dayOfWeek = dayDate.getDay();

        // 土曜日と日曜日に特定のクラスを追加
        if (dayOfWeek === 0) {
            dayCell.className = 'calendar-day sunday';
        } else if (dayOfWeek === 6) {
            dayCell.className = 'calendar-day saturday';
        } else {
            dayCell.className = 'calendar-day';
        }

        // 今日の日付の場合、.todayクラスを追加
        if (dayDate.toDateString() === today.toDateString()) {
            dayCell.classList.add('today');
        }

        dayCell.innerHTML = `<div class="date">${date}</div>`;

        // 祝日判定
        holidays.forEach(holiday => {
            const holidayDate = new Date(holiday.date);
            if (holidayDate.toDateString() === dayDate.toDateString()) {
                dayCell.classList.add('holiday');  // 祝日のスタイルを追加
                const holidayName = document.createElement('span');
                holidayName.className = 'holiday-name';
                holidayName.textContent = holiday.name;
                dayCell.querySelector('.date').appendChild(holidayName);  // 日付の横に祝日名を追加
            }
        });

        // 誕生日の表示
        persons.forEach(person => {
            if (person.birth_month === month + 1 && person.birth_day === date) {
                const birthdayDiv = document.createElement('div');
                birthdayDiv.className = 'birthday';
                birthdayDiv.style.color = person.color;
                birthdayDiv.innerHTML = `● ${person.name}の誕生日`;
                dayCell.appendChild(birthdayDiv);
            }
        });

        // 現地イベント表示
        onsite_events.forEach(event => {
            if (new Date(event.date).toDateString() === dayDate.toDateString()) {
                const eventDiv = createEventDiv(event);
                dayCell.appendChild(eventDiv);
            }
        });

        // 配信イベント表示
        streaming_events.forEach(event => {
            if (new Date(event.date).toDateString() === dayDate.toDateString()) {
                const eventDiv = createEventDiv(event);
                dayCell.appendChild(eventDiv);
            }
        });

        calendar.appendChild(dayCell);
    }
}

// イベントのdiv要素を作成する関数
function createEventDiv(event) {
    const eventDiv = document.createElement('div');
    eventDiv.className = 'event';
    const contentCode = event.content_codes[0];
    const contentColor = contents[contentCode] ? contents[contentCode].color : '#cccccc';  // デフォルトカラー
    eventDiv.style.backgroundColor = contentColor;
    const locationName = locations[event.location_code]?.name || '';
    eventDiv.innerHTML = `
        <span class="event-time">${event.start_time + " - " + event.end_time}</span>
        <span class="event-title">${event.name.substring(0, 20) + (event.name.length > 20 ? "…" : "")}</span>
        <span class="event-location">${"＠" + locationName}</span>
    `;
    eventDiv.onclick = () => {
        const eventDetails = `
            <h2> ${event.name}</h2>
            <table class="modal-table">
                <tr>
                    <td class="label">日付</td>
                    <td class="value">${event.date}</td>
                </tr>
                <tr>
                    <td class="label">開始時刻</td>
                    <td class="value">${event.start_time}</td>
                </tr>
                <tr>
                    <td class="label">終了時刻</td>
                    <td class="value">${event.end_time}</td>
                </tr>
                <tr>
                    <td class="label">ウェブサイト</td>
                    <td class="value">${event.websites.map(url => `<a href="${url}" target="_blank">${url}</a>`).join('<br>')}</td>
                </tr>
            </table>
        `;
        openModal(eventDetails);
    };
    return eventDiv;
}

document.getElementById('prev-month').addEventListener('click', () => {
    if (currentMonth === 0) {
        currentMonth = 11;
        currentYear--;
    } else {
        currentMonth--;
    }
    updateCalendar();
});

document.getElementById('next-month').addEventListener('click', () => {
    if (currentMonth === 11) {
        currentMonth = 0;
        currentYear++;
    } else {
        currentMonth++;
    }
    updateCalendar();
});

function updateCalendar() {
    createCalendar(currentYear, currentMonth);
    window.history.pushState({}, '', `?month=${currentMonth + 1}&year=${currentYear}`);
}
