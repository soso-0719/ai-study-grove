import sqlite3

conn = sqlite3.connect("../data/app.db")
cursor = conn.cursor()

# study_logsテーブルにuser_idカラムを追加
cursor.execute("ALTER TABLE study_logs ADD COLUMN user_id INTEGER")

conn.commit()
conn.close()
print("migration done")