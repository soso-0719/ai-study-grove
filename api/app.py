from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:3000",
    "http://127.0.0.1:3000",
])


@app.route("/health")
def health():
    return jsonify({
        "status": "ok",
        "app": "AI Study Grove API"
    })


@app.route("/study-logs")
def get_study_logs():
    return jsonify({
        "logs": [
            {
                "id": 1,
                "title": "React state and API",
                "memo": "useState, fetch, POST, and UI update flow.",
                "minutes": 60,
                "difficulty": 3,
                "created_at": "2026-06-06 18:00:00"
            },
            {
                "id": 2,
                "title": "Flask and SQLite",
                "memo": "API request, validation, INSERT, SELECT, and JSON response.",
                "minutes": 90,
                "difficulty": 4,
                "created_at": "2026-06-06 19:00:00"
            }
        ]
    })


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
