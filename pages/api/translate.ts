import type { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';

import { TranslateBody } from '@/types/types';
import { OpenAIStream } from '@/utils';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const {
      inputLanguage,
      outputLanguage,
      inputCode,
      model,
      apiKey,
      provider,
    } = req.body as TranslateBody;

    const stream = await OpenAIStream(
      inputLanguage,
      outputLanguage,
      inputCode,
      model,
      apiKey,
      provider,
    );

    res.status(200);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const maybeNodeStream = stream as unknown as Readable;

    if (typeof maybeNodeStream.pipe === 'function') {
      maybeNodeStream.pipe(res);
      return;
    }
    const reader = stream.getReader();

    const nodeStream = new Readable({
      async read() {
        const { value, done } = await reader.read();
        if (done) {
          this.push(null);
        } else {
          this.push(Buffer.from(value));
        }
      }
    });
    
    nodeStream.pipe(res);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error' });
  }
};

export default handler;
