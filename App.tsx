
import React, { useState, useEffect, useCallback } from 'react';
import { fetchNewsSummaries } from './services/geminiService';
import { NewsArticle, GroundingSource } from './types';
import { NewsCard } from './components/NewsCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';
import { SourceList } from './components/SourceList';

const App: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleFetchNews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { articles, sources } = await fetchNewsSummaries();
      setNews(articles);
      setSources(sources);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
      setNews([]);
      setSources([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    handleFetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const RefreshIcon = () => (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M20 4h-5v5M4 20h5v-5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5m11 7v-5h-5m-7-2h5V4M4 20h5v-5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4V2M12 22v-2M4 12H2M22 12h-2M6.343 6.343l-1.414-1.414M19.071 19.071l-1.414-1.414M6.343 17.657l-1.414 1.414M19.071 4.929l-1.414 1.414" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v1.5a2.5 2.5 0 002.5 2.5h0A2.5 2.5 0 0017 17.5V16" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8V6.5A2.5 2.5 0 0114.5 4h0A2.5 2.5 0 0117 6.5V8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12H6.5A2.5 2.5 0 004 14.5h0A2.5 2.5 0 006.5 17H8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 12h1.5a2.5 2.5 0 012.5 2.5h0a2.5 2.5 0 01-2.5 2.5H16" />
      </svg>
  );


  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8 md:mb-12">
           <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
            Hourly News Summarizer
          </h1>
          <p className="text-lg text-gray-400">Your AI-powered briefing on what's happening right now.</p>
        </header>

        <div className="flex justify-center mb-8">
          <button
            onClick={handleFetchNews}
            disabled={isLoading}
            className="flex items-center justify-center bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/30"
          >
            {isLoading ? 'Loading...' : (
                <>
                    <RefreshIcon/>
                    Get Latest News
                </>
            )}
          </button>
        </div>

        <main>
          {isLoading && <LoadingSpinner />}
          {error && <ErrorDisplay message={error} />}
          {!isLoading && !error && (
            <>
              <SourceList sources={sources} />
              {news.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {news.map((article, index) => (
                    <NewsCard key={index} article={article} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-400">No news summaries found. Try refreshing.</p>
                </div>
              )}
            </>
          )}
        </main>
         <footer className="text-center mt-12 text-gray-500 text-sm">
            <p>Powered by Google Gemini. Summaries are AI-generated and may not be fully accurate.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
