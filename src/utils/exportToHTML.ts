import appStyles from '../index.css?inline';

/**
 * Generate full HTML export using the live preview DOM and embedded app styles
 */
export function exportToHTMLFull(element: HTMLElement | null, filename: string = 'magazine-full'): void {
  if (!element) {
    console.error('No element provided for HTML export');
    return;
  }

  const styles = `
    <style>
      ${appStyles}
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
