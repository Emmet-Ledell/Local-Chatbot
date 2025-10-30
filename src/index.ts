//cli entry point

import Ollama from "ollama";

import * as fs from "fs";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

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
// interface Options {
//   numa: boolean;
//   num_ctx: number;
//   num_batch: number;
//   num_gpu: number;
//   main_gpu: number;
//   low_vram: boolean;
//   f16_kv: boolean;
//   logits_all: boolean;
//   vocab_only: boolean;
//   use_mmap: boolean;
//   use_mlock: boolean;
//   embedding_only: boolean;
//   num_thread: number;
//   num_keep: number;
//   seed: number;
//   num_predict: number;
//   top_k: number;
//   top_p: number;
//   tfs_z: number;
//   typical_p: number;
//   repeat_last_n: number;
//   temperature: number;
//   repeat_penalty: number;
//   presence_penalty: number;
//   frequency_penalty: number;
//   mirostat: number;
//   mirostat_tau: number;
//   mirostat_eta: number;
//   penalize_newline: boolean;
//   stop: string[];
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
  const rl = createInterface({ input, output });
  let messagelogs = [
    {
      role: "system",
      content:
        "you are a helpful ai chatbot, do your best to answer the users questions. In your responses don't bother with line breaks, the outputs are going to a terminal console. You're responses are role: 'system', the users are role:user",
    },
  ];

  try {
    while (true) {
      const question = await rl.question(`Enter your question: `);

      if (question.trim().toLowerCase() === "/close") {
        console.log("Bye!");
        rl.close();
        break;
      }
      messagelogs.push({ role: "user", content: `${question}` });

      const response = await Ollama.chat({
        model: "llama3.1:8b",
        think: false,
        messages: messagelogs,
        options: {
          num_ctx: 4096,
          temperature: 0.2,
        },
      });
      const llamaResponse = response.message.content;
      console.log(llamaResponse);
      messagelogs.push({
        role: "assistant",
        content: `${llamaResponse}`,
      });
    }
  } catch (error) {
    console.error("Error generating text:", error);
  }
}

generateText();
