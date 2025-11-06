//cli entry point

import Ollama from "ollama";

import * as fs from "fs";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { spawn } from "child_process";

const pythonProcess = spawn("python3", ["src/retriever.py"]);

pythonProcess.stdout.on("data", (data) => {
  const text = data.toString();
});

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
      if (question.trim().toLowerCase().startsWith("/search")) {
        try {
          const pythonScript = "src/retriever.py";
          const embedQuery = question.split("/search")[1] || "";

          const res = await fetch("http://127.0.0.1:8000/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: embedQuery }),
          });
          const data = await res.json();
          // if (typeof data !== "string") {
          //   return;
          // }
          console.log("PYTHON REPOSNE \n", data);
          // const a = JSON.parse(data);

          rl.close();
          break;
        } catch (error) {
          console.log(error);
        }
      }
      messagelogs.push({ role: "user", content: `${question}` });

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
