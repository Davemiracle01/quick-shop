// One request = many products, scraped in parallel, cached at the edge.
const { scrape } = require('./_scrape');

module.exports = async (req, res) => {
  const urls = String(req.query.u || '').split('|').filter(Boolean).slice(0, 12);
  const out = await Promise.all(urls.map(u => scrape(u).catch(() => null)));
  const ok = out.every(x => x && (x.title || x.image));
  // only cache long if everything worked, so failures retry soon
  res.setHeader('Cache-Control', ok
    ? 's-maxage=86400, stale-while-revalidate=604800'
    : 's-maxage=30');
  res.status(200).json(out);
};
