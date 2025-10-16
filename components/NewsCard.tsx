
import React from 'react';
import { NewsArticle } from '../types';

interface NewsCardProps {
  article: NewsArticle;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 duration-300 ease-in-out">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-3 text-cyan-400">{article.title}</h3>
        <p className="text-gray-300 leading-relaxed">{article.summary}</p>
      </div>
    </div>
  );
};
