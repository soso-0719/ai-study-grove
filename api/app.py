import anthropic
import os
from flask import Flask , jsonify, request
from db import init_db , create_log , get_logs, get_detail_by_id as get_detail, delete_log,update_log,create_feedback, get_feedback_by_log_id
from datetime import datetime
from flask_cors import CORS

##Flaskクラスが作成したインスタンス（アプリ本体）
app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:3000",
    "http://127.0.0.1:3000"
])
claude_client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))


##数字定義
HOST = "127.0.0.1"
PORT = 5000
DEBUG = True

# log_idに対応するフィードバックを返すエンドポイント
@app.route("/ai-feedbacks/<int:log_id>")
def get_feedback(log_id):
    feedback = get_feedback_by_log_id(log_id)
    if feedback is None:
        return jsonify({"error": "feedback not found"}), 404
    return jsonify(feedback), 200

#データベースの今ある範囲は全部返す
@app.route("/study-logs")
def get_study_logs():
    logs = get_logs()
    return jsonify({
        "logs":logs
    })

@app.route("/study-logs/<int:log_id>")
def get_detail_by_id(log_id):
    detail_log = get_detail(log_id)
    if detail_log is None:
        return jsonify({
            "error":"log not found"
        }),404
    return jsonify(detail_log)
##DELETE
@app.route("/study-logs/<int:log_id>", methods=["DELETE"])
def delete_study_log(log_id):
    deleted = delete_log(log_id)
    if not deleted:
        return jsonify({"error": "log not found"}), 404
    return jsonify({"message": "deleted"}), 200

@app.route("/study-logs/<int:log_id>", methods=["PUT"])
def update_study_log(log_id):
    data = request.get_json(silent=True)
    validata,error = validate_data(data)

    if error is not None :
        return jsonify({
            "error":error
        }),400
    
    updated_data = update_log(log_id, validata["title"], validata["memo"], validata["minutes"], validata["difficulty"])
    if not updated_data:
        return jsonify({"error": "log not found"}), 404
    return jsonify({"message": "updated"}), 200

@app.route("/study-logs",methods = ["POST"])
def create_study_log():
    created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    data = request.get_json(silent=True)##読み取りミスってもNoneにしてエラー防ぐ
    validata,error = validate_data(data)
    if error is not None:
        return jsonify({
        "error":error
    }),400
##INSERT
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

##AIfeedback作成
    prompt = f"以下の学習ログにコメントしてください。\nタイトル: {validata['title']}\nメモ: {validata['memo']}\n学習時間: {validata['minutes']}分\n難易度: {validata['difficulty']}/5\n\n学習内容への理解コメントと、次に学ぶべきことを2〜3文で教えてください。"
    message = claude_client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=300,
        messages=[{"role": "user", "content": prompt}]
    )
    feedback_text = message.content[0].text
    create_feedback(new_id, feedback_text, created_at)

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



