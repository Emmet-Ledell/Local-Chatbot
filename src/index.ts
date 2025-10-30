//cli entry point

import Ollama from "ollama";

import * as fs from "fs";

// interface ChatRequest {
//     model: string;
//     messages?: Message[];
//     stream?: boolean;
//     format?: string | object;
//     keep_alive?: string | number;
//     tools?: Tool[];
//     think?: boolean | 'high' | 'medium' | 'low';
//     options?: Partial<Options>;
// }

// interface Message {
//     role: string;
//     content: string;
//     thinking?: string;
//     images?: Uint8Array[] | string[];
//     tool_calls?: ToolCall[];
//     tool_name?: string;
// }

async function generateText() {
  try {
    const initialMessage = [
      {
        role: "user",
        content: "Two + Two ",
      },
    ];
    const response = await Ollama.chat({
      model: "llama3.1:8b",
      think: false,
      messages: initialMessage,
    });
    const messageresponse = JSON.stringify(response);
    console.table(messageresponse);
  } catch (error) {
    console.error("Error generating text:", error);
  }
}

generateText();
