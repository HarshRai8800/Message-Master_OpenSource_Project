
import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

const openai = createOpenAI({

  compatibility: 'strict', 
});
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const prompt = `
      Create a list of three open-ended and engaging questions
      formatted as a single string. Each question should be
      separated by '||'. These questions are for an anonymous
      social messaging platform, like qooh.me, and should be
      suitable for a diverse audience. Avoid personal or
      sensitive topics, focusing instead on universal themes
      that encourage friendly interaction. Ensure the 
      questions are intriguing, foster curiosity, and
      contribute to a positive and welcoming conversational
      environment. The output should be structured like this:
      "What's a hobby you've recently started? || If you could
      have dinner with any historical figure, who would it be?
      || What's a simple thing that makes you happy?"
  `;

  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages)) {
      throw new Error("The 'messages' field must be an array.");
    }

    const updatedMessages = [
      ...messages,      
      { role: "user", content: prompt }
    ];

    const result = await streamText({
      model: openai("gpt-3.5-turbo"),
      messages: updatedMessages,
    });
  console.log(result)
    // Resolve the streaming text promise to extract the content
    const text=  result.toDataStreamResponse() // Ensure this resolves successfully
   console.log(text )
   return text
// return text
//     return Response.json({
//       success: true,
//       message: text,
//     });
  } catch (error) {
    console.error("Error in POST handler:", error);

    return Response.json(
      {
        success: false,
        message: "Error in processing the request: " + error,
      },
      { status: 500 }
    );
  }
}
