import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {defineDotprompt} from 'genkit/dotprompt';
import * as path from 'path';

export const ai = genkit({
  plugins: [
    googleAI(),
    defineDotprompt({
      promptPath: path.resolve('./src/ai/dotprompts'),
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
