import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { runChain } from "../api/execute";

export default function ChainRunButton({ chainId }) {
  const [results, setResults] = useState(null);

  const mutation = useMutation({
    mutationFn: () => runChain(chainId),
    onSuccess: (data) => {
      console.log("Response:", data);
      setResults(data);
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  const formatText = (text) => {
    if (!text) return "";

    const paragraphs = text.split("\n\n");

    return paragraphs.map((para, index) => {
      if (para.trim().startsWith("**") && para.trim().endsWith("**")) {
        const headingText = para.replace(/\*\*/g, "").trim();
        return (
          <h3 key={index} className="text-xl font-bold text-gray-900 mt-6 mb-3">
            {headingText}
          </h3>
        );
      }

      if (para.trim().startsWith("*") || para.trim().startsWith("-")) {
        const items = para.split("\n").filter((item) => item.trim());
        return (
          <ul key={index} className="list-disc list-inside space-y-2 my-4 ml-4">
            {items.map((item, i) => (
              <li key={i} className="text-gray-700 leading-relaxed">
                {item.replace(/^[\*\-]\s+/, "").replace(/\*\*/g, "")}
              </li>
            ))}
          </ul>
        );
      }

      return (
        <p key={index} className="text-gray-700 leading-relaxed mb-4">
          {para.replace(/\*\*/g, "")}
        </p>
      );
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Execute Chain</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Chain ID
            </label>
            <input
              type="text"
              value={chainId}
              disabled
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900/50 text-gray-200 text-sm font-mono"
            />
          </div>

          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className={`w-full py-3 px-4 rounded-md font-medium transition-all ${
              mutation.isPending
                ? "bg-gray-600 cursor-not-allowed text-gray-400"
                : "bg-white hover:bg-white/90 text-black shadow-lg hover:shadow-xl"
            }`}
          >
            {mutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Running Chain...
              </span>
            ) : (
              "Run Chain"
            )}
          </button>

          {mutation.isError && (
            <div className="bg-red-900/30 border-l-4 border-red-500 text-red-400 px-4 py-3 rounded backdrop-blur">
              <p className="font-medium">Error occurred</p>
              <p className="text-sm mt-1">
                {mutation.error?.message || "Unknown error"}
              </p>
            </div>
          )}
        </div>
      </div>

      {results && (
        <div className="space-y-6">
          {results.finalOutput && (
            <div className="bg-gray-800/50 backdrop-blur rounded-xl shadow-2xl p-8 border border-gray-700">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                <h3 className="text-2xl font-bold text-white">Final Result</h3>
              </div>
              <div className="leading-relaxed whitespace-pre-wrap text-gray-50 [&_*]:text-gray-50">
                {formatText(results.finalOutput)}
              </div>
            </div>
          )}

          {results.logs && results.logs.length > 0 && (
            <div className="bg-gray-800/50 backdrop-blur rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-gray-800/80 to-slate-800/80 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-semibold text-white">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    Execution Steps
                  </span>
                  <span className="text-sm text-gray-300">
                    ({results.nodesExecuted} steps)
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {results.logs.map((log, index) => (
                    <div
                      key={log.nodeId}
                      className="border border-gray-700 rounded-xl overflow-hidden hover:shadow-xl hover:border-gray-600 transition-all bg-gray-900/40"
                    >
                      <div className="bg-gray-900/60 px-4 py-3  border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 bg-white text-black text-sm font-bold rounded-full shadow-lg">
                              {index + 1}
                            </span>
                            <div>
                              <h4 className="font-semibold text-white text-lg">
                                {log.nodeName.replace(/\{\{|\}\}/g, "")}
                              </h4>
                              <p className="text-xs text-gray-300 mt-0.5">
                                {log.type} •{" "}
                                {(log.executionTime / 1000).toFixed(2)}s
                              </p>
                            </div>
                          </div>
                          {log.hadPreviousContext && (
                            <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full font-medium border border-yellow-500/30">
                              Context
                            </span>
                          )}
                        </div>
                      </div>

                      {log.output && (
                        <div className="p-4 bg-gray-900/60">
                          <div className="text-sm leading-relaxed whitespace-pre-wrap text-gray-50 [&_*]:text-gray-50">
                            {formatText(log.output)}
                          </div>
                        </div>
                      )}

                      {log.error && (
                        <div className="p-4 bg-red-900/30 border-t border-red-800/50">
                          <p className="text-sm font-medium text-red-300 mb-2">
                            Error:
                          </p>
                          <p className="text-sm text-red-200">{log.error}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
