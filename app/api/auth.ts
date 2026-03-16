import { NextRequest } from "next/server";

export function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get("x-api-key");
  const validApiKey = process.env.API_KEY;

  if (!validApiKey) {
    console.warn("API_KEY is not set in environment variables");
    return false;
  }

  return apiKey === validApiKey;
}

export function authResponse() {
  return Response.json(
    { error: "Unauthorized: Invalid or missing API key" },
    { status: 401 }
  );
}
