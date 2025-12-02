/**
 * Generate full HTML magazine export with all styles embedded
 * Uses greyscale Inter-based editorial design
 */
export function exportToHTMLFull(element: HTMLElement | null, filename: string = 'magazine-full'): void {
  if (!element) {
    console.error('No element provided for HTML export');
    return;
  }

  const styles = `
    <style>
      :root {
        --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        --font-serif: 'Newsreader', Georgia, serif;
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { 
        font-family: var(--font-sans);
        background: #f5f5f5;
        min-height: 100vh;
        padding: 2rem;
        color: #111111;
      }
      a { color: inherit; text-decoration: none; }
      article {
        max-width: 900px;
        margin: 0 auto;
        background: #ffffff;
        box-shadow: 0 4px 24px rgba(0,0,0,0.08);
        padding: 3rem 4rem;
      }
      header {
        border-bottom: 2px solid #111111;
        padding-bottom: 0.75rem;
        margin-bottom: 2rem;
        display: flex;
        justify-content: space-between;
        align-items: baseline;
      }
      .brand {
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }
      .mode-label {
        font-size: 0.65rem;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: #9b9b9b;
      }
      h1 {
        font-size: 2.25rem;
        font-weight: 600;
        line-height: 1.15;
        letter-spacing: -0.01em;
        margin-bottom: 0.75rem;
        color: #111111;
      }
      .font-sans { font-family: var(--font-sans); }
      .font-serif { font-family: var(--font-serif); }
      .editorial-headline { font-family: var(--font-serif); }
      .editorial-subheadline { font-family: var(--font-sans); font-style: italic; color: #4b4b4b; }
      .editorial-body { font-family: var(--font-sans); }
      .editorial-quote { font-family: var(--font-sans); }
      .subheadline {
        font-style: italic;
        color: #4b4b4b;
        margin-bottom: 1.5rem;
      }
      .body-text p {
        font-size: 0.95rem;
        line-height: 1.75;
        margin-bottom: 1rem;
        color: #111111;
      }
      .body-text p:first-of-type::first-letter {
        float: left;
        font-size: 3.5rem;
        line-height: 1;
        font-weight: 600;
        margin-right: 0.5rem;
        margin-top: 0.1rem;
      }
      figure.quote {
        border-left: 2px solid #111111;
        padding-left: 1rem;
        margin: 1.5rem 0;
      }
      blockquote {
        font-style: italic;
        color: #4b4b4b;
        margin-bottom: 0.5rem;
      }
      figcaption {
        font-size: 0.75rem;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: #9b9b9b;
      }
      .image-caption {
        font-size: 0.7rem;
        color: #9b9b9b;
        text-align: center;
        font-style: italic;
        margin-top: 0.5rem;
      }
      img { max-width: 100%; height: auto; }
      .media-box {
        max-width: 320px;
        margin: 0 auto;
      }
      .media-box img,
      .media-box iframe,
      .media-box video {
        max-width: 100%;
        height: auto;
        display: block;
        border-radius: 12px;
      }
      .media-box iframe {
        width: 100%;
      }
      footer {
        margin-top: 3rem;
      }
      .footer-divider { margin: 1.5rem 0; }
      .footer-divider-top { border-top: 2px solid #111111; }
      .footer-divider-bottom { border-bottom: 2px solid #111111; }
      .footer-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1.25rem;
        flex-wrap: wrap;
        font-size: 0.8rem;
        color: #4b5563;
      }
      .footer-icons {
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .footer-icons svg {
        width: 18px;
        height: 18px;
        fill: currentColor;
      }
      footer {
        border-top: 1px solid #e5e5e5;
        padding-top: 1rem;
        margin-top: 3rem;
        font-size: 0.7rem;
        color: #9b9b9b;
      }
      .footer-tagline {
        letter-spacing: 0.18em;
        text-transform: uppercase;
        font-weight: 500;
      }
      @media (max-width: 768px) {
        article { padding: 1.5rem; }
        h1 { font-size: 1.75rem; }
      }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Newsreader:wght@400;500;600&display=swap" rel="stylesheet">
  `;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Magazine Export - Evolution Content Builder</title>
  ${styles}
</head>
<body>
  ${element.outerHTML}
</body>
</html>
  `.trim();

  downloadHTML(htmlContent, filename);
}

/**
 * Generate slim HTML export with just the core article content
 * Minimal greyscale styling
 */
export function exportToHTMLSlim(element: HTMLElement | null, filename: string = 'magazine-slim'): void {
  if (!element) {
    console.error('No element provided for HTML export');
    return;
  }

  // Minimal inline styles - greyscale
  const minimalStyles = `
    <style>
      :root {
        --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        --font-serif: 'Newsreader', Georgia, serif;
      }
      body { font-family: var(--font-sans); color: #111; background: #fff; }
      article { max-width: 700px; margin: 0 auto; padding: 2rem; }
      h1 { font-size: 2rem; font-weight: 600; margin-bottom: 0.75rem; line-height: 1.2; }
      .subheadline { font-style: italic; color: #4b4b4b; margin-bottom: 1.5rem; }
      p { line-height: 1.75; margin-bottom: 1rem; font-size: 0.95rem; }
      blockquote { border-left: 2px solid #111; padding-left: 1rem; font-style: italic; color: #4b4b4b; margin: 1.5rem 0; }
      figcaption { font-size: 0.7rem; color: #9b9b9b; text-align: center; margin-top: 0.5rem; }
      img { max-width: 100%; height: auto; }
      .font-sans { font-family: var(--font-sans); }
      .font-serif { font-family: var(--font-serif); }
      .editorial-headline { font-family: var(--font-serif); }
      .editorial-subheadline { font-family: var(--font-sans); font-style: italic; color: #4b4b4b; }
      .editorial-body { font-family: var(--font-sans); }
      .editorial-quote { font-family: var(--font-sans); }
      .media-box { max-width: 320px; margin: 0 auto; }
      .media-box img,
      .media-box iframe,
      .media-box video { max-width: 100%; height: auto; display: block; border-radius: 12px; }
      .media-box iframe { width: 100%; }
      .footer-divider { margin: 1.5rem 0; }
      .footer-divider-top { border-top: 2px solid #111; }
      .footer-divider-bottom { border-bottom: 2px solid #111; }
      .footer-bar { display: flex; justify-content: space-between; align-items: center; gap: 1.25rem; flex-wrap: wrap; font-size: 0.8rem; color: #4b5563; }
      .footer-icons { display: flex; align-items: center; gap: 14px; }
      .footer-icons svg { width: 18px; height: 18px; fill: currentColor; }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Newsreader:wght@400;500;600&display=swap" rel="stylesheet">
  `;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Article Export</title>
  ${minimalStyles}
</head>
<body>
  ${element.outerHTML}
</body>
</html>
  `.trim();

  downloadHTML(htmlContent, filename);
}

/**
 * Helper function to trigger file download
 */
function downloadHTML(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
