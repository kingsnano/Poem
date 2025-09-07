import React from 'react';
import { DownloadIcon } from './icons/DownloadIcon';
import type { TextPlacement, TextStyle } from '../types';

interface ResultDisplayProps {
  title: string;
  author: string;
  body: string;
  backgroundImage: string; // base64
  fontColor: string; // Hex code
  textPlacement: TextPlacement;
  textStyle: TextStyle;
}

const getPlacementClasses = (placement: TextPlacement): string => {
  switch (placement) {
    case 'top-center':
      return 'items-start justify-center text-center';
    case 'bottom-center':
      return 'items-end justify-center text-center';
    case 'top-left':
      return 'items-start justify-start text-left';
    case 'top-right':
      return 'items-start justify-end text-right';
    case 'bottom-left':
      return 'items-end justify-start text-left';
    case 'bottom-right':
      return 'items-end justify-end text-right';
    case 'center':
    default:
      return 'items-center justify-center text-center';
  }
};

const getTextStyleClasses = (style: TextStyle): { wrapper: string; text: string } => {
  switch (style) {
    case 'glow':
      // A soft, wide dark shadow to create an 'aura' and separate text from the light background.
      return {
        wrapper: '',
        text: `[text-shadow:0_2px_15px_rgba(0,0,0,0.5)]`,
      };
    case 'overlay':
      // A frosted glass effect for maximum readability on any background.
      return {
        wrapper: 'bg-white/50 backdrop-blur-sm p-6 rounded-lg',
        text: '',
      };
    case 'shadow':
    default:
      // A standard, crisp drop-shadow for depth. Better for sharper text.
      const shadowColor = 'rgba(0,0,0,0.4)';
      return {
        wrapper: '',
        text: `drop-shadow-[0_2px_3px_${shadowColor}]`,
      };
  }
};

const getBodyFontSizeClass = (bodyLength: number): string => {
  if (bodyLength > 500) {
    return 'text-[clamp(0.7rem,1.8vw,0.9rem)]';
  }
  if (bodyLength > 300) {
    return 'text-[clamp(0.8rem,2vw,1rem)]';
  }
  if (bodyLength > 150) {
    return 'text-[clamp(0.9rem,2.5vw,1.1rem)]';
  }
  return 'text-[clamp(1rem,3vw,1.25rem)]';
};


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ title, author, body, backgroundImage, fontColor, textPlacement, textStyle }) => {
  const imageUrl = `data:image/jpeg;base64,${backgroundImage}`;
  
  const placementClasses = getPlacementClasses(textPlacement);
  const { wrapper: wrapperStyleClasses, text: textStyleClasses } = getTextStyleClasses(textStyle);
  const bodyFontSizeClass = getBodyFontSizeClass(body.length);


  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'poem_canvas_background.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Your Masterpiece</h2>
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Background Only */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-3 text-slate-300">Artistic Background</h3>
          <div className="relative group w-full aspect-[9/16] rounded-lg overflow-hidden shadow-2xl">
            <img src={imageUrl} alt="Generated background" className="w-full h-full object-cover" />
            <button
              onClick={handleDownload}
              className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/80 transition-opacity opacity-0 group-hover:opacity-100"
              aria-label="Download background image"
            >
              <DownloadIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Poem Overlay */}
        <div className="flex flex-col items-center">
           <h3 className="text-lg font-semibold mb-3 text-slate-300">Complete Poster</h3>
           <div 
            className={`w-full aspect-[9/16] rounded-lg overflow-hidden shadow-2xl flex p-6 md:p-8 bg-cover bg-center ${placementClasses}`}
            style={{ backgroundImage: `url(${imageUrl})` }}
            >
              <div 
                className={`font-lora max-w-full ${wrapperStyleClasses} ${textStyleClasses}`}
                style={{ color: fontColor }}
              >
                <h4 className="text-[clamp(1.75rem,5vw,2.5rem)] leading-tight font-bold mb-2">{title}</h4>
                <p className="text-[clamp(1rem,3vw,1.25rem)] italic mb-6 opacity-90">by {author}</p>
                <div className={`${bodyFontSizeClass} leading-relaxed whitespace-pre-wrap`}>
                  {body}
                </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};