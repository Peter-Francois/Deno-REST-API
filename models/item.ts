/**
 * Item model definition
 */
export interface Item {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: unknown; // Allow additional fields
}

/**
 * Item validation function
 * 
 * @param item - The item to validate 
 * @returns Object with validation result and optional error message
 */
export function validateItem(item: Partial<Item>): { isValid: boolean; message?: string } {
  // Require name for new items
  if (!item.name || item.name.trim() === "") {
    return { isValid: false, message: "Item name is required" };
  }
  
  // Name length validation
  if (item.name.length > 100) {
    return { isValid: false, message: "Item name cannot exceed 100 characters" };
  }
  
  // Description length validation
  if (item.description && item.description.length > 1000) {
    return { isValid: false, message: "Item description cannot exceed 1000 characters" };
  }
  
  return { isValid: true };
}
