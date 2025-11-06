//cli entry point

import Ollama from "ollama";

import * as fs from "fs";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { spawn } from "child_process";

const pythonScript = "src/retriever.py";

const pythonProcess = spawn("python3", [pythonScript]);

pythonProcess.stdout.on("data", (data) => {
  const text = data.toString();
});

type DeadRes = {
  results: [
    { similarity: number; uuid: number; sourceFile: string; text: string }
  ];
};

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
      let flag = false;
      const question = await rl.question(`Enter your question: `);

      if (question.trim().toLowerCase() === "/close") {
        console.log("Bye!");
        rl.close();
        break;
      }
      if (question.trim().toLowerCase().startsWith("/search")) {
        try {
          flag = true;
          const embedQuery = question.split("/search")[1] || "";
          const res = await fetch("http://127.0.0.1:8000/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: embedQuery }),
          });
          const data = (await res.json()) as DeadRes;
          // console.log("PYTHON REPOSNE \n", data.results);
          messagelogs.push({
            role: "system",
            content: `
          You are a retrieval-augmented assistant. The user asked: "${embedQuery}".
          Use only the information from the provided JSON data to answer. 
          
          The JSON will contain objects in this format:
          [
            { similarity: number, uuid: number, sourceFile: string, text: string }
          ]
          
          Instructions:
          - If the answer is clearly supported by one or more "text" fields, answer concisely and cite the corresponding sourceFile(s).
          - If the information is not found or cannot be inferred from the JSON, reply with "I don't know."
          - Do not fabricate or use outside knowledge.
          - Respond naturally and directly to the user's question.
          
          JSON data:
          ${JSON.stringify(data)}
          `,
          });
        } catch (error) {
          console.log(error);
        }
      }

      if (!flag) {
        messagelogs.push({ role: "user", content: `${question}` });
      }

      const response = await Ollama.chat({
        model: "llama3.1:8b", //gpt-oss:20b, llama3.1:8b
        think: false,
        stream: false,
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
