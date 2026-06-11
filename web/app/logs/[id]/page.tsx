"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type StudyLog = {
    id: number;
    title: string;
    memo: string;
    minutes: number;
    difficulty: number;
    created_at: string;
};

type AiFeedback = {
    feedback: string;
    created_at: string;
}

type PageProps = {
    params: Promise<{ id: string }>;
};

// localStorageのトークンを取り出してヘッダーオブジェクトにして返す
function authHeaders() {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
}

export default function LogDetailPage({ params }: PageProps) {
    const [log, setLog] = useState<StudyLog | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editMemo, setEditMemo] = useState("");
    const [editMinutes, setEditMinutes] = useState("");
    const [editDifficulty, setEditDifficulty] = useState("3");
    const [feedback, setFeedback] = useState<AiFeedback | null>(null);

    useEffect(function () {
        async function load() {
            // トークンがなければログインページへ飛ばす
            if (!localStorage.getItem("token")) {
                router.push("/login");
                return;
            }
            const p = await params;
            const id = p.id;
            const res = await fetch(`https://ai-study-grove.onrender.com/study-logs/${id}`, {
                headers: authHeaders()
            });
            if (!res.ok) {
                setError("ログが見つかりません");
                setLoading(false);
                return;
            }
            const data = await res.json();
            setLog(data);

            const feedbackRes = await fetch(`https://ai-study-grove.onrender.com/ai-feedbacks/${id}`, {
                headers: authHeaders()
            });
            if (feedbackRes.ok) {
                const feedbackData = await feedbackRes.json();
                setFeedback(feedbackData);
            }
            setLoading(false);
        }
        load();
    }, []);

    async function handleDelete() {
        if (!log) return;
        const res = await fetch(`https://ai-study-grove.onrender.com/study-logs/${log.id}`, {
            method: "DELETE",
            headers: authHeaders()
        });
        if (res.ok) {
            router.push("/");
        }
    }

    async function handleEdit() {
        if (!log) return;
        const res = await fetch(`https://ai-study-grove.onrender.com/study-logs/${log.id}`, {
            method: "PUT",
            headers: authHeaders(), // Content-TypeもauthHeaders()がまとめて返す
            body: JSON.stringify({
                title: editTitle,
                memo: editMemo,
                minutes: editMinutes,
                difficulty: editDifficulty,
            }),
        });
        if (res.ok) {
            setLog({ ...log, title: editTitle, memo: editMemo, minutes: Number(editMinutes), difficulty: Number(editDifficulty) });
            setIsEditing(false);
        }
    }

    if (loading) return <div className="page-single"><p>Loading...</p></div>;
    if (error) return <div className="page-single"><p className="error">{error}</p><Link href="/" className="back-link">← Back</Link></div>;
    if (!log) return null;

    if (isEditing) {
        return (
            <div className="page-single">
                <Link href="/" className="back-link">← Back</Link>
                <div className="card">
                    <div className="card-title">Edit Log</div>
                    <div className="form-group">
                        <label>Title</label>
                        <input value={editTitle} onChange={function (e) { setEditTitle(e.target.value); }} />
                    </div>
                    <div className="form-group">
                        <label>Memo</label>
                        <textarea value={editMemo} onChange={function (e) { setEditMemo(e.target.value); }} />
                    </div>
                    <div className="form-group">
                        <label>Minutes</label>
                        <input value={editMinutes} onChange={function (e) { setEditMinutes(e.target.value); }} />
                    </div>
                    <div className="form-group">
                        <label>Difficulty</label>
                        <select value={editDifficulty} onChange={function (e) { setEditDifficulty(e.target.value); }}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                    <div className="detail-actions">
                        <button className="btn-primary" onClick={handleEdit}>Save</button>
                        <button onClick={function () { setIsEditing(false); }}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-single">
            <Link href="/" className="back-link">← Back</Link>
            <div className="card">
                <div className="detail-header">
                    <h1>{log.title}</h1>
                    <div className="detail-meta">{log.minutes}分 · 難易度 {log.difficulty} · {log.created_at}</div>
                </div>
                <p>{log.memo}</p>
                {feedback && (
                    <div style={{ marginTop: "20px" }}>
                        <div className="card-title">AI Feedback</div>
                        <div className="ai-feedback">{feedback.feedback}</div>
                    </div>
                )}
                <div className="detail-actions">
                    <button onClick={function () {
                        setEditTitle(log.title);
                        setEditMemo(log.memo);
                        setEditMinutes(String(log.minutes));
                        setEditDifficulty(String(log.difficulty));
                        setIsEditing(true);
                    }}>Edit</button>
                    <button className="btn-danger" onClick={handleDelete}>Delete</button>
                </div>
            </div>
        </div>
    );
}
