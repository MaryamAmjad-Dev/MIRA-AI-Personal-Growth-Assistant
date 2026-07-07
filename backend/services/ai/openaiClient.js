import { env } from '../../config/env.js';

export function isAiEnabled() {
  return Boolean(env.aiApiKey);
}

export async function callOpenAI(messages, { temperature = 0.7, json = false } = {}) {
  if (!env.aiApiKey) throw new Error('AI not configured');

  const body = {
    model: 'gpt-4o-mini',
    messages,
    temperature,
  };

  if (json) {
    body.response_format = { type: 'json_object' };
  }

  const response = await fetch(env.aiApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.aiApiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) throw new Error('AI service unavailable');

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('Empty AI response');

  return content.replace(/```json|```/g, '').trim();
}

export async function callOpenAIJson(messages, options = {}) {
  const content = await callOpenAI(messages, { ...options, json: true });
  return JSON.parse(content);
}

export async function callOpenAIText(systemPrompt, userPrompt, options = {}) {
  const content = await callOpenAI(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    options
  );
  return content;
}
