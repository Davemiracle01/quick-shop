const ALLOW = /(^|\.)(kili\.co|kilimall\.[a-z.]+)$/i;
const UA = 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36';

const decode = s => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

function meta(html, keys) {
  for (const k of keys) {
    const a = html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${k}["'][^>]*content=["']([^"']*)["']`, 'i'));
    const b = html.match(new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${k}["']`, 'i'));
    const m = a || b;
    if (m && m[1].trim()) return decode(m[1].trim());
  }
  return '';
}

async function scrape(link) {
  const u = new URL(link);
  if (u.protocol !== 'https:' || !ALLOW.test(u.hostname)) throw new Error('link not allowed');

  const r = await fetch(u, {
    redirect: 'follow',
    headers: { 'user-agent': UA, 'accept-language': 'en-US,en;q=0.9', accept: 'text/html' },
    signal: AbortSignal.timeout(6000)
  });
  const final = new URL(r.url);
  if (!ALLOW.test(final.hostname)) throw new Error('redirect not allowed');

  const html = (await r.text()).slice(0, 500000);

  const title = meta(html, ['og:title', 'twitter:title']) || ((html.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1] || '').trim();
  let image = meta(html, ['og:image', 'og:image:url', 'twitter:image']);
  let price = meta(html, ['product:price:amount', 'og:price:amount']);
  let currency = meta(html, ['product:price:currency', 'og:price:currency']);

  if (!price) {
    const p = html.match(/"price"\s*:\s*"?([\d][\d.,]*)/);
    const c = html.match(/"priceCurrency"\s*:\s*"([A-Za-z]{3})"/);
    if (p) { price = p[1]; if (c) currency = c[1]; }
  }
  if (image) { try { image = new URL(image, r.url).href; } catch { image = ''; } }

  let priceText = '';
  let n = parseFloat(String(price).replace(/,/g, ''));
  if (isNaN(n) || n <= 0) n = 0;
  if (n) {
    const cur = (currency || '').toUpperCase();
    priceText = (cur === 'KES' || cur === 'KSH' || !cur ? 'KSh ' : cur + ' ') + n.toLocaleString('en-KE');
  }
  return { title, image, price: priceText, n };
}

module.exports = { scrape };
