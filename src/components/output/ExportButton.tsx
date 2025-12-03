import React, { useCallback, useState } from "react";
import ReactDOMServer from 'react-dom/server';
import { Download } from "lucide-react";
import EditorialOutput from "../Templates/EditorialOutput";
import { useAppContext } from "../../context/AppContext";
import html2pdf from 'html2pdf.js';

export const ExportButton: React.FC = () => {
  const { structured } = useAppContext();
  const [isExporting, setIsExporting] = useState(false);

  const getFileName = (ext: string): string => {
    const safeHeadline = structured.headline.replace(/[^a-z0-9]/gi, '_').substring(0, 40) || "Report";
    const horseName = structured.horseName || "Evolution_Stables";
    return `${horseName}_${safeHeadline}.${ext}`;
  };

  const renderHtmlString = (data: typeof structured): string => {
    const fullHtml = ReactDOMServer.renderToStaticMarkup(
      <EditorialOutput data={data} />
    );
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${data.headline || "Evolution Stables Report"}</title>
        <style>
          body { margin: 0; padding: 0; font-family: Inter, system-ui, ui-sans-serif, sans-serif; background-color: #f7f7f7; color: #1a1a1a; }
          .editorial-template { font-family: Inter, system-ui, ui-sans-serif, sans-serif; background-color: #ffffff; color: #1a1a1a; max-width: 800px; margin: auto; padding: 2rem; box-shadow: 0 10px 15px rgba(0,0,0,0.1); }
          .editorial-headline { font-family: "Newsreader", Georgia, serif; font-weight: bold; line-height: 1.1; font-size: 2.25rem; }
          .editorial-body { font-family: "Inter", system-ui, ui-sans-serif, sans-serif; font-size: 1rem; line-height: 1.6; color: #1a1a1a; }
        </style>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous">
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Newsreader:wght@500;600;700&display=swap"
          rel="stylesheet"
        >
      </head>
      <body>
        <div id="exported-content">${fullHtml}</div>
      </body>
      </html>
    `;
  };

  const handleExportPDF = useCallback(() => {
    setIsExporting(true);
    const element = document.getElementById('editorial-output-container'); 
    const pdfConfig: any = { 
      margin: 0.5,
      filename: getFileName('pdf'),
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, logging: false },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' }
    };
    if (element) {
      html2pdf().set(pdfConfig).from(element).save();
    } else {
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = ReactDOMServer.renderToStaticMarkup(<EditorialOutput data={structured} />);
      html2pdf().set(pdfConfig).from(tempContainer).save();
    }
    setTimeout(() => {
      setIsExporting(false);
    }, 1500);
  }, [structured]);

  const handleExportHTML = useCallback(() => {
    setIsExporting(true);
    try {
      const htmlContent = renderHtmlString(structured);
      const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = getFileName('html');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("HTML Export Failed:", error);
      alert("HTML export failed. Check console for details.");
    } finally {
      setIsExporting(false);
    }
  }, [structured]);

  const ExportButtonClass = "flex items-center gap-1 text-[11px] px-3 py-1 rounded text-slate-900 transition-colors";

  return (
    <div className="flex items-center gap-2">
        <button
            type="button"
            onClick={handleExportPDF}
            disabled={isExporting}
            className={ExportButtonClass}
            style={{ backgroundColor: '#d4a964', color: '#1a1a1a', fontWeight: 'bold' }}
            title="Export the current content as a printable PDF."
        >
            <Download size={12} />
            {isExporting ? "PREPARING..." : "EXPORT PDF"}
        </button>
        <button
            type="button"
            onClick={handleExportHTML}
            disabled={isExporting}
            className={ExportButtonClass}
            style={{ backgroundColor: '#e4e4e4', color: '#4a4a4a', fontWeight: 'bold' }}
            title="Export the current content as a standalone HTML file."
        >
            <Download size={12} />
            HTML
        </button>
    </div>
  );
};