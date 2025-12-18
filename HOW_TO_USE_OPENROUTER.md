# 🔧 How to Use OpenRouter API for OCR

## **Problem:**
Backend doesn't have OpenAI API keys configured, causing OCR to fail with "Failed to renew cloud API key: Forbidden"

---

## ✅ **Solution: Use OpenRouter API Directly**

### **Step 1: Get OpenRouter API Key**

1. Visit https://openrouter.ai
2. Sign up for an account
3. Go to "Keys" section
4. Create a new API key
5. Copy your API key (starts with `sk-or-v1-...`)

---

### **Step 2: Configure in Code**

Edit `src/lib/insforge.ts`:

```typescript
// Alternative OCR configuration (if backend API keys aren't available)
export const USE_DIRECT_OCR_API = true; // ✅ Change to true
export const OPENROUTER_API_KEY = 'sk-or-v1-your-actual-key-here'; // ✅ Add your key
```

---

### **Step 3: Restart Application**

The OCR will now:
1. Try Gemini model (via Insforge backend)
2. Try GPT-4o (via Insforge backend)
3. **Fallback to OpenRouter API** (if backend APIs fail)

---

## 🎯 **How It Works:**

```
PDF Upload
    ↓
Standard Extraction (finds 0 text - scanned PDF)
    ↓
OCR Triggered
    ↓
Try Gemini → Fail (API key error)
    ↓
Try GPT-4o → Fail (API key error)
    ↓
Try OpenRouter API → ✅ Success!
    ↓
Extract Text → Analyze → Show Results
```

---

## ✅ **Expected Results:**

- ✅ **OCR works** without backend API keys
- ✅ **Extracts text** from scanned PDFs
- ✅ **Shows real data** - Enquiry Number, Tender ID, Value, etc.
- ✅ **Compliance score** - 50-90% based on extracted data

---

## 💰 **OpenRouter Pricing:**

- **Pay-as-you-go** - Only pay for what you use
- **Competitive rates** - Often cheaper than direct API access
- **Multiple models** - Supports GPT-4o, Gemini, Claude, etc.

---

## 🔑 **Alternative: Configure Backend API Keys**

If you prefer to use Insforge backend (no OpenRouter needed):

1. Go to Insforge backend dashboard
2. Configure OpenAI API keys in settings
3. Ensure GPT-4o model is enabled
4. OCR will work automatically

---

**Status: ✅ Ready to use OpenRouter API for OCR!**

