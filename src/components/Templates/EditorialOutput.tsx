import React from "react";
import EvolutionWatermark from "../../assets/Evolution-Watermark-Black.svg";
import EvolutionWatermarkOneLine from "../../assets/Evolution-Watermark-OneLine-Black.svg";
import { useAppContext } from "../../context/AppContext";
import type { StructuredFields } from "../../types";
import { p, m, g, wMax, s } from "../../layout/layoutConfig";

// The core output component - Single Source of Truth for the final HTML/PDF layout.
// This component receives data via props to allow for headless rendering in the ExportButton.
const EditorialOutput: React.FC<{ data?: StructuredFields }> = ({ data }) => {
  const { structured } = useAppContext();
  // Use props data first, then context data (Single Source of Truth principle)
  const doc = data ?? structured; 

  // Split body by double line break to simulate paragraphs
  const paragraphs = doc.body.split(/\n\s*\n/g).filter(p => p.trim().length > 0);

  // Fallback attribution, adhering to the brand's 'Understated Authority'
  const attribution = doc.quoteAttribution
    ? `— ${doc.quoteAttribution}`
    : "Evolution Stables Contributor";

  return (
    // Outer container uses the semantic template wrapper defined in index.css
    <div className={`editorial-template min-h-screen ${wMax("5xl")} mx-auto ${p(8)} shadow-xl`}>

      {/* Header bar - Minimal Logo */}
      <header className={`w-full border-b border-es-borderStrong ${p(0)} ${p(4)} flex items-center justify-between`}>
        <div className={`flex items-center ${g(3)}`}>
          <img
            src={EvolutionWatermark}
            alt="Evolution Stables"
            className="h-5 w-auto"
          />
        </div>
        {/* Output is designed for post-race as the v1 target */}
        <span className="text-[10px] tracking-[0.2em] uppercase text-es-textSoft">
          POST-RACE REPORT
        </span>
      </header>

      {/* Hero Content (Semantic Class Usage) */}
      <section className={`${p(0)} ${p(8)}`}> 
        <h1 className="editorial-headline mb-3">{doc.headline || "Untitled Post-Race Report"}</h1>
        {doc.subheadline && <h2 className="editorial-subheadline mb-8">{doc.subheadline}</h2>}
        <div className="flex justify-between text-xs text-es-textSoft">
          <p>{doc.horseName && `Horse: ${doc.horseName}`}</p>
          <p>{doc.raceLocation}</p>
        </div>
      </section>

      {/* Main Body Grid: 2-column editorial body + quote card */}
      {/* Grid is fixed to 2:1 ratio for canonical layout (Unconditional #3) */}
      <main className={`grid grid-cols-1 md:grid-cols-[2fr_1fr] ${g(6)} pt-6`}>
        
        {/* Left Column: Body Text */}
        <div className={`${s(6)}`}>
          {paragraphs.map((p, index) => (
            // Apply drop-cap to the first paragraph (if body exists)
            <p key={index} className={`editorial-body text-es-text ${index === 0 && paragraphs.length > 0 ? 'drop-cap' : ''}`}>
              {p}
            </p>
          ))}
        </div>

        {/* Right Column: Quote Card & Media */}
        <div className={`flex flex-col ${g(6)}`}>
          
          {/* Quote Card */}
          {doc.quote && (
            <div className={`bg-es-bgSoft rounded-lg ${p(6)} border border-es-border`}>
              <blockquote className="editorial-quote">
                &ldquo;{doc.quote}&rdquo;
              </blockquote>
              <div className="mt-3 text-[11px] font-semibold tracking-wider uppercase text-es-textSoft">
                {attribution}
              </div>
            </div>
          )}

          {/* Featured Image - Simplified rendering */}
          {doc.imagePreview && (
            <figure>
              <img
                src={doc.imagePreview}
                alt={doc.caption || `Image of ${doc.horseName}`}
                className="w-full h-auto object-cover rounded-lg"
              />
              {doc.caption && <figcaption className="editorial-caption text-center">{doc.caption}</figcaption>}
            </figure>
          )}

        </div>
      </main>

      {/* Footer / Embed Section */}
      <section className={`${m(12)} border-t border-es-borderStrong pt-4 text-center`}>
        {doc.rawEmbedHtml && (
          <div className={`${m(6)}`}> 
            <h3 className="text-xs font-semibold uppercase text-es-textSoft mb-2">Exclusive Content</h3>
            <div 
              className={`bg-es-bgSoft ${p(4)} rounded-lg text-xs overflow-hidden`} 
              dangerouslySetInnerHTML={{ __html: doc.rawEmbedHtml }} 
              // Embedding external HTML directly is a v1 feature to support pre-existing content types.
            />
          </div>
        )}
        
        {/* Canonical Footer Branding */}
        <div className={`mt-4 text-[10px] text-es-textSoft flex items-center justify-center ${g(2)}`}>
            <img src={EvolutionWatermarkOneLine} alt="Evolution Stables" className="h-3.5 w-auto" />
            <span className="font-mono">{doc.footer || "Ownership, evolved. Powered by Tokinvest."}</span>
        </div>
      </section>
    </div>
  );
};

export default EditorialOutput;
