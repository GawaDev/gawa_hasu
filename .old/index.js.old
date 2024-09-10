// グローバル変数として宣言
let persons = [];
let contents = {};
let onsite_events = [];
let streaming_events = [];
let holidays = [];

// ページのテーマカラーを設定する関数
function setThemeColor() {
    const colors = ["#fb8a9b", "#c40035", "#68be8d", "#c8504b", "#b8b6b9", "#ecb542", "#639ad1", "#e78cb7", "#99d2d0"];
    const today = new Date();
    const todaysBirthdays = persons.filter(person => person.birth_month === today.getMonth() + 1 && person.birth_day === today.getDate());
    
    let selectedColors;

    if (todaysBirthdays.length > 0) {
        // 誕生日の人がいる場合、その人たちの色からランダムに選ぶ
        selectedColors = todaysBirthdays.map(person => person.color);
    } else {
        // 誕生日の人がいない場合、通常の色からランダムに選ぶ
        selectedColors = colors;
    }

    const randomColor = selectedColors[Math.floor(Math.random() * selectedColors.length)];
    document.documentElement.style.setProperty('--theme-color', randomColor);
}

// JSONファイルを非同期に読み込む関数
async function loadJSON() {
    try {
        const personsResponse = await fetch('json/persons.json');
        const contentsResponse = await fetch('json/contents.json');
        const onsiteEventsResponse = await fetch('json/onsite_events.json');
        const streamingEventsResponse = await fetch('json/streaming_events.json');
        const holidaysResponse = await fetch('json/holidays.json');

        persons = await personsResponse.json();
        contents = await contentsResponse.json();
        onsite_events = await onsiteEventsResponse.json();
        streaming_events = await streamingEventsResponse.json();
        holidays = await holidaysResponse.json();

        // テーマカラーを設定
        setThemeColor();

        displayTodaysStreaming();
        displayTodaysEvents();
        displayBirthdays();

    } catch (error) {
        console.error('JSONの読み込み中にエラーが発生しました:', error);
    }
}

// 本日の配信番組を表示する関数
function displayTodaysStreaming() {
    const todaysStreamingList = document.getElementById('todays-streaming-list');
    streaming_events.forEach(event => {
        const eventDate = new Date(event.date);
        if (isToday(eventDate)) {
            const eventItem = document.createElement('div');
            eventItem.textContent = `${event.name} (${event.start_time} - ${event.end_time})`;
            todaysStreamingList.appendChild(eventItem);
        }
    });
}

// 本日のイベントを表示する関数
function displayTodaysEvents() {
    const todaysEventsList = document.getElementById('todays-events-list');
    onsite_events.forEach(event => {
        const eventDate = new Date(event.date);
        if (isToday(eventDate)) {
            const eventItem = document.createElement('div');
            eventItem.textContent = `${event.name} (${event.start_time} - ${event.end_time})`;
            todaysEventsList.appendChild(eventItem);
        }
    });
}

// 今日の日付かを判定する関数
function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}

// 誕生日を表示する関数
function displayBirthdays() {
    const today = new Date();
    persons.forEach(person => {
        if (person.birth_month === today.getMonth() + 1 && person.birth_day === today.getDate()) {
            const birthdayDiv = document.createElement('div');
            birthdayDiv.className = 'birthday';
            birthdayDiv.innerHTML = `<span class="birthday-dot" style="color: ${person.color};">●</span> ${person.name}の誕生日`;
            document.body.appendChild(birthdayDiv);
        }
    });
}

// ページが読み込まれたときにJSONをロードする
window.onload = loadJSON;
