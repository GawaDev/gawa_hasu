// JSONデータを読み込む関数
async function loadJSON(url) {
  const response = await fetch(url);
  return response.json();
}

// 本日の日付が一致するかを判定する関数
function isToday(month, day) {
  const today = new Date();
  return today.getMonth() === month && today.getDate() === day;
}

// 本日の誕生日、イベント、配信を表示する関数
async function displayTodaysSchedule() {
  const todaysList = document.getElementById('todays-events-list');
  if (!todaysList) {
    console.error('Error: Element with ID "todays-events-list" not found.');
    return;
  }

  const persons = await loadJSON('json/persons.json');
  const streaming_events = await loadJSON('json/streaming_events.json');
  const onsite_events = await loadJSON('json/onsite_events.json');
  const contents = await loadJSON('json/contents.json');

  // 誕生日を表示
  persons.forEach(person => {
    // 月と日を比較して誕生日かどうかを判定
    if (isToday(person.birth_month - 1, person.birth_day)) {
      const birthdayItem = document.createElement('div');
      birthdayItem.className = 'birthday-item';
      birthdayItem.innerHTML = `<span class="birthday-dot" style="background-color: ${person.color}"></span>
      <span class="birthday-name">${person.name}の誕生日</span>`;
      todaysList.appendChild(birthdayItem);
    }
  });

  // イベントと配信を結合し、日付と時間でソート
  const allEvents = [...streaming_events, ...onsite_events];
  allEvents.sort((a, b) => {
    const dateA = new Date(a.date.replace(/-/g, '/')).getTime();
    const dateB = new Date(b.date.replace(/-/g, '/')).getTime();
    const timeA = a.start_time ? a.start_time.replace(':', '') : '0000';
    const timeB = b.start_time ? b.start_time.replace(':', '') : '0000';

    if (dateA === dateB) {
      return parseInt(timeA) - parseInt(timeB);
    } else {
      return dateA - dateB;
    }
  });

  // 本日のイベントと配信を表示
  allEvents.forEach(event => {
    const eventDate = new Date(event.date.replace(/-/g, '/'));
    const today = new Date();
    if (eventDate.getFullYear() === today.getFullYear() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getDate() === today.getDate()) {
      const eventItem = document.createElement('div');
      eventItem.className = 'event-item';
      const contentColor = contents[event.content_codes[0]].color || '#000';
      const eventTime = event.start_time && event.end_time ? `${event.start_time} - ${event.end_time}` : '時間未定';
      eventItem.innerHTML = `<div class="event-line" style="background-color: ${contentColor};"></div>
      <span class="event-time">${eventTime}</span>
      <span class="event-name">${event.name}</span>`;
      todaysList.appendChild(eventItem);
    }
  });
}

// 初期化関数
async function init() {
  await displayTodaysSchedule();
}

// ページが読み込まれたときに初期化関数を実行
document.addEventListener('DOMContentLoaded', init);
