import { useState, useEffect, useCallback } from "react";
import { SavedAdvice } from "@/lib/types";
import { getSavedAdvice, saveAdvice, deleteSavedAdvice, ApiError } from "@/lib/api";

/**
 * Custom hook for managing saved advice state
 */
export function useSavedAdvice() {
  const [savedResponses, setSavedResponses] = useState<SavedAdvice[]>([]);
  const [currentSavedId, setCurrentSavedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved responses on mount
  useEffect(() => {
    loadSavedResponses();
  }, []);

  const loadSavedResponses = useCallback(async () => {
    try {
      const saved = await getSavedAdvice();
      setSavedResponses(saved);
    } catch (err) {
      console.error("Failed to load saved responses:", err);
      setError("Failed to load saved responses");
    }
  }, []);

  const saveNewAdvice = useCallback(
    async (question: string, advice: string): Promise<SavedAdvice | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const savedItem = await saveAdvice({ question, advice });
        setSavedResponses((prev) => [savedItem, ...prev]);
        return savedItem;
      } catch (err) {
        console.error("Error saving advice:", err);
        setError("Failed to save advice");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deleteAdvice = useCallback(async (id: number): Promise<boolean> => {
    try {
      await deleteSavedAdvice(id);
      setSavedResponses((prev) => prev.filter((item) => item.id !== id));

      if (currentSavedId === id) {
        setCurrentSavedId(null);
      }

      return true;
    } catch (err) {
      console.error("Error deleting advice:", err);
      setError("Failed to delete advice");
      return false;
    }
  }, [currentSavedId]);

  const selectSavedAdvice = useCallback((id: number) => {
    setCurrentSavedId(id);
  }, []);

  const clearSelection = useCallback(() => {
    setCurrentSavedId(null);
  }, []);

  return {
    savedResponses,
    currentSavedId,
    isLoading,
    error,
    saveNewAdvice,
    deleteAdvice,
    selectSavedAdvice,
    clearSelection,
  };
}
