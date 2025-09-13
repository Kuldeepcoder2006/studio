import { config } from 'dotenv';
config();

import '@/ai/flows/incorporate-extra-information.ts';
import '@/ai/flows/recommend-relevant-jobs.ts';
import '@/ai/flows/analyze-uploaded-resume.ts';