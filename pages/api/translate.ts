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
    const { inputLanguage, outputLanguage, inputCode, model, apiKey } =
      req.body as TranslateBody;

    const stream = await OpenAIStream(
      inputLanguage,
      outputLanguage,
      inputCode,
      model,
      apiKey,
    );

    res.status(200);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const maybeNodeStream = stream as unknown as Readable;

    if (typeof maybeNodeStream.pipe === 'function') {
      maybeNodeStream.pipe(res);
      return;
    }

    const nodeStream = Readable.fromWeb(stream as ReadableStream<Uint8Array>);
    nodeStream.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error' });
  }
};

export default handler;
