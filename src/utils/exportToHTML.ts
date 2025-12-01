/**
 * Generate full HTML magazine export with all styles embedded
 */
export function exportToHTMLFull(element: HTMLElement | null, filename: string = 'magazine-full'): void {
  if (!element) {
    console.error('No element provided for HTML export');
    return;
  }

  const styles = `
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { 
        font-family: 'Georgia', 'Times New Roman', serif;
        background: linear-gradient(135deg, #fefefe 0%, #f8f8f8 100%);
        min-height: 100vh;
        padding: 2rem;
      }
      .magazine-template {
        max-width: 800px;
        margin: 0 auto;
        background: white;
        box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
        border-radius: 8px;
        overflow: hidden;
      }
      .magazine-headline {
        font-family: 'Playfair Display', 'Georgia', serif;
        font-weight: 700;
        letter-spacing: -0.02em;
        line-height: 1.1;
        color: #0f172a;
      }
      .magazine-subheadline {
        font-family: 'Inter', system-ui, sans-serif;
        font-weight: 400;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        color: #d97706;
        font-size: 0.75rem;
      }
      .magazine-body {
        font-family: 'Georgia', 'Times New Roman', serif;
        line-height: 1.7;
        font-size: 1.05rem;
        color: #374151;
      }
      .magazine-quote {
        font-family: 'Georgia', 'Times New Roman', serif;
        font-style: italic;
        border-left: 4px solid #c9a227;
        padding-left: 1.5rem;
        margin: 2rem 0;
        color: #475569;
      }
      .two-column {
        columns: 2;
        column-gap: 2rem;
      }
      @media (max-width: 600px) {
        .two-column { columns: 1; }
        body { padding: 1rem; }
      }
      img { max-width: 100%; height: auto; }
      footer {
        border-top: 1px solid #e2e8f0;
        padding-top: 1.5rem;
        margin-top: 3rem;
      }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
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
 */
export function exportToHTMLSlim(element: HTMLElement | null, filename: string = 'magazine-slim'): void {
  if (!element) {
    console.error('No element provided for HTML export');
    return;
  }

  // Minimal inline styles
  const minimalStyles = `
    <style>
      article { font-family: Georgia, serif; max-width: 700px; margin: 0 auto; padding: 2rem; }
      h1 { font-size: 2.5rem; margin-bottom: 1rem; }
      p { line-height: 1.7; margin-bottom: 1rem; }
      blockquote { border-left: 3px solid #c9a227; padding-left: 1rem; font-style: italic; margin: 1.5rem 0; }
      img { max-width: 100%; height: auto; }
    </style>
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
