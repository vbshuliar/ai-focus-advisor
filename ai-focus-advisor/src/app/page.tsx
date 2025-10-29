"use client";

import { useState } from "react";
import { getAdvice, ApiError } from "@/lib/api";

interface SavedItem {
  id: string;
  prompt: string;
  text: string;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [savedResponses, setSavedResponses] = useState<SavedItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!input.trim()) {
      setError("Please enter a message");
      return;
    }

    console.log("Sent:", input);
    setIsLoading(true);
    setError(null);
    setResponse("");

    try {
      const result = await getAdvice({
        question: input,
        category: "general"
      });

      setResponse(result.advice);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
      console.error("Error getting advice:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    const newItem: SavedItem = {
      id: Date.now().toString(),
      prompt: input,
      text: response,
    };
    setSavedResponses([...savedResponses, newItem]);
    console.log("Saved response:", response);
    // Add your save logic here
  };

  const handleDelete = (id: string) => {
    setSavedResponses(savedResponses.filter((item) => item.id !== id));
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-zinc-50 font-sans dark:bg-black p-8">
      <div className="w-full max-w-6xl" style={{ marginTop: "5vh" }}>
        <h1 className="text-4xl font-bold text-center text-black dark:text-white mb-8">
          AI Focus Advisor
        </h1>
        <div className="flex gap-6 mb-8">
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
              onClick={handleConfirm}
              disabled={!response}
              className="w-full rounded-lg bg-green-600 px-4 py-3 font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-zinc-300 disabled:cursor-not-allowed dark:disabled:bg-zinc-700"
            >
              Confirm
            </button>
          </div>

          <div className="w-80 rounded-lg border border-zinc-300 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">Saved Responses</h2>
            <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
              {savedResponses.length === 0 ? (
                <p className="text-sm text-zinc-400 dark:text-zinc-600">No saved responses yet...</p>
              ) : (
                savedResponses.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800"
                  >
                    <span className="text-sm text-black dark:text-white truncate">
                      {item.prompt.substring(0, 25)}...
                    </span>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex-shrink-0 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      title="Delete"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
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
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !isLoading) {
                handleSend();
              }
            }}
            placeholder="Enter your message..."
            disabled={isLoading}
            className="flex-1 rounded-lg border border-zinc-300 px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="h-[52px] w-[52px] rounded-lg bg-blue-600 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
          >
            {isLoading ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mx-auto"></div>
            ) : (
              "Send"
            )}
          </button>
        </div>
      </div>
      <footer className="w-full text-center py-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Developed by <span className="font-semibold">Terdessa</span>
        </p>
      </footer>
    </div>
  );
}
