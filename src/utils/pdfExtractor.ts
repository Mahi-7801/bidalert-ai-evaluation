/**
 * PDF Text Extraction Utility
 * Uses pdfjs-dist to extract text from PDF files in the browser
 * Falls back to Insforge AI vision for problematic PDFs
 */

import JSZip from 'jszip';
import { insforge, OCR_ENABLED, USE_DIRECT_OCR_API, OPENROUTER_API_KEYS, OPENROUTER_MODELS, GROQ_API_KEYS, GROQ_API_KEY, MISTRAL_API_KEY } from '@/lib/insforge';

// Dynamic import to avoid SSR issues
let pdfjsLib: any;

const loadPdfJs = async () => {
  if (!pdfjsLib) {
    pdfjsLib = await import('pdfjs-dist');
    // Set worker path for pdfjs - use local worker file
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  }
  return pdfjsLib;
};

/**
 * Convert PDF page to image (canvas) and extract text using AI vision
 * Returns null if AI vision is unavailable (graceful fallback)
 */
async function extractTextFromPDFPageWithAI(
  pdfjs: any, 
  pdf: any, 
  pageNum: number,
  imageDataUrl?: string
): Promise<string | null> {
  try {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better quality
    
    // Create canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      console.warn(`Could not get canvas context for page ${pageNum}`);
      return null;
    }
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    // Render PDF page to canvas
    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;
    
    // Convert canvas to base64 image (use provided or generate)
    const pageImageDataUrl = imageDataUrl || canvas.toDataURL('image/png');
    
    if (!pageImageDataUrl || pageImageDataUrl.length < 100) {
      console.warn(`Failed to generate image from PDF page ${pageNum}`);
      return null;
    }
    
    console.log(`🔍 Attempting OCR extraction for page ${pageNum}...`);
    
    // STRATEGY: Try Groq FIRST, then Mistral, then OpenRouter, then fallback to Insforge MCP
    let completion: any = null;
    let lastError: any = null;
    let modelSuccess = false;
    
    const ocrPrompt = {
      system: 'You are an expert OCR assistant. Extract ALL visible text from this PDF page image accurately, preserving structure, tables, formatting, and layout. Return ONLY the extracted text content with proper line breaks and spacing. Do not add explanations, markdown formatting, or any other text - just the raw extracted text.',
      user: 'Extract all text from this PDF page image. Preserve tables, structure, formatting, line breaks, and spacing. Include all numbers, dates, names, addresses, and details exactly as they appear. Return only the extracted text content.'
    };
    
    // STEP 1: Try Groq API FIRST (if API keys are configured)
    if (GROQ_API_KEYS && GROQ_API_KEYS.length > 0) {
      console.log(`🔄 Step 1: Trying Groq API FIRST (${GROQ_API_KEYS.length} key(s) available)...`);
      const groqResult = await extractTextWithGroq(pageImageDataUrl, pageNum);
      if (groqResult) {
        console.log(`✅ Groq OCR successful for page ${pageNum}`);
        return groqResult;
      }
      console.log(`⚠️ All Groq API keys exhausted, proceeding to Mistral fallback...`);
    } else {
      console.log(`⚠️ Groq API keys not configured, trying Mistral...`);
    }
    
    // STEP 2: Try Mistral AI (if API key is configured)
    if (MISTRAL_API_KEY) {
      console.log(`🔄 Step 2: Trying Mistral AI...`);
      const mistralResult = await extractTextWithMistral(pageImageDataUrl, pageNum);
      if (mistralResult) {
        console.log(`✅ Mistral OCR successful for page ${pageNum}`);
        return mistralResult;
      }
      console.log(`⚠️ Mistral API failed, proceeding to OpenRouter fallback...`);
    } else {
      console.log(`⚠️ Mistral API key not configured, trying OpenRouter...`);
    }
    
    // STEP 3: Try OpenRouter with user's free model keys (if enabled)
    // Only try OpenRouter if USE_DIRECT_OCR_API is enabled and we have keys
    if (USE_DIRECT_OCR_API && OPENROUTER_API_KEYS && OPENROUTER_API_KEYS.length > 0) {
      console.log(`🔄 Step 3: Trying OpenRouter API with user's free model keys...`);
      const openRouterResult = await extractTextWithOpenRouter(pageImageDataUrl, pageNum);
      if (openRouterResult) {
        console.log(`✅ OpenRouter OCR successful for page ${pageNum}`);
        return openRouterResult;
      }
      console.log(`⚠️ All OpenRouter credentials exhausted, proceeding to Insforge MCP fallback...`);
    } else {
      console.log(`⚠️ OpenRouter disabled or no keys configured, using Insforge MCP directly...`);
    }
    
    // STEP 4: Fallback to Insforge MCP with Gemini 2.5 Pro
    console.log(`🔄 Step 4: Trying Insforge MCP with Gemini 2.5 Pro...`);
    const modelsToTry = [
      { id: 'google/gemini-2.5-pro', name: 'Gemini 2.5 Pro' } // ✅ FALLBACK MODEL - After OpenRouter
    ];
    
    let apiKeyErrorDetected = false; // Track if we see API key errors - skip all remaining models
    
    for (const model of modelsToTry) {
      // If we detected API key error, skip all remaining models immediately
      if (apiKeyErrorDetected) {
        console.log(`⚠️ Skipping remaining Insforge models (API key error detected on previous model)`);
        break;
      }
      
      try {
        console.log(`🔍 Trying Insforge MCP: ${model.name} (${model.id})...`);
        completion = await insforge.ai.chat.completions.create({
          model: model.id,
          messages: [
            {
              role: 'system',
              content: ocrPrompt.system
            },
            {
              role: 'user',
              content: ocrPrompt.user,
              images: [{ url: pageImageDataUrl }]
            }
          ],
          temperature: 0.1,
          maxTokens: 4000
        });
        console.log(`✅ Insforge MCP (${model.name}) OCR successful for page ${pageNum}`);
        modelSuccess = true;
        break; // Success, exit loop
      } catch (modelError: any) {
        const errorMsg = modelError?.message || '';
        const statusCode = (modelError as any)?.status || (modelError as any)?.statusCode;
        
        // Suppress 500 errors (server errors) - these are common and expected
        if (statusCode === 500 || errorMsg.includes('500')) {
          console.warn(`⚠️ Insforge MCP server error (500), trying fallback...`);
          lastError = modelError;
          continue; // Try next model or fallback
        }
        
        // Check for API key errors - if we see this, ALL models will fail, so skip immediately
        if (errorMsg.includes('API key') || 
            errorMsg.includes('Forbidden') ||
            errorMsg.includes('renew cloud API key') ||
            errorMsg.includes('Failed to renew')) {
          console.warn(`⚠️ Insforge MCP API key error detected, skipping remaining models...`);
          apiKeyErrorDetected = true;
          lastError = modelError;
          break; // Stop trying - all models will fail with same error
        }
        
        // Check if model is not enabled - skip faster
        if (errorMsg.includes('not enabled') || 
            errorMsg.includes('No allowed providers') ||
            statusCode === 500 && errorMsg.includes('claude-opus')) {
          console.warn(`⚠️ Insforge MCP (${model.name}) not enabled, skipping...`);
          lastError = modelError;
          continue; // Try next model
        }
        
        console.warn(`⚠️ Insforge MCP (${model.name}) failed:`, errorMsg.slice(0, 100));
        lastError = modelError;
        continue; // Try next model
      }
    }
    
    // If Insforge MCP also failed, return null (graceful fallback)
    if (!modelSuccess) {
      console.warn(`⚠️ All OCR methods exhausted for page ${pageNum} (OpenRouter credentials exhausted + Insforge MCP unavailable)`);
      // Don't throw - return null to allow graceful fallback to standard PDF extraction
      return null;
    }
    
    let extractedText = completion.choices[0]?.message?.content || '';
    
    // Clean up the extracted text - remove markdown code blocks if present
    extractedText = extractedText
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/`/g, '') // Remove backticks
      .trim();
    
    // Validate extracted text
    if (!extractedText || extractedText.length === 0) {
      console.warn(`AI vision returned empty text for page ${pageNum}`);
      return null;
    }
    
    // Check if it's an error message
    if (extractedText.toLowerCase().includes('cannot') || 
        extractedText.toLowerCase().includes('unable') ||
        extractedText.toLowerCase().includes('error') ||
        extractedText.toLowerCase().includes('sorry')) {
      console.warn(`AI vision returned error message for page ${pageNum}`);
      return null;
    }
    
    console.log(`✅ Insforge MCP extracted ${extractedText.length} characters from page ${pageNum}`);
    console.log(`Preview: ${extractedText.slice(0, 200)}...`);
    
    return extractedText;
  } catch (error: any) {
    // Log detailed error information for debugging
    const errorMessage = error?.message || error?.toString() || 'Unknown error';
    console.error(`❌ OCR error for page ${pageNum}:`, errorMessage);
    console.error(`Error details:`, {
      message: error?.message,
      status: (error as any)?.status,
      statusCode: (error as any)?.statusCode,
      response: (error as any)?.response
    });
    
    // Check if it's an API key error
    if (errorMessage.includes('API key') || 
        errorMessage.includes('Forbidden') ||
        errorMessage.includes('renew cloud API key') ||
        errorMessage.includes('Failed to renew')) {
      console.error(`⚠️ OCR unavailable for page ${pageNum}: Google API keys not configured on Insforge backend.`);
      console.error(`⚠️ Solution: Configure Google API keys in Insforge backend dashboard to enable Gemini 2.5 Pro.`);
      
      // OpenRouter disabled - only using Insforge MCP with Gemini 2.5 Pro
      
      return null;
    }
    
    // Other errors - log but don't throw
    console.warn(`⚠️ OCR extraction failed for page ${pageNum}:`, errorMessage);
    return null; // Return null instead of throwing - graceful fallback
  }
}

/**
 * Extract text using Mistral AI API (SECOND priority - tried after Groq, before OpenRouter)
 * Uses Mistral's OpenAI-compatible API endpoint
 */
async function extractTextWithMistral(imageDataUrl: string, pageNum: number): Promise<string | null> {
  if (!MISTRAL_API_KEY) {
    console.warn('Mistral API key not configured');
    return null;
  }
  
  const ocrPrompt = {
    system: 'You are an expert OCR assistant. Extract ALL visible text from this PDF page image accurately, preserving structure, tables, formatting, and layout. Return ONLY the extracted text content with proper line breaks and spacing. Do not add explanations, markdown formatting, or any other text - just the raw extracted text.',
    user: 'Extract all text from this PDF page image. Preserve tables, structure, formatting, line breaks, and spacing. Include all numbers, dates, names, addresses, and details exactly as they appear. Return only the extracted text content.'
  };
  
  // Mistral vision models to try (in order of preference)
  // Pixtral models are Mistral's vision-capable models
  const mistralModels = [
    'pixtral-large-latest',   // Large vision model (most capable)
    'pixtral-small-latest',  // Small vision model (faster)
    'pixtral-12b-2409'       // Specific version (fallback)
  ];
  
  for (const model of mistralModels) {
    try {
      console.log(`🔍 Trying Mistral: ${model} (page ${pageNum})...`);
      
      let response: Response;
      try {
        response = await fetch('https://api.mistral.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${MISTRAL_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: 'system',
                content: ocrPrompt.system
              },
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: ocrPrompt.user
                  },
                  {
                    type: 'image_url',
                    image_url: {
                      url: imageDataUrl
                    }
                  }
                ]
              }
            ],
            temperature: 0.1,
            max_tokens: 4000
          })
        });
      } catch (fetchError: any) {
        // Network error or fetch failed - try next model
        console.warn(`⚠️ Mistral API (${model}) fetch error:`, fetchError?.message || 'Network error');
        continue;
      }
      
      if (!response.ok) {
        let errorData = '';
        let errorJson: any = null;
        try {
          errorData = await response.text();
          try {
            errorJson = JSON.parse(errorData);
          } catch {
            // Not JSON, use as text
          }
        } catch {
          errorData = `Status ${response.status}`;
        }
        
        // Check if it's a model not found or vision not supported error
        const errorMessage = errorJson?.error?.message || errorData || '';
        const isModelNotFound = errorMessage.includes('model') && 
                                (errorMessage.includes('not found') || 
                                 errorMessage.includes('does not exist') ||
                                 errorMessage.includes('invalid') ||
                                 errorMessage.includes('not available'));
        const isVisionNotSupported = errorMessage.includes('vision') || 
                                      errorMessage.includes('image') ||
                                      errorMessage.includes('multimodal');
        
        // Suppress detailed error logging for common errors to reduce console spam
        if (response.status === 400 || response.status === 404) {
          // If it's a 400 error on the first model, Mistral likely doesn't support vision
          // Skip all Mistral models to avoid multiple 400 errors
          if (model === mistralModels[0]) {
            console.log(`⚠️ Mistral API returned 400 error - vision models may not be supported, skipping Mistral API...`);
            return null; // Skip all Mistral models
          }
          // Silently skip - these are expected for unsupported models
          continue;
        }
        
        if (response.status === 401 || response.status === 403) {
          // Authentication error - skip all Mistral models
          console.warn(`⚠️ Mistral API authentication error, skipping remaining Mistral models...`);
          break;
        }
        
        // Only log unexpected errors
        if (response.status >= 500) {
          console.warn(`⚠️ Mistral API (${model}) server error: ${response.status}`);
        }
        
        continue; // Try next model
      }
      
      const data = await response.json();
      
      // Check for API errors in response
      if (data.error) {
        console.warn(`⚠️ Mistral API (${model}) returned error:`, data.error.message || data.error);
        continue; // Try next model
      }
      
      const extractedText = data.choices?.[0]?.message?.content || '';
      
      if (extractedText && extractedText.trim().length > 10) {
        console.log(`✅ Mistral OCR successful with ${model} for page ${pageNum}`);
        return extractedText.trim();
      } else {
        console.warn(`⚠️ Mistral API (${model}) returned empty or invalid response`);
        continue; // Try next model
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error';
      console.warn(`⚠️ Mistral API (${model}) error:`, errorMessage);
      continue; // Try next model
    }
  }
  
  console.warn(`⚠️ All Mistral models failed for page ${pageNum}`);
  return null;
}

/**
 * Extract text using Groq API (FIRST priority - tried before OpenRouter and Insforge)
 * Uses Groq's OpenAI-compatible API endpoint
 */
async function extractTextWithGroq(imageDataUrl: string, pageNum: number): Promise<string | null> {
  if (!GROQ_API_KEYS || GROQ_API_KEYS.length === 0) {
    console.warn('Groq API keys not configured');
    return null;
  }
  
  const ocrPrompt = {
    system: 'You are an expert OCR assistant. Extract ALL visible text from this PDF page image accurately, preserving structure, tables, formatting, and layout. Return ONLY the extracted text content with proper line breaks and spacing. Do not add explanations, markdown formatting, or any other text - just the raw extracted text.',
    user: 'Extract all text from this PDF page image. Preserve tables, structure, formatting, line breaks, and spacing. Include all numbers, dates, names, addresses, and details exactly as they appear. Return only the extracted text content.'
  };
  
  // Groq vision models to try (in order of preference)
  const groqModels = [
    'llama-3.2-90b-vision-preview',  // Latest vision model
    'llama-3.1-70b-versatile',        // Alternative vision model
    'llama-3.1-8b-instant'            // Fallback model
  ];
  
  // Try each API key in sequence
  for (let keyIndex = 0; keyIndex < GROQ_API_KEYS.length; keyIndex++) {
    const apiKey = GROQ_API_KEYS[keyIndex];
    const isLastKey = keyIndex === GROQ_API_KEYS.length - 1;
    
    // Try each model with current API key
    for (const model of groqModels) {
      try {
        console.log(`🔍 Trying Groq: ${model} with key ${keyIndex + 1}/${GROQ_API_KEYS.length} (page ${pageNum})...`);
        
        let response: Response;
        try {
          response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: model,
              messages: [
                {
                  role: 'system',
                  content: ocrPrompt.system
                },
                {
                  role: 'user',
                  content: [
                    {
                      type: 'text',
                      text: ocrPrompt.user
                    },
                    {
                      type: 'image_url',
                      image_url: {
                        url: imageDataUrl
                      }
                    }
                  ]
                }
              ],
              temperature: 0.1,
              max_tokens: 4000
            })
          });
        } catch (fetchError: any) {
          // Network error or fetch failed - try next model
          console.warn(`⚠️ Groq API (${model}) fetch error:`, fetchError?.message || 'Network error');
          continue;
        }
      
      if (!response.ok) {
        let errorData = '';
        let errorJson: any = null;
        try {
          errorData = await response.text();
          try {
            errorJson = JSON.parse(errorData);
          } catch {
            // Not JSON, use as text
          }
        } catch {
          errorData = `Status ${response.status}`;
        }
        
        // Check if it's a model not found or vision not supported error
        const errorMessage = errorJson?.error?.message || errorData || '';
        const isModelNotFound = errorMessage.includes('model') && 
                                (errorMessage.includes('not found') || 
                                 errorMessage.includes('does not exist') ||
                                 errorMessage.includes('invalid') ||
                                 errorMessage.includes('not available'));
        const isVisionNotSupported = errorMessage.includes('vision') || 
                                      errorMessage.includes('image') ||
                                      errorMessage.includes('multimodal');
        
        // Suppress detailed error logging for common errors to reduce console spam
        if (response.status === 400 || response.status === 404) {
          // If it's a 400 error on the first model with first key, Groq likely doesn't support vision
          // Skip all Groq models to avoid multiple 400 errors
          if (model === groqModels[0] && keyIndex === 0) {
            console.log(`⚠️ Groq API returned 400 error - vision models may not be supported, skipping Groq API...`);
            return null; // Skip all Groq models
          }
          // Silently skip - these are expected for unsupported models
          continue;
        }
        
        if (response.status === 401 || response.status === 403) {
          // Authentication error - try next API key (if available)
          if (!isLastKey) {
            console.warn(`⚠️ Groq API key ${keyIndex + 1} authentication error, trying next key...`);
            break; // Break out of model loop, continue to next key
          } else {
            console.warn(`⚠️ Groq API authentication error with all keys, skipping remaining Groq models...`);
            return null; // All keys exhausted
          }
        }
        
        // Only log unexpected errors
        if (response.status >= 500) {
          console.warn(`⚠️ Groq API (${model}) server error: ${response.status}`);
        }
        
        continue; // Try next model
      }
      
      const data = await response.json();
      
      // Check for API errors in response
      if (data.error) {
        // If it's an auth error, try next key
        if (data.error.message?.includes('auth') || data.error.message?.includes('key') || data.error.message?.includes('invalid')) {
          if (!isLastKey) {
            console.warn(`⚠️ Groq API key ${keyIndex + 1} error, trying next key...`);
            break; // Break out of model loop, continue to next key
          }
        }
        console.warn(`⚠️ Groq API (${model}) returned error:`, data.error.message || data.error);
        continue; // Try next model
      }
      
      const extractedText = data.choices?.[0]?.message?.content || '';
      
      if (!extractedText || extractedText.trim().length === 0) {
        console.warn(`⚠️ Groq API (${model}) returned empty text, trying next model...`);
        continue;
      }
      
      // Validate extracted text - check if it's an error message
      if (extractedText.toLowerCase().includes('cannot') || 
          extractedText.toLowerCase().includes('unable') ||
          extractedText.toLowerCase().includes('error') ||
          extractedText.toLowerCase().includes('sorry') ||
          extractedText.toLowerCase().includes('not support')) {
        console.warn(`⚠️ Groq API (${model}) returned error message, trying next model...`);
        continue;
      }
      
      console.log(`✅ Groq OCR successful with ${model} (key ${keyIndex + 1}) for page ${pageNum}`);
      return extractedText.trim();
      
    } catch (groqError: any) {
      const errorMsg = groqError?.message || '';
      console.warn(`⚠️ Groq API (${model}) request failed:`, errorMsg.slice(0, 100));
      
      // If it's a network error, try next key if available
      if (errorMsg.includes('Failed to fetch') || errorMsg.includes('Network')) {
        if (!isLastKey) {
          console.warn(`⚠️ Network error with Groq key ${keyIndex + 1}, trying next key...`);
          break; // Break out of model loop, try next key
        } else {
          console.warn(`⚠️ Network error with all Groq keys, skipping...`);
          return null;
        }
      }
      
      continue; // Try next model
    }
    } // End of model loop
    
    // If we get here, all models failed with current key
    // Continue to next key if available
    if (!isLastKey) {
      console.log(`⚠️ All models failed with Groq key ${keyIndex + 1}, trying next key...`);
    }
  } // End of key loop
  
  // If all Groq keys and models failed, return null (will trigger Mistral fallback)
  console.warn(`⚠️ All Groq API keys and models exhausted for page ${pageNum}. Will fallback to Mistral.`);
  return null;
}

/**
 * Extract text using OpenRouter API directly (fallback when backend API keys unavailable)
 * Tries multiple API keys and models in order until one succeeds
 * Reduces MCP calls by using direct API calls first
 */
async function extractTextWithOpenRouter(imageDataUrl: string, pageNum: number): Promise<string | null> {
  if (!OPENROUTER_API_KEYS || OPENROUTER_API_KEYS.length === 0) {
    console.warn('OpenRouter API keys not configured');
    return null;
  }
  
  const ocrPrompt = {
    system: 'You are an expert OCR assistant. Extract ALL visible text from this PDF page image accurately, preserving structure, tables, formatting, and layout. Return ONLY the extracted text content with proper line breaks and spacing. Do not add explanations, markdown formatting, or any other text - just the raw extracted text.',
    user: 'Extract all text from this PDF page image. Preserve tables, structure, formatting, line breaks, and spacing. Include all numbers, dates, names, addresses, and details exactly as they appear. Return only the extracted text content.'
  };
  
  // Track payment required errors to skip faster
  let paymentRequiredCount = 0;
  const MAX_PAYMENT_REQUIRED = 2; // After 2 payment errors, skip to Insforge
  
  // Track bad request/not found errors (invalid models) - skip faster
  let badRequestCount = 0;
  const MAX_BAD_REQUESTS = 3; // After 3 bad requests (400/404), skip to Insforge
  
  // Track dedicated key model failures (MiniMax variants)
  let dedicatedKeyFailures = 0;
  const MAX_DEDICATED_FAILURES = 4; // After 4 MiniMax variants fail, skip to Insforge
  
  // Try each model with its associated API key
  for (const modelConfig of OPENROUTER_MODELS) {
    const apiKey = OPENROUTER_API_KEYS[modelConfig.keyIndex];
    
    if (!apiKey) {
      console.warn(`⚠️ API key not found for ${modelConfig.name}, skipping...`);
      continue;
    }
    
    // For dedicated key models (like MiniMax), only use their specific key - don't try other keys
    if ((modelConfig as any).dedicatedKey) {
      // Track failures for dedicated key models
      if (dedicatedKeyFailures >= MAX_DEDICATED_FAILURES) {
        console.log(`⚠️ Skipping remaining MiniMax variants (${dedicatedKeyFailures} failures), using Insforge MCP...`);
        break; // Skip remaining MiniMax variants, go to Insforge
      }
      console.log(`🔍 Trying ${modelConfig.name} with dedicated API key only...`);
    } else {
      // If we've seen multiple payment required errors, skip OpenRouter faster (but not dedicated key models)
      if (paymentRequiredCount >= MAX_PAYMENT_REQUIRED) {
        console.log(`⚠️ Skipping remaining OpenRouter models (${paymentRequiredCount} payment errors detected), using Insforge MCP...`);
        break;
      }
      // If we've seen multiple bad requests (invalid models), skip OpenRouter faster
      if (badRequestCount >= MAX_BAD_REQUESTS) {
        console.log(`⚠️ Skipping remaining OpenRouter models (${badRequestCount} bad requests detected), using Insforge MCP...`);
        break;
      }
    }
    
    try {
      console.log(`🔍 Trying OpenRouter: ${modelConfig.name} (page ${pageNum})...`);
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'BidAnalyzer AI OCR'
        },
        body: JSON.stringify({
          model: modelConfig.id,
          messages: [
            {
              role: 'system',
              content: ocrPrompt.system
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: ocrPrompt.user
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: imageDataUrl
                  }
                }
              ]
            }
          ],
          temperature: 0.1,
          max_tokens: 4000
        })
      });
      
      if (!response.ok) {
        let errorData = '';
        let errorJson = '';
        try {
          errorData = await response.text();
          try {
            errorJson = JSON.parse(errorData).error?.message || '';
          } catch {
            errorJson = errorData;
          }
        } catch {
          errorData = `Status ${response.status}`;
        }
        
        // For dedicated key models, if it fails, track and continue to next variant
        if ((modelConfig as any).dedicatedKey) {
          dedicatedKeyFailures++;
          // Only log if not a common error
          if (response.status !== 400 && response.status !== 404) {
            console.warn(`⚠️ ${modelConfig.name} (dedicated key) failed: ${response.status} (${dedicatedKeyFailures}/${MAX_DEDICATED_FAILURES})`);
          }
          continue; // Skip to next model variant, don't try other keys
        }
        
        // If it's a payment required error (402), track it and skip faster
        if (response.status === 402 || errorJson.includes('Insufficient credits') || errorJson.includes('never purchased')) {
          paymentRequiredCount++;
          // Only log once per payment error type
          if (paymentRequiredCount === 1) {
            console.warn(`⚠️ OpenRouter payment required, skipping paid models...`);
          }
          continue;
        }
        
        // If it's a rate limit or auth error, try next key/model (suppress common errors)
        if (response.status === 401 || response.status === 403 || response.status === 429) {
          // Only log auth errors (not rate limits which are common)
          if (response.status === 401 || response.status === 403) {
            console.warn(`⚠️ ${modelConfig.name} authentication error, trying next...`);
          }
          continue;
        }
        
        // For 400/404 (bad request/model not found), track and skip faster (suppress logging)
        if (response.status === 400 || response.status === 404) {
          badRequestCount++;
          // Suppress logging for common 400/404 errors to reduce console spam
          continue;
        }
        
        // Only throw for unexpected server errors
        if (response.status >= 500) {
          console.warn(`⚠️ OpenRouter server error: ${response.status}`);
          continue; // Don't throw, just try next model
        }
        
        // For other errors, just continue to next model
        continue;
      }
      
      const data = await response.json();
      let extractedText = data.choices[0]?.message?.content || '';
      
      // Clean up
      extractedText = extractedText
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`/g, '')
        .trim();
      
      if (extractedText.length > 0) {
        console.log(`✅ OpenRouter OCR (${modelConfig.name}) extracted ${extractedText.length} characters from page ${pageNum}`);
        return extractedText;
      }
      
      // If response is empty, try next model
      console.warn(`⚠️ ${modelConfig.name} returned empty text, trying next model...`);
      continue;
      
    } catch (error: any) {
      // Log error but continue to next key/model
      const errorMsg = error?.message || '';
      
      // For dedicated key models, if it fails, track and continue to next variant
      if ((modelConfig as any).dedicatedKey) {
        dedicatedKeyFailures++;
        console.warn(`⚠️ ${modelConfig.name} (dedicated key) failed:`, errorMsg.slice(0, 100), `(${dedicatedKeyFailures}/${MAX_DEDICATED_FAILURES})`);
        continue; // Skip to next model variant, don't try other keys
      }
      
      // For regular models, track payment errors
      if (errorMsg.includes('402') || errorMsg.includes('Insufficient credits') || errorMsg.includes('never purchased')) {
        paymentRequiredCount++;
        console.warn(`⚠️ ${modelConfig.name} payment error detected (${paymentRequiredCount}/${MAX_PAYMENT_REQUIRED})`);
      } else if (errorMsg.includes('400') || errorMsg.includes('404') || errorMsg.includes('Bad Request') || errorMsg.includes('Not Found')) {
        badRequestCount++;
        console.warn(`⚠️ ${modelConfig.name} bad request/not found error detected (${badRequestCount}/${MAX_BAD_REQUESTS})`);
      } else {
        console.warn(`⚠️ ${modelConfig.name} error:`, errorMsg.slice(0, 100));
      }
      continue;
    }
  }
  
      // If all OpenRouter keys/models failed, return null (will trigger Insforge MCP fallback)
      console.warn(`⚠️ All OpenRouter API keys/models exhausted for page ${pageNum}. Will fallback to Insforge MCP.`);
      return null; // Return null to trigger Insforge fallback
}

