const { scrape } = require('./_scrape');

module.exports = async (req, res) => {
  try {
    const d = await scrape(req.query.url);
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');
    res.status(200).json(d);
  } catch (e) {
    res.status(502).json({ error: 'could not read page' });
  }
};
