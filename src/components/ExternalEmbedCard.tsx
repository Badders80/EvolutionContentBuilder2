import React from "react";
import { useAppContext } from "../context/AppContext";
import { getEmbedCardClasses } from "../layout/layoutConfig";

interface ExternalEmbedCardProps {
  html: string;
  title?: string;
}

export const ExternalEmbedCard: React.FC<ExternalEmbedCardProps> = ({
  html,
  title,
}) => {
  const { layoutConfig } = useAppContext();

  return (
    <div className={getEmbedCardClasses(layoutConfig)} aria-label={title}>
      { }
      <div
        className="w-full h-full bg-black/90 rounded-lg overflow-hidden [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0 [&>img]:w-full [&>img]:h-full [&>img]:object-cover"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};
