# 🔧 Complete Troubleshooting Guide

## 🎯 **Current Situation:**

Your dev server is running on: **http://localhost:8082/**

You're seeing 400 errors because:
1. **Browser cache** is loading old code
2. **Authentication** might not be properly set up
3. **Database queries** need debugging

---

## ✅ **STEP-BY-STEP FIX (Follow in Order):**

### **STEP 1: Clear Browser Cache** ⚡ **DO THIS FIRST**

#### Option A: Hard Refresh (Fastest)
```
1. Close ALL tabs with localhost
2. Open NEW tab
3. Go to: http://localhost:8082
4. Press: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
5. Wait for page to load completely
```

#### Option B: Clear All Cache (Most Reliable)
```
1. Press: Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
2. Select: "Cached images and files"
3. Time range: "All time"
4. Click: "Clear data"
5. Close browser completely
6. Reopen browser
7. Go to: http://localhost:8082
```

#### Option C: Use Incognito (For Testing)
```
1. Press: Ctrl+Shift+N (Chrome) or Ctrl+Shift+P (Edge)
2. Go to: http://localhost:8082
3. Test from here
```

---

### **STEP 2: Verify Code Is Loaded** 🔍

1. Open **DevTools** (Press F12)
2. Go to **Console** tab
3. Type this and press Enter:
   ```javascript
   window.location.href
   ```
4. Should show: `http://localhost:8082/`
5. Refresh page (Ctrl+R)
6. Look for these messages:
   - ✅ No "Unexpected token" errors
   - ✅ No errors on page load
   - ✅ No red errors at all

---

### **STEP 3: Test Authentication** 🔐

1. On the homepage, click **"Sign in with Google"** or **"Sign in with GitHub"**
2. Complete OAuth authorization
3. Should redirect to Dashboard
4. **Check Console** (F12):
   - Should see no errors
   - If you see 400 errors, continue to Step 4

---

### **STEP 4: Test Document Upload** 📄

#### Create a Test File:

Create a file called `test-document.txt` with this content:

```
GOVERNMENT eSolution MARKETPLACE (GeM)
BID NO: GEM/2025/B/TEST001

PROJECT TITLE: Road Infrastructure Development
DEPARTMENT: Public Works Department
BUDGET: Rs. 5,00,00,000 (Five Crore Rupees)
PROJECT TIMELINE: 12 months

SCOPE OF WORK:
- Construction of 10 km rural road
- Quality standards: IRC specifications
- Include drainage and signage systems
- Bridge construction at 2 locations

TECHNICAL REQUIREMENTS:
- ISO 9001:2015 certification mandatory
- Minimum 10 years experience in road construction
- Previous similar projects completion certificate
- Technical team with minimum 5 qualified civil engineers
- Own machinery and equipment

FINANCIAL REQUIREMENTS:
- Bid security deposit: Rs. 10,00,000
- Performance guarantee: 10% of contract value
- Payment terms: 30-60-90 days milestone-based
- Bank guarantee from scheduled bank

ELIGIBILITY CRITERIA:
- Registered contractor with valid license
- Annual turnover minimum Rs. 10 crores
- PAN and GST registration mandatory
- No litigation or arbitration cases

SUBMISSION DEADLINE: 31st January 2025, 5:00 PM IST
TECHNICAL BID OPENING: 2nd February 2025, 11:00 AM
FINANCIAL BID OPENING: To be announced after technical evaluation

EVALUATION CRITERIA:
- Technical Capability: 70%
- Financial Bid: 30%
- Past Performance: Bonus 5%

CONTACT INFORMATION:
Project Director, Public Works Department
Email: pwd@ap.gov.in
Phone: 1800-XXX-XXXX
```

#### Upload Process:

1. Go to **Upload** page
2. Select document type: **"Tender Document"**
3. Choose your `test-document.txt` file
4. Click **"Upload and Analyze"**
5. Watch the progress bar: 10% → 30% → 60% → 100%
6. **Check Console (F12)**:
   - Look for: `Inserting document: {...}`
   - Should show the document data
   - If you see 400 error, copy the full error message

---

### **STEP 5: Debug 400 Errors** 🐛

If you still see 400 errors:

1. **Open Console** (F12)
2. Look for **red error messages**
3. Click on the error to expand
4. Look for:
   - `Failed to load resource: 400`
   - The URL that failed
   - Any error response

