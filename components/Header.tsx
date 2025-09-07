
import React from 'react';
import { PaintBrushIcon } from './icons/PaintBrushIcon';

export const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 bg-slate-900/50 border-b border-slate-700/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-center space-x-3">
        <PaintBrushIcon className="w-8 h-8 text-cyan-400" />
        <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
          Poem Canvas
        </h1>
      </div>
       <p className="text-center text-sm text-slate-400 mt-2">Transform your words into visual art.</p>
    </header>
  );
};
