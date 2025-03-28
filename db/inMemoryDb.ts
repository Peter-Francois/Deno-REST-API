// In-memory database implementation for items

import { Item, validateItem } from "../models/item.ts";

// In-memory storage for items
const items: Map<string, Item> = new Map();

/**
 * Get all items, optionally filtered by query parameters
 * 
 * @param params - Query parameters for filtering
 * @returns Array of items matching the filters
 */
export const getAllItems = async (params: Record<string, string> = {}): Promise<Item[]> => {
  // Convert items map to array
  let result = Array.from(items.values());
  
  // Filter by query parameters
  Object.entries(params).forEach(([key, value]) => {
    if (key && value) {
      result = result.filter(item => {
        const itemValue = item[key];
        // Handle different types of values
        if (typeof itemValue === "string") {
          return itemValue.toLowerCase().includes(value.toLowerCase());
        } else if (itemValue !== undefined) {
          return String(itemValue) === value;
        }
        return false;
      });
    }
  });
  
  // Sort by updated time, newest first
  return result.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
};

/**
 * Get an item by its ID
 * 
 * @param id - The ID of the item to retrieve
 * @returns The item or undefined if not found
 */
export const getItemById = async (id: string): Promise<Item | undefined> => {
  return items.get(id);
};

/**
 * Create a new item
 * 
 * @param itemData - Data for the new item
 * @returns The created item
 */
export const createItem = async (itemData: Partial<Item>): Promise<Item> => {
  // Validate the item data
  const validation = validateItem(itemData);
  if (!validation.isValid) {
    throw new Error(validation.message);
  }
  
  // Generate a unique ID
  const id = crypto.randomUUID();
  const timestamp = new Date();
  
  // Create the new item
  const newItem: Item = {
    id,
    name: itemData.name!,
    description: itemData.description || "",
    createdAt: timestamp,
    updatedAt: timestamp,
    ...itemData, // Include any additional fields
    // Ensure required fields are not overwritten
    id,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  
  // Store the item
  items.set(id, newItem);
  
  return newItem;
};

/**
 * Update an existing item
 * 
 * @param id - The ID of the item to update
 * @param itemData - New data for the item
 * @returns The updated item or undefined if not found
 */
export const updateItem = async (id: string, itemData: Partial<Item>): Promise<Item | undefined> => {
  // Check if the item exists
  const existingItem = items.get(id);
  if (!existingItem) {
    return undefined;
  }
  
  // Validate the updated data
  const validation = validateItem({ ...existingItem, ...itemData });
  if (!validation.isValid) {
    throw new Error(validation.message);
  }
  
  // Create the updated item, preserving the original ID and creation date
  const updatedItem: Item = {
    ...existingItem,
    ...itemData,
    id, // Ensure ID is not changed
    createdAt: existingItem.createdAt, // Preserve original creation date
    updatedAt: new Date(), // Update the updated timestamp
  };
  
  // Store the updated item
  items.set(id, updatedItem);
  
  return updatedItem;
};

/**
 * Delete an item by its ID
 * 
 * @param id - The ID of the item to delete
 * @returns True if the item was deleted, false if not found
 */
export const deleteItem = async (id: string): Promise<boolean> => {
  // Check if the item exists
  if (!items.has(id)) {
    return false;
  }
  
  // Delete the item
  return items.delete(id);
};

// Initialize some example data
(async () => {
  try {
    await createItem({
      name: "Example Item 1",
      description: "This is the first example item",
    });
    
    await createItem({
      name: "Example Item 2",
      description: "This is the second example item",
    });
    
    console.log("Initialized example items in the in-memory database");
  } catch (error) {
    console.error("Failed to initialize example items:", error.message);
  }
})();
