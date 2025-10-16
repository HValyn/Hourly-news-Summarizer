
import React from 'react';
import { GroundingSource } from '../types';

interface SourceListProps {
  sources: GroundingSource[];
}

const SourceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 inline-block text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
);


export const SourceList: React.FC<SourceListProps> = ({ sources }) => {
  if (sources.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg mb-8 border border-gray-700">
      <h2 className="text-lg font-semibold mb-3 flex items-center">
        <SourceIcon/>
        Information Sources
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {sources.map((source) => (
          <a
            key={source.uri}
            href={source.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline truncate transition-colors"
            title={source.title}
          >
            {source.title}
          </a>
        ))}
      </div>
    </div>
  );
};
