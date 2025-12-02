import { useState, useEffect } from 'react';

interface SmartImageProps {
  src: string;
  alt?: string;
  className?: string;
}

/**
 * Smart image component that detects portrait vs landscape orientation
 * and applies appropriate styling for premium greyscale magazine aesthetics
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
      <div className={`bg-es-bgSoft border border-es-border flex items-center justify-center h-48 ${className}`}>
        <span className="text-es-muted text-sm font-sans italic">Featured Image</span>
      </div>
    );
  }

  // Determine styling based on image characteristics
  const getImageClass = () => {
    if (isSmall) {
      // Small images: don't stretch, center them
      return 'max-h-[300px] w-auto object-contain mx-auto';
    }
    if (isPortrait) {
      // Portrait: constrain height, auto width, center
      return 'max-h-[400px] w-auto object-cover mx-auto';
    }
    // Landscape: full width, constrain height
    return 'w-full object-cover max-h-[350px]';
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
