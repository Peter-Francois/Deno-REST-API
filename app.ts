// Main application entry point for Deno REST API

import { Application } from "https://deno.land/x/oak@v12.5.0/mod.ts";
import { logger } from "./middleware/logger.ts";
import { errorHandler } from "./middleware/errorHandler.ts";
import router from "./routes/index.ts";

// Create a new Oak application
const app = new Application();
const PORT = 5000;

// Register middleware
app.use(logger);
app.use(errorHandler);

// Register routes
app.use(router.routes());
app.use(router.allowedMethods());

// Add a basic welcome message for the root route
app.use((ctx) => {
  ctx.response.body = {
    message: "Welcome to the Deno REST API!",
    documentation: "See README.md for API documentation",
  };
});

// Event listener for when the application starts
app.addEventListener("listen", ({ hostname, port, secure }) => {
  console.log(
    `🦕 Server running on ${secure ? "https" : "http"}://${
      hostname ?? "0.0.0.0"
    }:${port}`,
  );
  console.log("Press Ctrl+C to stop the server");
});

// Start the server
console.log(`Starting server on port ${PORT}...`);
await app.listen({ hostname: "0.0.0.0", port: PORT });
