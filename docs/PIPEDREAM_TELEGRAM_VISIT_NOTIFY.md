# Pipedream + Telegram Visit Notifications

## 1) Create Telegram bot
1. Message `@BotFather` on Telegram.
2. Run `/newbot`, copy the bot token.
3. Send a message to your bot once.
4. Get your `chat_id`:
   - Open: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Find `message.chat.id`.

## 2) Create Pipedream workflow
1. Create a new Workflow.
2. Add trigger: `HTTP / Webhook`.
3. Add one `Node.js` code step with the code below.
4. Set environment variables in Pipedream:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`

```js
export default defineComponent({
  async run({ steps, $ }) {
    const body = steps.trigger.event.body || {};
    const headers = steps.trigger.event.headers || {};

    const ip =
      headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      headers["cf-connecting-ip"] ||
      headers["x-real-ip"] ||
      "unknown";

    const ua = headers["user-agent"] || "unknown";
    const path = body.page_path || "/";
    const title = body.page_title || "(no title)";
    const url = body.page_url || "";
    const ref = body.referrer || "";
    const ts = body.ts || new Date().toISOString();

    // Server-side dedupe: same IP + path + 30m window
    const bucket = Math.floor(Date.now() / (30 * 60 * 1000));
    const dedupeKey = `visit:${ip}:${path}:${bucket}`;
    const already = await $.service.db.get(dedupeKey);
    if (already) return { skipped: true, reason: "deduped" };
    await $.service.db.set(dedupeKey, true);

    const msg = [
      "👀 New page visit",
      `• Time: ${ts}`,
      `• Page: ${path}`,
      `• Title: ${title}`,
      `• URL: ${url}`,
      ref ? `• Referrer: ${ref}` : null,
      `• IP: ${ip}`,
      `• UA: ${ua.substring(0, 140)}`
    ].filter(Boolean).join("\n");

    const tgUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    const res = await fetch(tgUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: msg
      })
    });

    if (!res.ok) {
      const t = await res.text();
      throw new Error(`Telegram send failed: ${res.status} ${t}`);
    }

    return { ok: true };
  }
});
```

## 3) Wire website config
In `/Users/yicong.huang/Repos/Yicong-Huang.github.io/_config.yml`:

```yml
visit_notify:
  enabled: true
  webhook_url: "https://<your-pipedream-endpoint>.m.pipedream.net"
  dedupe_minutes: 30
  send_on_localhost: false
  include_referrer: true
```

Then rebuild/redeploy.