5. **Common causes:**

   **A. Not Signed In:**
   ```
   Solution: Sign in first with Google/GitHub
   ```

   **B. Invalid User ID:**
   ```
   Console should show: "Inserting document: {user_id: 'uuid-here', ...}"
   If user_id is null or undefined, authentication failed
   ```

   **C. Database Column Mismatch:**
   ```
   Check the error message for "column" or "field" errors
   This would indicate a schema issue
   ```

---

### **STEP 6: Test AI Analysis** 🤖

After successful upload:

1. Should see **"AI Analysis Complete"** card
2. Shows:
   - ✅ Summary of document
   - ✅ Key points extracted
   - ✅ Compliance score (0-100%)
   - ✅ Missing clauses
   - ✅ Risk factors

3. If analysis fails:
   - Check Console for: "AI Analysis Error"
   - The error should NOT be about JSON parsing (we fixed that)
   - If it's an API error, check internet connection

---

## 🔍 **Expected Console Output (No Errors):**

```javascript
// When you sign in:
✓ User authenticated
✓ Session created

// When you upload:
Inserting document: {
  user_id: "abc-123-xyz",
  filename: "test-document.txt",
  file_url: "https://...",
  file_key: "...",
  document_type: "tender",
  file_size: 1234,
  status: "analyzed"
}
✓ Document saved
✓ AI analysis complete
✓ Audit log created
```

---

## 🚫 **Common Errors & Fixes:**

### Error 1: "Unexpected token" JSON error
```
Status: ✅ FIXED
Cause: GPT-4o returning markdown-wrapped JSON
Fix: Code now strips ```json``` wrappers
Action: Clear cache and refresh
```

### Error 2: 400 on /api/database/records/documents
```
Status: 🔍 DEBUGGING
Cause: Database insert failing
Check:
1. Are you signed in?
2. Console shows "Inserting document: {...}"?
3. Is user_id present in the object?
```

### Error 3: "Failed to load audit logs"
```
Status: ✅ FIXED
Cause: Empty audit logs table (normal for first-time users)
Fix: Code now handles gracefully
Action: Ignore this error, it's not critical
```

---

## 📊 **Verification Checklist:**

Run through this checklist:

- [ ] Dev server running on http://localhost:8082
- [ ] Browser cache cleared (hard refresh done)
- [ ] Can access homepage without errors
- [ ] Can sign in with Google/GitHub
- [ ] Redirects to Dashboard after sign in
- [ ] Dashboard loads without 400 errors
- [ ] Can navigate to Upload page
- [ ] Can select document type
- [ ] Can choose file
- [ ] Upload button works
- [ ] Progress bar shows
- [ ] AI analysis completes
- [ ] Results display

---

## 🆘 **If Still Not Working:**

1. **Stop the dev server** (Ctrl+C in terminal)

2. **Clear node_modules and reinstall:**
   ```bash
   rm -rf node_modules
   npm install
   npm run dev
   ```

3. **Check your internet connection** (AI requires internet)

4. **Try a different browser** (Chrome, Firefox, Edge)

5. **Check Insforge backend status:**
   - Visit: https://773hc5s6.us-east.insforge.app/
   - Should load (might show 404, that's ok)
   - If it doesn't load at all, backend is down

---

## 📸 **Send Me This Info If Still Failing:**

```bash
# 1. Your console errors (copy all red text)

# 2. Run this in browser console and send output:
navigator.userAgent
window.location.href

# 3. Run this in terminal and send output:
node --version
npm --version

# 4. Check if signed in (in browser console):
localStorage.getItem('insforge-session')
// Should show a token if signed in
// Should show null if not signed in
```

---

## ✅ **Success Indicators:**

You'll know it's working when:

1. ✅ No red errors in console on page load
2. ✅ Can sign in and see Dashboard
3. ✅ Can upload document
4. ✅ See "Inserting document: {...}" in console
5. ✅ Progress bar completes
6. ✅ AI analysis shows results
7. ✅ Can navigate to all pages

---

## 🎯 **Quick Test Script:**

Copy this into browser console after signing in:

```javascript
// Test if authenticated
console.log('Testing authentication...');
const session = localStorage.getItem('insforge-session');
console.log('Session exists:', !!session);

// Test API connection
console.log('Testing API connection...');
fetch('https://773hc5s6.us-east.insforge.app/api/health')
  .then(r => console.log('API Status:', r.status))
  .catch(e => console.log('API Error:', e));

// Check current URL
console.log('Current URL:', window.location.href);
console.log('Expected URL:', 'http://localhost:8082/');
```

---

**Start with STEP 1 (Clear Cache) and work through each step!** 🚀

**Most issues are solved by clearing browser cache!** 💡

