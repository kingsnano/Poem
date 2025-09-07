
import { useState, useCallback } from 'react';
import type { GenerationResult } from '../types';
import { extractPoemFromImage, analyzePoemAndGenerateImage } from '../services/geminiService';

export const usePoemGenerator = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);

  const generate = useCallback(async (poemText: string, imageFile: File | null) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      let poemToAnalyze = poemText;

      if (imageFile) {
        setLoadingMessage('Extracting poem from image...');
        const extractedText = await extractPoemFromImage(imageFile);
        if (!extractedText || extractedText.trim().length === 0) {
          throw new Error('Could not extract any text from the image. Please try another one.');
        }
        poemToAnalyze = extractedText;
      }
      
      if (!poemToAnalyze || poemToAnalyze.trim().length === 0) {
        throw new Error('Please provide a poem to analyze.');
      }

      setLoadingMessage('Analyzing poem and generating background...');
      const generationResult = await analyzePoemAndGenerateImage(poemToAnalyze);
      
      setResult(generationResult);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, []);

  return { isLoading, loadingMessage, error, result, generate };
};
