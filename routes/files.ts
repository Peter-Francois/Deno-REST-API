// Router for file-handling endpoints

import { Router } from "oak";
import { validatePath } from "../utils/helpers.ts";

const router = new Router();
const UPLOAD_DIR = "./uploads";

// Ensure the upload directory exists
try {
  await Deno.mkdir(UPLOAD_DIR, { recursive: true });
} catch (error) {
  if (!(error instanceof Deno.errors.AlreadyExists)) {
    console.error(`Failed to create upload directory: ${error.message}`);
  }
}

/**
 * @route GET /files
 * @description List all files in the uploads directory
 */
router.get("/", async (ctx) => {
  try {
    const files = [];
    for await (const dirEntry of Deno.readDir(UPLOAD_DIR)) {
      if (dirEntry.isFile) {
        const fileInfo = await Deno.stat(`${UPLOAD_DIR}/${dirEntry.name}`);
        files.push({
          name: dirEntry.name,
          size: fileInfo.size,
          created: fileInfo.birthtime,
          modified: fileInfo.mtime,
        });
      }
    }

    ctx.response.body = {
      status: "success",
      data: files,
      count: files.length,
    };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      status: "error",
      message: `Failed to list files: ${error.message}`,
    };
  }
});

/**
 * @route GET /files/:filename
 * @description Download a specific file
 */
router.get("/:filename", async (ctx) => {
  try {
    const filename = ctx.params.filename;
    if (!filename) {
      ctx.response.status = 400;
      ctx.response.body = {
        status: "error",
        message: "Filename is required",
      };
      return;
    }

    // Validate filename to prevent directory traversal
    if (!validatePath(filename)) {
      ctx.response.status = 400;
      ctx.response.body = {
        status: "error",
        message: "Invalid filename",
      };
      return;
    }

    const filePath = `${UPLOAD_DIR}/${filename}`;
    
    try {
      // Check if file exists
      await Deno.stat(filePath);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        ctx.response.status = 404;
        ctx.response.body = {
          status: "error",
          message: `File '${filename}' not found`,
        };
        return;
      }
      throw error;
    }

    // Set appropriate headers for file download
    const fileContent = await Deno.readFile(filePath);
    ctx.response.headers.set("Content-Disposition", `attachment; filename=${filename}`);
    ctx.response.body = fileContent;
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      status: "error",
      message: `Failed to download file: ${error.message}`,
    };
  }
});

/**
 * @route POST /files
 * @description Upload a file
 */
router.post("/", async (ctx) => {
  try {
    const body = ctx.request.body({ type: "form-data" });
    const formData = await body.value.read({ maxSize: 10_000_000 }); // 10MB limit
    
    if (!formData.files || formData.files.length === 0) {
      ctx.response.status = 400;
      ctx.response.body = {
        status: "error",
        message: "No file uploaded",
      };
      return;
    }

    const file = formData.files[0];
    if (!file.filename) {
      ctx.response.status = 400;
      ctx.response.body = {
        status: "error",
        message: "Filename is missing",
      };
      return;
    }

    // Validate filename to prevent directory traversal
    if (!validatePath(file.filename)) {
      ctx.response.status = 400;
      ctx.response.body = {
        status: "error",
        message: "Invalid filename",
      };
      return;
    }

    // Save the file to the uploads directory
    const filePath = `${UPLOAD_DIR}/${file.filename}`;
    
    if (file.content) {
      await Deno.writeFile(filePath, file.content);
    } else if (file.tempfile) {
      // If file was saved to a temporary location
      const tempFileContent = await Deno.readFile(file.tempfile);
      await Deno.writeFile(filePath, tempFileContent);
      // Clean up the temporary file
      await Deno.remove(file.tempfile);
    }

    ctx.response.status = 201;
    ctx.response.body = {
      status: "success",
      message: "File uploaded successfully",
      data: {
        filename: file.filename,
        size: file.size,
      },
    };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      status: "error",
      message: `Failed to upload file: ${error.message}`,
    };
  }
});

/**
 * @route DELETE /files/:filename
 * @description Delete a file
 */
router.delete("/:filename", async (ctx) => {
  try {
    const filename = ctx.params.filename;
    if (!filename) {
      ctx.response.status = 400;
      ctx.response.body = {
        status: "error",
        message: "Filename is required",
      };
      return;
    }

    // Validate filename to prevent directory traversal
    if (!validatePath(filename)) {
      ctx.response.status = 400;
      ctx.response.body = {
        status: "error",
        message: "Invalid filename",
      };
      return;
    }

    const filePath = `${UPLOAD_DIR}/${filename}`;
    
    try {
      // Check if file exists
      await Deno.stat(filePath);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        ctx.response.status = 404;
        ctx.response.body = {
          status: "error",
          message: `File '${filename}' not found`,
        };
        return;
      }
      throw error;
    }

    // Delete the file
    await Deno.remove(filePath);

    ctx.response.body = {
      status: "success",
      message: `File '${filename}' deleted successfully`,
    };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      status: "error",
      message: `Failed to delete file: ${error.message}`,
    };
  }
});

export default router;
