import { DesignResult, RoomData } from "../types";

export const generateDesignAndAnalysis = async (roomData: RoomData): Promise<DesignResult> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roomData),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || response.statusText);
    }

    return await response.json();
  } catch (e: any) {
    console.error("Design generation failed", e);
    throw new Error(`Failed to generate design: ${e.message}`);
  }
};