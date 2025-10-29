/**
 * Shared TypeScript types and interfaces
 */

export interface SavedAdvice {
  id: number;
  question: string;
  advice: string;
  created_at: string;
}

export interface AdviceRequest {
  question: string;
  category?: string;
}

export interface AdviceResponse {
  advice: string;
  question: string;
}
