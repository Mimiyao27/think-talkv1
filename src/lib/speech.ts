import puter from "@heyputer/puter.js";

export async function convertSpeechToText(audioBlob: Blob): Promise<string> {
  try {
    // According to Puter.js documentation, speech2txt takes an audio blob or URL.
    const result = await puter.ai.speech2txt(audioBlob, {
      language: "en",
      response_format: "text"
    });
    
    // Puter's speech2txt typically returns a string if response_format is "text",
    // or an object { text: string } if json. We handle both just in case.
    if (typeof result === "string") {
      return result;
    } else if (result && typeof result === "object" && "text" in result) {
      return (result as { text: string }).text;
    }
    
    return "Could not parse transcript from result.";
  } catch (error) {
    console.error("Speech-to-text error:", error);
    throw new Error("We couldn't understand the recording. Please try again.");
  }
}
