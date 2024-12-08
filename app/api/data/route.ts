import fs from "fs/promises";
import { NextRequest } from "next/server";
import path from "path";

// Ensure an absolute path that works across different environments
const filePath = path.join(process.cwd(), "data.json");

export async function POST(req: NextRequest) {
  try {
    // Ensure the directory exists
    const directory = path.dirname(filePath);
    await fs.mkdir(directory, { recursive: true });

    // Read existing data or start with an empty array
    let fileContents = [];
    try {
      const existingData = await fs.readFile(filePath, "utf8");
      fileContents = JSON.parse(existingData);
    } catch (readError) {
      // File doesn't exist or is empty, start with an empty array
      console.log("Creating new file:", readError);
    }

    // Add new object from request
    const newObject = await req.json();

    // Add timestamp if not present
    if (!newObject.timestamp) {
      newObject.timestamp = new Date().toISOString();
    }

    fileContents.push(newObject);

    // Write updated contents with proper formatting
    await fs.writeFile(filePath, JSON.stringify(fileContents, null, 2), {
      encoding: "utf8",
      flag: "w",
      mode: 0o666,
    });

    return Response.json({
      success: true,
      message: "Data successfully added",
      totalEntries: fileContents.length,
    });
  } catch (error) {
    console.error("File writing error:", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        details: error,
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    // Ensure the file exists before reading
    try {
      await fs.access(filePath);
    } catch (accessError) {
      console.log(accessError);
      // If file doesn't exist, create it with an empty array
      await fs.writeFile(filePath, JSON.stringify([], null, 2), {
        encoding: "utf8",
        flag: "w",
        mode: 0o666,
      });
    }

    // Read the file
    const fileData = await fs.readFile(filePath, "utf8");
    const fileContents = JSON.parse(fileData);

    return Response.json(fileContents);
  } catch (error) {
    console.error("File reading error:", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        details: error,
      },
      { status: 500 },
    );
  }
}
