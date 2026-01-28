"use client";
import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [views, setViews] = useState("");
  const [url, setUrl] = useState("");

  async function submit() {
    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        ttl_seconds: ttl ? Number(ttl) : undefined,
        max_views: views ? Number(views) : undefined
      })
    });

    let data = null;

try {
  data = await res.json();
} catch {
  alert("Server error: No JSON response");
  return;
}

if (res.ok) {
  setUrl(data.url);
} else {
  alert(data.error || "Unknown error");
}
}

  return (
    <main style={{ padding: 20 }}>
      <h1>Pastebin Lite</h1>
      <textarea rows={10} value={content} onChange={e => setContent(e.target.value)} />
      <br />
      <input placeholder="TTL (seconds)" value={ttl} onChange={e => setTtl(e.target.value)} />
      <input placeholder="Max views" value={views} onChange={e => setViews(e.target.value)} />
      <br />
      <button onClick={submit}>Create Paste</button>
      {url && <p>Share URL: <a href={url}>{url}</a></p>}
    </main>
  );
}
