"use client";
import { useState, useEffect, useRef } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
}

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

type UserInfo = {
  username: string;
  xp: number;
  level: number;
  next_xp: number;
};

const API_BASE_URL = "http://127.0.0.1:5000";

export default function Home() {
  // ログフォーム
  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");
  const [minutes, setMinutes] = useState("");
  const [difficulty, setDifficulty] = useState("3");
  const [logs, setLogs] = useState<StudyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const router = useRouter();

  // タイマー
  const [focusInput, setFocusInput] = useState("25");
  const [breakInput, setBreakInput] = useState("5");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);
  const [timerMode, setTimerMode] = useState("focus");

  const totalMinutes = logs.reduce((total, log) => total + log.minutes, 0);

  // タイマーが0になったとき
  useEffect(function () {
    if (timeLeft === 0 && isRunning) {
      if (timerIdRef.current) clearInterval(timerIdRef.current);
      const audio = new Audio("https://www.soundjay.com/buttons/sounds/beep-01a.mp3");
      audio.play();
      if (timerMode === "focus") {
        setTimerMode("break");
        setTimeLeft(Number(breakInput) * 60);
      } else {
        setTimerMode("focus");
        setTimeLeft(Number(focusInput) * 60);
      }
      setIsRunning(true);
      timerIdRef.current = setInterval(function () {
        setTimeLeft(function (prev) { return prev - 1; });
      }, 1000);
    }
  }, [timeLeft]);

  // ページを離れたときタイマーを止める
  useEffect(function () {
    return function () {
      if (timerIdRef.current) clearInterval(timerIdRef.current);
    };
  }, []);

  function handleStart() {
    if (isRunning) return;
    setIsRunning(true);
    timerIdRef.current = setInterval(function () {
      setTimeLeft(function (prev) { return prev - 1; });
    }, 1000);
  }

  function handleStop() {
    if (timerIdRef.current) clearInterval(timerIdRef.current);
    setIsRunning(false);
  }

  function handleReset() {
    handleStop();
    setTimeLeft(Number(focusInput) * 60);
  }

  const timerMinutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const timerSeconds = (timeLeft % 60).toString().padStart(2, "0");

  async function fetchLogs() {
    try {
      const response = await fetch(`${API_BASE_URL}/study-logs`, {
        headers: authHeaders()
      });
      if (!response.ok) throw new Error("Failed to fetch study logs");
      const data: logsResponse = await response.json();
      setLogs(data.logs);
    } catch {
      setError("Failed to load study logs");
    } finally {
      setLoading(false);
    }
  }

  async function fetchMe() {
    const res = await fetch(`${API_BASE_URL}/me`, {
      headers: authHeaders()
    });
    if (res.ok) {
      const data = await res.json();
      setUserInfo(data);
    }
  }

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
      return;
    }
    fetchLogs();
    fetchMe();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const response = await fetch(`${API_BASE_URL}/study-logs`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ title, memo, minutes, difficulty }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      setError(errorData.error || "Failed to save study log");
      return;
    }

    setTitle("");
    setMemo("");
    setMinutes("");
    setDifficulty("3");
    await fetchLogs();
    await fetchMe();
  }

  return (
    <>
      <nav>
        <span className="nav-logo">🌿 AI Study Grove</span>
        {userInfo && (
          <div className="xp-container">
            <span>Lv.{userInfo.level} {userInfo.username}</span>
            <div className="xp-bar-bg">
              <div
                className="xp-bar-fill"
                style={{ width: `${Math.min((userInfo.xp / userInfo.next_xp) * 100, 100)}%` }}
              />
            </div>
            <span>{userInfo.xp} / {userInfo.next_xp} XP</span>
          </div>
        )}
        <button onClick={() => {
          localStorage.removeItem("token");
          router.push("/login");
        }}>Logout</button>
      </nav>

      <div className="page-container">
        {/* 左カラム：統計 + フォーム */}
        <div>
          <div className="card">
            <div className="stat-grid">
              <div className="stat">
                <div className="stat-label">合計勉強時間</div>
                <div className="stat-value">{totalMinutes}</div>
              </div>
              <div className="stat">
                <div className="stat-label">合計ログ数</div>
                <div className="stat-value">{logs.length}</div>
              </div>
            </div>
            <div className="card-title">新しいログ</div>
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  placeholder="React state and API"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>メモ</label>
                <textarea
                  placeholder="今日学んだこと、まだ曖昧なことを書く"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Minutes</label>
                <input
                  placeholder="60"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Difficulty</label>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
              <button type="submit" className="btn-primary">Save Log</button>
            </form>
          </div>
        </div>


        {/* 右カラム：タイマー + ログ一覧 */}
        <div>
          <div className="card" style={{ marginBottom: "16px" }}>
            <div className="card-title">Focus Timer</div>
            <div className="timer-display">
              <div className="timer-mode">{timerMode === "focus" ? "集中" : "休憩中"}</div>
              <div className="timer-time">{timerMinutes}:{timerSeconds}</div>
              <div className="timer-btns">
                <button className="btn-start" onClick={handleStart} disabled={isRunning}>Start</button>
                <button onClick={handleStop} disabled={!isRunning}>Stop</button>
                <button onClick={handleReset}>Reset</button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "16px" }}>
              <div className="form-group">
                <label>集中時間（分）</label>
                <input
                  type="number"
                  value={focusInput}
                  onChange={(e) => {
                    setFocusInput(e.target.value);
                    if (timerMode === "focus") setTimeLeft(Number(e.target.value) * 60);
                  }}
                  disabled={isRunning}
                />
              </div>
              <div className="form-group">
                <label>休憩時間（分）</label>
                <input
                  type="number"
                  value={breakInput}
                  onChange={(e) => {
                    setBreakInput(e.target.value);
                    if (timerMode === "break") setTimeLeft(Number(e.target.value) * 60);
                  }}
                  disabled={isRunning}
                />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">直近のログ</div>
            {logs.map((log) => (
              <div className="log-item" key={log.id}>
                <div>
                  <Link href={`/logs/${log.id}`} className="log-title">
                    {log.title}
                  </Link>
                  <div className="log-meta">{log.minutes}分 · {log.created_at}</div>
                </div>
                <span className="log-badge">難易度 {log.difficulty}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
