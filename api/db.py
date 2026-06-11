import sqlite3

DB_NAME = "../data/app.db"

def get_conn():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    ##これまじ大事
    return conn

def init_db():
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS study_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            memo TEXT NOT NULL,
            minutes INTEGER NOT NULL,
            difficulty INTEGER NOT NULL,
            created_at TEXT NOT NULL
        )
        """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS ai_feedbacks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            log_id INTEGER NOT NULL,
            feedback TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()

def create_log(title, memo, minutes, difficulty, created_at,user_id):
    conn = get_conn()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO study_logs (title, memo, minutes, difficulty, created_at,user_id)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (title, memo, minutes, difficulty, created_at,user_id))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()

    return new_id

def create_feedback(log_id, feedback, created_at):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO ai_feedbacks (log_id, feedback, created_at)
        VALUES (?, ?, ?)
    """, (log_id, feedback, created_at))
    conn.commit()
    conn.close()

def create_user(username, password_hash, created_at):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO users (username, password_hash, created_at)
        VALUES (?, ?, ?)
    """, (username, password_hash, created_at))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return new_id



def get_logs(user_id):
    conn = get_conn()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, title, memo, minutes, difficulty, created_at
        FROM study_logs
        WHERE user_id = ?
        ORDER BY id DESC
    """, (user_id,))

    rows = cursor.fetchall()
    conn.close()
    logs = []

    for row in rows:
        logs.append({
            "id": row["id"],
            "title": row["title"],
            "memo": row["memo"],
            "minutes": row["minutes"],
            "difficulty": row["difficulty"],
            "created_at": row["created_at"]
        })
    return logs

def delete_log(log_id):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM study_logs WHERE id = ?", (log_id,))
    conn.commit()
    deleted = cursor.rowcount
    conn.close()
    return deleted > 0

def update_log(log_id, title, memo, minutes, difficulty):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE study_logs
        SET title = ?, memo = ?, minutes = ?, difficulty = ?
        WHERE id = ?
    """, (title, memo, minutes, difficulty, log_id))
    conn.commit()
    update = cursor.rowcount
    conn.close()
    return update > 0

def get_detail_by_id(log_id):
    conn = get_conn()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, title, memo, minutes, difficulty, created_at
        FROM study_logs
        WHERE id = ?
    """, (log_id,))

    row = cursor.fetchone()
    conn.close()

    if row is None:
        return None

    return {
        "id": row["id"],
        "title": row["title"],
        "memo": row["memo"],
        "minutes": row["minutes"],
        "difficulty": row["difficulty"],
        "created_at": row["created_at"]
    }


def get_feedback_by_log_id(log_id):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT feedback, created_at
        FROM ai_feedbacks
        WHERE log_id = ?
        ORDER BY created_at DESC
        LIMIT 1
    """, (log_id,))
    row = cursor.fetchone()
    conn.close()
    if row is None:
        return None
    return {
        "feedback": row["feedback"],
        "created_at": row["created_at"]
    }

def get_user_by_username(username):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, password_hash FROM users WHERE username = ?", (username,))
    row = cursor.fetchone()
    conn.close()
    if row is None:
        return None
    return {
        "id": row["id"],
        "username": row["username"],
        "password_hash": row["password_hash"]
    }