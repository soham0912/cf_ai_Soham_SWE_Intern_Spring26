import { createWorkersAI } from "workers-ai-provider";
import { generateText } from "ai";

export function makeModel(env) {
  const workersai = createWorkersAI({ binding: env.AI });
  return workersai("@cf/meta/llama-3.3-70b-instruct-fp8-fast");
}

export async function askModel(env, prompt) {
  const model = makeModel(env);
  const out = await generateText({ model, prompt, max_tokens: 512, temperature: 0.2 });
  // Vercel AI SDK returns text property for simple cases
  if (out?.text) return out.text;
  if (out?.output?.[0]?.content) return out.output[0].content;
  return String(out);
}