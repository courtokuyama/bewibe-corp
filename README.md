# BEWIBE コーポレートサイト（ドラフト v3）

sunfluoro.co.jp の**デザイン言語を高精度で再現**し、中身はBEWIBEに置換。
事業内容の構成は **LayerX流の事業セグメント並列**を採用。

> 方針：レイアウト・配色・タイポ・余白・スクロール演出など「デザインの作り」は忠実に寄せるが、
> 先方の文章・写真・ロゴそのものは流用しない（他社固有コンテンツの複製回避＋BEWIBE用に内容が必要なため）。

## 構成
- `index.html` — 1枚もの。イントロ幕 → 動画ヒーロー → About → Business(事業3セグメント) → Strength(数字) → Contact → Footer
- `api/lead.js` — 問い合わせ → Slack `#general` 通知（Vercelサーバーレス）
- `assets/video/` — `hero.mp4`(ご提供 BG.mp4 ループ), `tuun_demo.mp4`(TUUN実画面)
- `assets/photos/` — Unsplash実写プレースホルダ（差し替え前提）

## sunfluoro から再現した設計トークン
- **配色**：白背景／文字＝濃紺 `#091b25`／プライマリ青 `#0e7ae0`／セカンダリ `#46505d`／ターシャリ `#50b4d2`
- **書体**：Work Sans(200–400 細字) ＋ Noto Sans JP(300/400) ＋ yakuhanjp(約物詰め)、Material Symbols(細アイコン)。**全体に軽量ウェイト**
- **タイポ**：clamp()流体サイズ、ヒーローは約5.65vwの巨大細字 ＋ 文字スタッガー表示
- **イージング**：署名的な `cubic-bezier(.19,1,.22,1)`(expo-out) を .6s〜1.1s で
- **演出**：①読込のイントロ幕(4分割パネルが四隅へ開く＋BEWIBEキャッチ) ②ヒーロー動画 blur→sharpen ＋ ゆっくりズーム ③スクロールでexpo-outの上昇フェード ④画像はスケールイン(reveal-img) ⑤Strengthのカウントアップ ⑥Swiper風の横スライダー(edge-blur＋前後ボタン) ⑦View moreリンク(下線スワイプ＋アイコン移動)

## 事業内容（LayerX流・TUUN以外は抽象化）
横スライダーに3事業を並列：
1. **TUUN事業** — 自社プロダクト(具体)。実画面動画
2. **AIソリューション事業** — 抽象。会計・EC・業務領域へAIを展開（例：明朗会計AI／即日Shopify）
3. **AI受託事業** — 抽象。企画〜実装〜運用の受託

## 画像について
- `hero.mp4`・`tuun_demo.mp4` はご提供/自社素材 → そのまま使用
- Desktopの `IMG_85xx.PNG` はInstagramスクショ(ステータスバー＋IGナビ＋他者キャプション)のため不採用
- その他写真はUnsplassのプレースホルダ。本番は自社撮影に差し替え推奨
  - about-team(開発チーム) / about-work(ワークスペース) / tech-abstract(AI抽象) / meiro-desk(デスク)

## ローカル確認 / デプロイ
```
open index.html          # 表示確認（フォーム送信は /api/lead が必要）
```
1. Slack: api.slack.com → Create App → workspace `bewibehq` → Incoming Webhooks ON → `#general` → URLコピー
2. Vercel にこのフォルダをデプロイ → 環境変数 `SLACK_WEBHOOK_URL` 設定 → 再デプロイ
3. 確認: `curl -XPOST '<本番URL>/api/lead' -H 'Content-Type: application/json' -d '{"channel":"テスト","name":"確認","email":"a@b.c","message":"テスト"}'`

## 差し替え推奨
- 実績数字 / 各事業の説明・リンク先 / 会社情報・SNS / プレースホルダ写真を自社撮影に
