export type TextPlacement = 'center' | 'top-center' | 'bottom-center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export type TextStyle = 'shadow' | 'glow' | 'overlay';

export interface PoemAnalysis {
  title: string;
  author: string;
  body: string;
  emotions: string[];
  imagery: string[];
  atmosphere: string;
  artStyle: string;
  textPlacement: TextPlacement;
  textStyle: TextStyle;
}

export interface GenerationResult {
  title: string;
  author: string;
  body: string;
  backgroundImage: string; // base64
  fontColor: string; // Hex code, e.g., "#FFFFFF"
  textPlacement: TextPlacement;
  textStyle: TextStyle;
}