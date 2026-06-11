import sqlite3

conn = sqlite3.connect("../data/app.db")
cursor = conn.cursor()

# usersテーブルにxpカラムを追加
cursor.execute("ALTER TABLE users ADD COLUMN xp INTEGER DEFAULT 0")

conn.commit()
conn.close()
print("migration done")