/**
 * Extract text from PDF file with fallback to AI vision
 * Aggressively uses AI vision to ensure extraction always succeeds
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  let pdfjs: any;
  let pdf: any;
  let arrayBuffer: ArrayBuffer;
  
  try {
    pdfjs = await loadPdfJs();
    
    // Read file as array buffer
    arrayBuffer = await file.arrayBuffer();
    
    // Load PDF document
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    pdf = await loadingTask.promise;
    
    console.log(`PDF loaded: ${pdf.numPages} pages`);
    
    if (!pdf || pdf.numPages === 0) {
      throw new Error('PDF has no pages');
    }
    
    let fullText = '';
    let pagesWithLittleText = 0;
    const MIN_TEXT_THRESHOLD = 20; // Lower threshold - rely more on standard extraction
    
    // Try standard extraction first - it's more reliable and doesn't require API keys
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      try {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      console.log(`Page ${pageNum} has ${textContent.items.length} text items`);
        
        // Standard extraction - always try this first
        if (textContent.items && textContent.items.length > 0) {
          console.log(`Page ${pageNum}: Processing ${textContent.items.length} text items`);
          
          // Method 1: First try simple concatenation to get ALL text (most reliable)
          // IMPORTANT: Don't filter - get ALL text items, even single characters
          let simpleText = '';
          let itemCount = 0;
          textContent.items.forEach((item: any) => {
            // Extract text from item - try multiple properties
            const text = item.str || item.text || '';
            if (text && text.length > 0) {
              // Add space between items for readability, but preserve all text
              if (simpleText.length > 0 && !simpleText.endsWith(' ') && !text.startsWith(' ')) {
                simpleText += ' ';
              }
              simpleText += text;
              itemCount++;
            }
          });
          
          console.log(`Page ${pageNum}: Simple concatenation extracted ${simpleText.length} chars from ${itemCount} items`);
          
          // Method 2: Improved structured approach - Group by rows (Y position) then sort by columns (X position)
      const rows: Map<number, Array<{ x: number; text: string; width: number }>> = new Map();
      
      textContent.items.forEach((item: any) => {
            const text = item.str || item.text || '';
            if (!text || !item.transform) return;
        
            const x = item.transform[4] || 0;
            const y = item.transform[5] || 0;
        const width = (item.width || 0) * (item.transform[0] || 1);
        
            // Round Y to group items on same line (tolerance of 5px for better grouping)
            const rowKey = Math.round(y / 5) * 5;
        
        if (!rows.has(rowKey)) {
          rows.set(rowKey, []);
        }
        
            rows.get(rowKey)!.push({ x, text, width });
      });
      
      // Sort rows by Y (top to bottom)
      const sortedRowKeys = Array.from(rows.keys()).sort((a, b) => b - a);
      
          let structuredText = '';
      let prevRowY = 0;
      
      sortedRowKeys.forEach((rowY, rowIndex) => {
        const rowItems = rows.get(rowY)!;
        
        // Sort items in row by X (left to right)
        rowItems.sort((a, b) => a.x - b.x);
        
        // Check if this is a new row (significant Y change)
            if (rowIndex > 0 && Math.abs(rowY - prevRowY) > 8) {
              structuredText += '\n';
        }
        
        // Process items in row
        rowItems.forEach((item, itemIndex) => {
          if (itemIndex > 0) {
            const prevItem = rowItems[itemIndex - 1];
            const gap = item.x - (prevItem.x + prevItem.width);
            
            // Large gap = table column separator
                if (gap > 25) {
                  structuredText += '\t';
            }
            // Medium gap = word space
                else if (gap > 2) {
                  structuredText += ' ';
            }
          }
          
              structuredText += item.text;
        });
        
        prevRowY = rowY;
      });
      
          console.log(`Page ${pageNum}: Structured extraction got ${structuredText.length} chars`);
          
          // Use the method that got more text (prefer simpleText as it's more reliable)
          // Only use structured if it's significantly better
          let pageText = structuredText.length > simpleText.length * 1.2 ? structuredText : simpleText;
          
          // Ensure we have the maximum possible text
          if (simpleText.length > pageText.length) {
            pageText = simpleText;
          }
          
          // Final fallback: If both methods got very little, try OCR (for potentially scanned pages)
          if (pageText.trim().length < 100 && textContent.items.length > 10 && OCR_ENABLED) {
            console.log(`Page ${pageNum}: Both methods got little text (${pageText.length} chars), trying OCR as fallback...`);
            try {
              const ocrText = await extractTextFromPDFPageWithAI(pdfjs, pdf, pageNum);
              if (ocrText && ocrText.trim().length > pageText.trim().length) {
                console.log(`✅ OCR fallback extracted ${ocrText.trim().length} chars (better than ${pageText.trim().length})`);
                pageText = ocrText;
                pagesWithLittleText++;
              } else {
                console.log(`Page ${pageNum}: OCR didn't improve extraction, using standard text`);
              }
            } catch (ocrError: any) {
              console.warn(`Page ${pageNum}: OCR fallback failed, using standard extraction:`, ocrError.message);
            }
          }
          
          // Final check: Make sure we didn't lose text
          if (simpleText.length > pageText.length) {
            console.log(`Page ${pageNum}: Using simpleText as it has more characters (${simpleText.length} vs ${pageText.length})`);
            pageText = simpleText;
          }
          
          // Log what we extracted
          console.log(`Page ${pageNum}: Final extracted text length: ${pageText.trim().length} chars`);
          if (pageText.trim().length > 0 && pageText.trim().length < 200) {
            console.log(`Page ${pageNum}: Extracted text preview:`, pageText.trim().substring(0, 200));
          }
          
          // Add extracted text (even if short - it's better than nothing)
          if (pageText.trim().length > 0) {
      fullText += `\n--- Page ${pageNum} ---\n${pageText}\n`;
          } else {
            // Even aggressive extraction failed - log details
            console.warn(`Page ${pageNum}: No text extracted despite ${textContent.items.length} items`);
            console.warn(`Page ${pageNum}: Sample items:`, textContent.items.slice(0, 5).map((item: any) => ({
              str: item.str,
              text: item.text,
              hasTransform: !!item.transform
            })));
            fullText += `\n--- Page ${pageNum} ---\n[No readable text found - may be image-based PDF]\n`;
          }
        } else {
          // No text items - this is likely an image-based/scanned PDF
          console.log(`Page ${pageNum} has no text items (image-based/scanned PDF detected)`);
          
          // Use OCR (AI vision) if enabled
          if (OCR_ENABLED) {
            console.log(`🔍 Using OCR (AI vision) to extract text from scanned page ${pageNum}...`);
            try {
              const ocrText = await extractTextFromPDFPageWithAI(pdfjs, pdf, pageNum);
              if (ocrText && ocrText.trim().length > 0) {
                console.log(`✅ OCR extracted ${ocrText.trim().length} characters from page ${pageNum}`);
                fullText += `\n--- Page ${pageNum} ---\n${ocrText}\n`;
                pagesWithLittleText++;
              } else {
                console.warn(`⚠️ OCR failed for page ${pageNum} - no text extracted`);
                fullText += `\n--- Page ${pageNum} ---\n[OCR extraction failed - page may be blank or corrupted]\n`;
              }
            } catch (ocrError: any) {
              console.error(`❌ OCR error for page ${pageNum}:`, ocrError);
              fullText += `\n--- Page ${pageNum} ---\n[OCR extraction failed: ${ocrError.message || 'Unknown error'}]\n`;
            }
          } else {
            console.warn(`⚠️ OCR disabled. Page ${pageNum} skipped (scanned PDF requires OCR).`);
            fullText += `\n--- Page ${pageNum} ---\n[No extractable text found - OCR required for scanned PDF]\n`;
          }
        }
      } catch (pageError: any) {
        console.error(`Error extracting page ${pageNum}:`, pageError);
        
        // Try OCR as fallback if standard extraction failed
        if (OCR_ENABLED) {
          console.log(`🔍 Standard extraction failed for page ${pageNum}, trying OCR...`);
          try {
            const ocrText = await extractTextFromPDFPageWithAI(pdfjs, pdf, pageNum);
            if (ocrText && ocrText.trim().length > 0) {
              console.log(`✅ OCR recovered ${ocrText.trim().length} characters from page ${pageNum}`);
              fullText += `\n--- Page ${pageNum} ---\n${ocrText}\n`;
              pagesWithLittleText++;
            } else {
              console.warn(`Page ${pageNum}: OCR also failed`);
              fullText += `\n--- Page ${pageNum} ---\n[Page extraction failed - may be blank or corrupted]\n`;
            }
          } catch (ocrError: any) {
            console.error(`Page ${pageNum}: OCR fallback also failed:`, ocrError);
            fullText += `\n--- Page ${pageNum} ---\n[Page extraction failed - may be blank, corrupted, or image-only]\n`;
          }
        } else {
          console.warn(`Page ${pageNum}: Standard extraction failed, OCR disabled`);
          fullText += `\n--- Page ${pageNum} ---\n[Page extraction failed - OCR required but disabled]\n`;
        }
      }
    }
    
    // Remove page markers and error messages for accurate character count
    // Keep only actual extracted text
    const textWithoutMarkers = fullText
      .replace(/--- Page \d+ ---\n/g, '')  // Remove page markers
      .replace(/\[.*?\]/g, '')  // Remove error markers like [No extractable text...]
      .replace(/OCR extraction failed.*?\n/g, '')  // Remove OCR error messages
      .replace(/Page extraction failed.*?\n/g, '')  // Remove page error messages
      .trim();
    const trimmedFullText = textWithoutMarkers;
    
    console.log(`PDF extraction complete. Text length: ${trimmedFullText.length} chars (actual text only)`);
    console.log(`Total pages: ${pdf.numPages}, Pages with OCR: ${pagesWithLittleText}`);
    console.log('PDF extracted text (first 2000 chars):', trimmedFullText.slice(0, 2000));
    console.log('PDF extracted text (last 500 chars):', trimmedFullText.slice(-500));
    
    // Warn if very little text extracted
    if (trimmedFullText.length < 200) {
      console.error(`⚠️ CRITICAL: Only extracted ${trimmedFullText.length} characters from ${pdf.numPages} pages!`);
      
      // Check if PDF might be image-based
      const hasPageMarkers = (fullText.match(/--- Page \d+ ---/g) || []).length;
      const hasErrorMarkers = (fullText.match(/\[.*?\]/g) || []).length;
      const hasOcrPages = pagesWithLittleText > 0;
      
      if (hasPageMarkers === pdf.numPages && trimmedFullText.length < 100) {
        if (OCR_ENABLED && !hasOcrPages) {
          console.error('⚠️ PDF appears to be image-based (scanned document). OCR was attempted but failed.');
          console.error('⚠️ Check if Google API keys are configured in Insforge backend dashboard for Gemini 2.5 Pro.');
        } else if (!OCR_ENABLED) {
          console.error('⚠️ PDF appears to be image-based (scanned document). OCR is disabled.');
          console.error('⚠️ Enable OCR by setting OCR_ENABLED = true in src/lib/insforge.ts');
        } else {
          console.error('⚠️ PDF appears to be image-based (scanned document).');
        }
      }
      
      if (trimmedFullText.length > 0) {
        console.log('Full extracted text:', trimmedFullText);
      }
    }
    
    // Return actual extracted text (without markers)
    const finalText = trimmedFullText || fullText.trim();
    
    // Final validation: ensure we have some text
    if (!finalText || finalText.length === 0) {
      // If OCR was enabled but still got nothing, provide helpful error
      if (OCR_ENABLED && pagesWithLittleText === 0) {
        throw new Error('PDF extraction returned empty text. OCR was enabled but may have failed due to API key configuration. Check Insforge backend OpenAI API keys.');
      }
      throw new Error('PDF extraction returned empty text - PDF may be corrupted, password-protected, or contain only images. Enable OCR in src/lib/insforge.ts for scanned PDFs.');
    }
    
    if (finalText.length < 200) {
      console.warn(`⚠️ WARNING: Extracted text is very short (${finalText.length} chars from ${pdf.numPages} pages).`);
      if (OCR_ENABLED && pagesWithLittleText > 0) {
        console.warn(`⚠️ OCR was used for ${pagesWithLittleText} pages. Text may be limited or OCR may need improvement.`);
      } else if (OCR_ENABLED) {
        console.warn('⚠️ OCR is enabled but may have failed. Check if OpenAI API keys are configured on Insforge backend.');
      } else {
        console.warn('⚠️ This PDF appears to be image-based (scanned document). Enable OCR for better extraction.');
      }
    }
    
    return finalText;
  } catch (error: any) {
    console.error('PDF extraction error:', error);
    
    // Final fallback: try OCR for all pages if standard extraction completely failed
    if (OCR_ENABLED) {
      try {
        if (!pdfjs) {
          pdfjs = await loadPdfJs();
        }
        if (!arrayBuffer) {
          arrayBuffer = await file.arrayBuffer();
        }
        if (!pdf) {
          const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
          pdf = await loadingTask.promise;
        }
        
        if (pdf && pdf.numPages > 0) {
          console.log(`🔄 Standard extraction failed. Attempting OCR for all ${pdf.numPages} pages...`);
          let ocrText = '';
          let ocrSuccessCount = 0;
          
          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            try {
              const pageOcrText = await extractTextFromPDFPageWithAI(pdfjs, pdf, pageNum);
              if (pageOcrText && pageOcrText.trim().length > 0) {
                ocrText += `\n--- Page ${pageNum} ---\n${pageOcrText}\n`;
                ocrSuccessCount++;
              }
            } catch (ocrError) {
              console.error(`OCR failed for page ${pageNum} in fallback:`, ocrError);
            }
          }
          
          if (ocrText.trim().length > 0) {
            console.log(`✅ OCR fallback extracted ${ocrText.trim().length} chars from ${ocrSuccessCount}/${pdf.numPages} pages`);
            // Clean up OCR text
            const cleanOcrText = ocrText.replace(/--- Page \d+ ---\n/g, '').trim();
            return cleanOcrText;
          } else {
            console.error('❌ OCR fallback also failed - no text extracted from any page');
          }
        }
      } catch (fallbackError) {
        console.error('OCR fallback also failed:', fallbackError);
      }
    }
    
    // Last resort: throw error with helpful message
    if (OCR_ENABLED) {
      throw new Error(`Failed to extract text from PDF. The PDF appears to be image-based (scanned). OCR was attempted but failed - check if OpenAI API keys are configured on Insforge backend. Original error: ${error.message}`);
    } else {
      throw new Error(`Failed to extract text from PDF. The PDF may be corrupted, password-protected, or contain only images. Enable OCR in src/lib/insforge.ts for scanned PDFs. Error: ${error.message}`);
    }
  }
}

/**
 * Check if a file is a PDF
 */
