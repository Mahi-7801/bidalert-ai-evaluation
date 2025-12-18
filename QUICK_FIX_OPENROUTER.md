# ⚡ Quick Fix: Use OpenRouter API for OCR

## **To Fix OCR Right Now:**

### **1. Get OpenRouter API Key:**
- Go to: https://openrouter.ai
- Sign up (free account works)
- Copy your API key (starts with `sk-or-v1-...`)

### **2. Update `src/lib/insforge.ts`:**

```typescript
export const USE_DIRECT_OCR_API = true; // ✅ Change this
export const OPENROUTER_API_KEY = 'sk-or-v1-YOUR-KEY-HERE'; // ✅ Add your key
```

### **3. Save and Restart:**
- Save the file
- Restart your dev server
- Upload PDF again

---

## ✅ **What Will Happen:**

1. Tries Gemini model first (via Insforge)
2. Tries GPT-4o (via Insforge)  
3. **Uses OpenRouter API** (your key) → ✅ Works!

---

## 💡 **Example:**

```typescript
// src/lib/insforge.ts
export const USE_DIRECT_OCR_API = true;
export const OPENROUTER_API_KEY = 'sk-or-v1-abc123xyz...'; // Your actual key
```

---

**That's it! OCR will work with your OpenRouter API key!** 🎉

