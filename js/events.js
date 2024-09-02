// グローバル変数として宣言
let events = [];
let contents = {};
let locations = {};

// JSONファイルを非同期に読み込む関数
async function loadJSON() {
    try {
        const eventsResponse = await fetch('json/events.json');
        const contentsResponse = await fetch('json/contents.json');
        const locationsResponse = await fetch('json/locations.json');

        events = await eventsResponse.json();
        contents = await contentsResponse.json();
        locations = await locationsResponse.json();

        // JSONが読み込まれた後にイベントカードを作成
        createEventCards();

    } catch (error) {
        console.error('JSONの読み込み中にエラーが発生しました:', error);
    }
}

// ページが読み込まれたときにJSONをロードする
window.onload = loadJSON;

// モーダル関連の要素と関数
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const closeButton = document.querySelector(".close-button");

// モーダルを閉じる関数
function closeModal() {
    modal.style.display = "none";
}

// モーダルを開く関数: コンテンツを設定して表示
function openModal(content) {
    modalBody.innerHTML = content;
    modal.style.display = "block";
}

closeButton.addEventListener("click", closeModal);  // モーダルの閉じるボタンのイベントリスナー

window.addEventListener("click", (event) => {
    if (event.target == modal) {
        closeModal();  // モーダル外をクリックしたときに閉じる
    }
});

// 日付の比較関数: イベントの日付を今日と比較して過去、今日、未来を判定
function compareDates(eventDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);  // 今日の日付を00:00:00に設定

    const eventDateObj = new Date(eventDate);
    eventDateObj.setHours(0, 0, 0, 0);  // イベントの日付を00:00:00に設定

    if (eventDateObj < today) {
        return 'past';
    } else if (eventDateObj.getTime() === today.getTime()) {
        return 'today';
    } else {
        return 'future';
    }
}

// イベントカードを作成する関数: 各イベントの情報をもとにカードを作成し、リストに追加
function createEventCards() {
    const eventList = document.getElementById('event-list');
    events.forEach(event => {
        const card = document.createElement('div');
        card.className = 'card';

        // 日付に応じたカードの背景色設定
        const dateStatus = compareDates(event.date);
        if (dateStatus === 'past') {
            card.style.backgroundColor = '#d3d3d3';  // グレー（過去）
        } else if (dateStatus === 'today') {
            card.style.backgroundColor = '#ffa500';  // オレンジ（今日）
        }

        // 日付と時刻の要素を作成してカードに追加
        const dateTime = document.createElement('div');
        dateTime.className = 'date-time';
        const date = document.createElement('div');
        date.className = 'date';
        date.textContent = `${event.date}`;
        dateTime.appendChild(date);
        const time = document.createElement('div');
        time.className = 'time';
        time.textContent = `${event.start_time} - ${event.end_time}`;
        dateTime.appendChild(time);
        card.appendChild(dateTime);

        // コンテンツラベルを表示するコンテナを作成
        const contentLabelsContainer = document.createElement('div');
        contentLabelsContainer.className = 'content-labels-container';
        card.appendChild(contentLabelsContainer);

        // 各コンテンツコードのラベルを作成し、コンテナに追加
        event.content_codes.forEach(code => {
            const content = contents[code];
            if (content) {
                const contentLabel = document.createElement('span');
                contentLabel.className = 'content-label';
                contentLabel.style.backgroundColor = content.color;

                // テキストラップ要素を追加
                const labelText = document.createElement('span');
                labelText.className = 'content-label-text';
                labelText.textContent = content.name;
                contentLabel.appendChild(labelText);

                contentLabelsContainer.appendChild(contentLabel);

                // コンテンツラベルをクリックしたときのモーダル表示
                contentLabel.onclick = () => {
                    let modalContent = `<h2>${content.name}</h2>
                                        <table class="modal-table">
                                            <tr>
                                                <td class="label">ウェブサイト</td>
                                                <td class="value">${content.websites.map(url => `<a href="${url}" target="_blank">${url}</a>`).join('<br>')}</td>
                                            </tr>
                                        </table>`;
                    openModal(modalContent);
                };
            }
        });        // イベント名の作成と追加
        const name = document.createElement('h3');
        name.textContent = event.name;
        name.className = 'event-name';
        card.appendChild(name);

        // イベント名をクリックしたときのモーダル表示
        name.onclick = () => {
            const eventDetails = `
                <h2>${event.name}</h2>
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

        // 場所情報の作成と追加
        const location = locations[event.location_code];
        if (location) {
            const locationInfo = document.createElement('div');
            locationInfo.className = 'location-info';
            locationInfo.textContent = location.name;
            card.appendChild(locationInfo);

            // 場所情報をクリックしたときのモーダル表示
            locationInfo.onclick = () => {
                let modalContent = `<h2>${location.name}</h2>
                                    <table class="modal-table">
                                        <tr>
                                            <td class="label">都道府県</td>
                                            <td class="value">${location.prefecture}</td>
                                        </tr>
                                        <tr>
                                            <td class="label">市区町村</td>
                                            <td class="value">${location.city}</td>
                                        </tr>
                                        <tr>
                                            <td class="label">最寄駅</td>
                                            <td class="value">${location.nearest_station}</td>
                                        </tr>
                                        <tr>
                                            <td class="label">収容人数</td>
                                            <td class="value">${location.capacity}</td>
                                        </tr>
                                        <tr>
                                            <td class="label">ウェブサイト</td>
                                            <td class="value">${location.websites.map(url => `<a href="${url}" target="_blank">${url}</a>`).join('<br>')}</td>
                                        </tr>
                                    </table>`;

                if (location.show_map) {
                    modalContent += `<iframe width="100%" height="300" frameborder="0" style="border:0"
                                      src="https://www.google.com/maps?q=${encodeURIComponent(location.name)}&output=embed"
                                      allowfullscreen></iframe>`;
                }

                openModal(modalContent);
            };
        }

        eventList.appendChild(card);  // カードをリストに追加
    });
}
