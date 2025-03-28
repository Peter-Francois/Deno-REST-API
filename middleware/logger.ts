// Middleware for logging requests

import { Context, Next } from "https://deno.land/x/oak@v12.5.0/mod.ts";

/**
 * Logger middleware to log HTTP requests
 * 
 * @param ctx - Oak context
 * @param next - Next middleware function
 */
export const logger = async (ctx: Context, next: Next) => {
  const start = Date.now();
  const requestId = crypto.randomUUID();
  
  // Log request details
  console.log(`[${new Date().toISOString()}] [${requestId}] ${ctx.request.method} ${ctx.request.url.pathname}`);
  
  try {
    // Execute the next middleware
    await next();
    
    // Calculate request processing time
    const ms = Date.now() - start;
    
    // Set response headers for tracking
    ctx.response.headers.set("X-Response-Time", `${ms}ms`);
    ctx.response.headers.set("X-Request-ID", requestId);
    
    // Log completed request details
    console.log(
      `[${new Date().toISOString()}] [${requestId}] ${ctx.request.method} ${ctx.request.url.pathname} - ${ctx.response.status} (${ms}ms)`
    );
  } catch (error) {
    // Log error details
    console.error(
      `[${new Date().toISOString()}] [${requestId}] Error processing ${ctx.request.method} ${ctx.request.url.pathname}: ${error.message}`
    );
    
    // Re-throw the error for the error handler middleware
    throw error;
  }
};
