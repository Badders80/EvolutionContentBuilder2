declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | number[];
    filename?: string;
    image?: {
      type?: 'jpeg' | 'png' | 'webp';
      quality?: number;
    };
    html2canvas?: {
      scale?: number;
      useCORS?: boolean;
      logging?: boolean;
      [key: string]: unknown;
    };
    jsPDF?: {
      unit?: 'pt' | 'mm' | 'cm' | 'in';
      format?: string | number[];
      orientation?: 'portrait' | 'landscape';
      [key: string]: unknown;
    };
    [key: string]: unknown;
  }

  interface Html2PdfInstance {
    set(options: Html2PdfOptions): Html2PdfInstance;
    from(element: HTMLElement): Html2PdfInstance;
    save(): Promise<void>;
    output(type: string, options?: unknown): Promise<unknown>;
    then(callback: (pdf: unknown) => void): Html2PdfInstance;
  }

  function html2pdf(): Html2PdfInstance;
  export default html2pdf;
}
