# BidAnalyzer AI - Quick Start Guide

## ⚡ Get Started in 5 Minutes

This guide will help you quickly set up and test the BidAnalyzer AI platform.

## 📋 Prerequisites

- Node.js 18 or higher
- npm or yarn
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Internet connection

## 🚀 Installation

1. **Navigate to the project directory**
```bash
cd bid-scribe-forge-main
```

2. **Install dependencies** (if not already done)
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:5173
```

## 🔑 Authentication

The app uses OAuth for authentication. You have two options:

### Option 1: Sign in with Google
1. Click "Sign in with Google" button
2. Select your Google account
3. Grant permissions
4. You'll be redirected to the Dashboard

### Option 2: Sign in with GitHub
1. Click "Sign in with GitHub" button
2. Authorize the application
3. You'll be redirected to the Dashboard

## 📖 Testing the Features

### 1️⃣ Upload a Document (2 minutes)

1. **Navigate to Upload page**
   - Click "Upload" in the navigation menu

2. **Select document type**
   - Choose "Request for Proposal (RFP)" from dropdown

3. **Upload a test document**
   - Click "Choose File"
   - Select a PDF, DOC, DOCX, or TXT file (max 10MB)
   - **Test file suggestion:** Use any bid/tender document or create a simple text file

4. **Analyze the document**
   - Click "Upload and Analyze"
   - Watch the progress bar (10% → 30% → 60% → 100%)
   - AI analysis completes in ~20-30 seconds

5. **View AI analysis results**
   - Summary of the document
   - Key points extracted
   - Compliance score (0-100%)
   - Missing clauses
   - Risk factors

### 2️⃣ Explore the Dashboard (1 minute)

1. **Navigate to Dashboard**
   - Click "Dashboard" in the navigation menu

2. **View statistics**
   - Total documents uploaded
   - AI analyzed documents
   - Average compliance score
   - Pending evaluations

3. **Check AI performance metrics**
   - Document processing speed
   - AI accuracy score
   - Compliance detection

4. **Review recent documents**
   - See your uploaded documents
   - View their status and compliance scores

### 3️⃣ Chat with Your Document (2 minutes)

1. **Navigate to Documents page**
   - Click "Documents" in the navigation menu

2. **Select a document**
   - Click on any uploaded document from the list

3. **Ask questions**
   - Type questions in the chat box:
     - "What is the project budget?"
     - "What are the key requirements?"
     - "What are the submission deadlines?"
     - "Summarize the technical specifications"

4. **Get AI responses**
   - GPT-4o analyzes the document context
   - Provides accurate, instant answers
   - All conversations are logged

### 4️⃣ Evaluate a Bid (3 minutes)

1. **Navigate to Evaluation page**
   - Click "Evaluation" in the navigation menu

2. **Select document to evaluate**
   - Choose from your uploaded documents

3. **Customize evaluation criteria** (optional)
   - Technical Compliance: 30%
   - Financial Soundness: 25%
   - Experience & Qualification: 20%
   - Proposed Methodology: 15%
   - Timeline Realism: 10%
   - **Note:** Total must equal 100%

4. **Run AI evaluation**
   - Click "Evaluate Bid"
   - AI processes the document (~10-15 seconds)

5. **View evaluation results**
   - Overall score (0-100)
   - Individual criteria scores
   - Strengths identified
   - Weaknesses identified
   - AI recommendations
   - Confidence level

### 5️⃣ Check Audit Trail (1 minute)

1. **Navigate to Audit Trail page**
   - Click "Audit Trail" in the navigation menu

2. **View activity logs**
   - All document uploads
   - All AI evaluations
   - All AI processing operations
   - Timestamps and user information

3. **Filter logs** (optional)
   - Filter by action type
   - Search through logs
   - View detailed change records

## 🎯 Sample Test Workflow

Here's a complete workflow to test all features:

```
1. Sign in with Google/GitHub (30 seconds)
   ↓
2. Upload a test document (1 minute)
   ↓
3. View Dashboard statistics (30 seconds)
   ↓
4. Chat with the document (1 minute)
   ↓
5. Evaluate the document (1 minute)
   ↓
6. Check Audit Trail (30 seconds)
   ↓
