import json
from datetime import datetime, timedelta


def add_streaming_events(new_event, repeat_until=None):
    # JSONファイルを読み込む
    with open("json\streaming_events.json", "r", encoding="utf-8") as file:
        events = json.load(file)

    # イベントの繰り返し処理
    if repeat_until:
        end_date = datetime.strptime(repeat_until, "%Y/%m/%d")
        event_date = datetime.strptime(new_event["date"], "%Y/%m/%d")
        while event_date <= end_date:
            events.append(new_event.copy())
            event_date += timedelta(weeks=1)  # 繰り返し期間（週ごと）を調整
            new_event["date"] = event_date.strftime("%Y/%m/%d")
    else:
        events.append(new_event)

    # イベントを日付と開始時刻でソート
    events.sort(
        key=lambda x: (datetime.strptime(x["date"], "%Y/%m/%d"), x["start_time"])
    )

    # JSONファイルに書き戻す
    with open("json\streaming_events.json", "w", encoding="utf-8") as file:
        json.dump(events, file, ensure_ascii=False, indent=4)


if __name__ == "__main__":
    # 新しいイベントの情報
    new_event = {
        "date": "2024/9/20",
        "start_time": "21:30",
        "end_time": "",
        "content_codes": ["sasaki"],
        "name": "せーので！はすのそら！104 #19",
        "location_code": "youtube",
        "websites": ["https://www.youtube.com/@lovelive_hasu/"],
    }
    # イベントを追加（繰り返しイベントの場合はrepeat_untilを指定）
    add_streaming_events(new_event, repeat_until="")
