/**
 * portfolio-chat-proxy — Cloudflare Worker
 *
 * Proxies browser chat requests to the DeepSeek API with:
 * - CORS origin validation (odenlerma.github.io only)
 * - Two-tier rate limiting (burst binding + hourly in-memory)
 * - SSE streaming passthrough
 * - API key hidden as encrypted secret
 */

// ─── Allowed Origins ────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  'https://odenlerma.github.io',
  'http://localhost:5173', // Vite dev server — for local development
];

// ─── CORS Headers ───────────────────────────────────────────────────
function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

// ─── In-Memory Hourly Rate Limiter ──────────────────────────────────
const ipHourlyMap = new Map();
const HOURLY_LIMIT = 30;
const HOUR_MS = 60 * 60 * 1000;

function checkHourlyLimit(ip) {
  const now = Date.now();
  let record = ipHourlyMap.get(ip);

  if (!record || now - record.windowStart > HOUR_MS) {
    record = { windowStart: now, count: 0 };
    ipHourlyMap.set(ip, record);
  }

  record.count++;

  // Cleanup stale entries when map grows large (prevent memory leak)
  if (ipHourlyMap.size > 100) {
    for (const [key, val] of ipHourlyMap) {
      if (now - val.windowStart > HOUR_MS) {
        ipHourlyMap.delete(key);
      }
    }
  }

  return record.count <= HOURLY_LIMIT;
}

// ─── Rate Limit Response ────────────────────────────────────────────
function rateLimitResponse(origin) {
  return new Response(
    JSON.stringify({
      error: "You've asked a lot of questions! Please wait a bit before asking more.",
    }),
    {
      status: 429,
      headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
    }
  );
}

// ─── DeepSeek Streaming Proxy ───────────────────────────────────────
async function proxyToDeepSeek(request, env, origin) {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON body' }),
      {
        status: 400,
        headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
      }
    );
  }

  // Validate messages array exists and is non-empty
  if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
    return new Response(
      JSON.stringify({ error: 'messages array is required and must not be empty' }),
      {
        status: 400,
        headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
      }
    );
  }

  // Enforce model — always deepseek-chat (V3), never deepseek-reasoner (R1)
  // Enforce streaming — always stream responses
  const deepseekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: body.messages,
      stream: true,
      temperature: body.temperature ?? 0.7,
      max_tokens: body.max_tokens ?? 1024,
    }),
  });

  if (!deepseekResponse.ok) {
    return new Response(
      JSON.stringify({
        error: 'AI service error',
        details: deepseekResponse.status,
      }),
      {
        status: 502,
        headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
      }
    );
  }

  // Stream the SSE response directly through — no buffering
  return new Response(deepseekResponse.body, {
    status: 200,
    headers: {
      ...corsHeaders(origin),
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  });
}

// ─── Main Fetch Handler ─────────────────────────────────────────────
export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';

    // 1. CORS check — reject unknown origins
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return new Response('Forbidden', { status: 403 });
    }

    // 2. Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(origin),
      });
    }

    // 3. Only POST allowed
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', {
        status: 405,
        headers: corsHeaders(origin),
      });
    }

    try {
      // 4. Rate limiting — two tiers
      const clientIP = request.headers.get('CF-Connecting-IP') || '127.0.0.1';

      // Tier 1: Burst limiter (Workers Rate Limiting binding — 5 req/10s)
      const { success: burstOk } = await env.RATE_LIMITER.limit({ key: clientIP });
      if (!burstOk) {
        return rateLimitResponse(origin);
      }

      // Tier 2: Hourly limiter (in-memory — 30 req/hour)
      if (!checkHourlyLimit(clientIP)) {
        return rateLimitResponse(origin);
      }

      // 5. Proxy to DeepSeek
      return await proxyToDeepSeek(request, env, origin);
    } catch (err) {
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        {
          status: 500,
          headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
        }
      );
    }
  },
};