export function isPDF(file: File): boolean {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}

/**
 * Check if a file is DOCX
 */
export function isDOCX(file: File): boolean {
  return file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
         file.name.toLowerCase().endsWith('.docx');
}

/**
 * Read file as text with proper handling
 */
export async function readFileAsText(file: File): Promise<string> {
  if (isPDF(file)) {
    // For PDFs, use pdfjs to extract text
    return await extractTextFromPDF(file);
  }
  
  if (isDOCX(file)) {
    // For DOCX files, extract text from the document.xml inside the ZIP
    return await extractTextFromDOCX(file);
  }
  
  // For text files, read directly
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsText(file, 'UTF-8');
  });
}

/**
 * Extract text from DOCX file (it's a ZIP file with XML inside)
 */
async function extractTextFromDOCX(file: File): Promise<string> {
  try {
    // Use JSZip to read the DOCX file
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);
    
    // DOCX structure: word/document.xml contains the main text
    const documentXml = await zip.file('word/document.xml')?.async('string');
    
    if (!documentXml) {
      throw new Error('Could not find document.xml in DOCX file');
    }
    
    console.log('DOCX XML preview (first 2000 chars):', documentXml.substring(0, 2000));
    
    // Parse XML to extract text while preserving structure
    // Handle both regular paragraphs and tables
    let textContent = '';
    
    // Split document into sections: tables and regular paragraphs
    const allSections: Array<{ type: 'table' | 'paragraph', content: string }> = [];
    
    // Find all tables first
    const tablePattern = /<w:tbl[^>]*>(.*?)<\/w:tbl>/gs;
    let lastEnd = 0;
    let tableMatch;
    
    while ((tableMatch = tablePattern.exec(documentXml)) !== null) {
      // Add text before table as paragraph
      if (tableMatch.index > lastEnd) {
        allSections.push({
          type: 'paragraph',
          content: documentXml.substring(lastEnd, tableMatch.index)
        });
      }
      
      // Add table
      allSections.push({
        type: 'table',
        content: tableMatch[1]
      });
      
      lastEnd = tableMatch.index + tableMatch[0].length;
    }
    
    // Add remaining text as paragraph
    if (lastEnd < documentXml.length) {
      allSections.push({
        type: 'paragraph',
        content: documentXml.substring(lastEnd)
      });
    }
    
    console.log(`Found ${allSections.length} sections in DOCX`);
    
    let tableCount = 0;
    
    // Process each section
    allSections.forEach((section, sectionIndex) => {
      if (section.type === 'table') {
        tableCount++;
        textContent += `\n[TABLE ${tableCount} START]\n`;
        // Parse table
        const rowPattern = /<w:tr[^>]*>(.*?)<\/w:tr>/gs;
        let rowMatch;
        
        while ((rowMatch = rowPattern.exec(section.content)) !== null) {
          const rowContent = rowMatch[1];
          const cellPattern = /<w:tc[^>]*>(.*?)<\/w:tc>/gs;
          let cellMatch;
          const cellTexts = [];
          
          while ((cellMatch = cellPattern.exec(rowContent)) !== null) {
            const cellContent = cellMatch[1];
            // Extract text from all paragraphs in cell
            const cellParagraphPattern = /<w:p[^>]*>(.*?)<\/w:p>/gs;
            let cellParaMatch;
            const cellParas = [];
            
            while ((cellParaMatch = cellParagraphPattern.exec(cellContent)) !== null) {
              const paraContent = cellParaMatch[1];
              const textPattern = /<w:t[^>]*>(.*?)<\/w:t>/gs;
              let textMatch;
              const paraTexts = [];
              
              while ((textMatch = textPattern.exec(paraContent)) !== null) {
                if (textMatch[1]) {
                  const decoded = textMatch[1]
                    .replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .replace(/&apos;/g, "'")
                    .replace(/&#xA;/g, ' ')
                    .replace(/&#xD;/g, ' ')
                    .trim();
                  
                  if (decoded) {
                    paraTexts.push(decoded);
                  }
                }
              }
              
              if (paraTexts.length > 0) {
                cellParas.push(paraTexts.join(' '));
              }
            }
            
            if (cellParas.length > 0) {
              cellTexts.push(cellParas.join(' | '));
            } else {
              cellTexts.push('');
            }
          }
          
          if (cellTexts.length > 0) {
            textContent += cellTexts.join('\t') + '\n';
          }
        }
        
        textContent += `[TABLE ${tableCount} END]\n\n`;
      } else {
        // Parse paragraphs
        const paragraphPattern = /<w:p[^>]*>(.*?)<\/w:p>/gs;
        let paragraphMatch;
        
        while ((paragraphMatch = paragraphPattern.exec(section.content)) !== null) {
          const paragraphContent = paragraphMatch[1];
          const textPattern = /<w:t[^>]*>(.*?)<\/w:t>/gs;
          const paragraphTexts = [];
          let textMatch;
          
          while ((textMatch = textPattern.exec(paragraphContent)) !== null) {
            if (textMatch[1]) {
              const decoded = textMatch[1]
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&apos;/g, "'")
                .replace(/&#xA;/g, ' ')
                .replace(/&#xD;/g, ' ')
                .trim();
              
              if (decoded) {
                paragraphTexts.push(decoded);
              }
            }
          }
          
          if (paragraphTexts.length > 0) {
            textContent += paragraphTexts.join(' ') + '\n';
          }
        }
      }
    });
    
    // If no text found, try simple extraction
    if (!textContent || textContent.trim().length === 0) {
      console.log('No text found, trying simple extraction');
      const textPattern = /<w:t[^>]*>(.*?)<\/w:t>/gs;
      const matches = [];
      let match;
      
      while ((match = textPattern.exec(documentXml)) !== null) {
        if (match[1]) {
          const decoded = match[1]
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'")
            .replace(/&#xA;/g, ' ')
            .replace(/&#xD;/g, ' ')
            .trim();
          
          if (decoded) {
            matches.push(decoded);
          }
        }
      }
      
      if (matches.length === 0) {
        console.log('No text content found in DOCX file');
        return 'No text content found in DOCX file';
      }
      
      textContent = matches.join(' ');
    }
    
    console.log('Extracted DOCX text length:', textContent.length);
    console.log('First 1000 chars:', textContent.slice(0, 1000));
    
    return textContent.trim();
  } catch (error) {
    console.error('DOCX extraction error:', error);
    throw new Error('Failed to extract text from DOCX file');
  }
}

