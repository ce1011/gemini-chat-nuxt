import { GoogleGenerativeAI } from "@google/generative-ai";
import { AskRequest } from "~/typing/gemini";
import { Readable } from "stream";

export default defineEventHandler(async (event) => {
  // const config = useRuntimeConfig(event)
  if (!process.env.GEMINI_API_KEY) {
    return "No API key found.";
  }

  const body: AskRequest = await readBody(event);

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const chatSession = model.startChat({
    history: body.history,
  });

  const msg = body.ask;

  const result = await chatSession.sendMessageStream(msg);

  // Create a Readable stream for sending text to the client
  const textStream = new Readable({
    read() {},
  });

  // Assuming result.stream is an AsyncGenerator
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    textStream.push(chunkText); // Push the chunk to the client's stream
  }

  // Signal the end of the stream
  textStream.push(null);

  return sendStream(event, textStream);
});
