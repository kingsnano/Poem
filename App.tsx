import React from 'react';
import { Header } from './components/Header';
import { PoemInput } from './components/PoemInput';
import { ResultDisplay } from './components/ResultDisplay';
import { Loader } from './components/Loader';
import { ErrorDisplay } from './components/ErrorDisplay';
import { usePoemGenerator } from './hooks/usePoemGenerator';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  const {
    isLoading,
    loadingMessage,
    error,
    result,
    generate,
  } = usePoemGenerator();

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <PoemInput onGenerate={generate} disabled={isLoading} />
          
          {isLoading && <Loader message={loadingMessage} />}
          {error && <ErrorDisplay message={error} />}
          {result && !isLoading && (
            <ResultDisplay
              title={result.title}
              author={result.author}
              body={result.body}
              backgroundImage={result.backgroundImage}
              fontColor={result.fontColor}
              textPlacement={result.textPlacement}
              textStyle={result.textStyle}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;