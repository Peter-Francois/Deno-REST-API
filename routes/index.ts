// Main router file that combines all routes

import { Router } from "https://deno.land/x/oak@v12.5.0/mod.ts";
import itemsRouter from "./items.ts";
import filesRouter from "./files.ts";

const router = new Router();

// Define API version and prefix
const API_VERSION = "v1";
const API_PREFIX = `/api/${API_VERSION}`;

// Welcome message for API root
router.get(`${API_PREFIX}`, (ctx) => {
  ctx.response.body = {
    status: "success",
    message: `Welcome to the Deno REST API ${API_VERSION}`,
    endpoints: {
      items: `${API_PREFIX}/items`,
      files: `${API_PREFIX}/files`,
    },
  };
});

// Mount other routers
router.use(
  `${API_PREFIX}/items`,
  itemsRouter.routes(),
  itemsRouter.allowedMethods()
);

router.use(
  `${API_PREFIX}/files`,
  filesRouter.routes(),
  filesRouter.allowedMethods()
);

export default router;
