document.addEventListener('DOMContentLoaded', async function() {
    const colors = ['#fb8a9b', '#c40035', '#68be8d', '#c8504b', '#b8b6b9', '#ecb542', '#639ad1', '#e78cb7', '#99d2d0'];
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // "YYYY-MM-DD"形式に変換
  
    // JSONデータを読み込む関数
    async function loadJSON(url) {
      const response = await fetch(url);
      return response.json();
    }
  
    // データを取得し、表示する関数
    async function displayTodaysEvents() {
      try {
        const [streamingEvents, onsiteEvents, persons] = await Promise.all([
          loadJSON('json/streaming_events.json'),
          loadJSON('json/onsite_events.json'),
          loadJSON('json/persons.json')
        ]);
  
        const eventList = document.getElementById('event-list');
        eventList.innerHTML = ''; // 既存のリストをクリア
  
        // 今日のイベントをフィルタリング
        const todaysStreamingEvents = streamingEvents.filter(event => new Date(event.date).toISOString().split('T')[0] === todayStr);
        const todaysOnsiteEvents = onsiteEvents.filter(event => new Date(event.date).toISOString().split('T')[0] === todayStr);
        const birthdaysToday = persons.filter(person => person.birth_month === today.getMonth() + 1 && person.birth_day === today.getDate());
  
        // 誕生日を表示
        birthdaysToday.forEach(person => {
          const birthdayDiv = document.createElement('div');
          birthdayDiv.className = 'event-item';
          birthdayDiv.innerHTML = `<span class="event-icon" style="color: ${person.color};">●</span> <span>${person.name}の誕生日</span>`;
          eventList.appendChild(birthdayDiv);
        });
  
        // 今日の配信イベントを表示
        todaysStreamingEvents.forEach(event => {
          const eventDiv = document.createElement('div');
          eventDiv.className = 'event-item';
          const contentColor = contents[event.content_codes[0]] ? contents[event.content_codes[0]].color : '#cccccc';
          eventDiv.innerHTML = `
            <span class="event-time">${event.start_time} - ${event.end_time}</span>
            <span class="event-name" style="border-left: 5px solid ${contentColor};">${event.name}</span>
          `;
          eventList.appendChild(eventDiv);
        });
  
        // 今日の現地イベントを表示
        todaysOnsiteEvents.forEach(event => {
          const eventDiv = document.createElement('div');
          eventDiv.className = 'event-item';
          const contentColor = contents[event.content_codes[0]] ? contents[event.content_codes[0]].color : '#cccccc';
          eventDiv.innerHTML = `
            <span class="event-time">${event.start_time} - ${event.end_time}</span>
            <span class="event-name" style="border-left: 5px solid ${contentColor};">${event.name}</span>
          `;
          eventList.appendChild(eventDiv);
        });
  
      } catch (error) {
        console.error('データの取得中にエラーが発生しました:', error);
      }
    }
  
    // テーマカラーの設定
    function setThemeColor() {
      const birthdaysToday = persons.filter(person => person.birth_month === today.getMonth() + 1 && person.birth_day === today.getDate());
      if (birthdaysToday.length > 0) {
        const randomPerson = birthdaysToday[Math.floor(Math.random() * birthdaysToday.length)];
        document.documentElement.style.setProperty('--background-color', randomPerson.color);
      } else {
        document.documentElement.style.setProperty('--background-color', colors[Math.floor(Math.random() * colors.length)]);
      }
    }
  
    await displayTodaysEvents();
    setThemeColor();
  });
  