const log = document.getElementById("log");
const msg = document.getElementById("msg");
const send = document.getElementById("send");
const userId = localStorage.getItem("cf_user") || (Math.random().toString(36).slice(2));
localStorage.setItem("cf_user", userId);
function append(who, text){ const p = document.createElement("p"); p.textContent = `${who}: ${text}`; log.appendChild(p); }
send.onclick = async () => {
  const text = msg.value.trim(); if (!text) return;
  append("You", text); msg.value = "";
  const res = await fetch("/api/chat", { method: "POST", headers: {"content-type":"application/json"}, body: JSON.stringify({ userId, message: text })});
  const j = await res.json();
  append("AI", j.reply);
};