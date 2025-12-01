import { useState, useEffect } from 'react';

interface SmartImageProps {
  src: string;
  alt?: string;
  className?: string;
}

/**
 * Smart image component that detects portrait vs landscape orientation
 * and applies appropriate styling for premium magazine aesthetics
 */
export function SmartImage({ src, alt = '', className = '' }: SmartImageProps) {
  const [isPortrait, setIsPortrait] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.src = src;
    img.onload = () => {
      const portrait = img.naturalHeight > img.naturalWidth;
      const small = img.naturalWidth < 400 || img.naturalHeight < 400;
      setIsPortrait(portrait);
      setIsSmall(small);
      setIsLoaded(true);
    };
  }, [src]);

  if (!src) {
    return (
      <div className={`bg-gradient-to-br from-slate-200 to-slate-300 rounded-sm flex items-center justify-center h-64 ${className}`}>
        <span className="text-slate-500 text-sm">Featured Image</span>
      </div>
    );
  }

  // Determine styling based on image characteristics
  const getImageClass = () => {
    if (isSmall) {
      // Small images: don't stretch, center them
      return 'max-h-[350px] w-auto object-contain mx-auto rounded-sm shadow-md';
    }
    if (isPortrait) {
      // Portrait: constrain height, auto width, center
      return 'max-h-[450px] w-auto object-cover mx-auto rounded-sm shadow-md';
    }
    // Landscape: full width, constrain height
    return 'w-full object-cover max-h-[450px] rounded-sm shadow-md';
  };

  return (
    <div className={`w-full flex justify-center items-center ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${getImageClass()}`}
      />
    </div>
  );
}
