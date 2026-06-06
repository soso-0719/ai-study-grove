type StudyLog = {
  id: number;
  title: string;
  memo: string;
  minutes: number;
  difficulty: number;
  created_at: string;
};

const sampleLogs: StudyLog[] = [
  {
    id: 1,
    title: "React state and API",
    memo: "useState, fetch, POST, and UI update flow.",
    minutes: 60,
    difficulty: 3,
    created_at: "2026-06-06 18:00",
  },
  {
    id: 2,
    title: "Flask and SQLite",
    memo: "API request, validation, INSERT, SELECT, and JSON response.",
    minutes: 90,
    difficulty: 4,
    created_at: "2026-06-06 19:00",
  },
  {
    id: 3,
    title: "OS and bootloader",
    memo: "Boot sector, memory address, binary, and QEMU experiment.",
    minutes: 120,
    difficulty: 5,
    created_at: "2026-06-06 20:00",
  },
];

const totalMinutes = sampleLogs.reduce((total, log) => {
  return total + log.minutes;
}, 0);

const averageDifficulty =
  sampleLogs.reduce((total, log) => total + log.difficulty, 0) /
  sampleLogs.length;

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f7f3] text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8">
        <header className="flex flex-col gap-3 border-b border-slate-200 pb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
            Portfolio MVP
          </p>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
                AI Study Grove
              </h1>
              <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600">
                学習ログを記録し、AIで要約・弱点・復習問題に変える学習支援アプリ。
              </p>
            </div>
            <button className="w-fit rounded-md bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800">
              Generate Review Plan
            </button>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <form className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-950">
                New Study Log
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                今日学んだことを、あとで復習できる形で残します。
              </p>
            </div>

            <label className="mb-4 block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Title
              </span>
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                placeholder="例: React state and API"
              />
            </label>

            <label className="mb-4 block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Memo
              </span>
              <textarea
                className="min-h-36 w-full rounded-md border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                placeholder="今日理解したこと、まだ曖昧なことを書く"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Minutes
                </span>
                <input
                  className="w-full rounded-md border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                  placeholder="60"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Difficulty
                </span>
                <select className="w-full rounded-md border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100">
                  <option>1 - Easy</option>
                  <option>2</option>
                  <option>3 - Normal</option>
                  <option>4</option>
                  <option>5 - Hard</option>
                </select>
              </label>
            </div>

            <button className="mt-6 w-full rounded-md bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              Save Log
            </button>
          </form>

          <div className="flex flex-col gap-6">
            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-950">Summary</h2>
              <div className="mt-5 grid gap-3">
                <div className="rounded-md bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Total Minutes</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-950">
                    {totalMinutes}
                  </p>
                </div>
                <div className="rounded-md bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Study Logs</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-950">
                    {sampleLogs.length}
                  </p>
                </div>
                <div className="rounded-md bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Average Difficulty</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-950">
                    {averageDifficulty.toFixed(1)}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-6">
              <h2 className="text-xl font-semibold text-emerald-950">
                AI Feedback Preview
              </h2>
              <p className="mt-3 text-sm leading-6 text-emerald-900">
                今日の学習は、ReactのstateとAPI通信のつながりを理解する内容です。
                次は、useEffectの実行タイミングを復習すると理解が深まりそうです。
              </p>
              <div className="mt-5">
                <p className="text-sm font-semibold text-emerald-950">
                  Review Questions
                </p>
                <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-emerald-900">
                  <li>stateを更新すると画面が変わる理由は？</li>
                  <li>GETとPOSTの違いは？</li>
                </ol>
              </div>
            </section>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-950">Recent Logs</h2>
            <p className="text-sm text-slate-500">Click a log to review later</p>
          </div>

          <div className="grid gap-3">
            {sampleLogs.map((log) => (
              <article
                className="rounded-md border border-slate-200 p-4 transition hover:border-emerald-300 hover:bg-emerald-50"
                key={log.id}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-950">{log.title}</h3>
                    <p className="mt-1 max-w-2xl text-sm text-slate-500">
                      {log.memo}
                    </p>
                  </div>
                  <div className="flex gap-2 text-sm text-slate-600">
                    <span className="rounded-md bg-slate-100 px-3 py-2">
                      {log.minutes} min
                    </span>
                    <span className="rounded-md bg-slate-100 px-3 py-2">
                      Difficulty {log.difficulty}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
