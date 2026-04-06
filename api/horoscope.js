export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }

  const body = await req.text();

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body,
  });

  const data = await res.text();
  return new Response(data, {
    status: res.status,
    headers: { 'content-type': 'application/json' },
  });
}

export const config = { runtime: 'edge' };
