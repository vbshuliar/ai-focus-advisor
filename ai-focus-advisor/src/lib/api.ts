// API service for communicating with the FastAPI backend

import { AdviceRequest, AdviceResponse, SavedAdvice } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function getAdvice(request: AdviceRequest): Promise<AdviceResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/advice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: request.question,
        category: request.category || 'general',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new ApiError(
        response.status,
        errorData.detail || `Server error: ${response.status}`
      );
    }

    const data: AdviceResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError(
        0,
        'Unable to connect to the server. Please make sure the backend is running on port 8000.'
      );
    }

    throw new ApiError(500, 'An unexpected error occurred');
  }
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

export interface SaveAdviceRequest {
  question: string;
  advice: string;
}

// Save advice to database
export async function saveAdvice(request: SaveAdviceRequest): Promise<SavedAdvice> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/saved-advice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new ApiError(
        response.status,
        errorData.detail || `Failed to save advice: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Failed to save advice');
  }
}

// Get all saved advice
export async function getSavedAdvice(): Promise<SavedAdvice[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/saved-advice`);

    if (!response.ok) {
      throw new ApiError(response.status, 'Failed to fetch saved advice');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Failed to fetch saved advice');
  }
}

// Get specific saved advice by ID
export async function getSavedAdviceById(id: number): Promise<SavedAdvice> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/saved-advice/${id}`);

    if (!response.ok) {
      throw new ApiError(response.status, 'Failed to fetch saved advice');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Failed to fetch saved advice');
  }
}

// Delete saved advice by ID
export async function deleteSavedAdvice(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/saved-advice/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new ApiError(
        response.status,
        errorData.detail || `Failed to delete advice: ${response.status}`
      );
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Failed to delete advice');
  }
}