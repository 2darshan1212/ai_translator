# AI Code Translator

Use AI to translate code from one language to another.

![AI Code Translator](./public/screenshot.png)

## Running Locally

**Prerequisites**

- Node.js 18 LTS or 20 LTS (required for Next.js 13 + Bytez runtime)

**1. Clone Repo**

```bash
git clone https://github.com/mckaywrigley/ai-code-translator.git
```

**2. Install Dependencies**

```bash
npm install
```

**3. Run App**

```bash
npm run dev
```

## Configuration

- Provide your API key in the UI when prompted and choose its provider (OpenAI or Bytez) from the dropdown.
  - Bytez keys can also be provided via `BYTEZ_API_KEY` in `.env.local`.
  - OpenAI keys (`sk-...`) can be provided via `OPENAI_API_KEY` in `.env.local`.
- Leave the input blank to rely on the server-side environment variables.
- Optional: override the Bytez models with `BYTEZ_MODEL_GPT35` and `BYTEZ_MODEL_GPT4` if your Bytez account only has access to certain models.                
- Restart the dev server after changing environment variables.

## Contact

If you have any questions, feel free to reach out to me on [Twitter](https://twitter.com/mckaywrigley).
