import React, { useState } from 'react';
import { TextIcon } from './icons/TextIcon';
import { ImageIcon } from './icons/ImageIcon';

interface PoemInputProps {
  onGenerate: (poemText: string, imageFile: File | null) => void;
  disabled: boolean;
}

export const PoemInput: React.FC<PoemInputProps> = ({ onGenerate, disabled }) => {
  const [inputType, setInputType] = useState<'text' | 'image'>('text');
  const [poemText, setPoemText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      // If there's an old preview, revoke it to avoid memory leaks
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(file));
      setPoemText('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disabled) {
      onGenerate(poemText, imageFile);
    }
  };
  
  const handleTabClick = (type: 'text' | 'image') => {
    setInputType(type);
    setPoemText('');
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
  };

  return (
    <div className="bg-slate-800/50 rounded-lg p-6 shadow-lg border border-slate-700">
      <div className="flex border-b border-slate-600 mb-4">
        <button
          onClick={() => handleTabClick('text')}
          className={`flex items-center space-x-2 py-2 px-4 text-sm font-medium transition-colors ${
            inputType === 'text' ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <TextIcon className="w-5 h-5" />
          <span>Write Poem</span>
        </button>
        <button
          onClick={() => handleTabClick('image')}
          className={`flex items-center space-x-2 py-2 px-4 text-sm font-medium transition-colors ${
            inputType === 'image' ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ImageIcon className="w-5 h-5" />
          <span>Upload Image</span>
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {inputType === 'text' ? (
          <textarea
            value={poemText}
            onChange={(e) => setPoemText(e.target.value)}
            placeholder="The woods are lovely, dark and deep,..."
            className="w-full h-40 bg-slate-900 border border-slate-600 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
            disabled={disabled}
          />
        ) : (
          <label
            htmlFor="image-upload"
            className="w-full h-40 bg-slate-900 border-2 border-dashed border-slate-600 rounded-md flex items-center justify-center text-slate-400 text-center relative cursor-pointer hover:border-cyan-500 transition-colors"
          >
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={disabled}
            />
            {imagePreview ? (
              <img src={imagePreview} alt="Poem preview" className="h-full w-full object-contain rounded-md p-1" />
            ) : (
              <span>Click or drag to upload an image of a poem</span>
            )}
          </label>
        )}
        <button
          type="submit"
          disabled={disabled || (inputType === 'text' && !poemText) || (inputType === 'image' && !imageFile)}
          className="mt-4 w-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-md transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
          Generate Artwork
        </button>
      </form>
    </div>
  );
};