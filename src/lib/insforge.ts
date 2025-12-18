import { createClient } from '@insforge/sdk';

// Read configuration from environment variables (defined in .env / .env.local)
// This keeps real API keys out of the git repository.
const env = import.meta.env;

// Insforge configuration
export const INSFORGE_API_KEY = (env.VITE_INSFORGE_API_KEY as string) || '';
export const INSFORGE_BASE_URL = (env.VITE_INSFORGE_BASE_URL as string) || '';
export const INSFORGE_ANON_KEY = (env.VITE_INSFORGE_ANON_KEY as string) || '';

export const insforge = createClient({
  baseUrl: INSFORGE_BASE_URL,
  anonKey: INSFORGE_ANON_KEY,
});
// Export a flag to check if AI is available
// Set to false if OpenAI API keys aren't configured on backend
// When false, uses text-based extraction fallback (no API calls, no errors)
export const AI_AVAILABLE = true; // Set to true when OpenAI API keys are configured on backend

// Enable OCR for PDF extraction (separate from AI analysis)
// OCR is needed for scanned/image-based PDFs
export const OCR_ENABLED = true; // Enable OCR for PDF extraction using Insforge AI vision

// Groq API Keys for OCR (FIRST priority - tried before OpenRouter and Insforge)
// Multiple keys for fallback - tries in order, stops at first success.
// Order in VITE_GROQ_API_KEYS should be: your key(s) first, then Insforge/fallback keys.
const groqFromEnv = (env.VITE_GROQ_API_KEYS as string | undefined) || '';
export const GROQ_API_KEYS = groqFromEnv
  .split(',')
  .map((k) => k.trim())
  .filter((k) => k.length > 0);

// Legacy single key for backward compatibility (first key = highest priority)
export const GROQ_API_KEY = GROQ_API_KEYS[0];

// Mistral AI API Key for OCR (SECOND priority - tried after Groq, before OpenRouter)
export const MISTRAL_API_KEY = (env.VITE_MISTRAL_API_KEY as string) || '';

// Alternative OCR configuration (if backend API keys aren't available)
// Set to true to use direct API calls (requires OPENROUTER_API_KEY env var)
export const USE_DIRECT_OCR_API = true; // ✅ Enabled - Use Groq FIRST, then user's OpenRouter keys, then Insforge

// Multiple OpenRouter API keys for fallback (tries in order, stops at first success)
// Provide them in VITE_OPENROUTER_API_KEYS as a comma-separated list.
// Order: your keys first, then Insforge / fallback keys.
const openrouterFromEnv = (env.VITE_OPENROUTER_API_KEYS as string | undefined) || '';
export const OPENROUTER_API_KEYS = openrouterFromEnv
  .split(',')
  .map((k) => k.trim())
  .filter((k) => k.length > 0);

// Legacy single key for backward compatibility
export const OPENROUTER_API_KEY = OPENROUTER_API_KEYS[0];

// OpenRouter models to try (vision-capable models only, working models prioritized)
// Priority: User's free models FIRST with their dedicated keys, then fallback models
// NOTE: Free models may not support vision/image input - will try anyway and skip if not supported
export const OPENROUTER_MODELS = [
  // ✅ USER'S FREE MODELS (HIGHEST PRIORITY - tried FIRST with dedicated keys)
  // MiniMax M2 (free) - Uses user's dedicated key (index 0)
  { id: 'minimax/minimax-m2', name: 'MiniMax M2 (free)', keyIndex: 0, dedicatedKey: true },
  { id: 'minimax/abab5.5-chat', name: 'MiniMax ABAB5.5 Chat', keyIndex: 0, dedicatedKey: true },
  { id: 'minimax/abab5.5s-chat', name: 'MiniMax ABAB5.5s Chat', keyIndex: 0, dedicatedKey: true },
  
  // DeepSeek R1T2 Chimera (free) - Uses user's dedicated key (index 1)
  { id: 'deepseek/deepseek-r1t2-chimera', name: 'DeepSeek R1T2 Chimera (free)', keyIndex: 1, dedicatedKey: true },
  { id: 'deepseek/deepseek-r1t-chimera', name: 'DeepSeek R1T Chimera (free)', keyIndex: 1, dedicatedKey: true },
  
  // GLM 4.5 Air (free) - Uses user's dedicated key (index 2)
  { id: 'zai/glm-4.5-air', name: 'GLM 4.5 Air (free)', keyIndex: 2, dedicatedKey: true },
  { id: 'zai/glm-4-air', name: 'GLM 4 Air (free)', keyIndex: 2, dedicatedKey: true },
  
  // DeepSeek R1T Chimera (free) - Uses user's dedicated key (index 3)
  { id: 'deepseek/deepseek-r1t-chimera', name: 'DeepSeek R1T Chimera (free)', keyIndex: 3, dedicatedKey: true },
  
  // ✅ Working vision models (fallback to general keys if user's keys exhausted)
  { id: 'google/gemini-2.5-flash-image-preview', name: 'Gemini 2.5 Flash Image Preview', keyIndex: 4 }, // ✅ WORKING!
  { id: 'google/gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash Exp', keyIndex: 4 },
  { id: 'google/gemini-flash-1.5', name: 'Gemini Flash 1.5', keyIndex: 4 },
  
  // Premium vision models (fallback)
  { id: 'openai/gpt-4o', name: 'GPT-4o', keyIndex: 4 },
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', keyIndex: 4 },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', keyIndex: 4 },
  { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus', keyIndex: 4 },
  
  // Try with Deepseek key (if they have vision support)
  { id: 'deepseek/deepseek-v2-chat', name: 'Deepseek V2 Chat', keyIndex: 5 },
  
  // Try with NVIDIA key (if vision support available)
  { id: 'nvidia/nv-llama-v2-72b-instruct', name: 'NVIDIA Llama V2', keyIndex: 6 },
  
  // Try with Qwen key (if vision support available)
  { id: 'qwen/qwen-vl-max', name: 'Qwen VL Max', keyIndex: 7 },
  { id: 'qwen/qwen-vl-plus', name: 'Qwen VL Plus', keyIndex: 7 }
];

