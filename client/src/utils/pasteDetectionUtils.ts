/**
 * Utility Functions for Paste Detection
 */

export const API_BASE_URL = typeof window !== 'undefined' && (window as any)?.ENV?.REACT_APP_API_URL ? (window as any).ENV.REACT_APP_API_URL : 'http://localhost:5000';

/**
 * Generate unique session ID
 */
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Format bytes to human readable size
 */
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Calculate writing statistics
 */
export const calculateWritingStats = (text: string) => {
  const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
  const chars = text.length;
  const lines = text.split('\n').length;
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0).length;
  
  return { words, chars, lines, paragraphs };
};

/**
 * Calculate paste percentage
 */
export const calculatePastePercentage = (pastedChars: number, totalChars: number): number => {
  if (totalChars === 0) return 0;
  return Math.round((pastedChars / totalChars) * 100 * 100) / 100;
};

/**
 * Determine suspicion level based on paste data
 */
export const determineSuspicionLevel = (pasteCount: number, pastePercentage: number): string => {
  if (pasteCount > 10 || pastePercentage > 70) return 'high';
  if (pasteCount > 5 || pastePercentage > 40) return 'medium';
  if (pasteCount > 0 || pastePercentage > 10) return 'low';
  return 'none';
};

/**
 * Format timestamp to readable format
 */
export const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

/**
 * Validate paste event data
 */
export const validatePasteEvent = (event: any): boolean => {
  return (
    event.sessionId &&
    event.timestamp &&
    event.textLength >= 0 &&
    event.content &&
    event.position &&
    typeof event.position.line === 'number' &&
    typeof event.position.column === 'number'
  );
};

/**
 * Create authenticity report
 */
export interface AuthenticityReport {
  confidenceScore: number;
  humanScore: number;
  aiScore: number;
  pastedPercentage: number;
  typedPercentage: number;
  suspiciousFactor: 'high' | 'medium' | 'low' | 'none';
  recommendation: string;
}

export const createAuthenticityReport = (
  pasteCount: number,
  pastedChars: number,
  totalChars: number
): AuthenticityReport => {
  const pastedPercentage = calculatePastePercentage(pastedChars, totalChars);
  const suspiciousFactor = determineSuspicionLevel(pasteCount, pastedPercentage);
  
  const baseScore = 100;
  const pasteCountPenalty = Math.min(pasteCount * 5, 40);
  const pastePercentagePenalty = (pastedPercentage / 100) * 30;
  
  const humanScore = Math.max(0, baseScore - pasteCountPenalty - pastePercentagePenalty);
  const aiScore = 100 - humanScore;
  const confidenceScore = Math.max(0, humanScore);

  let recommendation = '';
  const susFactor = suspiciousFactor as 'high' | 'medium' | 'low' | 'none';
  if (susFactor === 'high') {
    recommendation = 'Content appears to have significant pasted material. Manual review recommended.';
  } else if (susFactor === 'medium') {
    recommendation = 'Moderate paste activity detected. Consider additional verification.';
  } else if (susFactor === 'low') {
    recommendation = 'Minor paste activity. Content appears mostly original.';
  } else {
    recommendation = 'No paste activity detected. Excellent!';
  }

  return {
    confidenceScore: Math.round(confidenceScore),
    humanScore: Math.round(humanScore),
    aiScore: Math.round(aiScore),
    pastedPercentage: pastedPercentage,
    typedPercentage: 100 - pastedPercentage,
    suspiciousFactor: susFactor,
    recommendation,
  };
};

/**
 * API call wrapper with error handling
 */
export const apiCall = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};
