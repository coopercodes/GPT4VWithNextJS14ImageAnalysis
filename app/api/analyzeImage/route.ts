import { Configuration, OpenAIApi } from "openai-edge"
import { OpenAIStream, StreamingTextResponse } from "ai"

export const runtime = 'edge';

const configuration = new Configuration({
    apiKey: "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"
});

const openai = new OpenAIApi(configuration);

// Route Handlers let us create API logic
// POST api/analyzeImage
export async function POST(request: Request) {
    // { image: "ASDFASDFASDF base64 string" }
    const { image } = await request.json();

    const response = await openai.createChatCompletion({
        model: "gpt-4-vision-preview",
        stream: true,
        max_tokens: 4096, // No max tokens: super short / cut off response.
        messages: [ // GPT-4 with Vision is JUST GPT-4. So you can still talk with it like GPT-4
            // There is no "system" message (THIS MAY CHANGE)
            {
                role: "user",
                //@ts-ignore
                content: [
                    { type: "text", text: "What's in this image?" },
                    {
                        type: "image_url",
                        image_url: image // base64 images
                    }
                ]
            }
        ]
    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
}