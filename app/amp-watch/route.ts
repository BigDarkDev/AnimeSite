export async function GET({ url }: { url: URL }) {
  const title = url?.searchParams?.get('title') ?? 'Unknown Anime';

  const AMP_HTML = `<!doctype html>
  <html amp lang=\"en\">
  <head>
    <meta charset=\"utf-8\" />
  <title>${title} - AMP Watch</title>
    <link rel=\"canonical\" href=\"/watch?title=${encodeURIComponent(title)}\" />
    <meta name=\"viewport\" content=\"width=device-width,minimum-scale=1,initial-scale=1\" />
    <script async src=\"https://cdn.ampproject.org/v0.js\"></script>
    <script async custom-element=\"amp-ad\" src=\"https://cdn.ampproject.org/v0/amp-ad-0.1.js\"></script>
  </head>
  <body>
  <header style=\"padding:16px; background:#000; color:#fff;\">\n      <h1 style=\"margin:0; font-size:24px;\">AnimeSensei</h1>\n    </header>
    <main style=\"padding:16px;\">
      <h2>${title}</h2>
      <amp-ad width=\"100vw\" height=\"320\" type=\"adsense\" data-ad-client=\"ca-pub-3463527483851601\" data-ad-slot=\"6304608648\" data-auto-format=\"rspv\" data-full-width=\"\"> 
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
