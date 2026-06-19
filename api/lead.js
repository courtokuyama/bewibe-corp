// BEWIBE コーポレートサイト 問い合わせ → Slack #general 通知
// 環境変数: SLACK_WEBHOOK_URL (Slack Incoming Webhook / workspace=bewibehq, channel=#general)
// デプロイ: Vercel (依存ゼロ・global fetch 使用)

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method Not Allowed' }); return; }

  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) { res.status(500).json({ error: 'SLACK_WEBHOOK_URL is not configured' }); return; }

  const b = req.body || {};
  const channel = b.channel || 'BEWIBEコーポレートサイト';
  const sourceUrl = b.source_url || '';
  const srcLine = sourceUrl ? `<${sourceUrl}|${channel}>` : channel;

  // 入力された全項目を *ラベル*: 値 で整形
  const rows = [
    ['お名前', b.name],
    ['会社名', b.company],
    ['メール', b.email],
    ['電話', b.contact],
    ['ご相談内容', b.message],
  ].filter(([, v]) => v && String(v).trim());

  const text = [
    '🔔 *新規リード獲得*',
    `🌐 *流入元*: ${srcLine}`,
    '',
    ...rows.map(([k, v]) => `*${k}*: ${v}`),
  ].join('\n');

  const blocks = [
    { type: 'header', text: { type: 'plain_text', text: '🔔 新規リード獲得', emoji: true } },
    { type: 'section', text: { type: 'mrkdwn', text: `🌐 *流入元*: ${srcLine}` } },
    { type: 'section', text: { type: 'mrkdwn', text: rows.map(([k, v]) => `*${k}*: ${v}`).join('\n') || '_（内容なし）_' } },
    { type: 'context', elements: [{ type: 'mrkdwn', text: `BEWIBEコーポレートサイト・問い合わせフォーム` }] },
  ];

  try {
    const r = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, blocks }),
    });
    if (!r.ok) throw new Error('slack ' + r.status);
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(502).json({ error: 'failed to notify slack' });
  }
};
