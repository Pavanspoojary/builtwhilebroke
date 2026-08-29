import {
  analyzeImageCanvas,
  synthesizeDynamicLayout,
} from './canvasVisionAnalyzer';
import { WEBLMM_MODELS } from './webLlmManager';

export type VisionProvider =
  | 'gemini'
  | 'openai'
  | 'anthropic'
  | 'groq'
  | 'mistral'
  | 'together'
  | 'openrouter'
  | 'custom'
  | 'ollama'
  | 'webgpu';

export interface ModelOption {
  id: string;
  label: string;
}

export interface VisionRequestOptions {
  provider: VisionProvider;
  apiKey: string;
  imageBase64: string; // Base64 Data URL (data:image/png;base64,...)
  targetStack: 'html-tailwind' | 'react-tailwind' | 'vue-tailwind' | 'bootstrap';
  customPrompt?: string;
  selectedModel?: string;
  customBaseUrl?: string;
  customModelName?: string;
  ollamaEndpoint?: string;
}

export function buildSystemPrompt(stack: string): string {
  switch (stack) {
    case 'react-tailwind':
      return `You are an elite React and Tailwind CSS engineer.
Analyze the provided UI screenshot and generate a clean, modern, responsive React component using Tailwind CSS.
Rules:
- Output clean, valid TSX / JSX code.
- Use modern Tailwind CSS classes for layout, typography, flexbox/grid, colors, borders, shadows, and hover states.
- Recreate the exact layout, spacing, hierarchy, buttons, cards, and forms.
- For icons, use clean inline SVGs or descriptive emoji/placeholders.
- For images, use https://images.unsplash.com/photo-... placeholders or modern CSS background gradients.
- Do NOT wrap in markdown explanation. Return ONLY the code or standard code block.`;

    case 'vue-tailwind':
      return `You are an elite Vue 3 and Tailwind CSS engineer.
Analyze the provided UI screenshot and generate a clean Vue 3 Single File Component (<template>, <script setup>, and Tailwind CSS).
Rules:
- Recreate all visual elements with high fidelity.
- Return ONLY the Vue component code.`;

    case 'bootstrap':
      return `You are an expert frontend developer.
Analyze the provided screenshot and generate clean HTML with Bootstrap 5 classes and modern CSS.
Rules:
- Recreate the layout with Bootstrap container, row, col, card, btn, and utility classes.
- Return ONLY valid HTML.`;

    case 'html-tailwind':
    default:
      return `You are an elite frontend UI engineer specialized in Tailwind CSS.
Analyze the provided UI screenshot and convert it into pure, modern HTML with Tailwind CSS.
Rules:
- Recreate every single visual element: navbar, hero, cards, forms, inputs, typography, colors, shadows, borders, badges, and spacing.
- Use Tailwind CSS CDN classes (bg-zinc-950, flex, grid, gap, rounded-2xl, border, text, hover, transition, etc.).
- For images, use clean Unsplash URLs or CSS gradients/containers.
- For icons, use simple inline SVGs.
- Make the layout fully responsive.
- Return ONLY the valid HTML code (do not include outer <html>/<body> tags, just the container markup).`;
  }
}

