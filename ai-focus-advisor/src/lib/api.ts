// API service for communicating with the FastAPI backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface AdviceRequest {
  question: string;
  category?: string;
}

export interface AdviceResponse {
  advice: string;
  question: string;
}

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