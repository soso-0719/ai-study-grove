"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    // モード切替（login or register）
    const [mode, setMode] = useState("login");
    // フォームの入力値
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    // エラーメッセージ
    const [error, setError] = useState("");
    // 通信中かどうか（2重送信防止）
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleLogin() {
        setLoading(true);
        setError("");
        const res = await fetch("http://127.0.0.1:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
            // Flaskからのエラーメッセージを表示
            setError(data.error);
            return;
        }
        // トークンをlocalStorageに保存
        localStorage.setItem("token", data.token);
        // トップページに遷移
        router.push("/");
    }

    async function handleRegister() {
        setLoading(true);
        setError("");
        const res = await fetch("http://127.0.0.1:5000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
            setError(data.error);
            return;
        }
        // 登録成功 → ログインモードに切り替え
        setMode("login");
        setUsername("");
        setPassword("");
        setError("");
    }

    return (
        <main>
            <h1>{mode === "login" ? "ログイン" : "新規登録"}</h1>

            {/* ユーザー名入力 */}
            <div>
                <label>ユーザー名</label>
                <input
                    value={username}
                    onChange={function (e) { setUsername(e.target.value); }}
                />
            </div>

            {/* パスワード入力 */}
            <div>
                <label>パスワード</label>
                <input
                    type="password"
                    value={password}
                    onChange={function (e) { setPassword(e.target.value); }}
                />
            </div>

            {/* エラー表示 */}
            {error && <p>{error}</p>}

            {/* モードによってボタンを切り替え */}
            {mode === "login" ? (
                <div>
                    <button onClick={handleLogin} disabled={loading}>
                        {loading ? "ログイン中..." : "ログイン"}
                    </button>
                    <p>アカウントがない方は
                        <button onClick={function () { setMode("register"); setError(""); }}>
                            新規登録
                        </button>
                    </p>
                </div>
            ) : (
                <div>
                    <button onClick={handleRegister} disabled={loading}>
                        {loading ? "登録中..." : "登録する"}
                    </button>
                    <p>すでにアカウントがある方は
                        <button onClick={function () { setMode("login"); setError(""); }}>
                            ログイン
                        </button>
                    </p>
                </div>
            )}
        </main>
    );
}