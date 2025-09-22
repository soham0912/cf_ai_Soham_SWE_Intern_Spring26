import { askModel } from "./ai_client.js";

export default {
  async fetch(req, env) {
    const url = new URL(req.url);

    if (url.pathname === "/api/chat" && req.method === "POST") {
      const { userId = "anon", message = "" } = await req.json();

      const id = env.SESSION_DO.idFromName(userId);
      const stub = env.SESSION_DO.get(id);

      await stub.fetch(new Request("https://session/append", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ role: "user", text: message })
      }));

      const hres = await stub.fetch("https://session/history");
      const history = await hres.json();

      const prompt = buildPrompt(history, message);
      const reply = await askModel(env, prompt);

      await stub.fetch(new Request("https://session/append", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ role: "assistant", text: reply })
      }));

      return new Response(JSON.stringify({ reply }), { headers: { "content-type": "application/json" }});
    }

    // simple health
    if (url.pathname === "/") return new Response("ok");
    return new Response("not found", { status: 404 });
  }
};

function buildPrompt(history, message) {
  const last = history.slice(-10).map(m => `${m.role}: ${m.text}`).join("\n");
  return `System: You are a helpful assistant.\n${last}\nuser: ${message}\nassistant:`;
}