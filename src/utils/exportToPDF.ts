import html2pdf from 'html2pdf.js';

/**
 * Export the output element to PDF
 */
export async function exportToPDF(element: HTMLElement | null, filename: string = 'magazine-output'): Promise<void> {
  if (!element) {
    console.error('No element provided for PDF export');
    return;
  }

  const opt = {
    margin: 0,
    filename: `${filename}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      logging: false,
    },
    jsPDF: { 
      unit: 'mm' as const, 
      format: 'a4', 
      orientation: 'portrait' as const,
    },
  };

  try {
    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw error;
  }
}
