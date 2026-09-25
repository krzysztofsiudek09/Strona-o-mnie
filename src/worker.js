const json = (data, status = 200) => Response.json(data, {status, headers: {
  'Cache-Control': status === 200 ? 'public, max-age=60' : 'no-store',
  'X-Content-Type-Options': 'nosniff'
}});
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
    if (!['GET', 'HEAD'].includes(request.method)) return new Response(null, {status:405, headers:{Allow:'GET, HEAD'}});
    if (url.pathname !== '/api/content') return json({error:'Nie znaleziono.'},404);
    try {
      const [photos, socials] = await Promise.all([
        env.DB.prepare('SELECT id, title, category, src, thumbnail, alt FROM photos WHERE published = 1 ORDER BY position, id').all(),
        env.DB.prepare('SELECT platform, label, url FROM social_profiles WHERE enabled = 1 ORDER BY position').all()
      ]);
      const response = json({photos:photos.results, socials:socials.results});
      return request.method === 'HEAD' ? new Response(null, response) : response;
    } catch (error) {
      console.error('Content database unavailable', error.message);
      return json({error:'Nie udało się wczytać galerii. Spróbuj ponownie za chwilę.'},503);
    }
  }
};
