export class SessionDO {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(req) {
    const url = new URL(req.url);
    if (req.method === "POST" && url.pathname === "/append") {
      const { role, text } = await req.json();
      const msgs = (await this.state.storage.get("messages")) || [];
      msgs.push({ role, text, ts: Date.now() });
      // keep recent 200
      await this.state.storage.put("messages", msgs.slice(-200));
      return new Response("ok");
    }

    if (req.method === "GET" && url.pathname === "/history") {
      const msgs = (await this.state.storage.get("messages")) || [];
      return new Response(JSON.stringify(msgs), { headers: { "content-type": "application/json" }});
    }

    return new Response("not found", { status: 404 });
  }
}