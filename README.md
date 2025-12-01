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

The app supports three AI providers:

### Groq (Recommended - Free)
1. Go to <https://console.groq.com/keys> and create a free API key
2. Add to `.env.local`:
   ```
   GROQ_API_KEY=gsk_your_groq_key_here
   ```
3. Select "Groq (Free)" in the provider dropdown

### OpenAI
- Provide your API key via `OPENAI_API_KEY` in `.env.local` or paste it in the UI
- Select "OpenAI" in the provider dropdown

### Bytez
- Provide your API key via `BYTEZ_API_KEY` in `.env.local`
- Optional: override models with `BYTEZ_MODEL_GPT35` and `BYTEZ_MODEL_GPT4`

Leave the API key input blank to use server-side environment variables.
Restart the dev server after changing environment variables.

## Contact

If you have any questions, feel free to reach out to me on [Twitter](https://twitter.com/mckaywrigley).
