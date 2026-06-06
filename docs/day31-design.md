# Day31 設計メモ

## 今日作るもの

AI Study Grove の企画とMVPを決める。

今日はコードを多く書く日ではなく、これから何を作るかを迷わないようにするための設計日。

## アプリの一言説明

学習ログを保存し、AIが要約、苦手ポイント、復習問題を作ってくれる学習支援アプリ。

## 誰のためのアプリか

- 資格勉強をしている学生
- 大学の授業や実験の内容を復習したい学生
- プログラミング学習をしている初学者
- 学んだ内容を後から説明できるようになりたい人

## 解決したい課題

学習記録は残しても、後から見ると「何を理解して、何が分からなかったのか」が曖昧になりやすい。

そのため、単なる記録ではなく、次の学習に使える形で整理する必要がある。

## MVPで作る機能

| 機能 | 内容 |
|---|---|
| 学習ログ作成 | title, memo, minutes, difficulty を保存する |
| 学習ログ一覧 | 登録したログを新しい順に表示する |
| 学習ログ詳細 | 1つのログのメモとAI結果を確認する |
| 学習ログ編集 | 内容を後から修正する |
| 学習ログ削除 | 不要なログを削除する |
| ダミーAI生成 | 要約、弱点、復習問題を仮生成する |
| AI結果保存 | 生成した結果をDBに保存する |

## 画面構成

```text
Dashboard
  - 学習時間の合計
  - 学習ログ数
  - 最近のログ

New Log
  - title
  - memo
  - minutes
  - difficulty

Log Detail
  - 学習ログ本文
  - AI要約
  - 苦手ポイント
  - 復習問題
```

最初はページを増やしすぎず、以下の2画面でもよい。

```text
/          一覧・作成
/logs/:id  詳細・AIフィードバック
```

## DB設計案

### study_logs

| カラム | 型 | 内容 |
|---|---|---|
| id | INTEGER | 主キー |
| title | TEXT | 学習タイトル |
| memo | TEXT | 学習メモ |
| minutes | INTEGER | 学習時間 |
| difficulty | INTEGER | 難易度・理解度 |
| created_at | TEXT | 作成日時 |
| updated_at | TEXT | 更新日時 |

### ai_feedbacks

| カラム | 型 | 内容 |
|---|---|---|
| id | INTEGER | 主キー |
| study_log_id | INTEGER | 対象の学習ログID |
| summary | TEXT | AI要約 |
| weak_points | TEXT | 苦手ポイント JSON文字列 |
| review_questions | TEXT | 復習問題 JSON文字列 |
| created_at | TEXT | 作成日時 |

## API設計案

| Method | Endpoint | 内容 |
|---|---|---|
| GET | `/health` | APIの動作確認 |
| GET | `/study-logs` | 学習ログ一覧取得 |
| POST | `/study-logs` | 学習ログ作成 |
| GET | `/study-logs/<id>` | 学習ログ詳細取得 |
| PUT | `/study-logs/<id>` | 学習ログ更新 |
| DELETE | `/study-logs/<id>` | 学習ログ削除 |
| POST | `/study-logs/<id>/ai-feedback` | AIフィードバック生成 |

## ダミーAIの考え方

最初はAI APIを呼ばず、サーバー側で固定または簡単なルールベースの結果を返す。

例:

```json
{
  "summary": "今日の学習内容を整理しました。",
  "weak_points": [
    "まだ説明が曖昧な用語があります",
    "コードの流れをもう一度確認すると良さそうです"
  ],
  "review_questions": [
    "今日学んだ内容を一言で説明すると？",
    "一番つまずいた部分はどこですか？"
  ]
}
```

これにより、料金を使わずにAI機能の画面、API、DB保存の流れを完成させる。

## 実務との接続

- 要件をMVPに絞る
- DB設計を先に考える
- API仕様を表で整理する
- フロントとバックエンドを分ける
- AI APIを直接フロントから呼ばず、サーバー側から呼ぶ設計にする

## 次回やること

Day32では、実際に `web/` にNext.js、`api/` にFlask APIの土台を作る。