Total: ~5 minutes
```

## 📝 Creating Test Documents

If you don't have bid documents handy, create a simple text file:

**sample-rfp.txt:**
```
PROJECT TITLE: Road Infrastructure Development
DEPARTMENT: Public Works Department
BUDGET: Rs. 50,00,000
TIMELINE: 6 months

SCOPE OF WORK:
- Construction of 5 km rural road
- Quality standards: IRC specifications
- Include drainage systems

TECHNICAL REQUIREMENTS:
- Minimum 10 years experience
- Similar project completion certificate
- ISO 9001 certification

SUBMISSION DEADLINE: January 31, 2025
```

Save this as a `.txt` file and upload it to test the system.

## 🔍 What to Look For

### Document Upload & Analysis
✅ File uploads successfully  
✅ Progress bar shows completion  
✅ AI generates summary  
✅ Compliance score calculated  
✅ Key points extracted  
✅ Missing clauses identified  

### Dashboard
✅ Statistics update in real-time  
✅ Recent documents appear  
✅ AI metrics displayed  
✅ Navigation works smoothly  

### Chat Assistant
✅ Questions generate AI responses  
✅ Responses are contextual  
✅ Chat history maintained  
✅ Response time under 5 seconds  

### Evaluation
✅ Document content loads  
✅ Criteria can be customized  
✅ AI evaluation completes  
✅ Detailed scores provided  
✅ Strengths/weaknesses identified  

### Audit Trail
✅ All actions logged  
✅ Timestamps accurate  
✅ Filtering works  
✅ Search functionality works  

## 🎨 UI/UX Features to Notice

1. **Responsive Design**
   - Try resizing your browser window
   - Works on mobile, tablet, and desktop

2. **Modern UI**
   - Clean, professional interface
   - Intuitive navigation
   - Smooth animations

3. **Real-time Updates**
   - Progress indicators
   - Loading states
   - Toast notifications

4. **Accessibility**
   - Keyboard navigation
   - Screen reader friendly
   - High contrast support

## 🐛 Troubleshooting

### Issue: OAuth not working
**Solution:** 
- Check internet connection
- Try clearing browser cache
- Use incognito/private mode

### Issue: Document upload fails
**Solution:**
- Check file size (max 10MB)
- Verify file format (PDF, DOC, DOCX, TXT)
- Try a different file

### Issue: AI analysis slow
**Solution:**
- Check internet connection
- Wait a bit longer (can take up to 30 seconds)
- Refresh page and try again

### Issue: Chat not responding
**Solution:**
- Make sure document is selected
- Check internet connection
- Refresh page

## 📊 Expected Results

After testing, you should see:

✅ **Document uploaded and analyzed**  
✅ **Compliance score between 0-100%**  
✅ **AI chat providing relevant answers**  
✅ **Bid evaluation with detailed scores**  
✅ **Complete audit trail of all activities**  

## 🎯 Success Indicators

You'll know the system is working when:

1. Documents upload in under 10 seconds
2. AI analysis completes in under 30 seconds
3. Chat responses arrive in under 5 seconds
4. Evaluations complete in under 20 seconds
5. All actions appear in audit trail

## 📞 Need Help?

- **Email:** Hackathon-RTGS@ap.gov.in
- **Documentation:** See README.md
- **Deployment:** See DEPLOYMENT.md
- **Technical Details:** See PROJECT_SUMMARY.md

## 🎉 Next Steps

After testing the basic features:

1. **Try advanced features**
   - Upload multiple documents
   - Compare evaluations
   - Use different criteria weights

2. **Explore the codebase**
   - Check `src/services/aiService.ts` for AI logic
   - Review `src/pages/` for page implementations
   - Examine `src/lib/insforge.ts` for backend config

3. **Customize for your needs**
   - Modify evaluation criteria
   - Add new document types
   - Customize AI prompts

## ✨ Tips for Best Results

1. **Upload quality documents** - Well-structured documents get better AI analysis
2. **Ask specific questions** - The AI chat works best with clear, specific questions
3. **Review AI recommendations** - AI provides insights, but human review is important
4. **Check audit trail regularly** - Maintain transparency and accountability

---

**Quick Start Guide Version 1.0.0**  
*Get started with BidAnalyzer AI in just 5 minutes!*

**Built for:** Government of Andhra Pradesh  
**Contact:** Hackathon-RTGS@ap.gov.in

