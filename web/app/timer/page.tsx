"use client";
import { useState, useEffect, useRef } from "react";

export default function TimerPage() {
    // ユーザーが設定時間（分）
    const [timeInput, setTimeInput] = useState("25");
    // （秒）
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    // タイマーが動いているか
    const [isRunning, setIsRunning] = useState(false);
    // setIntervalのID   useRefで作った変数には.currentのなかに格納される。
    const timerIdRef = useRef<NodeJS.Timeout | null>(null);

    // タイマーが0になったとき音を鳴らして止める
    useEffect(function () {
        if (timeLeft === 0 && isRunning) {
            handleStop();
            // ブラウザの標準機能で音を鳴らす
            const audio = new Audio("https://www.soundjay.com/buttons/sounds/beep-01a.mp3");
            audio.play();
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
        setTimeLeft(Number(timeInput) * 60);
    }

    // 秒をMM:SS形式に変換する
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
    const seconds = (timeLeft % 60).toString().padStart(2, "0");

    return (
        <main>
            <h1>Focus Timer</h1>

            {/* 時間設定（タイマーが止まっているときだけ変更できる） */}
            <div>
                <label>時間（分）</label>
                <input
                    type="number"
                    value={timeInput}
                    onChange={function (e) {
                        setTimeInput(e.target.value);
                        setTimeLeft(Number(e.target.value) * 60);
                    }}
                    disabled={isRunning}
                />
            </div>

            {/* タイマー表示 */}
            <p>{minutes}:{seconds}</p>

            {/* ボタン */}
            <button onClick={handleStart} disabled={isRunning}>Start</button>
            <button onClick={handleStop} disabled={!isRunning}>Stop</button>
            <button onClick={handleReset}>Reset</button>
        </main>
    );
}