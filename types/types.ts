export type OpenAIModel = 'gpt-3.5-turbo' | 'gpt-4';
export type Provider = 'openai' | 'bytez';

export interface TranslateBody {
  inputLanguage: string;
  outputLanguage: string;
  inputCode: string;
  model: OpenAIModel;
  apiKey: string;
  provider?: Provider;
}

export interface TranslateResponse {
  code: string;
}
