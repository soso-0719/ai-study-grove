"use client";
import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import Link from "next/link";

type StudyLog = {
  id: number;
  title: string;
  memo: string;
  minutes: number;
  difficulty: number;
  created_at: string;
};

type logsResponse = {
  logs: StudyLog[];
};

export default function Home() {
  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");
  const [minutes, setMinutes] = useState("");
  const [difficulty, setDifficulty] = useState("3");
  const [logs, setLogs] = useState<StudyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const totalMinutes = logs.reduce((total, log) => {
    return total + log.minutes;
  }, 0);
  const API_BASE_URL = "http://127.0.0.1:5000";

  //データ持ってくる、画面更新1回目は全部のデータ持ってくる
  async function fetchLogs() {
    try {
      const response = await fetch(`${API_BASE_URL}/study-logs`);

      if (!response.ok) {
        throw new Error("Failed to fetch study logs");
      }
      //dataはlogsResponse型
      const data: logsResponse = await response.json();
      setLogs(data.logs);
    } catch {
      setError("Failed to load study logs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLogs();
  }, []);

  //POST処理
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const response = await fetch(`${API_BASE_URL}/study-logs`, {
      method: "POST",
      headers: {
        "content-Type": "application/json"
      },
      body: JSON.stringify({
        title: title,
        memo: memo,
        minutes: minutes,
        difficulty: difficulty,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      //Flaskにerrorあればそれ出力なきゃ右
      setError(errorData.error || "Failed to save study log");
      return;
    }

    setTitle("");
    setMemo("");
    setMinutes("");
    setDifficulty("3");

    await fetchLogs();
    console.log("submit")
  }
  return (
    <main>
      <h1>AI Study Grove</h1>
      <p>学習ログを記録し、AIで復習しやすくする学習支援アプリ。</p>

      <section>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        <h2>New Study Log</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Title</label>
            <input
              placeholder="React state and API"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div>
            <label>Memo</label>
            <textarea
              placeholder="今日学んだこと、まだ曖昧なことを書く"
              value={memo}
              onChange={(event) => setMemo(event.target.value)}
            />
          </div>

          <div>
            <label>Minutes</label>
            <input
              placeholder="60"
              value={minutes}
              onChange={(event) => setMinutes(event.target.value)}
            />
          </div>

          <div>
            <label>Difficulty</label>
            <select
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value)}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>

          <button type="submit" >Save Log</button>
        </form>

        <div>
          <h3>Input Preview</h3>
          <p>Title: {title}</p>
          <p>Memo: {memo}</p>
          <p>Minutes: {minutes}</p>
          <p>Difficulty: {difficulty}</p>
        </div>
      </section>

      <section>
        <h2>Summary</h2>
        <p>Total Minutes: {totalMinutes}</p>
        <p>Total Logs: {logs.length}</p>
      </section>

      <section>
        <h2>AI Feedback Preview</h2>
        <p>
          今日の学習内容をAIが要約し、苦手ポイントと復習問題を作る予定です。
        </p>
      </section>

      <section>
        <h2>Recent Logs</h2>

        {logs.map((log) => (
          <article key={log.id}>
            <Link href={`/logs/${log.id}`}>
              {log.title}
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}