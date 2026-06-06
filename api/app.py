from flask import Flask , jsonify, request

##Flaskクラスが作成したインスタンス（アプリ本体）
app = Flask(__name__)
##数字定義
HOST = "127.0.0.1"
PORT = 5000
DEBUG = True
study_logs = {
        "id":1,
        "title":"Flask API",
        "memo":"Flask app",
        "minute":50,
        "difiiculty":3,
        "create_at":"2026-06-06"
            }
@app.route("/health")
def health():
    ## HTTPレスポンスではjsonで扱う。
    return jsonify({
        "status": "ok"
    })

@app.route("/study-logs")
def get_study_logs():
    return jsonify({
        "logs" : study_logs
    })

@app.route("/study-logs")
def get_study_logs():
    global next_id 
    data = request.get_json(silent=True)
    if data is None :
        return jsonify({
            "error":"Json body is required from HTTP request"
        }),400
    title = data.get(title)
    memo = data.get(memo)
    minutes = data.get(minutes)
    difficulty = data.get("difficulty")
    if title is None or memo is None or minutes is None or difficulty is None:
        return jsonify({
        "error":"all element  must be full"
    }),400
    
    new_log = {
            "id": next_id,
            "title": title,
            "memo": memo,
            "minutes": minutes,
            "difficulty": difficulty,
            "created_at": "2026-06-06 20:30:00"
        }

    study_logs.append(new_log)
    next_id += 1

    return jsonify(new_log), 201
    
if __name__ == "__main__":
    app.run(host=HOST,port=PORT,debug=DEBUG)



