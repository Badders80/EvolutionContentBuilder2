// PROTECTED: Evolution Stables Preview Footer.
// Do not allow automated tools to modify this component.

import React from "react";
import { Mail, Instagram, Linkedin, Twitter } from "lucide-react";
import { brandCopy } from "../../brand/brandCopy";

export const PreviewFooter: React.FC = () => {
  return (
    <footer className="mt-10 pt-8 border-t-2 border-slate-900 text-slate-800">
      <div className="text-center space-y-2">
        <div className="text-2xl font-serif font-semibold">{brandCopy.tagline}</div>
        <div className="text-sm text-slate-600">{brandCopy.footerLine1}</div>
      </div>

      <div className="mt-6 border-t border-slate-200 pt-4 flex flex-col gap-3 text-[12px] text-slate-700 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-slate-800">{brandCopy.copyright}</span>
          <a href="/privacy" className="hover:text-slate-900">Privacy Policy</a>
          <a href="/terms" className="hover:text-slate-900">Terms of Service</a>
        </div>

        <div className="flex items-center gap-3 text-slate-700">
          <a href="https://x.com/evostables" className="hover:text-slate-900" aria-label="X">
            <Twitter size={16} />
          </a>
          <a href="https://instagram.com/evostables" className="hover:text-slate-900" aria-label="Instagram">
            <Instagram size={16} />
          </a>
          <a href="https://www.linkedin.com/in/alex-baddeley/" className="hover:text-slate-900" aria-label="LinkedIn">
            <Linkedin size={16} />
          </a>
          <a href="mailto:alex@evolutionstables.nz" className="hover:text-slate-900" aria-label="Email">
            <Mail size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
};
