export default {
  async fetch(request, env, ctx) {
    return new Response('portfolio-chat-proxy is running', {
      headers: { 'Content-Type': 'text/plain' },
    });
  },
};
