document.addEventListener('DOMContentLoaded', async function() {
    // JSONデータを読み込む関数
    async function loadJSON(url) {
        const response = await fetch(url);
        return response.json();
    }

    // 本日の日付が一致するかを判定する関数
    function isToday(date) {
        const today = new Date();
        return date.getFullYear() === today.getFullYear() &&
               date.getMonth() === today.getMonth() &&
               date.getDate() === today.getDate();
    }

    // イベントを表示する関数
    async function displayTodaysEventsAndStreaming() {
        const todaysList = document.getElementById('todays-events-list');
        const streaming_events = await loadJSON('json/streaming_events.json');
        const onsite_events = await loadJSON('json/onsite_events.json');

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
            if (isToday(eventDate)) {
                const eventItem = document.createElement('div');
                const eventTime = event.start_time && event.end_time ? ` (${event.start_time} - ${event.end_time})` : '';
                eventItem.textContent = `${event.name}${eventTime}`;
                todaysList.appendChild(eventItem);
            }
        });
    }

    // 初期化関数
    async function init() {
        await displayTodaysEventsAndStreaming();
    }

    // ページが読み込まれたときに初期化関数を実行
    init();
});
