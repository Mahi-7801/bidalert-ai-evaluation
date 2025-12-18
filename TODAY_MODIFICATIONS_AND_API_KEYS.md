# Today's Modifications & API Keys Configuration

**Date:** November 1, 2025  
**Version:** BidScribe Forge v1.0

---

## 📋 Table of Contents
1. [Today's Modifications](#todays-modifications)
2. [Current API Keys Configuration](#current-api-keys-configuration)
3. [How to Add New API Keys](#how-to-add-new-api-keys)
4. [API Key Priority & Fallback Strategy](#api-key-priority--fallback-strategy)

---

## 🔧 Today's Modifications

### 1. **Fixed Enquiry Number Extraction**
   - **Issue:** System was extracting "860025" (Tender ID) instead of "EAPH250035" (Enquiry Number)
   - **Fix:** 
     - Added explicit cleanup to remove "ID" and "Tender ID" prefixes
     - Implemented validation to exclude pure numeric values that are Tender IDs
     - Prioritized formats with letters (EAPH250035) over pure numbers
   - **Files Modified:** `src/services/aiService.ts` (lines 1040-1173)

### 2. **Enhanced eProcurement Format Support**
   - **Issue:** Incorrect extraction from eProcurement documents (GeM, eProcurement, AP eProcurement)
   - **Fixes:**
     - **Enquiry Number:** Prioritized "Tender Reference Number:" pattern (eProcurement format)
       - Now correctly extracts "PSGCT/CPPP/2025-26/03" instead of "ADDCPP20252603"
     - **Organization:** Enhanced "Organisation Chain" pattern to capture both parts with `||` separator
       - Now extracts "National Project Implementation Unit - World Bank Tenders||PSG COLLEGE OF TECHNOLOGY COIMBATORE"
     - **Work Location:** Prioritized eProcurement "Location:" pattern
       - Now extracts "Department of Textile Technology PSGCT" correctly
   - **Files Modified:** `src/services/aiService.ts` (lines 1043-1056, 1253-1256, 2189-2190)

### 3. **Fixed Date Extraction**
   - **Issue:** Invalid date ranges like "25-26/2025" were being extracted
   - **Fix:** Added validation to skip incomplete date ranges
     - Skips patterns like "23-25/03", "25-26/2025"
     - Only extracts valid full dates (DD/MM/YYYY format)
   - **Files Modified:** `src/services/aiService.ts` (line 1392)

### 4. **Improved Project Title Extraction**
   - **Issue:** Title was capturing clause text (e.g., "to force majeure clause...")
   - **Fix:** 
     - Added aggressive stopping mechanisms at clause markers
     - Prioritized "Scope of Work" sections for title extraction
     - Added validation to exclude titles starting with "to force" or similar clause text
   - **Files Modified:** `src/services/aiService.ts` (lines 1870-1950)

### 5. **Fixed Work Items Display**
   - **Issue:** Work items showing as `[object Object]` in extracted data
   - **Fix:** 
     - Excluded work items from general extracted data display
     - Added dedicated "Scope of Work Items" section with formatted HTML table
     - Filtered out arrays of objects from general display
   - **Files Modified:** `src/utils/reportGenerator.ts`, `src/pages/Upload.tsx`

### 6. **Enhanced Date Field Identification**
   - **Issue:** Dates were not labeled (showing "Other Date" for all dates)
   - **Fix:** 
     - Implemented contextual date identification using surrounding text (150 characters)
     - Added chronological fallback logic for date labeling
     - Dates now show correct labels: "Enquiry Date", "Submission Deadline", "Bid Opening Date", etc.
   - **Files Modified:** `src/services/aiService.ts` (lines 1520-1650)

---

## 🔑 Current API Keys Configuration

### **Insforge Backend API**
**Location:** `src/lib/insforge.ts`

```typescript
// Insforge API Key (from MCP configuration)
INSFORGE_API_KEY: 'ik_0561d666ded8e0fe057c9ecce69954a4'
INSFORGE_BASE_URL: 'https://527ft3xh.us-east.insforge.app'
```

**MCP Configuration:** `~/.cursor/mcp.json`
```json
{
  "mcpServers": {
    "insforge": {
      "command": "npx",
      "args": ["-y", "@insforge/mcp@latest"],
      "env": {
        "API_KEY": "ik_0561d666ded8e0fe057c9ecce69954a4",
        "API_BASE_URL": "https://527ft3xh.us-east.insforge.app"
      }
    }
  }
}
```

---

### **OpenRouter API Keys (Multi-Key Fallback)**
**Location:** `src/lib/insforge.ts`

#### **Primary Keys:**
1. **Primary OpenRouter Key**
   ```
   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
   ```
   - Used for: Gemini models, GPT-4o, Claude models
   - Priority: **1st** (Primary)

2. **Deepseek Key**
   ```
   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
   ```
   - Used for: Deepseek V2 Chat
   - Priority: **2nd**

3. **NVIDIA Nemotron Key**
   ```
   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
   ```
   - Used for: NVIDIA Nemotron Nano 12B 2 VL (free)
   - Priority: **3rd**

4. **Qwen Key**
   ```
   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
   ```
   - Used for: Qwen VL Max, Qwen VL Plus
   - Priority: **4th**

---

### **Configured AI Models**

#### **✅ Working Vision Models (Confirmed):**
1. **Gemini 2.5 Flash Image Preview** (`google/gemini-2.5-flash-image-preview`)
   - Key: Primary OpenRouter (keyIndex: 0)
   - Status: ✅ **WORKING**
   - Priority: **Highest**

2. **Gemini 2.0 Flash Exp** (`google/gemini-2.0-flash-exp`)
   - Key: Primary OpenRouter (keyIndex: 0)
   - Status: ✅ Available

3. **Gemini Flash 1.5** (`google/gemini-flash-1.5`)
   - Key: Primary OpenRouter (keyIndex: 0)
   - Status: ✅ Available

#### **Premium Vision Models:**
4. **GPT-4o** (`openai/gpt-4o`)
   - Key: Primary OpenRouter (keyIndex: 0)
   - Status: Premium (paid)

5. **GPT-4o Mini** (`openai/gpt-4o-mini`)
   - Key: Primary OpenRouter (keyIndex: 0)
   - Status: Premium (paid)

6. **Claude 3.5 Sonnet** (`anthropic/claude-3.5-sonnet`)
   - Key: Primary OpenRouter (keyIndex: 0)
   - Status: Premium (paid)

7. **Claude 3 Opus** (`anthropic/claude-3-opus`)
   - Key: Primary OpenRouter (keyIndex: 0)
   - Status: Premium (paid)

#### **Alternative Models (Fallback):**
8. **Deepseek V2 Chat** (`deepseek/deepseek-v2-chat`)
   - Key: Deepseek Key (keyIndex: 1)
   - Status: Fallback

9. **NVIDIA Llama V2** (`nvidia/nv-llama-v2-72b-instruct`)
   - Key: NVIDIA Key (keyIndex: 2)
   - Status: Fallback

10. **Qwen VL Max** (`qwen/qwen-vl-max`)
    - Key: Qwen Key (keyIndex: 3)
    - Status: Fallback

11. **Qwen VL Plus** (`qwen/qwen-vl-plus`)
    - Key: Qwen Key (keyIndex: 3)
    - Status: Fallback

---

## ➕ How to Add New API Keys

### **Method 1: Add to OpenRouter Keys Array**

Edit `src/lib/insforge.ts`:

```typescript
export const OPENROUTER_API_KEYS = [
  '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', // Primary
  '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', // Deepseek
  'esk-or-v1-bd71c52a5fe9ff8205cc8cb97436812fc1a55768120ed073e04eefb8a64094cd', // NVIDIA
  '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', // Qwen
  'YOUR_NEW_API_KEY_HERE' // Add your new key here
];
```

**Note:** The keyIndex for new models should be the array index (e.g., index 4 for the 5th key).

---

### **Method 2: Add New Model with Specific Key**

Edit `src/lib/insforge.ts` and add to `OPENROUTER_MODELS` array:

```typescript
export const OPENROUTER_MODELS = [
  // ... existing models ...
  
  // Your new model
  { 
    id: 'provider/model-name', 
    name: 'Model Display Name', 
    keyIndex: 4  // Index of your API key in OPENROUTER_API_KEYS array
  }
];
```

**Example:**
```typescript
{ 
  id: 'anthropic/claude-opus-4.1', 
  name: 'Claude Opus 4.1', 
  keyIndex: 0  // Use primary key
}
```

---

### **Method 3: Add Insforge Backend API Key**

#### **Step 1: Update `src/lib/insforge.ts`**
```typescript
export const INSFORGE_API_KEY = 'your_new_insforge_api_key_here';
export const INSFORGE_BASE_URL = 'https://your-instance.insforge.app';
```

#### **Step 2: Update MCP Configuration**

Edit `~/.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "insforge": {
      "command": "npx",
      "args": ["-y", "@insforge/mcp@latest"],
      "env": {
        "API_KEY": "your_new_insforge_api_key_here",
        "API_BASE_URL": "https://your-instance.insforge.app"
      }
    }
  }
}
```

**Note:** After updating MCP config, restart Cursor/VS Code for changes to take effect.

---

## 🔄 API Key Priority & Fallback Strategy

### **OCR/Image Processing Flow:**

1. **First Attempt:** Insforge Backend AI Models
   - Uses: Insforge API Key
   - Models: Claude Opus 4.1, Gemini 2.5 Flash Image Preview, GPT-4o (if configured on backend)
   - If fails → Go to Step 2

2. **Second Attempt:** Direct OpenRouter API (Primary Key)
   - Uses: Primary OpenRouter Key (keyIndex: 0)
   - Models: Gemini 2.5 Flash Image Preview, Gemini 2.0 Flash Exp, GPT-4o
   - If fails → Go to Step 3

3. **Third Attempt:** OpenRouter API (Deepseek Key)
   - Uses: Deepseek Key (keyIndex: 1)
   - Models: Deepseek V2 Chat
   - If fails → Go to Step 4

4. **Fourth Attempt:** OpenRouter API (NVIDIA Key)
   - Uses: NVIDIA Key (keyIndex: 2)
   - Models: NVIDIA Nemotron Nano 12B 2 VL
   - If fails → Go to Step 5

5. **Fifth Attempt:** OpenRouter API (Qwen Key)
   - Uses: Qwen Key (keyIndex: 3)
   - Models: Qwen VL Max, Qwen VL Plus
   - If fails → Go to Step 6

6. **Final Fallback:** Text-based Extraction (No AI)
   - Uses: Regex patterns and text extraction
   - No API calls, no errors
   - Basic extraction only

---

## 📊 Feature Flags

**Location:** `src/lib/insforge.ts`

```typescript
// AI Analysis Feature
AI_AVAILABLE = false  // Set to true when OpenAI API keys are configured on backend

// OCR Feature (for scanned PDFs)
OCR_ENABLED = true  // Enable OCR for PDF extraction using Insforge AI vision

// Direct OCR API (OpenRouter fallback)
USE_DIRECT_OCR_API = true  // ✅ Enabled - will use OpenRouter when backend models fail
```

---

## 🎯 Quick Reference: Adding New Keys

### **Add OpenRouter Key:**
1. Open `src/lib/insforge.ts`
2. Add key to `OPENROUTER_API_KEYS` array
3. Add model to `OPENROUTER_MODELS` array with correct `keyIndex`
4. Save file

### **Add Insforge Key:**
1. Open `src/lib/insforge.ts`
2. Update `INSFORGE_API_KEY` and `INSFORGE_BASE_URL`
3. Update `~/.cursor/mcp.json` with same values
4. Restart Cursor/VS Code

### **Test New Keys:**
1. Upload a scanned PDF document
2. Check browser console for API calls
3. Verify OCR extraction works
4. Check network tab for successful API responses

---

## 📝 Notes

- **Security:** Never commit API keys to public repositories
- **Rate Limits:** OpenRouter has rate limits per key; multiple keys help distribute load
- **Model Availability:** Free models may have limited availability; premium models are more reliable
- **Fallback:** System gracefully falls back to text extraction if all API calls fail
- **Priority:** Models are tried in order listed in `OPENROUTER_MODELS` array

---

## ✅ Summary

**Today's Key Changes:**
- ✅ Fixed Enquiry Number extraction (removed ID prefix, validated against Tender ID)
- ✅ Enhanced eProcurement format support (Tender Reference Number, Organisation Chain, Location)
- ✅ Fixed date extraction (excluded invalid ranges)
- ✅ Improved Project Title extraction (stopped at clause markers)
- ✅ Fixed Work Items display (formatted table instead of [object Object])
- ✅ Enhanced date field identification (contextual labeling)

**Current API Keys:**
- ✅ 1 Insforge Backend API Key
- ✅ 4 OpenRouter API Keys (multi-key fallback)
- ✅ 11 Configured AI Models (prioritized by success rate)

**Ready to Add:**
- ✅ Follow "How to Add New API Keys" section above
- ✅ Add keys to `OPENROUTER_API_KEYS` array
- ✅ Add models to `OPENROUTER_MODELS` array with correct `keyIndex`

---

**Last Updated:** November 1, 2025  
**Maintained By:** BidScribe Forge Development Team

