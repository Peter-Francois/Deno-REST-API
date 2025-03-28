/**
 * Utility functions for the application
 */

/**
 * Validate a file or path name to prevent directory traversal attacks
 * 
 * @param path - The path or filename to validate
 * @returns True if the path is valid, false otherwise
 */
export function validatePath(path: string): boolean {
  // Prevent directory traversal and invalid characters
  if (path.includes("..") || path.includes("/") || path.includes("\\")) {
    return false;
  }
  
  // Check for any null bytes or control characters
  if (/[\x00-\x1F\x7F]/.test(path)) {
    return false;
  }
  
  // Additional validation for common bad patterns
  const disallowedPatterns = [
    /^\./, // Hidden files
    /^\//, // Absolute paths
    /^\\/, // Windows absolute paths
    /^con$/i, /^prn$/i, /^aux$/i, /^nul$/i, // Windows reserved names
    /^com[1-9]$/i, /^lpt[1-9]$/i, // More Windows reserved names
  ];
  
  if (disallowedPatterns.some(pattern => pattern.test(path))) {
    return false;
  }
  
  return true;
}

/**
 * Parse a string into a Date, returning undefined if invalid
 * 
 * @param dateString - The date string to parse
 * @returns A Date object or undefined if parsing failed
 */
export function parseDate(dateString: string): Date | undefined {
  try {
    const date = new Date(dateString);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return undefined;
    }
    return date;
  } catch {
    return undefined;
  }
}

/**
 * Format a date as an ISO string without milliseconds
 * 
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('.')[0] + 'Z';
}

/**
 * Sanitize an object for JSON response by handling Date objects
 * 
 * @param obj - The object to sanitize
 * @returns A sanitized copy of the object
 */
export function sanitizeForJson(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value instanceof Date) {
      result[key] = formatDate(value);
    } else if (typeof value === 'object' && value !== null) {
      result[key] = sanitizeForJson(value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }
  
  return result;
}
