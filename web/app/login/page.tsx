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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
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
        <div className="auth-wrapper">
            <div className="auth-card">
                <div className="auth-logo">🌿 AI Study Grove</div>
                <div className="auth-subtitle">
                    {mode === "login" ? "ログインしてください" : "アカウントを作成"}
                </div>

                <div className="form-group">
                    <label>ユーザー名</label>
                    <input
                        value={username}
                        onChange={function (e) { setUsername(e.target.value); }}
                    />
                </div>

                <div className="form-group">
                    <label>パスワード</label>
                    <input
                        type="password"
                        value={password}
                        onChange={function (e) { setPassword(e.target.value); }}
                    />
                </div>

                {error && <p className="error">{error}</p>}

                {mode === "login" ? (
                    <>
                        <button className="btn-primary" onClick={handleLogin} disabled={loading}>
                            {loading ? "ログイン中..." : "ログイン"}
                        </button>
                        <div className="auth-switch">
                            アカウントがない方は
                            <button onClick={function () { setMode("register"); setError(""); }}>
                                新規登録
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <button className="btn-primary" onClick={handleRegister} disabled={loading}>
                            {loading ? "登録中..." : "登録する"}
                        </button>
                        <div className="auth-switch">
                            すでにアカウントがある方は
                            <button onClick={function () { setMode("login"); setError(""); }}>
                                ログイン
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}