import React from 'react';

interface RawHtmlEmbedProps {
  html: string;
  className?: string;
}

/**
 * Component to safely render raw HTML embed code (like Canva's iframe).
 * NOTE: This uses React's dangerouslySetInnerHTML and should ONLY be used
 * for trusted content (i.e., content placed directly by the user/developer).
 */
export const RawHtmlEmbed: React.FC<RawHtmlEmbedProps> = ({ html, className = '' }) => {
  if (!html) return null;

  return (
    <div
      className={`w-full ${className}`}
      // This is necessary to render the raw HTML iframe
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
