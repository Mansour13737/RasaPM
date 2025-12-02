import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {dotprompt} from 'genkit/dotprompt';
import * as path from 'path';

export const ai = genkit({
  plugins: [
    googleAI(),
    dotprompt({
      promptPath: path.resolve('./src/ai/dotprompts'),
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
