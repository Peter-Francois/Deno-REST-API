// Router for item-related endpoints

import { Router } from "https://deno.land/x/oak@v12.5.0/mod.ts";
import { getQuery } from "https://deno.land/x/oak@v12.5.0/helpers.ts";
import { Item } from "../models/item.ts";
import { 
  getAllItems, 
  getItemById, 
  createItem, 
  updateItem, 
  deleteItem 
} from "../db/inMemoryDb.ts";

const router = new Router();

/**
 * @route GET /items
 * @description Get all items, optionally filtered
 */
router.get("/", async (ctx) => {
  try {
    const params = getQuery(ctx);
    const items = await getAllItems(params);
    
    ctx.response.body = {
      status: "success",
      data: items,
      count: items.length,
    };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      status: "error",
      message: error.message,
    };
  }
});

/**
 * @route GET /items/:id
 * @description Get a single item by its ID
 */
router.get("/:id", async (ctx) => {
  try {
    const id = ctx.params.id;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = {
        status: "error",
        message: "Item ID is required",
      };
      return;
    }

    const item = await getItemById(id);
    if (!item) {
      ctx.response.status = 404;
      ctx.response.body = {
        status: "error",
        message: `Item with ID ${id} not found`,
      };
      return;
    }

    ctx.response.body = {
      status: "success",
      data: item,
    };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      status: "error",
      message: error.message,
    };
  }
});

/**
 * @route POST /items
 * @description Create a new item
 */
router.post("/", async (ctx) => {
  try {
    if (!ctx.request.hasBody) {
      ctx.response.status = 400;
      ctx.response.body = {
        status: "error",
        message: "Request body is missing",
      };
      return;
    }

    const body = await ctx.request.body().value;
    const newItem = await createItem(body as Item);

    ctx.response.status = 201;
    ctx.response.body = {
      status: "success",
      message: "Item created successfully",
      data: newItem,
    };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      status: "error",
      message: error.message,
    };
  }
});

/**
 * @route PUT /items/:id
 * @description Update an existing item
 */
router.put("/:id", async (ctx) => {
  try {
    const id = ctx.params.id;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = {
        status: "error",
        message: "Item ID is required",
      };
      return;
    }

    if (!ctx.request.hasBody) {
      ctx.response.status = 400;
      ctx.response.body = {
        status: "error",
        message: "Request body is missing",
      };
      return;
    }

    const body = await ctx.request.body().value;
    const updatedItem = await updateItem(id, body as Partial<Item>);

    if (!updatedItem) {
      ctx.response.status = 404;
      ctx.response.body = {
        status: "error",
        message: `Item with ID ${id} not found`,
      };
      return;
    }

    ctx.response.body = {
      status: "success",
      message: "Item updated successfully",
      data: updatedItem,
    };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      status: "error",
      message: error.message,
    };
  }
});

/**
 * @route DELETE /items/:id
 * @description Delete an item by its ID
 */
router.delete("/:id", async (ctx) => {
  try {
    const id = ctx.params.id;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = {
        status: "error",
        message: "Item ID is required",
      };
      return;
    }

    const deleted = await deleteItem(id);
    if (!deleted) {
      ctx.response.status = 404;
      ctx.response.body = {
        status: "error",
        message: `Item with ID ${id} not found`,
      };
      return;
    }

    ctx.response.body = {
      status: "success",
      message: `Item with ID ${id} deleted successfully`,
    };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      status: "error",
      message: error.message,
    };
  }
});

export default router;
