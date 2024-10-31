// Googleマップを使う例
let map;
let markers = {}; // 複数のイベントごとにマーカーを用意

function initMap() {
    // マップの初期表示位置
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 35.6895, lng: 139.6917 }, // 東京をデフォルト中心
        zoom: 10,
    });

    // 各イベントに対応するマーカーを追加
    markers['location1'] = new google.maps.Marker({
        position: { lat: 35.6895, lng: 139.6917 }, // 東京
        map: map,
        title: 'イベント1開催場所',
    });

    markers['location2'] = new google.maps.Marker({
        position: { lat: 35.6762, lng: 139.6503 }, // 例：場所2
        map: map,
        title: 'イベント2開催場所',
    });

    markers['location3'] = new google.maps.Marker({
        position: { lat: 35.6738, lng: 139.7223 }, // 例：場所3
        map: map,
        title: 'イベント3開催場所',
    });

    // 初期は全てのマーカーを非表示にする
    for (let marker in markers) {
        markers[marker].setVisible(false);
    }
}

// イベントリストの項目をクリックしたときの動作
document.getElementById('event-list').addEventListener('click', function (e) {
    const location = e.target.getAttribute('data-location');

    if (location && markers[location]) {
        // すべてのマーカーを非表示にする
        for (let marker in markers) {
            markers[marker].setVisible(false);
        }

        // クリックされたイベントのマーカーを表示
        markers[location].setVisible(true);
        map.setCenter(markers[location].getPosition()); // マップの中心を移動
    }
});
