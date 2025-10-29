import React from "react";

interface AdviceDisplayProps {
  response: string;
  isLoading: boolean;
  error: string | null;
  onConfirm: () => void;
  isSaving: boolean;
  isAlreadySaved: boolean;
}

export function AdviceDisplay({
  response,
  isLoading,
  error,
  onConfirm,
  isSaving,
  isAlreadySaved,
}: AdviceDisplayProps) {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="min-h-[300px] w-full rounded-lg border border-zinc-300 bg-white p-6 text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
        <h2 className="mb-4 text-lg font-semibold">AI Response:</h2>
        {isLoading ? (
          <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
            <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            <p>Getting advice...</p>
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 dark:bg-red-900/20 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : response ? (
          <p className="whitespace-pre-wrap">{response}</p>
        ) : (
          <p className="text-zinc-400 dark:text-zinc-600">No response yet...</p>
        )}
      </div>
      <button
        onClick={onConfirm}
        disabled={!response || isSaving || isAlreadySaved}
        className="w-full rounded-lg bg-green-600 px-4 py-3 font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-zinc-300 disabled:cursor-not-allowed dark:disabled:bg-zinc-700"
      >
        {isSaving ? "Saving..." : isAlreadySaved ? "Already Saved" : "Confirm"}
      </button>
    </div>
  );
}
