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

type PageProps = {
    params: Promise<{ id: string }>;
};

export default function LogDetailPage({ params }: PageProps) {
    const [log, setLog] = useState<StudyLog | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

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

    if (loading) return <main><p>Loading...</p></main>;
    if (error) return <main><p>{error}</p><Link href="/">← Back</Link></main>;
    if (!log) return null;

    return (
        <main>
            <Link href="/">← Back</Link>
            <h1>{log.title}</h1>
            <p>Memo: {log.memo}</p>
            <p>Minutes: {log.minutes}</p>
            <p>Difficulty: {log.difficulty}</p>
            <p>Created at: {log.created_at}</p>
            <button onClick={handleDelete}>Delete</button>
        </main>
    );
}