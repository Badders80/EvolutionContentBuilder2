import appStyles from '../index.css?inline';
import { createRoot } from 'react-dom/client';
import { PreviewPanel } from '../components/preview/PreviewPanel';
import { AppProvider } from '../context/AppContext';

/**
 * Generate full HTML export by rendering PreviewPanel with isExport={true} (no Smart Layout Editor)
 */
export function exportToHTMLFull(_element: HTMLElement | null, filename: string = 'magazine-full'): void {
  // Render PreviewPanel with isExport={true} into a detached DOM node
  const tempDiv = document.createElement('div');
  document.body.appendChild(tempDiv);
  createRoot(tempDiv).render(
    <AppProvider>
      <PreviewPanel isExport={true} />
    </AppProvider>
  );

  // Wait for React to render
  setTimeout(() => {
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
  ${tempDiv.innerHTML}
</body>
</html>
    `.trim();

    downloadHTML(htmlContent, filename);
    document.body.removeChild(tempDiv);
  }, 100);
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