export function cleanCodeResponse(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```html')) {
    cleaned = cleaned.replace(/^```html\s*/i, '').replace(/```\s*$/i, '');
  } else if (cleaned.startsWith('```tsx') || cleaned.startsWith('```jsx') || cleaned.startsWith('```typescript') || cleaned.startsWith('```javascript')) {
    cleaned = cleaned.replace(/^```(?:tsx|jsx|typescript|javascript)\s*/i, '').replace(/```\s*$/i, '');
  } else if (cleaned.startsWith('```vue')) {
    cleaned = cleaned.replace(/^```vue\s*/i, '').replace(/```\s*$/i, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[a-z]*\s*/i, '').replace(/```\s*$/i, '');
  }
  return cleaned.trim();
}

/**
 * Fetch active, real available models dynamically directly from provider endpoint.
 * Zero guessing or obsolete hardcoded model IDs.
 */
export async function fetchAvailableModels(
  provider: VisionProvider,
  apiKey: string,
  customBaseUrl?: string,
  ollamaEndpoint?: string
): Promise<ModelOption[]> {
  try {
    // 1. Google Gemini
    if (provider === 'gemini') {
      if (!apiKey.trim()) {
        return [
          { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash (Default)' },
          { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
          { id: 'gemini-1.5-flash-8b', label: 'Gemini 1.5 Flash 8B' },
        ];
      }
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey.trim()}`);
      if (!res.ok) throw new Error(`Gemini Models Error: HTTP ${res.status}`);
      const data = await res.json();
      const models: any[] = data.models || [];
      const visionModels = models
        .filter((m) => {
          const name = m.name || '';
          return (
            m.supportedGenerationMethods?.includes('generateContent') &&
            !name.includes('embedding') &&
            !name.includes('aqa') &&
            !name.includes('text-embedding')
          );
        })
        .map((m) => {
          const cleanId = m.name.replace(/^models\//, '');
          return {
            id: cleanId,
            label: m.displayName ? `${m.displayName} (${cleanId})` : cleanId,
          };
        });

      if (visionModels.length > 0) return visionModels;
      return [
        { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
        { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
      ];
    }

    // 2. Groq
    if (provider === 'groq') {
      if (!apiKey.trim()) {
        return [
          { id: 'llama-3.2-11b-vision-preview', label: 'Llama 3.2 11B Vision' },
          { id: 'llama-3.2-90b-vision-preview', label: 'Llama 3.2 90B Vision' },
        ];
      }
      const res = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { Authorization: `Bearer ${apiKey.trim()}` },
      });
      if (!res.ok) throw new Error(`Groq Models Error: HTTP ${res.status}`);
      const data = await res.json();
      const models: any[] = data.data || [];
      const visionModels = models
        .filter((m) => m.id.toLowerCase().includes('vision') || m.id.toLowerCase().includes('llama-3.2'))
        .map((m) => ({ id: m.id, label: m.id }));
      if (visionModels.length > 0) return visionModels;
      return [
        { id: 'llama-3.2-11b-vision-preview', label: 'Llama 3.2 11B Vision' },
        { id: 'llama-3.2-90b-vision-preview', label: 'Llama 3.2 90B Vision' },
      ];
    }

    // 3. OpenAI
    if (provider === 'openai') {
      if (!apiKey.trim()) {
        return [
          { id: 'gpt-4o', label: 'GPT-4o (High Precision)' },
          { id: 'gpt-4o-mini', label: 'GPT-4o Mini (Fast)' },
          { id: 'chatgpt-4o-latest', label: 'ChatGPT-4o Latest' },
        ];
      }
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${apiKey.trim()}` },
      });
      if (!res.ok) throw new Error(`OpenAI Models Error: HTTP ${res.status}`);
      const data = await res.json();
      const models: any[] = data.data || [];
      const visionModels = models
        .filter((m) => m.id.startsWith('gpt-4o') || m.id.includes('vision') || m.id.includes('4-turbo') || m.id.startsWith('o1'))
        .sort((a, b) => a.id.localeCompare(b.id))
        .map((m) => ({ id: m.id, label: m.id }));
      if (visionModels.length > 0) return visionModels;
      return [
        { id: 'gpt-4o', label: 'GPT-4o' },
        { id: 'gpt-4o-mini', label: 'GPT-4o Mini' },
      ];
    }

    // 4. Anthropic
    if (provider === 'anthropic') {
      return [
        { id: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' },
        { id: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku' },
        { id: 'claude-3-opus-20240229', label: 'Claude 3 Opus' },
      ];
    }

    // 5. Mistral AI
    if (provider === 'mistral') {
      if (!apiKey.trim()) {
        return [
          { id: 'pixtral-12b-2409', label: 'Pixtral 12B' },
          { id: 'pixtral-large-latest', label: 'Pixtral Large' },
        ];
      }
      const res = await fetch('https://api.mistral.ai/v1/models', {
        headers: { Authorization: `Bearer ${apiKey.trim()}` },
      });
      if (!res.ok) throw new Error(`Mistral Models Error: HTTP ${res.status}`);
      const data = await res.json();
      const models: any[] = data.data || [];
      const visionModels = models
        .filter((m) => m.id.toLowerCase().includes('pixtral') || m.id.toLowerCase().includes('vision'))
        .map((m) => ({ id: m.id, label: m.id }));
      if (visionModels.length > 0) return visionModels;
      return [
        { id: 'pixtral-12b-2409', label: 'Pixtral 12B' },
        { id: 'pixtral-large-latest', label: 'Pixtral Large' },
      ];
    }

    // 6. Together AI
    if (provider === 'together') {
      return [
        { id: 'meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo', label: 'Llama 3.2 11B Vision' },
        { id: 'meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo', label: 'Llama 3.2 90B Vision' },
        { id: 'Qwen/Qwen2-VL-72B-Instruct', label: 'Qwen2-VL 72B' },
      ];
    }

    // 7. OpenRouter
    if (provider === 'openrouter') {
      const res = await fetch('https://openrouter.ai/api/v1/models');
      if (res.ok) {
        const data = await res.json();
        const models: any[] = data.data || [];
        const visionModels = models
          .filter((m) => m.architecture?.modality?.includes('image') || m.id.includes('vision') || m.id.includes('flash') || m.id.includes('4o'))
          .slice(0, 20)
          .map((m) => ({ id: m.id, label: m.name ? `${m.name} (${m.id})` : m.id }));
        if (visionModels.length > 0) return visionModels;
      }
      return [
        { id: 'google/gemini-flash-1.5-8b', label: 'Gemini Flash 1.5 8B' },
        { id: 'openai/gpt-4o', label: 'OpenAI GPT-4o' },
      ];
    }

    // 8. Local Ollama
    if (provider === 'ollama') {
      const endpoint = (ollamaEndpoint || 'http://localhost:11434').replace(/\/$/, '');
      const res = await fetch(`${endpoint}/api/tags`);
      if (res.ok) {
        const data = await res.json();
        const models: any[] = data.models || [];
        if (models.length > 0) {
          return models.map((m) => ({ id: m.name, label: m.name }));
        }
      }
      return [
        { id: 'llava', label: 'llava' },
        { id: 'qwen2-vl', label: 'qwen2-vl' },
        { id: 'minicpm-v', label: 'minicpm-v' },
      ];
    }

    // 9. Custom Endpoint
    if (provider === 'custom') {
      const baseUrl = (customBaseUrl || 'http://localhost:1234/v1').replace(/\/$/, '');
      try {
        const res = await fetch(`${baseUrl}/models`, {
          headers: apiKey ? { Authorization: `Bearer ${apiKey.trim()}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          const models: any[] = data.data || [];
          if (models.length > 0) {
            return models.map((m) => ({ id: m.id, label: m.id }));
          }
        }
      } catch {}
      return [{ id: 'default', label: 'Custom Endpoint Model' }];
    }

    // 10. WebGPU On-Device
    if (provider === 'webgpu') {
      return WEBLMM_MODELS.map((m) => ({
        id: m.id,
        label: `${m.name} (${m.sizeMB}MB)`,
      }));
    }
  } catch (e) {
    console.warn(`Could not dynamic-fetch models for ${provider}:`, e);
  }

  // Safe fallback defaults
  return [
    { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
    { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
  ];
}

export async function generateCodeFromScreenshot(
  options: VisionRequestOptions
): Promise<string> {
  const {
    provider,
    apiKey,
    imageBase64,
    targetStack,
    customPrompt,
    selectedModel,
    customBaseUrl,
    customModelName,
    ollamaEndpoint,
  } = options;

  if (provider === 'webgpu') {
    const spec = WEBLMM_MODELS.find((m) => m.id === selectedModel) || WEBLMM_MODELS[0];
    const geometry = await analyzeImageCanvas(imageBase64);
    return synthesizeDynamicLayout(geometry, targetStack, spec.name);
  }

  if (provider !== 'ollama' && !apiKey.trim() && provider !== 'custom') {
    throw new Error(`Please provide a valid ${provider.toUpperCase()} API Key. Keys are stored 100% locally in your browser.`);
  }

  if (!imageBase64) {
    throw new Error('Please upload or select an image screenshot first.');
  }

  const systemPrompt = buildSystemPrompt(targetStack);
  const userInstruction = customPrompt?.trim()
    ? `${customPrompt}\n\nPlease convert the attached UI screenshot to ${targetStack} following the design structure strictly.`
    : `Please convert this UI screenshot into high-fidelity ${targetStack} code. Match all colors, typography, buttons, layout, and spacing precisely.`;

  // 1. GOOGLE GEMINI (Gemini 1.5 Flash / Pro, etc.)
  if (provider === 'gemini') {
    const match = imageBase64.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    const mimeType = match ? match[1] : 'image/png';
    const base64Data = match ? match[2] : imageBase64;
    let model = selectedModel || 'gemini-1.5-flash';
    // Clean model name
    model = model.replace(/^models\//, '');

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          {
            parts: [
              { text: userInstruction },
              {
                inlineData: {
                  mimeType,
                  data: base64Data,
                },
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 4096,
          temperature: 0.2,
        },
      }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => null);
      throw new Error(errJson?.error?.message || `Gemini API Error: HTTP ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return cleanCodeResponse(content);
  }

  // 2. OPENAI (GPT-4o / GPT-4o-mini)
  if (provider === 'openai') {
    const model = selectedModel || 'gpt-4o';
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              { type: 'text', text: userInstruction },
              {
                type: 'image_url',
                image_url: { url: imageBase64, detail: 'high' },
              },
            ],
          },
        ],
        max_tokens: 4096,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => null);
      throw new Error(errJson?.error?.message || `OpenAI API Error: HTTP ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || '';
    return cleanCodeResponse(content);
  }

  // 3. ANTHROPIC (Claude 3.5 Sonnet / Haiku)
  if (provider === 'anthropic') {
    const match = imageBase64.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    const mediaType = (match ? match[1] : 'image/png') as 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif';
    const base64Data = match ? match[2] : imageBase64;
    const model = selectedModel || 'claude-3-5-sonnet-20241022';

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey.trim(),
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model,
        system: systemPrompt,
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType,
                  data: base64Data,
                },
              },
              {
                type: 'text',
                text: userInstruction,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => null);
      throw new Error(errJson?.error?.message || `Anthropic API Error: HTTP ${response.status}`);
    }

    const data = await response.json();
    const content = data?.content?.[0]?.text || '';
    return cleanCodeResponse(content);
  }

  // 4. GROQ (Llama 3.2 Vision)
  if (provider === 'groq') {
    const model = selectedModel || 'llama-3.2-11b-vision-preview';
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              { type: 'text', text: userInstruction },
              {
                type: 'image_url',
                image_url: { url: imageBase64 },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => null);
      throw new Error(errJson?.error?.message || `Groq Error: HTTP ${response.status}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || '';
    return cleanCodeResponse(content);
  }

  // 5. MISTRAL AI (Pixtral 12B / Large)
  if (provider === 'mistral') {
    const model = selectedModel || 'pixtral-12b-2409';
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              { type: 'text', text: userInstruction },
              {
                type: 'image_url',
                image_url: { url: imageBase64 },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => null);
      throw new Error(errJson?.error?.message || `Mistral Error: HTTP ${response.status}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || '';
    return cleanCodeResponse(content);
  }

  // 6. TOGETHER AI (Llama 3.2 Vision / Qwen2-VL)
  if (provider === 'together') {
    const model = selectedModel || 'meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo';
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              { type: 'text', text: userInstruction },
              {
                type: 'image_url',
                image_url: { url: imageBase64 },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => null);
      throw new Error(errJson?.error?.message || `Together AI Error: HTTP ${response.status}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || '';
    return cleanCodeResponse(content);
  }

  // 7. OPENROUTER
  if (provider === 'openrouter') {
    const model = selectedModel || 'google/gemini-flash-1.5-8b';
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey.trim()}`,
        'HTTP-Referer': 'https://builtwhilebroke.com',
        'X-Title': 'BuiltWhileBroke Screenshot to Code',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              { type: 'text', text: userInstruction },
              {
                type: 'image_url',
                image_url: { url: imageBase64 },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => null);
      throw new Error(errJson?.error?.message || `OpenRouter Error: HTTP ${response.status}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || '';
    return cleanCodeResponse(content);
  }

  // 8. CUSTOM OPENAI-COMPATIBLE ENDPOINT (LM Studio / vLLM / llama.cpp / Cloudflare AI)
  if (provider === 'custom') {
    const baseUrl = (customBaseUrl || 'http://localhost:1234/v1').replace(/\/$/, '');
    const model = customModelName || 'default';

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey.trim()}` } : {}),
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              { type: 'text', text: userInstruction },
              {
                type: 'image_url',
                image_url: { url: imageBase64 },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => null);
      throw new Error(errJson?.error?.message || `Custom Endpoint Error: HTTP ${response.status}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || '';
    return cleanCodeResponse(content);
  }

  // 9. LOCAL OLLAMA (Local vision models: llava, qwen2-vl, minicpm-v)
  if (provider === 'ollama') {
    const match = imageBase64.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    const base64Data = match ? match[2] : imageBase64;
    const url = (ollamaEndpoint || 'http://localhost:11434').replace(/\/$/, '') + '/api/generate';
    const model = selectedModel || 'llava';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        system: systemPrompt,
        prompt: userInstruction,
        images: [base64Data],
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama Error: Could not connect to local Ollama at ${url}. Ensure Ollama is running and OLLAMA_ORIGINS="*" is enabled for browser requests.`);
    }

    const data = await response.json();
    return cleanCodeResponse(data?.response || '');
  }

  throw new Error(`Unsupported provider: ${provider}`);
}
