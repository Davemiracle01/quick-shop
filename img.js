const ALLOW = /kilimall|kili\.co|aliyuncs/i;
const UA = 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36';

module.exports = async (req, res) => {
  try {
    const u = new URL(req.query.u);
    if (u.protocol !== 'https:' || !ALLOW.test(u.hostname)) return res.status(400).end();
    const r = await fetch(u, {
      headers: { 'user-agent': UA, referer: 'https://www.kilimall.com/' },
      signal: AbortSignal.timeout(8000)
    });
    const type = r.headers.get('content-type') || '';
    if (!r.ok || !type.startsWith('image/')) return res.status(502).end();
    const buf = Buffer.from(await r.arrayBuffer());
    res.setHeader('Content-Type', type);
    res.setHeader('Cache-Control', 'public, s-maxage=604800, max-age=86400');
    res.status(200).send(buf);
  } catch (e) {
    res.status(502).end();
  }
};
      
