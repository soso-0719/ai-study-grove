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
            const p = await params;
            const id = p.id;
            const res = await fetch(`http://127.0.0.1:5000/study-logs/${id}`);
            if (!res.ok) {
                setError("ログが見つかりません");
                setLoading(false);
                return;
            }
            const data = await res.json();
            setLog(data);

            const feedbackRes = await fetch(`http://127.0.0.1:5000/ai-feedbacks/${id}`);
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
        const res = await fetch(`http://127.0.0.1:5000/study-logs/${log.id}`, {
            method: "DELETE",
        });
        if (res.ok) {
            router.push("/");
        }
    }

    async function handleEdit() {
        if (!log) return;
        const res = await fetch(`http://127.0.0.1:5000/study-logs/${log.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
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

    if (loading) return <main><p>Loading...</p></main>;
    if (error) return <main><p>{error}</p><Link href="/">← Back</Link></main>;
    if (!log) return null;

    if (isEditing) {
        return (
            <main>

                <input value={editTitle} onChange={function (e) { setEditTitle(e.target.value); }} />
                <textarea value={editMemo} onChange={function (e) { setEditMemo(e.target.value); }} />
                <input value={editMinutes} onChange={function (e) { setEditMinutes(e.target.value); }} />
                <select value={editDifficulty} onChange={function (e) { setEditDifficulty(e.target.value); }}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
                <button onClick={handleEdit}>Save</button>
                <button onClick={function () { setIsEditing(false); }}>Cancel</button>
            </main>
        );
    }

    return (
        <main>
            <Link href="/">← Back</Link>
            <h1>{log.title}</h1>
            <p>Memo: {log.memo}</p>
            <p>Minutes: {log.minutes}</p>
            <p>Difficulty: {log.difficulty}</p>
            <p>Created at: {log.created_at}</p>
            {feedback && (
                <div>
                    <h2>AI Feedback</h2>
                    <p>{feedback.feedback}</p>
                    <p>{feedback.created_at}</p>
                </div>
            )}
            <button onClick={function () {
                setEditTitle(log.title);
                setEditMemo(log.memo);
                setEditMinutes(String(log.minutes));
                setEditDifficulty(String(log.difficulty));
                setIsEditing(true);
            }}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
        </main>
    );

}