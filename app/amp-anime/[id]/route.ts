export async function GET({ params }: { params: { id: string } }) {
  const id = params.id;
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title {
          romaji
          english
        }
      }
    }
  `;
  let title = 'Anime';
  try {
    const res = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { id: parseInt(id) } }),
    });
    const data = await res.json();
    const m = data?.data?.Media;
    if (m?.title?.english || m?.title?.romaji) {
      title = m.title.english || m.title.romaji;
    }
  } catch {
    // ignore, fallback title
  }

  const AMP_HTML = `<!doctype html>
  <html amp lang="en">
  <head>
    <meta charset="utf-8" />
  <title>${title} - AMP</title>
    <link rel="canonical" href="/anime/${id}" />
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
    <script async src="https://cdn.ampproject.org/v0.js"></script>
    <script async custom-element="amp-ad" src="https://cdn.ampproject.org/v0/amp-ad-0.1.js"></script>
  </head>
  <body>
  <header style="padding:16px; background:#000; color:#fff;">
      <h1 style="margin:0; font-size:24px;">AnimeSensei</h1>
    </header>
    <main style="padding:16px;">
      <h2>${title}</h2>
      <amp-ad width="100vw" height="320" type="adsense" data-ad-client="ca-pub-3463527483851601" data-ad-slot="6304608648" data-auto-format="rspv" data-full-width="true">
        <div overflow></div>
      </amp-ad>
    </main>
  </body>
  </html>`;

  return new Response(AMP_HTML, {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });
}
