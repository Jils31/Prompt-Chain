import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { runChain } from '../api/execute';

export default function ChainRunButton({ chainId }) {
  const [results, setResults] = useState(null);

  const mutation = useMutation({
    mutationFn: () => runChain(chainId),
    onSuccess: (data) => {
      console.log('Response:', data);
      setResults(data);
    },
    onError: (error) => {
      console.error('Error:', error);
    }
  });

  // Format text to render markdown-like formatting
  const formatText = (text) => {
    if (!text) return '';
    
    // Split by double newlines for paragraphs
    const paragraphs = text.split('\n\n');
    
    return paragraphs.map((para, index) => {
      // Check if it's a heading (starts with ** or #)
      if (para.trim().startsWith('**') && para.trim().endsWith('**')) {
        const headingText = para.replace(/\*\*/g, '').trim();
        return (
          <h3 key={index} className="text-xl font-bold text-gray-900 mt-6 mb-3">
            {headingText}
          </h3>
        );
      }
      
      // Check for bullet points
      if (para.trim().startsWith('*') || para.trim().startsWith('-')) {
        const items = para.split('\n').filter(item => item.trim());
        return (
          <ul key={index} className="list-disc list-inside space-y-2 my-4 ml-4">
            {items.map((item, i) => (
              <li key={i} className="text-gray-700 leading-relaxed">
                {item.replace(/^[\*\-]\s+/, '').replace(/\*\*/g, '')}
              </li>
            ))}
          </ul>
        );
      }
      
      // Regular paragraph
      return (
        <p key={index} className="text-gray-700 leading-relaxed mb-4">
          {para.replace(/\*\*/g, '')}
        </p>
      );
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Execute Chain</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chain ID
            </label>
            <input
              type="text"
              value={chainId}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm font-mono"
            />
          </div>

          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className={`w-full py-3 px-4 rounded-md font-medium transition-all ${
              mutation.isPending
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
            }`}
          >
            {mutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Running Chain...
              </span>
            ) : (
              'Run Chain'
            )}
          </button>

          {mutation.isError && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
              <p className="font-medium">Error occurred</p>
              <p className="text-sm mt-1">{mutation.error?.message || 'Unknown error'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Results Display Section */}
      {results && (
        <div className="space-y-6">
          {/* Execution Summary */}
          <div className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-800">Execution Complete</h3>
              {results.success && (
                <span className="flex items-center gap-2 text-green-600 font-semibold">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Success
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/80 backdrop-blur rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Total Time</p>
                <p className="text-2xl font-bold text-blue-600">
                  {(results.totalTime / 1000).toFixed(2)}s
                </p>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Steps Completed</p>
                <p className="text-2xl font-bold text-purple-600">
                  {results.nodesExecuted}
                </p>
              </div>
            </div>
          </div>

          {/* Final Output */}
          {results.finalOutput && (
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                <h3 className="text-2xl font-bold text-gray-800">Result</h3>
              </div>
              <div className="prose prose-lg max-w-none">
                {formatText(results.finalOutput)}
              </div>
            </div>
          )}

          {/* Execution Steps - With Output */}
          {results.logs && results.logs.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-semibold text-gray-800">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Execution Steps
                  </span>
                  <span className="text-sm text-gray-500">({results.nodesExecuted} steps)</span>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {results.logs.map((log, index) => (
                  <div 
                    key={log.nodeId} 
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Step Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white text-sm font-bold rounded-full shadow-sm">
                            {index + 1}
                          </span>
                          <div>
                            <h4 className="font-semibold text-gray-800">
                              {log.nodeName.replace(/\{\{|\}\}/g, '')}
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {log.type} • {(log.executionTime / 1000).toFixed(2)}s
                            </p>
                          </div>
                        </div>
                        {log.hadPreviousContext && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                            Context
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Step Output */}
                    {log.output && (
                      <div className="p-4 bg-white">
                        <div className="prose prose-sm max-w-none">
                          {formatText(log.output)}
                        </div>
                      </div>
                    )}

                    {/* Step Error */}
                    {log.error && (
                      <div className="p-4 bg-red-50 border-t border-red-200">
                        <p className="text-sm font-medium text-red-700 mb-2">Error:</p>
                        <p className="text-sm text-red-800">{log.error}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}