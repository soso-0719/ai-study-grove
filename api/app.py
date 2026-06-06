from flask import Flask , jsonify, request
from db import init_db , create_log , get_logs
from datetime import datetime
##Flaskクラスが作成したインスタンス（アプリ本体）
app = Flask(__name__)
##数字定義
HOST = "127.0.0.1"
PORT = 5000
DEBUG = True

@app.route("/health")
def health():
    ## HTTPレスポンスではjsonで扱う。
    return jsonify({
        "status": "ok"
    })

@app.route("/study-logs")
def get_study_logs():
    logs = get_logs()
    return jsonify({
        "logs":logs

    })

@app.route("/study-logs",methods = ["POST"])
def create_study_log():
    created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    data = request.get_json(silent=True)##読み取りミスってもNoneにしてエラー防ぐ
    validata,error = validate_data(data)
    if error is not None:
        return jsonify({
        "error":error
    }),400
##INSERTしてる。
    new_id = create_log(
        validata["title"],
        validata["memo"],
        validata["minutes"],
        validata["difficulty"],
        created_at
)
    new_log = {
            "id": new_id,
            "title": validata["title"],
            "memo": validata["memo"],
            "minutes": validata["minutes"],
            "difficulty": validata["difficulty"],
            "created_at": created_at
        }

    

    return jsonify(new_log), 201

def validate_data(data):
    if data is None:
        return None, "Json body is required from HTTP request"

    title = data.get("title")
    memo = data.get("memo")
    minutes = data.get("minutes")
    difficulty = data.get("difficulty")

    if title is None or memo is None or minutes is None or difficulty is None:
        return None, "all element must be full"

    if not isinstance(title, str):
        return None, "title must be a string"

    if not isinstance(memo, str):
        return None, "memo must be a string"

    title = title.strip()
    memo = memo.strip()

    if title == "":
        return None, "title must not be empty"

    if memo == "":
        return None, "memo must not be empty"

    try:
        minutes = int(minutes)
        difficulty = int(difficulty)
    except (ValueError, TypeError):
        return None, "minutes and difficulty must be integers"

    if minutes <= 0:
        return None, "minutes must be greater than 0"

    if difficulty < 1 or difficulty > 5:
        return None, "difficulty must be between 1 and 5"

    return {
        "title": title,
        "memo": memo,
        "minutes": minutes,
        "difficulty": difficulty
    }, None
if __name__ == "__main__":
    init_db()
    app.run(host=HOST,port=PORT,debug=DEBUG)



