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

- Provide your API key in the UI when prompted. The app supports both:
  - Bytez API keys (default path). Set `BYTEZ_API_KEY` in `.env.local` to avoid retyping.
  - OpenAI API keys (`sk-...`). Set `OPENAI_API_KEY` if you prefer the native OpenAI path.
- When using Bytez, the app maps the existing model picker to Bytez-hosted instruct models for translation.
- Restart the dev server after changing environment variables.

## Contact

If you have any questions, feel free to reach out to me on [Twitter](https://twitter.com/mckaywrigley).
