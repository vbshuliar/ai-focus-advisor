import React from "react";
import { SavedAdvice } from "@/lib/types";

interface SavedResponsesListProps {
  savedResponses: SavedAdvice[];
  currentSavedId: number | null;
  onItemClick: (item: SavedAdvice) => void;
  onDelete: (id: number, e: React.MouseEvent) => void;
}

export function SavedResponsesList({
  savedResponses,
  currentSavedId,
  onItemClick,
  onDelete,
}: SavedResponsesListProps) {
  return (
    <div className="w-80 rounded-lg border border-zinc-300 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
      <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">
        Saved Responses
      </h2>
      <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
        {savedResponses.length === 0 ? (
          <p className="text-sm text-zinc-400 dark:text-zinc-600">
            No saved responses yet...
          </p>
        ) : (
          savedResponses.map((item) => (
            <div
              key={item.id}
              onClick={() => onItemClick(item)}
              className={`flex items-center justify-between gap-2 rounded-lg border p-3 cursor-pointer transition-colors ${
                currentSavedId === item.id
                  ? "border-blue-400 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/30"
                  : "border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
              }`}
            >
              <span className="text-sm text-black dark:text-white truncate flex-1">
                {item.question.length > 25
                  ? `${item.question.substring(0, 25)}...`
                  : item.question}
              </span>
              <button
                onClick={(e) => onDelete(item.id, e)}
                className="flex-shrink-0 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
                title="Delete"
                aria-label="Delete saved response"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
