"use client";

import { useState } from "react";
import { getAdvice, ApiError } from "@/lib/api";
import { SavedAdvice } from "@/lib/types";
import { useSavedAdvice } from "@/hooks/useSavedAdvice";
import { MessageInput } from "@/components/MessageInput";
import { AdviceDisplay } from "@/components/AdviceDisplay";
import { SavedResponsesList } from "@/components/SavedResponsesList";

export default function Home() {
  // Local state for current conversation
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Saved advice state management
  const {
    savedResponses,
    currentSavedId,
    isLoading: isSaving,
    saveNewAdvice,
    deleteAdvice,
    selectSavedAdvice,
    clearSelection,
  } = useSavedAdvice();

  const handleSend = async () => {
    if (!input.trim()) {
      setError("Please enter a message");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse("");
    setCurrentQuestion(input);
    clearSelection(); // Reset saved ID when sending new question

    try {
      const result = await getAdvice({
        question: input,
        category: "general",
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

  const handleConfirm = async () => {
    if (!response || !currentQuestion) return;

    // If viewing a saved item, don't save it again
    if (currentSavedId !== null) {
      console.log("Already saved, skipping duplicate save");
      return;
    }

    const savedItem = await saveNewAdvice(currentQuestion, response);

    if (savedItem) {
      // Clear the current response and input
      setResponse("");
      setInput("");
      setCurrentQuestion("");
    }
  };

  const handleSavedItemClick = (item: SavedAdvice) => {
    setInput(item.question);
    setResponse(item.advice);
    setCurrentQuestion(item.question);
    selectSavedAdvice(item.id);
    setError(null);
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    // Prevent triggering the parent click event
    e.stopPropagation();

    const deleted = await deleteAdvice(id);

    // If currently viewing this item, clear the display
    if (deleted && currentSavedId === id) {
      setResponse("");
      setInput("");
      setCurrentQuestion("");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-zinc-50 font-sans dark:bg-black p-8">
      <div className="w-full max-w-6xl" style={{ marginTop: "5vh" }}>
        <h1 className="text-4xl font-bold text-center text-black dark:text-white mb-8">
          AI Focus Advisor
        </h1>

        <div className="flex gap-6 mb-8">
          <AdviceDisplay
            response={response}
            isLoading={isLoading}
            error={error}
            onConfirm={handleConfirm}
            isSaving={isSaving}
            isAlreadySaved={currentSavedId !== null}
          />

          <SavedResponsesList
            savedResponses={savedResponses}
            currentSavedId={currentSavedId}
            onItemClick={handleSavedItemClick}
            onDelete={handleDelete}
          />
        </div>

        <MessageInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          isLoading={isLoading}
        />
      </div>

      <footer className="w-full text-center py-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Developed by <span className="font-semibold">Terdessa</span>
        </p>
      </footer>
    </div>
  );
}
