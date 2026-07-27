const SHARE_URL = 'https://photos.app.goo.gl/TS2G7TYTRUtwFTzs5';

export default async function(req) {
  try {
    const res = await fetch(SHARE_URL, { redirect: 'follow' });
    if (!res.ok) {
      return Response.json({ error: 'Failed to fetch album' }, { status: 502 });
    }
    const html = await res.text();

    // Extract all lh3.googleusercontent.com/pw/ image URLs (not /a/ avatars)
    const urlPattern = /https:\/\/lh3\.googleusercontent\.com\/pw\/[^"'\s)]+/g;
    const matches = html.match(urlPattern) || [];

    // Deduplicate by base URL (strip size suffix after =)
    const seen = new Set();
    const photos = [];
    for (const url of matches) {
      const baseEnd = url.indexOf('=');
      const base = baseEnd > -1 ? url.substring(0, baseEnd) : url;
      if (seen.has(base)) continue;
      seen.add(base);
      // Construct a large display-size URL from the base
      photos.push(base + '=w800-h600-p-k-no');
    }

    return Response.json({ photos });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}