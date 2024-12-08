import { NextRequest } from "next/server";

// Global array to store data (will be reset on server restart)
type Comment = { id: string; name: string; comment: string; timestamp: string };
const dataStore: Comment[] = [];

export async function POST(req: NextRequest) {
  try {
    // Parse the new object from the request
    const newObject = await req.json();

    // Add timestamp if not present
    if (!newObject.timestamp) {
      newObject.timestamp = new Date().toISOString();
    }

    // Add unique identifier if not present
    if (!newObject.id) {
      newObject.id = dataStore.length.toString();
    }

    // Store the object in the array
    dataStore.push(newObject);

    return Response.json({
      success: true,
      message: "Data successfully added",
      totalEntries: dataStore.length,
      index: dataStore.length - 1,
    });
  } catch (error) {
    console.error("Data storage error:", error);
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
    return Response.json(dataStore);
  } catch (error) {
    console.error("Data retrieval error:", error);
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
