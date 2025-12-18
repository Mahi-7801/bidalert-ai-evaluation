# Debugging Data Extraction Issues

## Problem Identified:
❌ Uploaded documents are not showing extracted data correctly

---

## Changes Made for Debugging:

### 1. Added Console Logging to Upload.tsx:
```typescript
// File reading
console.log('File read successfully, length:', result.length);
console.log('First 500 chars:', result.slice(0, 500));

// Before AI analysis
console.log('File text length:', fileText.length);
console.log('First 1000 chars:', fileText.slice(0, 1000));
console.log('Starting AI analysis...');

// After AI analysis
console.log('AI analysis result:', analysisResult);
```

### 2. Added Console Logging to aiService.ts:
```typescript
// Before AI call
console.log('AI Analysis - Document length:', documentText.length);
console.log('AI Analysis - First 500 chars:', documentText.slice(0, 500));
console.log('AI Analysis - Document Type:', documentType);

// After AI response
console.log('AI raw response length:', result.length);
console.log('AI raw response (first 500):', result.slice(0, 500));
console.log('AI parsed result:', JSON.stringify(parsed, null, 2));
```

---

## How to Debug:

### Step 1: Start Dev Server
```bash
npm run dev
```

### Step 2: Open Browser Console
- Press F12 or right-click → Inspect
- Go to "Console" tab

### Step 3: Upload GEM.txt
1. Go to: http://localhost:5173/upload
2. Select: GEM.txt
3. Document type: "Tender Document"
4. Click: "Upload and Analyze"

### Step 4: Check Console Logs

**Look for these logs in order:**

#### 1. File Reading:
```
File read successfully, length: <number>
First 500 chars: <content>
```

**Expected:** Should show GEM bid content with Hindi/English text

**If Empty:** File reading issue or encoding problem

#### 2. Before AI Call:
```
File text length: <number>
First 1000 chars: <content>
Starting AI analysis...
AI Analysis - Document length: <number>
AI Analysis - First 500 chars: <content>
AI Analysis - Document Type: tender
```

**Expected:** Should show document text is being passed to AI

#### 3. AI Response:
```
AI raw response length: <number>
AI raw response (first 500): <JSON content>
AI parsed result: { ... JSON object ... }
```

**Expected:** Should show extracted data JSON

---

## Common Issues & Solutions:

### Issue 1: "File read successfully" but empty content
**Problem:** File encoding issue or binary file

**Solution:** Check if file is actually readable text

### Issue 2: "First 500 chars" shows garbled text
**Problem:** Encoding issue

**Solution:** Change `reader.readAsText(file, 'UTF-8')` to handle encoding better

### Issue 3: "AI raw response" is not JSON
**Problem:** AI didn't follow instructions

**Solution:** Check if document was too long or unclear

### Issue 4: "AI parsed result" shows empty extractedData
**Problem:** AI couldn't extract data from document

**Solution:** Check document format, keywords present

### Issue 5: No console logs at all
**Problem:** JavaScript error or file not uploading

**Solution:** Check for errors in console

---

## Expected Console Output:

### Successful Extraction Should Show:
```javascript
File read successfully, length: 8871
First 500 chars: बड ववरण/Bid Details
बड बंद होने क तारख/समय /Bid End Date/Time 29-08-2025 18:00:00
...
File text length: 8871
Starting AI analysis...
AI Analysis - Document length: 8871
AI Analysis - First 500 chars: बड ववरण/Bid Details
...
AI raw response length: 2847
AI raw response (first 500): {
  "summary": "GeM bid document for procurement...",
  "keyPoints": ["Bid GEM/2025/B/6572913", ...],
  "extractedData": {
    "tenderId": "GEM/2025/B/6572913",
    "department": "Department Of Heavy Industry",
    ...
  },
  ...
}
AI parsed result: {
  "summary": "...",
  "extractedData": {
    "tenderId": "GEM/2025/B/6572913",
    ...
  }
}
```

---

## What to Share When Asking for Help:

If extraction still doesn't work, share:

1. **Console logs** from Step 4 above
2. **"First 500 chars"** output
3. **"AI raw response"** output  
4. **"AI parsed result"** output
5. **Any error messages** in console

---

## Next Steps:

Run the upload test and share console output to identify the exact issue! 🔍

