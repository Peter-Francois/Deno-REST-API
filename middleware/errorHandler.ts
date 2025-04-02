// Middleware for handling errors

import { Context, Next, isHttpError } from "oak";

/**
 * Global error handler middleware
 * 
 * @param ctx - Oak context
 * @param next - Next middleware function
 */
export const errorHandler = async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (error) {
    // Log the error
    console.error(`Error: ${error.message}`);
    
    let status = 500;
    let message = "Internal Server Error";
    
    // Handle HTTP-specific errors from Oak
    if (isHttpError(error)) {
      status = error.status;
      message = error.message;
    }
    
    // Set the response status and body
    ctx.response.status = status;
    ctx.response.body = {
      status: "error",
      message,
      ...(Deno.env.get("ENVIRONMENT") === "development" && { stack: error.stack }),
    };
    
    // Ensure the error is not propagated further
    ctx.response.type = "json";
  }
};
