"use client";
import { useState, useEffect, useRef } from "react";

export default function TimerPage() {
    // ユーザーが設定時間（分）
    const [focusInput, setFocusInput] = useState("25");  // 集中時間
    const [breakInput, setBreakInput] = useState("5");
    // （秒）
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    // タイマーが動いているか
    const [isRunning, setIsRunning] = useState(false);
    // setIntervalのID   useRefで作った変数には.currentのなかに格納される。
    const timerIdRef = useRef<NodeJS.Timeout | null>(null);
    const [mode, setMode] = useState("focus")

    // タイマーが0になったとき音を鳴らして止める
    useEffect(function () {
        if (timeLeft === 0 && isRunning) {
            if (timerIdRef.current) clearInterval(timerIdRef.current);
            const audio = new Audio("https://www.soundjay.com/buttons/sounds/beep-01a.mp3");
            audio.play();
            if (mode === "focus") {
                setMode("break");
                setTimeLeft(Number(breakInput) * 60);
            } else {
                setMode("focus");
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
            // timeLeftを1秒ずつ減らす
            //今の値をprevにREACTが自動で代入してくれる
            setTimeLeft(function (prev) { return prev - 1; });
        }, 1000);

    }

    function handleStop() {
        if (timerIdRef.current) clearInterval(timerIdRef.current);
        setIsRunning(false);
    }

    function handleReset() {
        handleStop();
        // 入力した分数を秒に変換してリセット
        setTimeLeft(Number(focusInput) * 60);
    }

    // 秒をMM:SS形式に変換する
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
    const seconds = (timeLeft % 60).toString().padStart(2, "0");

    return (
        <>
            <nav>
                <span className="nav-logo">🌿 AI Study Grove</span>
                <div className="nav-links">
                    <a href="/">Home</a>
                    <a href="/timer" className="active">Timer</a>
                </div>
            </nav>

            <div className="page-single">
                <div className="card">
                    <div className="card-title">Focus Timer</div>

                    <div className="timer-display">
                        <div className="timer-mode">{mode === "focus" ? "集中中" : "休憩中"}</div>
                        <div className="timer-time">{minutes}:{seconds}</div>
                        <div className="timer-btns">
                            <button className="btn-start" onClick={handleStart} disabled={isRunning}>Start</button>
                            <button onClick={handleStop} disabled={!isRunning}>Stop</button>
                            <button onClick={handleReset}>Reset</button>
                        </div>
                    </div>

                    <div style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div className="form-group">
                            <label>集中時間（分）</label>
                            <input
                                type="number"
                                value={focusInput}
                                onChange={function (e) {
                                    setFocusInput(e.target.value);
                                    if (mode === "focus") setTimeLeft(Number(e.target.value) * 60);
                                }}
                                disabled={isRunning}
                            />
                        </div>
                        <div className="form-group">
                            <label>休憩時間（分）</label>
                            <input
                                type="number"
                                value={breakInput}
                                onChange={function (e) {
                                    setBreakInput(e.target.value);
                                    if (mode === "break") setTimeLeft(Number(e.target.value) * 60);
                                }}
                                disabled={isRunning}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}