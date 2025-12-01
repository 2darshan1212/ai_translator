import Bytez from 'bytez.js';
import endent from 'endent';
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser';

const BYTEZ_MODEL_MAP: Record<string, string> = {
  'gpt-3.5-turbo': 'Qwen/Qwen2.5-Coder-7B-Instruct',
  'gpt-4': 'meta-llama/Meta-Llama-3.1-8B-Instruct',
};

const DEFAULT_BYTEZ_MODEL = BYTEZ_MODEL_MAP['gpt-3.5-turbo'];

const isOpenAIKey = (maybeKey?: string) =>
  typeof maybeKey === 'string' && maybeKey.trim().startsWith('sk-');

const createPrompt = (
  inputLanguage: string,
  outputLanguage: string,
  inputCode: string,
) => {
  if (inputLanguage === 'Natural Language') {
    return endent`
    You are an expert programmer in all programming languages. Translate the natural language to "${outputLanguage}" code. Do not include \`\`\`.

    Example translating from natural language to JavaScript:

    Natural language:
    Print the numbers 0 to 9.

    JavaScript code:
    for (let i = 0; i < 10; i++) {
      console.log(i);
    }

    Natural language:
    ${inputCode}

    ${outputLanguage} code (no \`\`\`):
    `;
  } else if (outputLanguage === 'Natural Language') {
    return endent`
      You are an expert programmer in all programming languages. Translate the "${inputLanguage}" code to natural language in plain English that the average adult could understand. Respond as bullet points starting with -.
  
      Example translating from JavaScript to natural language:
  
      JavaScript code:
      for (let i = 0; i < 10; i++) {
        console.log(i);
      }
  
      Natural language:
      Print the numbers 0 to 9.
      
      ${inputLanguage} code:
      ${inputCode}

      Natural language:
     `;
  } else {
    return endent`
      You are an expert programmer in all programming languages. Translate the "${inputLanguage}" code to "${outputLanguage}" code. Do not include \`\`\`.
  
      Example translating from JavaScript to Python:
  
      JavaScript code:
      for (let i = 0; i < 10; i++) {
        console.log(i);
      }
  
      Python code:
      for i in range(10):
        print(i)
      
      ${inputLanguage} code:
      ${inputCode}

      ${outputLanguage} code (no \`\`\`):
     `;
  }
};

const streamFromString = (text: string) => {
  const encoder = new TextEncoder();

  return new ReadableStream({
    start(controller) {
      if (text) {
        controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });
};

const runWithBytez = async (
  prompt: string,
  model: string,
  bytezKey: string,
) => {
  if (!bytezKey) {
    throw new Error('A Bytez API key is required to run translation.');
  }

  const bytez = new Bytez(bytezKey);
  const mappedModel = BYTEZ_MODEL_MAP[model] ?? DEFAULT_BYTEZ_MODEL;
  const bytezModel = bytez.model(mappedModel);

  const result = await bytezModel.run(prompt, {
    max_new_tokens: 1200,
    temperature: 0.2,
  });

  if (result?.error) {
    throw new Error(result.error);
  }

  const output = result?.output;
  const text =
    typeof output === 'string'
      ? output
      : Array.isArray(output)
      ? output.join('')
      : output === null || output === undefined
      ? ''
      : JSON.stringify(output);

  return streamFromString(text);
};

const runWithOpenAI = async (
  prompt: string,
  model: string,
  apiKey: string,
) => {
  if (!apiKey) {
    throw new Error('An OpenAI API key is required to run translation.');
  }

  const system = { role: 'system', content: prompt };

  const res = await fetch(`https://api.openai.com/v1/chat/completions`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    method: 'POST',
    body: JSON.stringify({
      model,
      messages: [system],
      temperature: 0,
      stream: true,
    }),
  });

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  if (res.status !== 200) {
    const statusText = res.statusText;
    const result = await res.body?.getReader().read();
    throw new Error(
      `OpenAI API returned an error: ${
        decoder.decode(result?.value) || statusText
      }`,
    );
  }

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === 'event') {
          const data = event.data;

          if (data === '[DONE]') {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
};

export const OpenAIStream = async (
  inputLanguage: string,
  outputLanguage: string,
  inputCode: string,
  model: string,
  key: string,
) => {
  const prompt = createPrompt(inputLanguage, outputLanguage, inputCode);
  const trimmedKey = key?.trim();

  const hasBytezKey =
    (!trimmedKey || !isOpenAIKey(trimmedKey)) &&
    (trimmedKey || process.env.BYTEZ_API_KEY);

  if (hasBytezKey) {
    return runWithBytez(
      prompt,
      model,
      trimmedKey || process.env.BYTEZ_API_KEY || '',
    );
  }

  const openAIKey = trimmedKey || process.env.OPENAI_API_KEY || '';

  return runWithOpenAI(prompt, model, openAIKey);
};
