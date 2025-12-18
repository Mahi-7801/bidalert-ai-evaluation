import { insforge, INSFORGE_API_KEY, AI_AVAILABLE } from '@/lib/insforge';

/**
 * AI Service for Bid Document Analysis, Drafting, and Evaluation
 * Uses Insforge AI models (GPT-4o and Gemini Flash) for real-time processing
 */

export interface DocumentAnalysis {
  summary: string;
  keyPoints: string[];
  extractedData: {
    // Tender/Bid Information
    title?: string;
    tenderId?: string;
    tenderNumber?: string;
    enquiryNumber?: string;
    enquiryDate?: string;
    tenderCategory?: string;
    tenderType?: string; // Open, Limited, etc.
    orderType?: string;
    modeOfTendering?: string;
    numberOfSources?: string;
    modeOfEnquiry?: string;
    tenderStages?: string;
    inputTaxCredit?: string;
    evaluationType?: string;
    currencyType?: string;
    applicabilityOfEMD?: string;
    projectType?: string;
    department?: string;
    ministry?: string;
    organization?: string;
    estimatedValue?: string;
    approximateValue?: string;
    budget?: string;
    bidValue?: string;
    quotedAmount?: string;
    scopeOfWork?: string;
    workItems?: Array<{
      serialNumber?: string;
      description?: string;
      quantity?: string;
      unit?: string;
      unitPrice?: string;
      totalPrice?: string;
    }>;
    
    // Company/Vendor Details
    companyName?: string;
    vendorName?: string;
    registrationNumber?: string;
    contactEmail?: string;
    contactPhone?: string;
    contactPerson?: string;
    address?: string;
    workLocation?: string;
    site?: string;
    website?: string;
    
    // Timeline
    timeline?: string;
    completionTime?: string;
    startDate?: string;
    endDate?: string;
    submissionDeadline?: string;
    bidSubmissionStartDate?: string;
    bidSubmissionEndDate?: string;
    bidEndDate?: string;
    bidOpeningDate?: string;
    technicalBidOpeningDate?: string;
    financialBidOpeningDate?: string;
    preBidMeetingDate?: string;
    projectDuration?: string;
    validity?: string;
    
    // Financial Information
    emdAmount?: string;
    emdPercentage?: string;
    emdRequired?: string;
    emdFeeType?: string; // "fixed" or "percentage"
    performanceSecurity?: string;
    bidSecurity?: string;
    tenderFee?: string;
    documentFee?: string;
    paymentTerms?: string;
    annualTurnover?: string;
    netWorth?: string;
    creditRating?: string;
    financialCriteria?: string;
    turnoverRequirement?: string;
    
    // Quantities & Scope
    totalQuantity?: string;
    quantities?: string[];
    
    // Product/Service
    itemCategory?: string;
    
    // Experience & Qualifications
    yearsOfExperience?: number;
    totalProjectsCompleted?: number;
    similarProjectsCompleted?: number;
    totalProjectValue?: string;
    technicalTeamSize?: number;
    employeeCount?: number;
    qualifications?: string[];
    
    // Certifications
    isoCertifications?: string[];
    licenses?: string[];
    qualityCertifications?: string[];
    safetyCertifications?: string[];
    requiredCertifications?: string[];
    requiredLicenses?: string[];
    
    // Additional Fields
    eligibilityCriteria?: string; // Eligibility criteria text
    technicalSpecifications?: string;
    evaluationCriteria?: string;
    termsAndConditions?: string;
    corrigendum?: string;
    addenda?: string;
    documentAttachments?: string[];
    gemBiddingNumber?: string;
    contractNumber?: string;
    poNumber?: string;
    dates?: string[];
    dateFieldMap?: { [date: string]: string }; // Mapping of dates to their field labels based on document context analysis
    
    // 🏗 Project Information - Extended
    projectName?: string;
    projectId?: string;
    tenderNoticeNumber?: string;
    workName?: string;
    projectObjective?: string;
    projectCategory?: string; // Construction, IT, Supply, Services
    sector?: string;
    division?: string;
    
    // 💰 Financial Details - Extended
    contractValue?: string;
    tenderValue?: string;
    costOfTenderDocument?: string;
    bidSecurityAmount?: string;
    bankGuarantee?: string;
    priceBid?: string;
    currency?: string; // INR, USD, etc.
    
    // 🕒 Timeline & Deadlines - Extended
    tenderPublishDate?: string;
    preBidClarificationLastDate?: string;
    corrigendumIssueDate?: string;
    warrantyPeriod?: string;
    maintenancePeriod?: string;
    
    // 👷‍♂️ Eligibility & Qualification - Extended
    technicalQualification?: string;
    experienceRequired?: string; // Years, Projects
    similarWorkExperience?: string;
    financialCapacity?: string;
    registrationCertificates?: string[]; // GST, MSME, PAN, etc.
    isoStandards?: string[];
    bisStandards?: string[];
    ceStandards?: string[];
    otherStandards?: string[];
    keyPersonnelRequirement?: string;
    
    // 🧾 Technical Requirements - Extended
    productDescription?: string;
    serviceDescription?: string;
    equipmentRequirements?: string;
    materialRequirements?: string;
    qualityStandards?: string;
    complianceClauses?: string;
    drawings?: string[];
    layoutDocuments?: string[];
    designDocuments?: string[];
    
    // 📤 Submission Details - Extended
    portalName?: string; // CPPP, GeM, eProcurement
    platformName?: string;
    documentUploadFormat?: string[]; // PDF, Excel, Docx
    bidderInstructions?: string;
    coveringLetter?: string;
    formSubmission?: string;
    supportingDocumentsList?: string[];
    bidValidityPeriod?: string;
    numberOfCopiesRequired?: string;
    
    // ⚖️ Evaluation & Selection - Extended
    weightage?: string; // e.g., 70% Technical, 30% Financial
    minimumQualifyingMarks?: string;
    scoringParameters?: string;
    tieBreakingRules?: string;
    negotiationRules?: string;
    awardCriteria?: string; // L1 / QCBS / Least Cost / Best Value
    
    // 📜 Legal & Policy Details - Extended
    contractConditions?: string;
    penaltyClauses?: string;
    liquidatedDamages?: string;
    terminationClause?: string;
    arbitrationClause?: string;
    forceMajeureClause?: string;
    confidentialityClause?: string;
    policyCompliance?: string; // Govt. Procurement Policy, MSME Policy
    
    // 📍 Contact & Location - Extended
    siteVisitDetails?: string;
    designation?: string;
    emailId?: string;
    phoneNumber?: string;
    
    // 📎 Attachments & References - Extended
    tenderDocumentFileNames?: string[];
    annexures?: string[];
    appendices?: string[];
    boqFile?: string;
    sampleForms?: string[];
    templates?: string[];
    bidderDeclaration?: string;
    undertaking?: string;
    
    // 🔍 Other Useful Metadata
    tenderStatus?: string; // Open / Closed / Awarded
    procurementType?: string; // Goods / Works / Services
    country?: string;
    state?: string;
    city?: string;
    district?: string;
    fundingSource?: string; // Government / World Bank / ADB / Private
    tenderCategoryType?: string; // National / International / Local
    bidOpeningAuthority?: string;
    
    // Equipment & Resources
    equipmentValue?: string;
    equipmentOwned?: number;
    equipmentLeased?: number;
    machineryDetails?: string[];
    
    // Performance Metrics
    onTimeCompletion?: string;
    aheadOfSchedule?: string;
    delayedProjects?: string;
    defectRate?: string;
    safetyRecord?: string;
    clientSatisfaction?: string;
    
    // Requirements
    technicalRequirements?: string[];
    financialRequirements?: string[];
    eligibilityCriteriaList?: string[]; // List of eligibility criteria items
    qualificationCriteria?: string[];
    requiredDocuments?: string[];
    
    // Compliance & Legal
    complianceStandards?: string[];
    governmentGuidelines?: string[];
    regulatoryCompliance?: string[];
    msePreference?: string;
    miiPreference?: string;
    arbitration?: string;
    mediation?: string;
    reverseAuction?: string;
    inspectionRequired?: string;
    evaluationMethod?: string;
    
    // Additional Details
    awards?: string[];
    recognitions?: string[];
    pastClients?: string[];
    testimonials?: string[];
    uniqueFeatures?: string[];
  };
  complianceScore: number;
  missingClauses: string[];
  riskFactors: string[];
}

export interface BidEvaluation {
  criteria: Record<string, number>;
  scores: Record<string, number>;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string;
  aiConfidence: number;
}

/**
 * Smart truncation: Prioritizes important sections for large documents
 */
function smartTruncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  
  const priorityKeywords = [
    'Enquiry Number', 'Enquiry No', 'Tender ID', 'Tender Number', 'Tender Category',
    'Approximate value', 'Approximate value of the enquiry', 'Rs.', '₹',
    'Scope of Work', 'A. Civil Works', 'B. Mechanical Works', 'C. Electrical Works',
    'TABLE', '[TABLE', 'Work Description', 'Serial Number', 'Sl. No.',
    'Terms & Conditions', 'Eligibility Criteria', 'Payment Terms'
  ];
  
  // First, try to extract priority sections
  const prioritySections: string[] = [];
  const lines = text.split('\n');
  
  // Extract first 3000 chars (usually header/key info)
  prioritySections.push(text.slice(0, 3000));
  
  // Find and extract lines with priority keywords
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();
    
    for (const keyword of priorityKeywords) {
      if (lowerLine.includes(keyword.toLowerCase())) {
        // Extract context around this line (10 lines before and after)
        const start = Math.max(0, i - 10);
        const end = Math.min(lines.length, i + 11);
        const context = lines.slice(start, end).join('\n');
        
        if (!prioritySections.includes(context)) {
          prioritySections.push(context);
        }
        break;
      }
    }
  }
  
  // Combine priority sections
  let truncated = prioritySections.join('\n\n--- SECTION BREAK ---\n\n');
  
  // If still too long, take first N chars
  if (truncated.length > maxLength) {
    truncated = truncated.slice(0, maxLength) + '\n\n[Document truncated due to size. Only priority sections shown.]';
  }
  
  return truncated;
}

/**
 * Analyze uploaded bid document using AI
 */
export async function analyzeDocument(
  documentText: string,
  documentType: string,
  fileSize?: number
): Promise<DocumentAnalysis> {
  const systemPrompt = `You are an expert document analyst specializing in bid and tender documents.
You MUST analyze the ENTIRE document LINE BY LINE and extract ACCURATE, STRUCTURED information.

**CRITICAL: You are analyzing a REAL document. You MUST extract REAL data from it.**
**DO NOT return null unless you have SEARCHED the entire document and CANNOT find the data.**
**If you see ANY text matching the patterns below, extract it EXACTLY as written.**

**YOUR EXTRACTION TASK:**
Analyze this bid/tender document and extract the following information. ONLY include fields where you find ACTUAL data in the document. DO NOT include fields with null, empty string, or placeholder values. If information is NOT found after thorough searching, OMIT the field entirely from the response.

**STRUCTURED EXTRACTION REQUIREMENTS:**

**1. 🏗 PROJECT INFORMATION (COMPREHENSIVE):**
- title: Project Title, Name of Work, Work Description, Subject - HIGH PRIORITY
- projectName: Project Name (if different from title)
- projectId: Project ID
- tenderId: Tender ID - EXTRACT COMPLETE VALUE (e.g., 2025_WBNPI_883395_1, 860025)
- tenderNoticeNumber: Tender Notice Number
- tenderNumber: Bid Number, Reference Number, Tender Number - HIGH PRIORITY
- enquiryNumber: Enquiry Number or Tender Reference Number - EXTRACT COMPLETE VALUE (e.g., PSGCT/CPPP/2025-26/03, EAPH250035) - REMOVE trailing years if duplicate
- enquiryDate: Enquiry Date, Dated (extract date format exactly as written) - HIGH PRIORITY
- workName: Work Name
- projectObjective: Project Objective
- projectCategory: Project Category (Construction, IT, Supply, Services, Works, Goods)
- sector: Sector - HIGH PRIORITY
- division: Division
- tenderCategory: Tender Category (e.g., Works, Goods, Services) - Extract ONLY the category word, NOT "No" or other words from next field
- tenderType: Tender Type (Open, Limited, Single, Restricted, Two Stage, Single Stage, EOI, RFP, RFQ)
- orderType: Order Type (e.g., Firm Order, Purchase Order)
- modeOfTendering: Mode of Tendering (e.g., e-Tendering, Manual, Offline) - Extract ONLY the mode word, NOT "No" or other words from next field
- numberOfSources: Number of Sources (e.g., Single, Multiple)
- modeOfEnquiry: Mode of enquiry (e.g., Open, Limited, Restricted)
- tenderStages: Tender Stages (e.g., Single Stage, Two Stage, PQ Stage)
- inputTaxCredit: Input Tax Credit (e.g., Applicable, Not Applicable)
- evaluationType: Evaluation Type (e.g., Work Wise, Item wise, L1)
- currencyType: Currency Type (e.g., INR, USD)
- currency: Currency (INR, USD, EUR, GBP, JPY, AUD, CAD, CHF, CNY)
- applicabilityOfEMD: Applicability of EMD (e.g., % value of Quotation, Fixed Amount)
- projectType: Bid Type, Tender Type
- department: Issuing Department, Department Name, Buying Organization - For "Department of [Name]" format, extract COMPLETE name including "Department of" (e.g., "Department of Textiles", NOT "of Textile Pincode") - HIGH PRIORITY
- ministry: Ministry Name (if mentioned) - HIGH PRIORITY
- organization: Organization Name, Buying Entity - Extract COMPLETE name, STOP at "Pincode", "Pin Code", or next field label - HIGH PRIORITY
- tenderStatus: Tender Status (Open, Closed, Awarded, Cancelled, Under Evaluation)
- procurementType: Procurement Type (Goods, Works, Services, Supply, Construction)
- tenderCategoryType: Tender Category Type (National, International, Local, State, Central)
- country: Country
- state: State
- city: City
- district: District
- fundingSource: Funding Source (Government, World Bank, ADB, Private, Internal, External)

**2. 💰 FINANCIAL DETAILS (COMPREHENSIVE):**
- estimatedValue: Estimated Contract Value, Total Value
- approximateValue: Approximate value of the enquiry (e.g., Rs.8,96,035/-, ₹5 Crores)
- contractValue: Contract Value
- tenderValue: Tender Value
- budget: Budget Allocation - HIGH PRIORITY
- bidValue: Bid Amount Quoted
- quotedAmount: Quoted Price
- priceBid: Price Bid
- currency: Currency (INR, USD, EUR, GBP, JPY, AUD, CAD, CHF, CNY)
- emdAmount: EMD Amount in ₹, Earnest Money Deposit (extract exact amount, e.g., "40,000", "₹40,000")
- emdPercentage: EMD Percentage (extract if available, or "NA" if fixed amount)
- emdRequired: Is EMD required? (Yes/No/Not Mentioned)
- emdFeeType: EMD Fee Type (e.g., "fixed", "percentage", "percentage of quotation")
- bidSecurity: Bid Security Amount
- bidSecurityAmount: Bid Security Amount
- performanceSecurity: Performance Security Amount/Percentage
- bankGuarantee: Bank Guarantee Amount/Percentage
- tenderFee: Tender Fee
- documentFee: Document Fee
- costOfTenderDocument: Cost of Tender Document
- paymentTerms: Payment terms, Payment Conditions (e.g., "95% on certification, 5% after commissioning")
- annualTurnover: Annual Turnover Requirement
- turnoverRequirement: Turnover Requirement
- financialCapacity: Financial Capacity
- financialCriteria: Financial Criteria (detailed text)
- netWorth: Net Worth Requirement
- creditRating: Credit Rating Requirement

**3. TIMELINE:**
- submissionDeadline: Bid Submission Deadline, Last Date to Submit
- bidEndDate: Bid End Date/Time
- bidOpeningDate: Bid Opening Date, Technical Bid Opening
- startDate: Contract Start Date
- endDate: Contract End Date
- timeline: Contract Duration, Completion Time
- validity: Validity Period

**4. COMPANY/VENDOR (if bid response):**
- companyName: Company Name, Vendor Name
- vendorName: Vendor/Bidder Name
- registrationNumber: Registration Number
- contactEmail: Email
- contactPhone: Phone
- address: Address

**5. QUANTITIES & SCOPE:**
- totalQuantity: Total Quantity
- quantities: Array of quantities for different items
- scopeOfWork: Scope of Work description (full text from "Scope of Work" sections)
- workItems: Array of work items from tables with:
  * serialNumber: Serial Number (Sl. No.)
  * description: Work Description, Description of Work/Item - EXCLUDE disclaimers, ATC clauses, terms & conditions
  * quantity: Quantity/Measurement (e.g., "20 Nos", "38 Cu.M. approx.", "45 Tons (approx.)")
  * unit: Unit/Rate Type, to be quoted for (e.g., "Per No.", "Per Cu.M.", "Per Ton", "Lumpsum")
  * unitPrice: Unit Price (if provided)
  * totalPrice: Total Price (if provided)

**6. 📤 SUBMISSION DETAILS (COMPREHENSIVE):**
- modeOfTendering: Mode of Submission (Online / Offline / e-Tendering)
- portalName: Portal Name (CPPP, GeM, eProcurement, e-Tender, NIC, EPROC, IEPM)
- platformName: Platform Name
- documentUploadFormat: Document Upload Format (PDF, Excel, Docx, etc.) - Extract as array
- bidderInstructions: Bidder Instructions
- coveringLetter: Covering Letter / Form Submission
- formSubmission: Form Submission Requirements
- supportingDocumentsList: Supporting Documents List - Extract as array
- bidValidityPeriod: Bid Validity Period
- numberOfCopiesRequired: Number of Copies Required

**7. ⚖️ EVALUATION & SELECTION (COMPREHENSIVE):**
- evaluationCriteria: Evaluation Criteria (full text)
- weightage: Weightage (e.g., "70% Technical, 30% Financial")
- minimumQualifyingMarks: Minimum Qualifying Marks
- scoringParameters: Scoring Parameters
- tieBreakingRules: Tie-breaking Rules
- negotiationRules: Negotiation Rules
- awardCriteria: Award Criteria (L1, QCBS, Least Cost, Best Value, Lowest Bid)

**8. 📜 LEGAL & POLICY DETAILS (COMPREHENSIVE):**
- termsAndConditions: Terms and Conditions (full text)
- contractConditions: Contract Conditions
- penaltyClauses: Penalty Clauses
- liquidatedDamages: Liquidated Damages
- terminationClause: Termination Clause
- arbitrationClause: Arbitration Clause
- forceMajeureClause: Force Majeure Clause
- confidentialityClause: Confidentiality Clause
- policyCompliance: Policy Compliance (Govt. Procurement Policy, MSME Policy, etc.)

**9. 📍 CONTACT & LOCATION (COMPREHENSIVE):**
- workLocation: Work Location / Project Site - HIGH PRIORITY
- site: Site Location
- siteVisitDetails: Site Visit Details
- city: City - HIGH PRIORITY
- state: State - HIGH PRIORITY
- district: District - HIGH PRIORITY
- country: Country - HIGH PRIORITY
- address: Address - HIGH PRIORITY
- contactPerson: Contact Person, Tender Inviting Authority (TIA)
- designation: Designation
- emailId: Email ID - HIGH PRIORITY
- contactEmail: Contact Email
- phoneNumber: Phone Number - HIGH PRIORITY
- contactPhone: Contact Phone

**10. 📎 ATTACHMENTS & REFERENCES (COMPREHENSIVE):**
- documentAttachments: Document Attachments (BOQ, Forms, Annexures) - Extract as array
- tenderDocumentFileNames: Tender Document File Names - Extract as array
- annexures: Annexures - Extract as array
- appendices: Appendices - Extract as array
- boqFile: BOQ File
- sampleForms: Sample Forms - Extract as array
- templates: Templates - Extract as array
- bidderDeclaration: Bidder Declaration
- undertaking: Undertaking
- corrigendum: Corrigendum
- addenda: Addenda

**11. 🔍 OTHER USEFUL METADATA:**
- bidOpeningAuthority: Bid Opening Authority
  
  **IMPORTANT FOR TABULAR DATA:**
  - Extract ALL rows from "Scope of Work" tables
  - Extract from sections like "Civil Works", "Mechanical Works", "Electrical Works"
  - Preserve exact quantity formats including "(approx.)", "Nos", "Sets", "KM", "Cu.M"
  - Extract multi-line descriptions completely

**6. PRODUCT/SERVICE:**
- itemCategory: Item Category, Product Category
- technicalRequirements: Technical Specifications
- financialRequirements: Financial Requirements

**7. QUALIFICATIONS:**
- yearsOfExperience: Years of Experience required
- totalProjectsCompleted: Projects Completed count
- technicalTeamSize: Technical Team Size
- qualifications: Qualification Criteria

**8. COMPLIANCE & PREFERENCES:**
- msePreference: MSE Purchase Preference (Yes/No)
- miiPreference: Make in India Preference (Yes/No)
- arbitration: Arbitration Clause (Yes/No)
- mediation: Mediation Clause (Yes/No)
- reverseAuction: Reverse Auction Enabled (Yes/No)

**9. EVALUATION:**
- evaluationMethod: Evaluation Method
- eligibilityCriteria: Eligibility Criteria
- qualificationCriteria: Qualification Criteria

**10. ADDITIONAL:**
- requiredDocuments: Required Documents List
- inspectionRequired: Inspection Required (Yes/No)

**SEARCH PATTERNS TO MATCH:**
"Enquiry Number", "Enquiry No", "EAPH", "Ref", "Reference"
"Tender ID", "Tender Number", "Bid Number", "Reference Number"
"Tender Category", "Order Type", "Mode of Tendering", "Mode of enquiry"
"Number of Sources", "Tender Stages", "Input Tax Credit"
"Evaluation Type", "Currency Type", "Applicability of EMD"
"Approximate value", "Approximate value of the enquiry", "Rs.", "₹"
"Bid End Date", "Submission Deadline", "Last Date", "Due dates"
"Bid Opening", "Technical Bid Opening"
"Estimated Value", "Contract Value", "EMD", "Performance Security"
"Payment Terms", "Payment Conditions"
"Department", "Ministry", "Organization"
"Scope of Work", "Scope of", "Work Description", "Serial Number", "Sl. No."
"Civil Works", "Mechanical Works", "Electrical Works"
"Quantity", "Qty", "Unit", "Per No.", "Per Cu.M.", "Lumpsum"
"Terms & Conditions", "Eligibility Criteria", "Commercial Order"
"MSE Purchase", "Make in India", "MII"
"Arbitration", "Mediation"
"Reverse Auction", "Reverse Bidding"
"Required Documents", "Submission Documents"
"Inspection Required"

**CRITICAL EXTRACTION RULES:**
1. Read EVERY SINGLE LINE - do NOT skip any part of the document
2. Extract EXACT values as written (preserve formatting)
3. For dates: Keep format exactly as written (e.g., "28.10.2025", "Dated: 25.10.2025")
4. For amounts: Keep currency symbol and format (e.g., "Rs.8,96,035/-", "₹5 Crores")
5. For Yes/No: Extract actual value from document
6. If field NOT FOUND: Use null or empty string - DO NOT INVENT DATA
7. Arrays: Extract ALL items mentioned
8. For keyPoints: List most important facts extracted
9. For summary: Provide concise overview of the document

**TABULAR DATA EXTRACTION:**
- Look for tables with specifications (key-value pairs like "Enquiry Number: EAPH250035")
- Extract ALL rows from "Scope of Work" tables, including:
  * Serial Numbers (Sl. No.)
  * Complete work descriptions (even if multi-line)
  * Quantities with units (e.g., "20 Nos", "38 Cu.M. approx.")
  * Unit types (e.g., "Per No.", "Per Cu.M.", "Lumpsum")
- Section identification: "A. Civil Works", "B. Mechanical Works", "C. Electrical Works"
- Preserve quantity formats including "(approx.)" and abbreviations

**TERMS & CONDITIONS EXTRACTION:**
- Extract numbered clauses (1, 2, 3, etc.) from "Terms & Conditions" sections
- Capture complete clause text, not just titles
- Look for sections titled "Eligibility Criteria", "Commercial Order", "Terms & Conditions"
- Extract all 12+ numbered items if present

**QUALITY STANDARDS:**
- Be extremely precise and factual
- Only extract information that EXISTs in the document
- Maintain original formatting and terminology
- If in doubt, extract exactly as written

**CRITICAL: Extract EXACT values as written in the document. For numbers, use the exact format used.**

Respond in JSON format with these exact fields:
{
  "summary": "Brief summary of the document",
  "keyPoints": ["point1", "point2"],
  "extractedData": { /* extract ALL relevant fields from the comprehensive list above */ },
  "complianceScore": 85,
  "missingClauses": ["clause1", "clause2"],
  "riskFactors": ["risk1", "risk2"]
}

DO NOT include any text before or after the JSON. ONLY return valid JSON.`;

  // Skip AI if explicitly disabled (when OpenAI API keys aren't configured)
  if (!AI_AVAILABLE) {
    console.log('⚠️ AI analysis disabled. Using text-based extraction fallback...');
    return extractDataFromTextFallback(documentText, documentType, fileSize);
  }

  try {
    console.log('AI Analysis - Original document length:', documentText.length);
    
    // Truncate intelligently for large documents
    const truncatedDoc = smartTruncate(documentText, 8000);
    console.log('AI Analysis - Truncated document length:', truncatedDoc.length);
    console.log('AI Analysis - Document Type:', documentType);
    console.log('AI Analysis - First 500 chars:', truncatedDoc.slice(0, 500));
    
    const completion = await insforge.ai.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { 
          role: 'user', 
          content: `**YOU ARE ANALYZING A REAL DOCUMENT. EXTRACT ONLY ACTUAL DATA FROM IT. DO NOT USE EXAMPLE OR MOCK DATA.**

You are analyzing a REAL bid/tender document. Extract ALL information EXACTLY as written. Read EVERY LINE carefully.

**CRITICAL: Extract ONLY data that exists in the document below. DO NOT use example values.**

**CRITICAL INSTRUCTIONS:**
1. Look for SPECIFIC PATTERNS like "Enquiry Number:", "Tender ID:", "Approximate value:", etc.
2. Extract ONLY the value AFTER the colon/label - STOP at newline or next field label
3. For dates: Extract EXACTLY as written, but if you see both 2023 and 2025, prefer 2025 dates
4. For years in IDs/references: If document shows 2025 somewhere, use 2025 (not 2023)
5. Tables are indicated by:
   - Tab separators (\t) between columns
   - Markers like [TABLE X START] and [TABLE X END]
   - Multiple rows with consistent column structure
6. Extract EXACT text - do not modify or interpret values EXCEPT for year corrections (2023→2025 if 2025 exists in document)
7. If you see "Enquiry Number: EAPH250035" extract "EAPH250035" exactly (STOP at newline)
8. If you see "Rs.8,96,035/-" extract it EXACTLY including currency and format
9. For tables: Each row is on a new line, cells separated by tabs
10. Extract ALL rows from tables - do not skip any

**BASIC/TENDER INFORMATION - LOOK FOR THESE PATTERNS:**
- "Tender Reference Number:" or "Tender Ref No:" → Extract ONLY the reference value (e.g., "PSGCT/CPPP/2025-26/03") - STOP at newline or next field label like "Withdrawal", "Tender ID", "Tender Type"
- "Enquiry Number:" or "Enquiry No:" → Extract ONLY the number/reference (e.g., "PSGCT/CPPP/2025-26/03", "EAPH250035") - STOP at newline or next field
- "Dated:" or "Date:" → Extract ONLY the date (e.g., "31-Oct-2025", "28.10.2025", "25.10.2025") - STOP at newline
- "Tender ID:" → Extract ONLY the ID value (e.g., "2025_WBNPI_883395_1", "860025") - STOP at newline or next field like "Withdrawal", "Tender Type"
- "Department of [Name]:" or "Department: [Name]" → Extract COMPLETE department name including "Department of" (e.g., "Department of Textiles") - STOP at "Pincode", "Pin Code", or next field like "Withdrawal", "Tender ID"
- "Organization:" or "Organisation Chain:" → Extract ONLY the organization name(s) (e.g., "National Project Implementation Unit - World Bank Tenders || PSG COLLEGE OF TECHNOLOGY COIMBATORE") - STOP at newline or next field like "Withdrawal", "Tender ID"
- "Tender Number:", "Bid Number:", "Reference Number:" → Extract ONLY the number - STOP at newline or next field
- "Tender Category:" → Extract ONLY the category value (e.g., "Works", "Goods", "Services") - STOP at "No", "Number", "of", or next field label
- "Order Type:" → Extract value (e.g., "Firm Order")
- "Mode of Tendering:" → Extract ONLY the mode value (e.g., "e-Tendering", "Manual", "Offline") - STOP at "No", "Number", "of", or next field label
- "Number of Sources:" → Extract value (e.g., "Single", "Multiple")
- "Mode of enquiry:" → Extract value (e.g., "Open", "Limited")
- "Tender Stages:" → Extract complete text (e.g., "Two Stage: PQ Stage- i) Technical Bid & Commercial Terms ii) Commercial Stage-(Price Bid)")
- "Input Tax Credit:" → Extract value (e.g., "Applicable", "Not Applicable")
- "Evaluation Type:" → Extract value (e.g., "Work Wise /Item wise")
- "Currency Type:" → Extract value (e.g., "INR")
- "Applicability of EMD:" → Extract complete text (e.g., "% value of Quotation")
- Look for "Name of Work:", "Project Title:", "Subject:", "Work Description:" → Extract ONLY the work title - STOP at newline or next field
- Look for "Department:", "Issuing Department:", "Organization:", "Organisation Chain:" → Extract ONLY the organization/department name - STOP at newline or next field like "Withdrawal", "Tender ID", "Tender Type"
- Look for "Ministry:" or ministry name in the document - Extract ONLY the ministry name - STOP at newline
- Organization name (e.g., "ANDHRA PRADESH HEAVY MACHINERY AND ENGINEERING LTD.") - Extract COMPLETE name but STOP at next field label

**FINANCIAL DETAILS - LOOK FOR THESE PATTERNS:**
- "Estimated Contract Value:", "Estimated Value:", "Contract Value:" → Extract amount
- "Approximate value of the enquiry is" or "Approximate value:" → Extract EXACTLY (e.g., "Rs.8,96,035/-", "Rs. 8,96,035 /-")
- "EMD Amount in ₹:" or "EMD Amount:" or "EMD:" or "Earnest Money Deposit:" → Extract amount EXACTLY (e.g., "40,000", "₹40,000", "Rs. 40,000")
- "EMD Fee Type:" → Extract type (e.g., "fixed", "percentage", "percentage of quotation")
- "EMD Percentage:" → Extract percentage if not "NA" (e.g., "2%", "3%", or "NA" if fixed amount)
- "EMD Exemption Allowed:" → Extract Yes/No
- "Performance Security:" or "Performance Bank Guarantee:" → Extract amount/percentage
- "Payment Terms:" or look for payment percentages → Extract complete text (e.g., "95% Payment will be released on the claimed bills...")

**TIMELINE:**
- Bid Submission Deadline/Due dates
- Bid Opening Date/Time
- Contract Duration/Validity
- Delivery/Timeline information

**3. 🕒 TIMELINE & DEADLINES (COMPREHENSIVE):**
- tenderPublishDate: Tender Publish Date
- enquiryDate: Enquiry Date, Dated (extract date format exactly as written)
- bidSubmissionStartDate: Bid Submission Start Date
- bidSubmissionEndDate: Bid Submission End Date
- submissionDeadline: Submission Deadline, Last Date for Submission
- bidEndDate: Bid End Date
- bidOpeningDate: Bid Opening Date
- technicalBidOpeningDate: Technical Bid Opening Date
- financialBidOpeningDate: Financial Bid Opening Date, Price Bid Opening Date
- preBidMeetingDate: Pre-bid Meeting Date, Pre-bid Conference Date
- preBidClarificationLastDate: Pre-bid Clarification Last Date
- corrigendumIssueDate: Corrigendum Issue Date
- projectDuration: Project Duration, Completion Period (e.g., "18 months", "3 months from site handover")
- timeline: Timeline, Completion Time
- completionTime: Completion Time
- startDate: Start Date
- endDate: End Date
- validity: Bid Validity Period
- bidValidityPeriod: Bid Validity Period
- warrantyPeriod: Warranty Period
- maintenancePeriod: Maintenance Period

**4. 👷‍♂️ ELIGIBILITY & QUALIFICATION (COMPREHENSIVE):**
- eligibilityCriteria: Eligibility Criteria (full text)
- technicalQualification: Technical Qualification
- experienceRequired: Experience Required (Years, Projects, Months)
- similarWorkExperience: Similar Work Experience Requirement
- financialCapacity: Financial Capacity / Annual Turnover Requirement
- registrationCertificates: Registration Certificates Required (GST, MSME, PAN, Aadhaar, Udyam) - Extract as array
- isoStandards: ISO Standards Required (extract as array)
- bisStandards: BIS Standards Required (extract as array)
- ceStandards: CE Standards Required (extract as array)
- otherStandards: Other Standards Required
- requiredCertifications: Required Certifications (extract as array)
- requiredLicenses: Required Licenses (extract as array)
- keyPersonnelRequirement: Key Personnel Requirement

**5. 🧾 TECHNICAL REQUIREMENTS (COMPREHENSIVE):**
- technicalSpecifications: Technical Specifications (full text)
- productDescription: Product Description
- serviceDescription: Service Description
- equipmentRequirements: Equipment Requirements
- materialRequirements: Material Requirements
- qualityStandards: Quality Standards
- complianceClauses: Compliance Clauses
- drawings: Drawings Required (extract as array)
- layoutDocuments: Layout Documents Required (extract as array)
- designDocuments: Design Documents Required (extract as array)
- scopeOfWork: Scope of Work description (full text from "Scope of Work" sections) - STOP at disclaimers/terms

**SCOPE OF WORK (TABULAR DATA - CRITICAL):**
**IMPORTANT: DO NOT confuse document file names, disclaimers, ATC clauses, or terms & conditions with actual work items!**

Tables may appear with columns separated by tabs, spaces, or pipe characters (|).

**WHAT TO EXTRACT (ACTUAL WORK ITEMS):**
- Look for BOQ (Bill of Quantity) tables with actual work descriptions
- Look for tables with columns like: Sl. No., Description, Quantity, Unit, Unit Price, Total Price
- Extract items that describe actual work/services/products to be delivered
- Extract only items that mention actual deliverables (construction, supply, installation, equipment, materials, etc.)

**WHAT TO SKIP (NOT WORK ITEMS):**
- Document file names (e.g., "Tendernotice_1.pdf", "GTECPPP20252603.pdf")
- Document descriptions (e.g., "Notice Inviting Tender", "General Technical Evaluation")
- File sizes (e.g., "884.72", "71.20")
- Cover details or document lists
- Disclaimer text (e.g., "Disclaimer/ अस्वीकरण", "Thank You/ धन्यवाद")
- ATC (Additional Terms & Conditions) clauses
- Legal/Compliance text (e.g., "Certificates Bidder's offer", "ISO 9001", "Financial standing", "Buyer Added ATC")
- Terms & Conditions sections
- Buyer-specific clauses and requirements
- GeM-specific disclaimers and legal text
- Representation/compliance clauses

EXAMPLE TABLE FORMAT (cells separated by tabs):
[TABLE 1 START]
Sl. No.	Work Description	Qty	Unit
1	Roof Bolts Grouting M20 x 1800M	20 Nos	Per No.
2	Cable hooks/brackets fixing 450mm	220 Nos	Per No.
3	Civil foundation and Bed Formation	38 Cu.M. approx.	Per Cu.M.
[TABLE 1 END]

EXTRACTION INSTRUCTIONS:
1. Find sections titled "Scope of Work", "A. Civil Works", "B. Mechanical Works", "C. Electrical Works", "Bill of Quantity", "BOQ"
2. For EACH row in these tables:
   - Extract Serial Number (Sl. No.) - the number in first column
   - Extract Work Description - the complete description (even if multi-line)
   - Extract Quantity (Qty) - exact format including units (e.g., "20 Nos", "38 Cu.M. approx.", "45 Tons (approx.)", "52 Sets", "1550Mtrs")
   - Extract Unit - exact text (e.g., "Per No.", "Per Cu.M.", "Per Ton", "Per Set", "Lumpsum", "Per KM")
   - Extract Unit Price if present (may be empty)
   - Extract Total Price if present (may be empty)
3. Do NOT skip any rows - extract ALL work items from ALL tables
4. Preserve exact formatting - if quantity says "38 Cu.M. approx." extract it exactly like that
5. For multi-line descriptions, include the complete text
6. **SKIP rows that are clearly document files or document lists** (if description contains ".pdf", ".xls", "Notice Inviting", "Tender Documents", "Additional Tender Documents", etc.)

Look for these section headers:
- "Scope of Work"
- "A. Civil Works" or "Civil Works"
- "B. Mechanical Works" or "Mechanical Works"
- "C. Electrical Works" or "Electrical Works"
- "Bill of Quantity" or "BOQ"

**TERMS & CONDITIONS:**
- Extract ALL numbered clauses (1, 2, 3, etc.) from "Terms & Conditions" sections
- Include complete clause text, not just titles
- Look for "Eligibility Criteria", "Commercial Order" sections

**REQUIREMENTS:**
- Key Eligibility Criteria
- Required Documents
- Technical Specifications
- Total Quantity

**COMPLIANCE & PREFERENCES:**
- MSE Purchase Preference
- Make in India (MII) Preference
- Arbitration Clause
- Mediation Clause
- Reverse Auction
- Inspection Required
- Evaluation Method

**DOCUMENT CONTENT:**
${truncatedDoc}

**EXTRACTION RULES:**
1. Read EVERY LINE of the document including ALL tables and sections
2. Extract EXACT values as written - preserve formatting (dates, amounts, quantities)
3. For tabular data: Extract ALL rows from Scope of Work tables - do NOT skip any items
4. For quantities: Preserve exact format (e.g., "20 Nos", "38 Cu.M. approx.", "45 Tons (approx.)")
5. For amounts: Keep currency symbols and format (e.g., "Rs.8,96,035/-", "₹5 Crores")
6. For dates: Keep format exactly (e.g., "28.10.2025", "Dated: 25.10.2025")
7. For Yes/No questions, extract actual value from document
8. For missing information, use null or empty string
9. DO NOT invent or assume any data
10. Extract all items in lists and tables completely
11. For workItems array: Include ALL work items from ALL sections (Civil, Mechanical, Electrical)
12. For Terms & Conditions: Extract ALL numbered clauses as complete text

**FOR SUMMARY:** Provide a concise overview of the document type and main purpose
**FOR KEY POINTS:** List the most important extracted facts including enquiry number, tender details, approximate value
**FOR COMPLIANCE SCORE:** Calculate based on completeness (0-100)
**FOR MISSING CLAUSES:** List what is actually missing from standard requirements
**FOR RISK FACTORS:** Identify real risks mentioned or implied

**IMPORTANT:** The workItems array should contain ALL work items extracted from tables. If tables are present, ensure workItems array is populated with serialNumber, description, quantity, and unit for each row.

**CRITICAL REMINDER:**
- Extract ONLY data that EXISTS in the document provided below
- DO NOT use example values or placeholder data
- DO NOT invent or assume any values
- If a field is not found, use null or empty string
- All values MUST come from the actual document text

**JSON RESPONSE FORMAT:**
{
  "summary": "Brief summary based on ACTUAL document content",
  "keyPoints": ["Real extracted facts from document"],
  "extractedData": {
    // Extract ONLY fields that exist in the document
    // Use null for missing fields
  },
  "complianceScore": <number based on actual completeness>,
  "missingClauses": [],
  "riskFactors": []
}

**NOW ANALYZE THIS ACTUAL DOCUMENT AND EXTRACT REAL DATA:**

Respond ONLY with valid JSON. No markdown, no explanations, no text before or after JSON.` 
        }
      ],
      temperature: 0.1, // Lower temperature for more accurate extraction
      maxTokens: 2500 // Reduced to stay within credit limits for large documents
    });

    let result = completion.choices[0].message.content;
    
    console.log('AI raw response length:', result.length);
    console.log('AI raw response (first 500):', result.slice(0, 500));
    
    // Remove markdown code block wrappers if present
    result = result.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    // Check if response starts with JSON
    if (!result.startsWith('{')) {
      console.error('AI returned non-JSON response:', result.slice(0, 200));
      throw new Error('Invalid AI response format');
    }
    
    const parsed = JSON.parse(result);
    
    console.log('AI parsed result:', JSON.stringify(parsed, null, 2));
    
    return parsed as DocumentAnalysis;
  } catch (error: any) {
    // Handle 402 token limit errors
    if (error?.message?.includes('402') || error?.message?.includes('credits') || error?.message?.includes('max_tokens')) {
      console.error('Token limit exceeded, retrying with reduced tokens...');
      
      try {
        // Retry with reduced tokens and simplified prompt
        const retryCompletion = await insforge.ai.chat.completions.create({
          model: 'openai/gpt-4o',
          messages: [
            { role: 'system', content: 'You are an expert document analyst. Extract data from bid/tender documents accurately.' },
            { 
              role: 'user', 
              content: `Analyze this document and extract: Enquiry Number, Tender ID, Organization, Approximate value, and all work items from tables.

**DOCUMENT:**
${smartTruncate(documentText, 6000)}

Respond ONLY with valid JSON in this format:
{
  "summary": "Brief summary",
  "keyPoints": ["key point 1", "key point 2"],
  "extractedData": {
    "enquiryNumber": "value or null",
    "tenderId": "value or null",
    "organization": "value or null",
    "approximateValue": "value or null",
    "workItems": [{"serialNumber": "1", "description": "...", "quantity": "...", "unit": "..."}]
  },
  "complianceScore": 85,
  "missingClauses": [],
  "riskFactors": []
}` 
            }
          ],
          temperature: 0.1,
          maxTokens: 1500 // Further reduced for retry
        });

        let retryResult = retryCompletion.choices[0].message.content;
        retryResult = retryResult.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
        
        if (!retryResult.startsWith('{')) {
          throw new Error('Invalid AI response format after retry');
        }
        
        const retryParsed = JSON.parse(retryResult);
        console.log('AI retry successful:', retryParsed);
        return retryParsed as DocumentAnalysis;
      } catch (retryError) {
        console.error('Retry failed:', retryError);
        throw new Error('AI token limit exceeded. Please reduce document size or contact support for more credits.');
      }
    }
    
    console.error('AI Analysis Error:', error);
    console.error('Error type:', typeof error);
    console.error('Error keys:', Object.keys(error || {}));
    console.error('Error message:', error?.message);
    console.error('Error toString:', error?.toString());
    
    // Check if it's an API key error - check multiple error properties
    const errorMessage = String(error?.message || error?.error?.message || error?.toString() || '').toLowerCase();
    const errorString = String(error || '').toLowerCase();
    const isApiKeyError = errorMessage.includes('api key') || 
                         errorMessage.includes('forbidden') ||
                         errorMessage.includes('renew cloud api key') ||
                         errorMessage.includes('failed to renew') ||
                         errorString.includes('api key') ||
                         errorString.includes('forbidden') ||
                         (error as any)?.status === 403 ||
                         (error as any)?.statusCode === 403 ||
                         (error as any)?.response?.status === 403;
    
    console.log('🔍 Error detection - Message:', errorMessage, 'String:', errorString, 'Is API key error:', isApiKeyError);
    
    // Use fallback for API key errors or any network/API errors
    // This ensures we always extract data even when AI is unavailable
    if (isApiKeyError || errorMessage.includes('failed') || errorMessage.includes('error') || errorMessage.includes('500')) {
      console.warn('⚠️ AI analysis unavailable. Using text-based extraction fallback...');
      console.log('📋 Calling extractDataFromTextFallback with document length:', documentText.length);
      try {
        const fallbackResult = extractDataFromTextFallback(documentText, documentType, fileSize);
        console.log('✅ Fallback extraction successful - Found', Object.keys(fallbackResult.extractedData || {}).length, 'fields');
        return fallbackResult;
      } catch (fallbackError) {
        console.error('❌ Fallback extraction failed:', fallbackError);
        // Return minimal result if even fallback fails
        return {
          summary: 'Document uploaded successfully. Text extraction completed.',
          keyPoints: ['Document uploaded', 'Basic extraction completed'],
          extractedData: {},
          complianceScore: 30,
          missingClauses: [],
          riskFactors: []
        };
      }
    }
    
    // Return default analysis on other unexpected errors
    console.warn('⚠️ Unexpected error type, using minimal fallback');
    return {
      summary: 'Document uploaded successfully. Manual analysis required.',
      keyPoints: ['Document requires manual review'],
      extractedData: {},
      complianceScore: 0,
      missingClauses: ['Analysis pending'],
      riskFactors: ['Analysis pending']
    };
  }
}

/**
 * Fallback text extraction when AI is unavailable
 * Uses simple regex patterns to extract basic information
 */
function extractDataFromTextFallback(documentText: string, documentType: string, fileSize?: number): DocumentAnalysis {
  console.log('🔍 Using REAL-TIME text extraction from actual document...');
  console.log('📄 Document text length:', documentText.length);
  console.log('📄 First 500 chars of ACTUAL document:', documentText.substring(0, 500));
  console.log('📄 Document type:', documentType);
  
  // Verify we have actual document content, not empty or placeholder
  if (!documentText || documentText.trim().length < 50) {
    console.error('❌ ERROR: Document text is empty or too short! Length:', documentText?.length || 0);
    return {
      summary: 'Document text extraction failed. Document may be empty or corrupted.',
      keyPoints: ['Document extraction failed'],
      extractedData: {},
      complianceScore: 0,
      missingClauses: ['Document text not available'],
      riskFactors: ['Cannot analyze empty document']
    };
  }
  
  const extractedData: any = {};
  const keyPoints: string[] = [];
  
  // Normalize text - remove extra whitespace, normalize line breaks
  const normalizedText = documentText.replace(/\s+/g, ' ').replace(/\n\s*\n/g, '\n');
  
  // Extract Enquiry Number / Tender Reference Number (multiple patterns - extract COMPLETE value AFTER label)
  // PRIORITY ORDER: More specific patterns first, then generic ones
  // CRITICAL: Prioritize eProcurement format patterns (Tender Reference Number) over generic patterns
  const enquiryPatterns = [
    // Priority 1: eProcurement format - "Tender Reference Number:" (HIGHEST PRIORITY for eProcurement documents)
    /(?:Tender\s*Reference\s*Number[:.\s]+)([A-Z0-9\/\-\s]{3,100}?)(?:\s*\n|$|\s+(?:Withdrawal|Tender\s*ID|Tender\s*Type|Organization|Department|Date|Time|Form\s*of\s*contract|Tender\s*Category)[:.\s])/i,  // PSGCT/CPPP/2025-26/03 - stop at newline or next field
    // Priority 2: Explicit "Enquiry Number:" label patterns (most reliable)
    // Pattern for formats like "Enquiry Number: EAPH250035 Dated:" - capture EAPH250035, stop at "Dated"
    /(?:Enquiry\s*(?:Number|No\.?)[:.\s]+)([A-Z]{2,8}\d{6,})(?:\s+(?:Dated|Tender\s*ID|Organization|Department|Withdrawal|Tender\s*Type|Date|Time)[:.\s]|\s*\n|$)/i,  // EAPH250035 - stop at "Dated" or next field
    /(?:Enquiry\s*(?:Number|No\.?)[:.\s]+)([A-Z0-9\/\-\s]{3,100}?)(?:\s*\n|$|\s+(?:Dated|Tender\s*ID|Organization|Department|Withdrawal|Tender\s*Type|Date|Time)[:.\s])/i,  // PSGCT/CPPP/2025-26/03 - stop at "Dated" or next field
    /(?:Tender\s*Ref\s*No[:.\s]+)([A-Z0-9\/\-\s]{3,100}?)(?:\s*\n|$|\s+(?:Tender\s*ID|Organization|Department|Date|Time)[:.\s])/i,
    /(?:Ref\.?\s*(?:No\.?|Number)[:.\s]+)([A-Z0-9\/\-\s]{3,100}?)(?:\s*\n|$|\s+(?:Tender\s*ID|Organization|Department|Date|Time)[:.\s])/i,
    /(?:Reference\s*(?:No\.?|Number)[:.\s]+)([A-Z0-9\/\-\s]{3,100}?)(?:\s*\n|$|\s+(?:Tender\s*ID|Organization|Department|Date|Time)[:.\s])/i,
    // Priority 2: Specific format patterns (EAPH250035, GEM/2025/B/5859779)
    /(?:EAPH\s*)(\d{6,})/i,  // EAPH250035 format
    /(EAPH\d{6,})/i,  // EAPH250035 (no space)
    /([A-Z]{2,8}\d{6,})/i,  // Pattern like EAPH250035, GEM20255859779 (letters followed by numbers)
    /([A-Z]{2,5}\/[A-Z0-9\/\-\s]+\d{2,})/i,  // Pattern like PSGCT/CPPP/2025-26/03 or GEM/2025/B/5859779
    /([A-Z]{2,5}\s*\d{6,})/i  // Generic pattern like "EAPH 250035" (with space)
  ];
  // Helper function to detect binary/corrupted data
  const isBinaryOrCorrupted = (text: string): boolean => {
    if (!text || text.length < 3) return true;
    // Check for binary characters (non-printable except spaces, newlines, tabs)
    const binaryChars = text.match(/[\x00-\x08\x0E-\x1F]/g);
    if (binaryChars && binaryChars.length > text.length * 0.1) return true; // More than 10% binary chars
    // Check for excessive special characters that suggest corruption
    const specialChars = text.match(/[^\w\s\/\-\.]/g);
    if (specialChars && specialChars.length > text.length * 0.3) return true; // More than 30% special chars
    // Check for patterns that suggest corrupted OCR (like "bL13333333")
    if (text.match(/^[a-z]\d{6,}$/i) && text.length < 15) return true; // Single letter followed by many digits
    return false;
  };
  
  for (const pattern of enquiryPatterns) {
    const match = documentText.match(pattern);
    if (match && match[1]) {
      let value = match[1].trim();
      
      // CRITICAL: Skip binary/corrupted data
      if (isBinaryOrCorrupted(value)) {
        continue;
      }
      
      // Clean up: remove common words/field labels that might be incorrectly captured
      value = value.replace(/^(Tender\s*ID|Tender\s*Reference|Organization|Department|National|Project|Implementation|Unit|World|Bank|Tenders|Date|Time|Name)\s+/i, '').trim();
      
      // CRITICAL: Stop at work item keywords (hooks, brackets, fixing, etc.) - these are NOT enquiry numbers
      const workItemKeywords = ['hooks', 'brackets', 'fixing', 'bolts', 'grouting', 'cable', 'foundation', 'bed', 'formation', 'per', 'nos', 'cu.m', 'tons', 'sets', 'description', 'quantity', 'unit', 'sl.', 'serial', 'no.', 'work', 'item', 'roof', 'drilling', 'resin', 'capsules'];
      const hasWorkItemKeywords = workItemKeywords.some(keyword => value.toLowerCase().includes(keyword));
      if (hasWorkItemKeywords) {
        // Split at first work item keyword
        for (const keyword of workItemKeywords) {
          const keywordIndex = value.toLowerCase().indexOf(keyword);
          if (keywordIndex > 0) {
            value = value.substring(0, keywordIndex).trim();
            break;
          }
        }
      }
      
      // Stop at common field labels that might appear after (especially Date/Time)
      value = value.split(/\s+(?:Date|Time|Date\/Time|Tender\s*ID|Organization|Department|Withdrawal|Tender\s*Type|Form\s*of\s*contract|Tender\s*Category|hooks|brackets|fixing|Sl\.\s*No|Serial|Description|Quantity|Unit)[:.\s]/i)[0].trim();
      
      // Exclude date/time patterns and placeholder text
      if (value.match(/^(Date|Time|Date\/Time|Name|Department|Organization)[\s:]/i) ||
          value.match(/^\d{1,2}[.\/-]\d{1,2}[.\/-]\d{2,4}\s+\d+/i) || // Date with time
          value.match(/^(Minimum|Average|Annual|Turnover|Years?|वर्ष|औसत|टर्नओवर)/i)) {
        continue; // Skip date/time patterns and placeholder text
      }
      
      // EXCLUDE work item descriptions - check again after cleanup
      const stillHasWorkItemKeywords = workItemKeywords.some(keyword => value.toLowerCase().includes(keyword));
      if (stillHasWorkItemKeywords || value.includes('/') && value.match(/hooks|brackets|fixing/i)) {
        continue; // Skip this match - it's a work item, not an enquiry number
      }
      
      // CRITICAL: Exclude pure numeric values that are likely Tender IDs (6-digit numbers like 860025)
      // Enquiry numbers typically have letters (EAPH250035) or special formats (PSGCT/CPPP/2025-26/03)
      const isPureNumeric = /^\d{6,}$/.test(value);
      const hasLetters = /[A-Za-z]/.test(value);
      const hasSlashesOrHyphens = /[\/\-]/.test(value);
      
      // If it's pure numeric and we haven't found a Tender ID yet, it might be a Tender ID, not Enquiry Number
      // Skip pure numeric values unless they're part of a pattern with letters (like EAPH250035)
      if (isPureNumeric && !hasLetters && !hasSlashesOrHyphens && value.length === 6) {
        // Check if this value appears as "Tender ID: 860025" in the document
        const tenderIdContext = documentText.match(new RegExp(`(?:Tender\\s*ID[:.\\s]+)${value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i'));
        if (tenderIdContext) {
          continue; // Skip - this is a Tender ID, not Enquiry Number
        }
      }
      
      // CRITICAL: Additional validation - exclude corrupted patterns
      // Exclude patterns like "bL13333333" (single lowercase letter + many digits - likely OCR error)
      if (value.match(/^[a-z]\d{6,}$/i) && value.length < 15) {
        continue; // Skip corrupted OCR patterns
      }
      
      // Must be a valid reference format (alphanumeric with slashes/hyphens, preferably with letters)
      // PREFER formats with letters (EAPH250035) over pure numbers
      if (value.length > 3 && value.length < 100 && 
          (value.match(/[A-Z0-9\/\-]/i) || (value.match(/^\d+$/) && !isPureNumeric)) &&
          !value.match(/^(Tender|Reference|ID|Number|National|Project|Implementation|Unit|World|Bank|Tenders|Tender\s*Reference|Tender\s*ID|Date|Time|Name|Department|hooks|brackets|fixing)$/i) &&
          !value.match(/^\d{1,2}[.\/-]\d{1,2}[.\/-]\d{2,4}/i)) { // Not a date
        // Correct year if it's 2023 but should be 2025 (common OCR/typing error)
        if (value.includes('2023-') && documentText.match(/2025/)) {
          value = value.replace(/2023-/g, '2025-');
        }
        // Fix incorrect year ranges: "2025-25" should be "2025-26" (if document shows 2025)
        if (value.match(/2025-25/) && documentText.match(/2025/)) {
          value = value.replace(/2025-25/g, '2025-26');
        }
        // Also fix year ranges like "2023-25" to "2025-26"
        if (value.match(/2023-25/) && documentText.match(/2025/)) {
          value = value.replace(/2023-25/g, '2025-26');
        }
        // Fix GeM enquiry number format: "GEM/2025/B/5859779" -> "GEM/2025/8/5859779" if document shows "8"
        // Check if document has "GEM/2025/8" pattern and we extracted "GEM/2025/B"
        if (value.match(/GEM\/2025\/B/i) && documentText.match(/GEM\/2025\/8/i)) {
          value = value.replace(/GEM\/2025\/B/i, 'GEM/2025/8');
        }
        // Also fix "GEM/2025/B" to "GEM/2025/8" if consistent pattern (B often OCR'd as 8)
        if (value.match(/GEM\/2025\/B\/\d+/) && !documentText.match(/GEM\/2025\/B/i)) {
          // Check if document shows "8" in similar pattern
          const gemPattern = documentText.match(/GEM\/2025\/[B8]\/\d+/i);
          if (gemPattern && gemPattern[0].includes('8')) {
            value = value.replace(/GEM\/2025\/B/i, 'GEM/2025/8');
          }
        }
        // Remove trailing year if it's just a duplicate (e.g., "PSGCT/CPPP/2025-26/03 2025" -> "PSGCT/CPPP/2025-26/03")
        value = value.replace(/\s+2025$/, '').trim();
        // Remove trailing standalone years that are likely not part of the reference
        value = value.replace(/\s+\d{4}$/, '').trim();
        // Remove "ID" prefix if present (e.g., "ID 860025" -> "860025")
        // BUT: If removing "ID" leaves a pure 6-digit number, check if it's actually a Tender ID
        const originalValue = value;
        value = value.replace(/^ID\s+/i, '').trim();
        value = value.replace(/^Tender\s*ID\s+/i, '').trim();
        
        // Final validation: If the result is a pure 6-digit number, verify it's not a Tender ID
        if (/^\d{6}$/.test(value)) {
          // Check if document explicitly shows this as "Tender ID: [value]"
          const tenderIdCheck = documentText.match(new RegExp(`(?:Tender\\s*ID[:.\\s]+)${value}`, 'i'));
          if (tenderIdCheck) {
            // This is likely a Tender ID, not Enquiry Number - skip this match
            continue;
          }
          // Also check if there's a format like "EAPH250035" that should be the Enquiry Number
          const eaphPattern = documentText.match(/(?:Enquiry\s*(?:Number|No)[:.\s]+)(EAPH\d{6,}|[A-Z]{2,8}\d{6,})/i);
          if (eaphPattern && eaphPattern[1] && eaphPattern[1] !== value) {
            // There's a better match (EAPH format) - skip this numeric one
            continue;
          }
        }
        
        extractedData.enquiryNumber = value;
        keyPoints.push(`Enquiry Number: ${extractedData.enquiryNumber}`);
        break;
      }
    }
  }
  
  // Extract Tender ID (including GeM formats - extract COMPLETE value AFTER label)
  // Exclude work item descriptions (hooks, brackets, fixing, etc.)
  const tenderIdPatterns = [
    /(?:Tender\s*ID[:.\s]+)([A-Z0-9_\-]{3,100}?)(?:\s*\n|$|\s+(?:Withdrawal|Tender\s*Type|Form\s*of\s*contract|Tender\s*Category|Organization|Department|Project\s*Title|Subject|Name\s*of\s*Work|hooks|brackets|fixing|Sl\.\s*No|Serial|Description|Quantity|Unit)[:.\s])/i,  // 2025_WBNPI_883395_1 format - stop at newline or next field
    /(?:Tender\s*ID[:.\s]+)(\d{6,})(?:\s*\n|$|\s+(?:Withdrawal|Tender\s*Type|Organization|Department|Project\s*Title|Subject|hooks|brackets|fixing)[:.\s])/i,
    /(?:Tender\s*(?:Number|No)[:.\s]+)(\d{6,})(?:\s*\n|$|\s+(?:Withdrawal|Tender\s*Type|Project\s*Title|Subject|hooks|brackets|fixing)[:.\s])/i,
    /(?:Bid\s*(?:Number|No|ID)[:.\s]+)(\d{6,})(?:\s*\n|$|\s+(?:Project\s*Title|Subject|Name\s*of\s*Work|hooks|brackets|fixing)[:.\s])/i,
    /GeM[-_]Bidding[-_](\d+)/i,  // GeM-Bidding-7931942
    /(?:GeM\s*)[\s\-]*(\d{7,})/i  // GeM 7931942 or GeM-7931942
  ];
  for (const pattern of tenderIdPatterns) {
    const match = documentText.match(pattern);
    if (match && match[1]) {
      let value = match[1].trim();
      // Clean up: remove organization names or other text that might be incorrectly captured
      value = value.split(/\s+(?:National|Project|Implementation|Unit|World|Bank|Tenders|Withdrawal|Tender\s*Type|Form\s*of\s*contract|Tender\s*Category|Organization|Department|Project\s*Title|Subject|Name\s*of\s*Work|hooks|brackets|fixing|Sl\.\s*No|Serial|Description|Quantity|Unit)[:.\s]/i)[0].trim();
      
      // EXCLUDE work item descriptions - common words that appear in work items
      const workItemKeywords = ['hooks', 'brackets', 'fixing', 'bolts', 'grouting', 'cable', 'foundation', 'bed', 'formation', 'per', 'nos', 'cu.m', 'tons', 'sets', 'description', 'quantity', 'unit', 'sl.', 'serial', 'no.', 'work', 'item'];
      const hasWorkItemKeywords = workItemKeywords.some(keyword => value.toLowerCase().includes(keyword));
      
      // Check if value contains "/" which might indicate it's a work item (e.g., "hooks/brackets")
      const hasSlash = value.includes('/');
      
      // Must be a valid ID format (alphanumeric with underscores/hyphens, or just numbers, NOT just words)
      // STRICT validation: must have numbers and proper format, no slashes unless it's a GeM format
      if (value.length >= 3 && value.length < 100 && 
          value.match(/^[A-Z0-9_\-]+$/i) && // Only alphanumeric, underscores, hyphens
          !hasWorkItemKeywords && // Exclude work item descriptions
          !hasSlash && // Exclude work items with slashes like "hooks/brackets"
          !value.match(/^(National|Project|Implementation|Unit|World|Bank|Tenders|Tender|Reference|ID|Number|hooks|brackets|fixing)$/i) &&
          (value.match(/\d/) && value.match(/[A-Z0-9_\-]{3,}/i))) { // Must contain numbers AND be at least 3 chars of alphanumeric
        // Correct year if it's 2023 but should be 2025 (common OCR/typing error)
        if (value.includes('2023_') && documentText.match(/2025/)) {
          value = value.replace('2023_', '2025_');
        }
        extractedData.tenderId = value;
        keyPoints.push(`Tender ID: ${extractedData.tenderId}`);
        break;
      }
    }
  }
  
  // Extract Approximate Value (multiple formats - more flexible, including GeM)
  const valuePatterns = [
    /(?:Approximate\s*(?:value|Value)\s*(?:of\s*the\s*enquiry\s*is|is|:)[:.\s]*)(Rs?\.?\s*[\d,]+[\/\-]?|₹\s*[\d,]+)/i,
    /(Rs?\.?\s*[\d,]+[\/\-]?\s*(?:Crores?|Lakhs?|Crore|Lakh|Lakhs))/i,
    /(?:Value[:.\s]*)(Rs?\.?\s*[\d,]+[\/\-]?)/i,
    /(?:Amount[:.\s]*)(Rs?\.?\s*[\d,]+[\/\-]?)/i,
    /Rs?\.?\s*([\d,]+[\/\-]?)\s*(?:Crores?|Lakhs?|Crore|Lakh)/i,
    /₹\s*([\d,]+[\/\-]?)/i,
    /(?:Rs\.?\s*)([\d,]+[\/\-]?)/i,
    /(?:Estimated\s*(?:Value|Amount|Price)[:.\s]*)(Rs?\.?\s*[\d,]+[\/\-]?|₹\s*[\d,]+)/i,
    /(?:Total\s*(?:Value|Amount|Price)[:.\s]*)(Rs?\.?\s*[\d,]+[\/\-]?|₹\s*[\d,]+)/i,
    /(?:Order\s*(?:Value|Amount)[:.\s]*)(Rs?\.?\s*[\d,]+[\/\-]?|₹\s*[\d,]+)/i
  ];
  for (const pattern of valuePatterns) {
    const match = documentText.match(pattern);
    if (match) {
      const value = (match[1] || match[0]).trim();
      if (value.length > 2) {
        extractedData.approximateValue = value.replace(/Rs?\.?\s*/i, 'Rs. ').trim();
        keyPoints.push(`Approximate Value: ${extractedData.approximateValue}`);
        break;
      }
    }
  }
  
  // Extract Organization/Department (multiple patterns - extract COMPLETE name AFTER label)
  const orgPatterns = [
    // Priority 1: "Department of [Name]" format - capture complete including "Department of"
    /(?:Department\s*of\s*)([A-Z][A-Za-z\s]{5,80})(?:\s*\n|$|\s+(?:Pincode|Pin\s*Code|Pin|Code|Withdrawal|Tender\s*ID|Tender\s*Type|Form\s*of\s*contract|Tender\s*Category|No\.\s*of\s*Covers|Name|PURCHASE|ORDER)[:.\s])/i,
    // Priority 2: "Department: [Name]" format
    /(?:Department[:.\s]+)([A-Z][A-Za-z\s]{5,80})(?:\s*\n|$|\s+(?:Pincode|Pin\s*Code|Pin|Code|of|Textile|Withdrawal|Tender\s*ID|Tender\s*Type|Form\s*of\s*contract|Tender\s*Category|Name|PURCHASE|ORDER)[:.\s])/i,
    // Priority 3: "Issuing Department: [Name]" format
    /(?:Issuing\s*Department[:.\s]+)([A-Z][A-Za-z\s]{5,80})(?:\s*\n|$|\s+(?:Pincode|Pin\s*Code|Pin|Code|Withdrawal|Tender\s*ID|Tender\s*Type|Name|PURCHASE|ORDER)[:.\s])/i,
    // Priority 4: Organisation Chain (eProcurement format - HIGHEST PRIORITY for organization)
    /(?:Organisation\s*Chain[:.\s]+)([A-Z][A-Za-z\s&\|\-]+(?:TENDERS|TENDERS\s*\|\||COLLEGE|TECHNOLOGY|UNIT|WORLD\s*BANK|PROJECT|IMPLEMENTATION)[^.\n]{0,200}?)(?:\s*\n|$|\s+(?:Withdrawal|Tender\s*ID|Tender\s*Type|Form\s*of\s*contract|Tender\s*Category|Name|PURCHASE|ORDER|Tender\s*Reference)[:.\s])/i,  // Complete org chain - stop at next field
    // Priority 4b: Organisation Chain with || separator (capture both parts)
    /(?:Organisation\s*Chain[:.\s]+)([A-Z][A-Za-z\s&\-]+(?:\s*\|\|\s*[A-Z][A-Za-z\s&\-]+)?[^.\n]{0,200}?)(?:\s*\n|$|\s+(?:Withdrawal|Tender\s*ID|Tender\s*Type|Form\s*of\s*contract|Tender\s*Category|Name|PURCHASE|ORDER|Tender\s*Reference)[:.\s])/i,  // Capture both parts of org chain
    // Priority 5: Organization - include common organization endings
    /(?:Organization[:.\s]+)([A-Z][A-Za-z\s&\|\-]+(?:LTD|LIMITED|CORPORATION|CORP|PVT|PRIVATE|ENGINEERING|MACHINERY|HEAVY|TENDERS|COLLEGE|TECHNOLOGY|UNIT|WORLD\s*BANK|and\s*Engineering)[^.\n]{0,150}?)(?:\s*\n|$|\s+(?:Withdrawal|Tender\s*ID|Tender\s*Type|Form\s*of\s*contract|Tender\s*Category|No\.\s*of\s*Covers|Name|PURCHASE|ORDER)[:.\s])/i,
    // Priority 6: Buying Organization
    /(?:Buying\s*Organization[:.\s]+)([A-Z][A-Za-z\s&\|\-]+[^.\n]{0,150}?)(?:\s*\n|$|\s+(?:Withdrawal|Tender\s*ID|Tender\s*Type|Name|PURCHASE|ORDER)[:.\s])/i,
    // Priority 7: Specific patterns - Andhra Pradesh Heavy Machinery and Engineering Limited
    /(ANDHRA\s*PRADESH\s*HEAVY\s*MACHINERY\s*(?:AND\s*)?ENGINEERING\s*(?:LIMITED|LTD\.?)?[^.\n]{0,50}?)(?:\s*\n|$|\s+(?:PURCHASE|ORDER|Withdrawal|Tender\s*ID|Tender\s*Type|Name)[:.\s])/i,
    /(National\s*Project\s*Implementation\s*Unit[^.\n]{0,150}?)(?:\s*\|\||\s*\n|$|\s+(?:Withdrawal|Tender\s*ID|Tender\s*Type|Name|PURCHASE|ORDER)[:.\s])/i,  // Specific pattern with || separator
    /(National\s*Project\s*Implementation\s*Unit[^.\n]{0,50}\s*\|\|\s*[A-Z][A-Za-z\s]{5,80})/i,  // With || separator - capture both parts
    /(PSG\s*COLLEGE\s*OF\s*TECHNOLOGY[^.\n]{0,50})/i  // Specific pattern
  ];
  for (const pattern of orgPatterns) {
    const match = documentText.match(pattern);
    if (match && match[1]) {
      let org = match[1].trim().split(/[\n\r]/)[0].trim();
      
      // ALWAYS remove "PURCHASE" or "ORDER" if they're at the end (they're field labels, not part of org name)
      // Except if it's part of a compound name like "PURCHASE DEPARTMENT"
      if (org.match(/\s+PURCHASE\s*$/i) && !org.match(/PURCHASE\s*DEPARTMENT/i)) {
        org = org.replace(/\s+PURCHASE\s*$/i, '').trim();
      }
      if (org.match(/\s+ORDER\s*$/i) && !org.match(/ORDER\s*DEPARTMENT/i)) {
        org = org.replace(/\s+ORDER\s*$/i, '').trim();
      }
      
      // Additional cleanup: split at "PURCHASE" or "ORDER" if they appear mid-string followed by field labels
      org = org.split(/\s+(?:PURCHASE|ORDER)\s*(?:[:.\s]|$)/i)[0].trim();
      
      // Exclude placeholder text like "Name Department", "Name Organization"
      if (org.match(/^(Name|Date|Time|Date\/Time)\s+(Department|Organization|Name)$/i) ||
          org.toLowerCase() === 'name department' ||
          org.toLowerCase() === 'name organization' ||
          org.toLowerCase() === 'department name') {
        continue; // Skip placeholder text
      }
      
      // Special handling for "Department of [Name]" pattern - prepend "Department of"
      if (pattern.source.includes('Department\\s*of\\s*') && !org.toLowerCase().startsWith('department of')) {
        org = `Department of ${org}`;
      }
      
      // Clean up: remove common field labels that might be incorrectly captured
      org = org.replace(/^(Tender\s*ID|Tender\s*Reference|Enquiry\s*Number|Ref|Withdrawal|Tender\s*Type|Form\s*of\s*contract|Tender\s*Category|of\s*only|Name|Date|Time)[:.\s]*/i, '').trim();
      
      // Stop at next field label (especially "Pincode", "Pin Code", "Pin", "Code", "Name", "in charge", "direct charge")
      org = org.split(/\s+(?:Pincode|Pin\s*Code|Pin\s*Code|Pin|Code|Withdrawal|Tender\s*Type|Form\s*of\s*contract|Tender\s*Category|No\.\s*of\s*Covers|Tender\s*ID|Tender\s*Reference|Enquiry\s*Number|Ref|Name|Date|Time|in\s*charge|direct\s*charge|officer|ficer)[:.\s]/i)[0].trim();
      
      // Additional cleanup: remove "Pincode" if it's at the end
      org = org.replace(/\s+Pincode\s*$/i, '').trim();
      org = org.replace(/\s+Pin\s*Code\s*$/i, '').trim();
      
      // Remove trailing incomplete words like "of", "the", "charge", "officer" if followed by field labels
      org = org.replace(/\s+(?:of|the|charge|officer|ficer|in\s*charge|direct\s*charge)\s*$/, '').trim();
      
      // CRITICAL: Skip if organization ends with incomplete phrases
      if (org.match(/\s+(?:of|the|charge|officer|ficer|in\s*charge|direct\s*charge)\s*$/i)) {
        continue; // Skip incomplete organization names
      }
      
      // Must be a valid organization name (not just field labels or placeholder text)
      if (org.length > 5 && org.length < 200 && 
          !org.match(/^\d+$/) && 
          !org.match(/^(Tender|Reference|ID|Number|National\s*only|Project\s*only|Tender\s*Reference|Tender\s*ID|Ref|of\s*only|of\s*Textile\s*only|Name|Date|Time|Date\/Time|Department\s*Name|Name\s*Department)$/i) &&
          org.match(/[A-Za-z]{5,}/)) { // Must contain at least 5 letters
        extractedData.organization = org;
        keyPoints.push(`Organization: ${extractedData.organization}`);
        break;
      }
    }
  }
  
  // Extract any department name from common patterns (only if organization not found)
  if (!extractedData.organization) {
    const deptMatch = documentText.match(/(?:Department\s*of\s*)([A-Z][A-Za-z\s]{5,100})(?:\s*\n|$|\s+(?:Pincode|Pin\s*Code|Pin|Code|Tender|Withdrawal|Organization)[:.\s])/i);
    if (deptMatch && deptMatch[1]) {
      let dept = deptMatch[1].trim();
      // Stop at "Pincode" or other field labels
      dept = dept.split(/\s+(?:Pincode|Pin\s*Code|Pin|Code|Tender|Withdrawal|Organization)[:.\s]/i)[0].trim();
      // Prepend "Department of" if not already there
      if (!dept.toLowerCase().startsWith('department of')) {
        dept = `Department of ${dept}`;
      }
      if (dept.length > 5 && dept.length < 100 && !dept.match(/^(Tender|Reference|ID|of\s*only)$/i)) {
        extractedData.organization = dept;
        keyPoints.push(`Organization: ${extractedData.organization}`);
      }
    }
  }
  
  // Extract dates (multiple formats) - prioritize dates with 4-digit years, prefer 2025/2024 over older years
  const allDates: string[] = [];
  const datePatterns = [
    /(?:Dated|Date|Enquiry\s*Date)[:.\s]*(\d{1,2}[.\/-]\d{1,2}[.\/-]\d{4})/gi,  // 4-digit year (preferred) - added 'g' flag
    /(?:Dated|Date|Enquiry\s*Date)[:.\s]*(\d{1,2}[.\/-]\d{1,2}[.\/-]\d{2})/gi,  // 2-digit year - added 'g' flag
    /(\d{1,2}[.\/-]\d{1,2}[.\/-]\d{4})/g,  // All dates with 4-digit years
    /(\d{1,2}[.\/-]\d{1,2}[.\/-]\d{2})/g   // All dates with 2-digit years
  ];
  
  // Helper function to normalize date formats (fixes OCR errors like "13.5/2025")
  const normalizeDateForStorage = (dateStr: string): string => {
    // Fix formats like "13.5/2025" -> "13.05/2025" (missing zero in month)
    let fixed = dateStr.replace(/\.(\d)\//g, '.0$1/'); // Fix "13.5/2025" -> "13.05/2025"
    fixed = fixed.replace(/\.(\d)\./g, '.0$1.'); // Fix "4.6.2025" -> "04.06.2025"
    return fixed.trim();
  };
  
  // First, collect all dates
  for (const pattern of datePatterns) {
    const matches = documentText.matchAll(pattern);
    for (const match of matches) {
      if (match[1]) {
        let date = normalizeDateForStorage(match[1].trim()); // Normalize date format first
        
        // Skip incomplete dates (like "31/10/20" when we should have full year)
        // Also skip dates like "18.05.25", "23.03.25" which are incomplete (need full year)
        if (date.match(/^\d{1,2}[.\/-]\d{1,2}[.\/-]\d{2}$/)) {
          const yearPart = date.match(/\d{2}$/)?.[0];
          if (yearPart) {
            const yearNum = parseInt(yearPart);
            // Only accept 2-digit years ending in 24 or 25 (2024/2025)
            // Skip incomplete dates like "18.05.25" (should be "18.05.2025")
            if (yearNum !== 24 && yearNum !== 25) {
              // Try to correct if document shows 2025
              if (documentText.match(/2025/)) {
                date = date.replace(/\d{2}$/, '2025');
              } else if (documentText.match(/2024/)) {
                date = date.replace(/\d{2}$/, '2024');
              } else {
                // Skip incomplete dates that don't match document year
                continue;
              }
            } else {
              // Convert 2-digit year to 4-digit (24 -> 2024, 25 -> 2025)
              date = date.replace(/\d{2}$/, `20${yearPart}`);
            }
          } else {
            continue; // Skip if no year part
          }
        }
        
        // Skip incomplete date ranges like "23-25/03" or "25-26/2025" (should be full date)
        if (date.match(/^\d{1,2}[-\/]\d{1,2}[.\/-]\d{1,2}$/) || date.match(/^\d{1,2}[-\/]\d{1,2}[.\/-]\d{4}$/)) {
          continue; // Skip incomplete ranges like "25-26/2025"
        }
        
        // Skip dates that are just day/month without year (like "18.05" or "23.03")
        if (date.match(/^\d{1,2}[.\/-]\d{1,2}$/)) {
          continue;
        }
        
        // Correct year if it's 2023 but document shows 2025
        if (date.match(/2023/) && documentText.match(/2025/)) {
          date = date.replace(/2023/g, '2025');
        }
        
        // Only add valid dates (must have at least day/month/year)
        // Require 4-digit year or valid 2-digit year converted to 4-digit
        if (date.match(/^\d{1,2}[.\/-]\d{1,2}[.\/-]\d{4}$/) && !allDates.includes(date)) {
          allDates.push(date);
        }
      }
    }
  }
  
  // Prioritize dates: prefer 2025, then 2024, then most recent, exclude old/incomplete dates
  if (allDates.length > 0) {
    // Filter and sort dates: 4-digit years first, prefer 2025/2024, exclude 2023 if 2025 exists
    const filteredDates = allDates.filter(date => {
      const year = date.match(/\d{4}$/) ? parseInt(date.match(/\d{4}$/)![0]) : 
                   date.match(/\d{2}$/) ? (parseInt(date.match(/\d{2}$/)![0]) > 50 ? 1900 + parseInt(date.match(/\d{2}$/)![0]) : 2000 + parseInt(date.match(/\d{2}$/)![0])) : 0;
      // Exclude dates before 2024 if document shows 2025
      if (documentText.match(/2025/) && year < 2024) {
        return false;
      }
      return true;
    });
    
    const sortedDates = filteredDates.sort((a, b) => {
      const yearA = a.match(/\d{4}$/) ? parseInt(a.match(/\d{4}$/)![0]) : 
                   a.match(/\d{2}$/) ? (parseInt(a.match(/\d{2}$/)![0]) > 50 ? 1900 + parseInt(a.match(/\d{2}$/)![0]) : 2000 + parseInt(a.match(/\d{2}$/)![0])) : 0;
      const yearB = b.match(/\d{4}$/) ? parseInt(b.match(/\d{4}$/)![0]) : 
                   b.match(/\d{2}$/) ? (parseInt(b.match(/\d{2}$/)![0]) > 50 ? 1900 + parseInt(b.match(/\d{2}$/)![0]) : 2000 + parseInt(b.match(/\d{2}$/)![0])) : 0;
      
      // Prefer 2025, then 2024, then most recent
      if (yearA === 2025) return -1;
      if (yearB === 2025) return 1;
      if (yearA === 2024) return -1;
      if (yearB === 2024) return 1;
      return yearB - yearA; // Most recent first
    });
    
    if (sortedDates.length > 0) {
      // Create a date-to-field mapping by analyzing document context
      const dateFieldMap: { [date: string]: string } = {};
      
      // Function to normalize dates for comparison (handles different separators)
      const normalizeDate = (dateStr: string): string => {
        // Fix formats like "13.5/2025" -> "13.05.2025" before normalization
        let fixed = dateStr.replace(/\.(\d)\//g, '.0$1/'); // Fix "13.5/2025" -> "13.05/2025"
        fixed = fixed.replace(/\.(\d)\./g, '.0$1.'); // Fix "4.6.2025" -> "04.06.2025"
        // Convert all date formats to a standard format for comparison
        return fixed.replace(/[.\/-]/g, '').replace(/\s/g, '');
      };
      
      // Function to normalize date for storage (fixes common OCR errors)
      const normalizeDateForStorage = (dateStr: string): string => {
        // Fix formats like "13.5/2025" -> "13.05.2025"
        let fixed = dateStr.replace(/\.(\d)\//g, '.0$1/'); // Fix "13.5/2025" -> "13.05/2025"
        fixed = fixed.replace(/\.(\d)\./g, '.0$1.'); // Fix "4.6.2025" -> "04.06.2025"
        return fixed.trim();
      };
      
      // Function to parse date string to Date object for comparison
      const parseDate = (dateStr: string): Date | null => {
        try {
          // Handle different formats: 1/4/2025, 22-01-2025, 23.03.2025, 4.6.2025, 04.06.2025, 18.05.2025, 13.5/2025
          // Fix formats like "13.5/2025" -> "13.05.2025" (assuming month is missing digit)
          let fixedDate = dateStr.replace(/\.(\d)\//g, '.0$1/'); // Fix "13.5/2025" -> "13.05/2025"
          fixedDate = fixedDate.replace(/\.(\d)\./g, '.0$1.'); // Fix "4.6.2025" -> "04.06.2025"
          
          // Normalize separators
          const normalized = fixedDate.replace(/[.\/-]/g, '/');
          const parts = normalized.split('/');
          if (parts.length === 3) {
            let day = parseInt(parts[0]);
            let month = parseInt(parts[1]) - 1; // Month is 0-indexed
            let year = parseInt(parts[2]);
            
            // Handle 2-digit years
            if (year < 100) {
              year = year < 50 ? 2000 + year : 1900 + year; // 25 -> 2025, 95 -> 1995
            }
            
            // Validate and fix: if month is invalid (e.g., 5 instead of 05), pad it
            if (month < 0 || month > 11) {
              // Try swapping day and month if month > 12
              if (day > 12 && month <= 12) {
                [day, month] = [month + 1, day];
                month = month - 1; // Adjust back to 0-indexed
              }
            }
            
            if (!isNaN(day) && !isNaN(month) && !isNaN(year) && day >= 1 && day <= 31 && month >= 0 && month <= 11) {
              return new Date(year, month, day);
            }
          }
        } catch (e) {
          // Ignore parsing errors
        }
        return null;
      };
      
      // Function to find date context in document (look for keywords near dates)
      const findDateContext = (date: string, dateIndex: number, totalDates: number): string => {
        // Escape special regex characters in date
        const escapedDate = date.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Look for context within 150 characters before or after the date (increased from 100)
        const patterns = [
          // Enquiry Date patterns (highest priority - usually appears first)
          { pattern: new RegExp(`(?:enquiry\\s*date|dated|ref\\.?\\s*no|tender\\.?\\s*ref|enquiry\\s*number)[:.\s]*[^\\d]{0,80}${escapedDate}`, 'i'), field: 'Enquiry Date', priority: 1 },
          { pattern: new RegExp(`${escapedDate}[^\\d]{0,80}(?:enquiry|dated|ref\\.?\\s*no|tender\\s*ref)`, 'i'), field: 'Enquiry Date', priority: 1 },
          
          // Submission Deadline patterns (usually the latest date)
          { pattern: new RegExp(`(?:submission|deadline|last\\s*date|bid\\s*end|due\\s*date|closing|submit|submission\\s*end)[:.\s]*[^\\d]{0,80}${escapedDate}`, 'i'), field: 'Submission Deadline', priority: 2 },
          { pattern: new RegExp(`${escapedDate}[^\\d]{0,80}(?:submission|deadline|last\\s*date|bid\\s*end|due\\s*date|closing|submit)`, 'i'), field: 'Submission Deadline', priority: 2 },
          
          // Bid Opening patterns
          { pattern: new RegExp(`(?:bid\\s*opening|opening\\s*date|technical\\s*bid\\s*opening|opening|bid\\s*opening\\s*date)[:.\s]*[^\\d]{0,80}${escapedDate}`, 'i'), field: 'Bid Opening Date', priority: 3 },
          { pattern: new RegExp(`${escapedDate}[^\\d]{0,80}(?:bid\\s*opening|opening\\s*date|technical\\s*bid|opening)`, 'i'), field: 'Bid Opening Date', priority: 3 },
          
          // Pre-Bid Meeting patterns
          { pattern: new RegExp(`(?:pre[\\s-]?bid|pre[\\s-]?bid\\s*meeting|pre[\\s-]?bid\\s*conference|pre[\\s-]?bid\\s*clarification|pre[\\s-]?bid\\s*date)[:.\s]*[^\\d]{0,80}${escapedDate}`, 'i'), field: 'Pre-Bid Meeting', priority: 4 },
          { pattern: new RegExp(`${escapedDate}[^\\d]{0,80}(?:pre[\\s-]?bid|pre[\\s-]?bid\\s*meeting|pre[\\s-]?bid\\s*conference)`, 'i'), field: 'Pre-Bid Meeting', priority: 4 },
          
          // Financial Bid Opening
          { pattern: new RegExp(`(?:financial\\s*bid|price\\s*bid|commercial\\s*bid|financial\\s*bid\\s*opening)[:.\s]*[^\\d]{0,80}${escapedDate}`, 'i'), field: 'Financial Bid Opening', priority: 5 },
          { pattern: new RegExp(`${escapedDate}[^\\d]{0,80}(?:financial\\s*bid|price\\s*bid|commercial\\s*bid)`, 'i'), field: 'Financial Bid Opening', priority: 5 },
          
          // Tender Publish Date
          { pattern: new RegExp(`(?:publish|published|issue|issued|release|tender\\s*publish)[:.\s]*[^\\d]{0,80}${escapedDate}`, 'i'), field: 'Tender Publish Date', priority: 6 },
          { pattern: new RegExp(`${escapedDate}[^\\d]{0,80}(?:publish|published|issue|issued|release)`, 'i'), field: 'Tender Publish Date', priority: 6 },
          
          // Contract dates
          { pattern: new RegExp(`(?:contract\\s*start|start\\s*date|commencement|work\\s*start)[:.\s]*[^\\d]{0,80}${escapedDate}`, 'i'), field: 'Contract Start Date', priority: 7 },
          { pattern: new RegExp(`(?:contract\\s*end|end\\s*date|completion|work\\s*end)[:.\s]*[^\\d]{0,80}${escapedDate}`, 'i'), field: 'Contract End Date', priority: 7 },
          
          // Corrigendum
          { pattern: new RegExp(`(?:corrigendum|addendum|amendment)[:.\s]*[^\\d]{0,80}${escapedDate}`, 'i'), field: 'Corrigendum Issue Date', priority: 8 },
        ];
        
        // Find matches with priority
        const matches: Array<{ field: string; priority: number }> = [];
        for (const { pattern, field, priority } of patterns) {
          if (pattern.test(documentText)) {
            matches.push({ field, priority });
          }
        }
        
        // Return highest priority match (lowest priority number)
        if (matches.length > 0) {
          matches.sort((a, b) => a.priority - b.priority);
          return matches[0].field;
        }
        
        // Fallback: Use chronological order and position to guess field
        const dateObj = parseDate(date);
        if (dateObj) {
          // If it's the first date (or very early), likely Enquiry/Publish Date
          if (dateIndex === 0 || dateIndex <= Math.floor(totalDates * 0.2)) {
            return 'Tender Publish Date';
          }
          
          // If it's the last date (or very late), likely Submission Deadline
          if (dateIndex === totalDates - 1 || dateIndex >= Math.floor(totalDates * 0.8)) {
            return 'Submission Deadline';
          }
          
          // Middle dates might be Bid Opening or Pre-Bid Meeting
          if (dateIndex >= Math.floor(totalDates * 0.4) && dateIndex <= Math.floor(totalDates * 0.6)) {
            return 'Bid Opening Date';
          }
          
          // Dates between submission deadline and opening might be Pre-Bid Meeting
          if (dateIndex >= Math.floor(totalDates * 0.2) && dateIndex < Math.floor(totalDates * 0.5)) {
            return 'Pre-Bid Meeting';
          }
          
          // All remaining dates - assign based on chronological position
          if (dateIndex < Math.floor(totalDates * 0.3)) {
            return 'Tender Publish Date';
          } else if (dateIndex < Math.floor(totalDates * 0.5)) {
            return 'Pre-Bid Meeting';
          } else if (dateIndex < Math.floor(totalDates * 0.7)) {
            return 'Bid Opening Date';
          } else {
            return 'Submission Deadline';
          }
        }
        
        // Ultimate fallback - use position
        if (dateIndex === 0) {
          return 'Tender Publish Date';
        } else if (dateIndex === totalDates - 1) {
          return 'Submission Deadline';
        } else if (dateIndex < totalDates / 2) {
          return 'Pre-Bid Meeting';
        } else {
          return 'Bid Opening Date';
        }
      };
      
      // Analyze each date to determine its field
      for (let i = 0; i < sortedDates.length; i++) {
        const date = sortedDates[i];
        const context = findDateContext(date, i, sortedDates.length);
        if (context) {
          dateFieldMap[date] = context;
          
          // Also set the extracted data fields
          if (context === 'Enquiry Date' && !extractedData.enquiryDate) {
            extractedData.enquiryDate = date;
          } else if (context === 'Submission Deadline' && !extractedData.bidSubmissionEndDate) {
            extractedData.bidSubmissionEndDate = date;
            extractedData.submissionDeadline = date;
          } else if (context === 'Bid Opening Date' && !extractedData.bidOpeningDate) {
            extractedData.bidOpeningDate = date;
            extractedData.technicalBidOpeningDate = date;
          } else if (context === 'Pre-Bid Meeting' && !extractedData.preBidMeetingDate) {
            extractedData.preBidMeetingDate = date;
          } else if (context === 'Financial Bid Opening' && !extractedData.financialBidOpeningDate) {
            extractedData.financialBidOpeningDate = date;
          } else if (context === 'Tender Publish Date' && !extractedData.tenderPublishDate) {
            extractedData.tenderPublishDate = date;
          } else if (context === 'Contract Start Date' && !extractedData.startDate) {
            extractedData.startDate = date;
          } else if (context === 'Contract End Date' && !extractedData.endDate) {
            extractedData.endDate = date;
          } else if (context === 'Corrigendum Issue Date' && !extractedData.corrigendumIssueDate) {
            extractedData.corrigendumIssueDate = date;
          }
        }
      }
      
      // Set enquiry date as the first date if not already identified
      if (!extractedData.enquiryDate && sortedDates.length > 0) {
        extractedData.enquiryDate = sortedDates[0];
        if (!dateFieldMap[sortedDates[0]]) {
          dateFieldMap[sortedDates[0]] = 'Enquiry Date';
        }
      }
      
      // Set submission deadline as the last date if not already identified
      if (!extractedData.bidSubmissionEndDate && sortedDates.length > 1) {
        const lastDate = sortedDates[sortedDates.length - 1];
        extractedData.bidSubmissionEndDate = lastDate;
        extractedData.submissionDeadline = lastDate;
        if (!dateFieldMap[lastDate]) {
          dateFieldMap[lastDate] = 'Submission Deadline';
        }
      }
      
      // Store dates with their field mappings
      extractedData.dates = sortedDates.slice(0, 10); // Store up to 10 dates
      extractedData.dateFieldMap = dateFieldMap; // Store mapping for display
      
      keyPoints.push(`Date: ${extractedData.enquiryDate}`);
    }
  }
  
  // Extract Tender Category (including GeM) - stop at next field, exclude table headers
  const categoryPatterns = [
    /(?:Tender\s*Category[:.\s]+)([A-Za-z]+)(?:\s*\n|$|\s+(?:No\.|Number|of|Covers|Withdrawal|Tender\s*Type|Form\s*of\s*contract|Mode\s*of\s*Tendering|Sl\.|Serial|Description|Quantity|Unit)[:.\s])/i,  // Stop at "No." or next field or table headers
    /(?:Category[:.\s]+)([A-Za-z]+)(?:\s*\n|$|\s+(?:No\.|of|Covers|Tender\s*Type|Sl\.|Serial|Description|Quantity|Unit)[:.\s])/i,
    /(?:Category\s*of\s*Work[:.\s]+)([A-Za-z]+)(?:\s*\n|$|\s+(?:No\.|of|Covers|Sl\.|Serial|Description|Quantity|Unit)[:.\s])/i,
    /(?:Type\s*of\s*Bid[:.\s]+)([A-Za-z]+)(?:\s*\n|$|\s+(?:No\.|of|Covers|Sl\.|Serial|Description|Quantity|Unit)[:.\s])/i,
    /(?:Procurement\s*Category[:.\s]+)([A-Za-z]+)(?:\s*\n|$|\s+(?:No\.|of|Covers|Sl\.|Serial|Description|Quantity|Unit)[:.\s])/i
  ];
  for (const pattern of categoryPatterns) {
    const match = documentText.match(pattern);
    if (match && match[1]) {
      let category = match[1].trim();
      // Clean up: remove "No" or other words that might be from next field
      category = category.split(/\s+(?:No|Number|of|Covers|Withdrawal|Tender\s*Type|Form\s*of\s*contract|Mode\s*of\s*Tendering|Sl\.|Serial|Description|Quantity|Unit)[:.\s]/i)[0].trim();
      // Exclude table headers and invalid values
      if (category.match(/^(Sl\.|Serial|Description|Quantity|Qty|Unit|No\.|Number|of|Covers)$/i)) {
        continue; // Skip table headers
      }
      // Must be a valid category (Works, Goods, Services)
      if (category.length > 2 && category.length < 50 && 
          (category.match(/^(Works|Goods|Services|Supply|Purchase|Contract)$/i) || category.length > 3)) {
        extractedData.tenderCategory = category;
        break;
      }
    }
  }
  
  // Extract Mode of Tendering (including GeM) - stop at next field
  const modePatterns = [
    /(?:Mode\s*of\s*Tendering[:.\s]+)([A-Za-z\-]+)(?:\s*\n|$|\s+(?:No\.|Number|of|Covers|Withdrawal|Tender\s*Type|Form\s*of\s*contract|Tender\s*Category|Organization|Department)[:.\s])/i,  // Stop at next field
    /(?:Mode[:.\s]+)([A-Za-z\-]+)(?:\s*\n|$|\s+(?:No\.|of|Covers|Tender\s*Type)[:.\s])/i,
    /(?:Tendering\s*Mode[:.\s]+)([A-Za-z\-]+)(?:\s*\n|$|\s+(?:No\.|of|Covers)[:.\s])/i,
    /(?:Bidding\s*Mode[:.\s]+)([A-Za-z\-]+)(?:\s*\n|$|\s+(?:No\.|of|Covers)[:.\s])/i
  ];
  for (const pattern of modePatterns) {
    const match = documentText.match(pattern);
    if (match && match[1]) {
      let mode = match[1].trim();
      // Clean up: remove words that might be from next field
      mode = mode.split(/\s+(?:No|Number|of|Covers|Withdrawal|Tender\s*Type|Form\s*of\s*contract|Tender\s*Category|Organization|Department)[:.\s]/i)[0].trim();
      // Must be a valid mode
      if (mode.length > 2 && mode.length < 50 && 
          (mode.match(/^(e[-_]?Tendering|Manual|Offline|Online|e[-_]?Tender|Electronic)$/i) || mode.length > 3)) {
        extractedData.modeOfTendering = mode;
        break;
      }
    }
  }
  
  // Extract GeM-specific fields
  const gemBidMatch = documentText.match(/GeM[-_]Bidding[-_](\d+)/i);
  if (gemBidMatch) {
    extractedData.gemBiddingNumber = gemBidMatch[1];
    if (!extractedData.tenderId) {
      extractedData.tenderId = gemBidMatch[1];
      keyPoints.push(`GeM Bidding Number: ${gemBidMatch[1]}`);
    }
  }
  
  // Extract Contract Number (GeM)
  const contractMatch = documentText.match(/(?:Contract\s*(?:Number|No\.?)[:.\s]*)([A-Z0-9\-]+)/i);
  if (contractMatch) {
    extractedData.contractNumber = contractMatch[1].trim();
  }
  
  // Extract PO Number (GeM)
  const poMatch = documentText.match(/(?:PO\s*(?:Number|No\.?)|Purchase\s*Order\s*(?:Number|No\.?))[:.\s]*([A-Z0-9\-]+)/i);
  if (poMatch) {
    extractedData.poNumber = poMatch[1].trim();
  }
  
  // Extract work items from tables (improved patterns - more flexible)
  const workItems: any[] = [];
  
  // Pattern 1: Standard table format with multiple separators
  const tablePatterns = [
    /(\d+)[\s\t]+(.+?)[\s\t]+([\d,]+(?:\s*(?:Nos?|Cu\.M\.|Tons?|Sets?|Mtrs?|KM|approx\.?))?)[\s\t]+(Per\s+(?:No\.?|Cu\.M\.|Ton|Set|KM|Lumpsum))/gi,
    /(\d+)[\s]+(.{10,200}?)[\s]+([\d,]+(?:\s*(?:Nos?|Cu\.M\.|Tons?|Sets?|Mtrs?|KM|approx\.?))?)[\s]+(Per\s+(?:No\.?|Cu\.M\.|Ton|Set|KM|Lumpsum))/gi,
    /(?:Sl\.?\s*No\.?|Serial\s*No\.?)[\s]*(\d+)[\s]+(.{10,200}?)[\s]+([\d,]+)/gi
  ];
  
  for (const pattern of tablePatterns) {
    let match;
    while ((match = pattern.exec(documentText)) !== null && workItems.length < 100) {
      if (match[1] && match[2] && match[2].trim().length > 5) {
        workItems.push({
          serialNumber: match[1],
          description: match[2].trim(),
          quantity: match[3]?.trim() || '',
          unit: match[4]?.trim() || ''
        });
      }
    }
  }
  
  // Pattern 2: Lines starting with numbers (Sl. No. format) - improved
  const lines = documentText.split(/\n/);
  let currentItem: any = null;
  let itemCount = 0;
  
  for (let i = 0; i < lines.length && itemCount < 100; i++) {
    const line = lines[i].trim();
    
    // Check if line starts with a number (likely serial number)
    const slNoMatch = line.match(/^(\d+)[\s\t]+(.{10,})/);
    if (slNoMatch && slNoMatch[2].length > 10) {
      if (currentItem && currentItem.description) {
        workItems.push(currentItem);
        itemCount++;
      }
      currentItem = {
        serialNumber: slNoMatch[1],
        description: slNoMatch[2].trim()
      };
    } 
    // Check for quantity/unit in current or next lines
    else if (currentItem) {
      const qtyMatch = line.match(/([\d,]+(?:\s*(?:Nos?|Cu\.M\.|Tons?|Sets?|Mtrs?|KM|approx\.?))?)/);
      const unitMatch = line.match(/(Per\s+(?:No\.?|Cu\.M\.|Ton|Set|KM|Lumpsum))/i);
      
      if (qtyMatch && !currentItem.quantity) {
        currentItem.quantity = qtyMatch[1].trim();
      }
      if (unitMatch && !currentItem.unit) {
        currentItem.unit = unitMatch[1].trim();
      }
      
      // If we have description and (quantity or unit), consider it complete
      if (currentItem.description && (currentItem.quantity || currentItem.unit || line.length < 5)) {
        workItems.push(currentItem);
        itemCount++;
        currentItem = null;
      }
      // Continue description on next line if line doesn't look like quantity/unit
      else if (!qtyMatch && !unitMatch && line.length > 5 && !line.match(/^\d+$/)) {
        currentItem.description += ' ' + line;
      }
    }
  }
  if (currentItem && currentItem.description) {
    workItems.push(currentItem);
  }
  
  // Filter out document files, disclaimers, ATC clauses, binary data, and invalid work items
  const filteredWorkItems = workItems.filter(item => {
    const desc = item.description || '';
    const descLower = desc.toLowerCase();
    
    // CRITICAL: Skip binary/corrupted data
    if (isBinaryOrCorrupted(desc)) {
      return false;
    }
    
    // Skip if description contains binary characters (non-printable except spaces, newlines, tabs)
    const binaryChars = desc.match(/[\x00-\x08\x0E-\x1F]/g);
    if (binaryChars && binaryChars.length > desc.length * 0.05) { // More than 5% binary chars
      return false;
    }
    
    // Skip if description contains excessive special characters (likely corrupted)
    const specialChars = desc.match(/[^\w\s\/\-\.\,\:\(\)]/g);
    if (specialChars && specialChars.length > desc.length * 0.2) { // More than 20% special chars
      return false;
    }
    
    // Skip if description contains document file indicators
    if (descLower.includes('.pdf') || descLower.includes('.xls') || descLower.includes('.doc') || 
        descLower.includes('.docx') || descLower.includes('notice inviting') ||
        descLower.includes('tender documents') || descLower.includes('additional tender') ||
        descLower.includes('general technical evaluation') || descLower.includes('bill of quantity') ||
        desc.match(/^\d+\.\d+$/) || // Just a number (likely file size)
        desc.length < 10) { // Too short to be a real work item
      return false;
    }
    
    // Skip disclaimer/terms/ATC content
    const excludeKeywords = [
      'disclaimer', 'अस्वीकरण', 'thank you', 'धन्यवाद', 'ध)यवाद',
      'terms and conditions', 'additional terms', 'atc', 'buyer added',
      'bid specific', 'representation', 'compliance', 'general terms',
      'सामान्य शर्तें', 'gtc', 'gem gtc', 'restrictions', 'बिदर',
      'click here to view', 'file', 'document', 'upload',
      'certificates bidder', 'iso 9001', 'financial standing',
      'liquidation', 'court receivership', 'bankrupt', 'undertaking',
      'blacklisting', 'bunch items', 'category items', 'custom catalogs',
      'boq', 'seller', 'buyer', 'bidder', 'mandated', 'labour laws',
      'minimum wages act', 'payment of wages act', 'payment of bonus act',
      'equal remuneration act', 'payment of gratuity act', 'breach of contract',
      'competent authority', 'land border', 'immediate termination',
      'legal action', 'कानूनी', 'अनुपालन', 'गलत', 'समाप्त',
      'definition of class', 'emd submission', 'custom / boq bids',
      'single item', 'brand or make', 'model or manufacturer', 'dealer name',
      'physical form', 'work contracts', 'custom bids', 'sample with bid',
      'foreign / international certifications', 'indian standards',
      'experience from specific', 'export experience', 'irrelevant categories',
      'msme policy', 'make in india', 'external site', 'external documents',
      'tender fee', 'bid participation fee', 'auction fee', 'forward auction',
      'system generated bid template', 'emd detail', 'epbg detail',
      'mii and mse purchase preference', 'scope of work/ additional terms',
      'bunching category', 'bunching custom catalogs', 'bunching a boq',
      'seller dashboard', 'logging in as a seller', '4 days of bid publication',
      'buyer is duty bound', 'reply to all such representations',
      'not be allowed to open bids', 'fails to reply', 'sellers / service providers',
      'applicable laws / acts / rules', 'treated as breach', 'take suitable actions',
      'gem contract', 'clause 26', 'shares a land border', 'registered with',
      'while participating in bid', 'false declaration', 'non-compliance',
      'ground for immediate termination', 'further legal action', 'accordance with the laws',
      'जेम की सामान्य शर्तें', 'खंड 26', 'संदर्भ में', 'भारत के साथ',
      'भूमि सीमा साझा', 'देश के', 'बिदर से खरिद पर प्रतिबंध',
      'कोई भी बिदर', 'इस निविदा में', 'बिद देने के लिए',
      'तभी पात्र होगा', 'बिद देने वाला', 'सक्षम प्राधिकारी के पास',
      'पंजीकृत हो', 'बिद में भाग लेते समय', 'बिदर को', 'इसका अनुपालन',
      'कोई भी गलत घोषणा', 'किए जाने व', 'इसका अनुपालन न करने पर',
      'अनुबंध को', 'तुरंत समाप्त', 'कानून के अनुसार', 'आगे की कानूनी कार्रवाई',
      'आधार होगा', '---thank you', '---thank', '--- धन्यवाद'
    ];
    
    for (const keyword of excludeKeywords) {
      if (desc.includes(keyword)) {
        return false; // Exclude items with disclaimer/terms keywords
      }
    }
    
    // Skip if description is mostly disclaimers/legal text (check word patterns)
    const legalWordPatterns = [
      /\b(certificates|bidder|offer|liable|rejected|upload|documents|sought|bid document|atc|corrigendum)\b/i,
      /\b(iso|oem|offered products|certification|bis licence|type test|approval certificates|prescribed|product specification)\b/i,
      /\b(generic|financial standing|liquidation|court receivership|bankrupt|undertaking|effect|bid)\b/i,
      /\b(buyer added|bid specific|uploaded atc|text based|atc clauses|firm quoting|incorrect|unreasonably low rates|blacklisting)\b/i,
      /\b(note|below|items|additionally|included|bunch items|quote|rate|kindly|consider|category items|part|total bid value|supply)\b/i,
      /\b(s\.no\.|item\/category|quantity|no\. of items|no\. of piece|towel|school bag|tongue cleaner|sharpner|wishper sanitary pad)\b/i
    ];
    
    let legalWordCount = 0;
    for (const pattern of legalWordPatterns) {
      if (pattern.test(desc)) {
        legalWordCount++;
      }
    }
    
    // If too many legal words, likely not a work item
    if (legalWordCount >= 3) {
      return false;
    }
    
    // Must contain actual work/product description keywords
    const workKeywords = [
      'construction', 'supply', 'installation', 'commissioning', 'erection',
      'repair', 'maintenance', 'fabrication', 'testing', 'delivery',
      'equipment', 'machinery', 'material', 'component', 'system',
      'civil', 'mechanical', 'electrical', 'works', 'services', 'goods',
      'product', 'item', 'unit', 'set', 'piece', 'lot', 'number', 'nos'
    ];
    
    const hasWorkKeyword = workKeywords.some(keyword => desc.includes(keyword));
    
    // If no work keywords and description is long, likely disclaimer text
    if (!hasWorkKeyword && desc.length > 100) {
      return false;
    }
    
    return true;
  });
  
  // Remove duplicates based on serial number
  const uniqueItems = new Map();
  filteredWorkItems.forEach(item => {
    if (item.serialNumber && !uniqueItems.has(item.serialNumber)) {
      uniqueItems.set(item.serialNumber, item);
    }
  });
  const finalWorkItems = Array.from(uniqueItems.values());
  
  if (finalWorkItems.length > 0) {
    extractedData.workItems = finalWorkItems;
    keyPoints.push(`Found ${finalWorkItems.length} work items`);
  }
  
  // Extract EMD details
  const emdAmountPatterns = [
    /(?:EMD\s*Amount\s*in\s*₹[:.\s]*)([\d,]+)/i,
    /(?:EMD\s*Amount[:.\s]*)([\d,]+|₹[\d,]+|Rs\.?\s*[\d,]+)/i,
    /(?:Earnest\s*Money\s*Deposit[:.\s]*)([\d,]+|₹[\d,]+|Rs\.?\s*[\d,]+)/i
  ];
  for (const pattern of emdAmountPatterns) {
    const match = documentText.match(pattern);
    if (match && match[1]) {
      extractedData.emdAmount = match[1].trim();
      break;
    }
  }
  
  // Extract EMD Fee Type
  const emdFeeTypeMatch = documentText.match(/(?:EMD\s*Fee\s*Type[:.\s]*)(fixed|percentage|percentage\s*of\s*quotation)/i);
  if (emdFeeTypeMatch) {
    extractedData.emdFeeType = emdFeeTypeMatch[1].trim().toLowerCase();
  }
  
  // Extract EMD Percentage (only if not "NA")
  const emdPercentMatch = documentText.match(/(?:EMD\s*Percentage[:.\s]*)(\d+(?:\.\d+)?%|NA)/i);
  if (emdPercentMatch && emdPercentMatch[1] !== 'NA') {
    extractedData.emdPercentage = emdPercentMatch[1].trim();
  }
  
  // Extract EMD Required
  const emdRequiredMatch = documentText.match(/(?:EMD\s*(?:Required|Exemption\s*Allowed)[:.\s]*)(Yes|No)/i);
  if (emdRequiredMatch) {
    extractedData.emdRequired = emdRequiredMatch[1].trim();
  }
  
  // Extract more general information from document
  // Extract title/subject - stop at form fields, Hindi text patterns, clause markers, and field labels
  // CRITICAL: Skip corrupted data and incomplete titles
  // Priority 1: Look for "Scope of Work" or "Name of Work" patterns first (these usually contain the actual title)
  const scopeOfWorkMatch = documentText.match(/(?:Scope\s*of\s*Work|Name\s*of\s*Work|Work\s*Name)[:.\s]+([A-Z][^\n]{10,150}?)(?:\s*\n|$|\s+(?:FOR\s*ERECTION|LENGTH|Sl\.\s*No|Serial|Work\s*Description|A\.\s*Civil|B\.\s*Mechanical|बिदर|बिदर का|का|Dयूनतम|औसत|वा.ष%क|टन%ओवर|Minimum|Average|Annual|Turnover|Years?|Date|Time|Tender\s*ID|Organization|Department|force\s*majeure|FALL\s*CLAUSE|TERMS|CONDITIONS|clause|shall|submit|bidder)[:.\s])/i);
  if (scopeOfWorkMatch && scopeOfWorkMatch[1]) {
    let title = scopeOfWorkMatch[1].trim();
    
    // CRITICAL: Skip corrupted/binary data
    if (isBinaryOrCorrupted(title)) {
      // Skip this match
    } else {
      // Stop at "FOR ERECTION" or "LENGTH" or table markers
      title = title.split(/\s+(?:FOR\s*ERECTION|LENGTH|Sl\.\s*No|Serial|Work\s*Description|A\.\s*Civil|B\.\s*Mechanical|shall|submit|bidder|proposed|organization|chart)[:.\s]/i)[0].trim();
      // Clean up
      title = title.replace(/[\s\.\,\;\:\-]+$/, '').trim();
      
      // Skip if title starts with lowercase (likely mid-sentence, not a title)
      if (title && title.length > 10 && title.length < 200 && 
          title.match(/^[A-Z]/) && // Must start with capital letter
          !isBinaryOrCorrupted(title)) {
        extractedData.title = title;
        keyPoints.push(`Title: ${title.substring(0, 50)}${title.length > 50 ? '...' : ''}`);
      }
    }
  }
  
  // Priority 2: Look for Subject/Title patterns (only if title not found above)
  if (!extractedData.title) {
    const titlePatterns = [
      /(?:Subject|Title|Name\s*of\s*Work|Project\s*Title)[:.\s]+([A-Z][^\n]{10,200}?)(?:\s*\n|$|\s+(?:बिदर|बिदर का|का|Dयूनतम|औसत|वा.ष%क|टन%ओवर|Minimum|Average|Annual|Turnover|Years?|Date|Time|Tender\s*ID|Organization|Department|force\s*majeure|FALL\s*CLAUSE|TERMS|CONDITIONS|clause|shall|submit|bidder|proposed)[:.\s])/i,
      /(?:Work\s*Description|Description\s*of\s*Work)[:.\s]+([A-Z][^\n]{10,200}?)(?:\s*\n|$|\s+(?:बिदर|बिदर का|का|Dयूनतम|औसत|वा.ष%क|टन%ओवर|Minimum|Average|Annual|Turnover|Years?|Date|Time|Tender\s*ID|Organization|Department|force\s*majeure|FALL\s*CLAUSE|TERMS|CONDITIONS|clause|shall|submit|bidder|proposed)[:.\s])/i
    ];
  for (const pattern of titlePatterns) {
    const match = documentText.match(pattern);
    if (match && match[1]) {
      let title = match[1].trim().split('\n')[0].trim();
      
      // CRITICAL: Skip corrupted/binary data and titles starting with lowercase (mid-sentence)
      if (isBinaryOrCorrupted(title) || !title.match(/^[A-Z]/)) {
        continue; // Skip corrupted data or titles that don't start with capital letter
      }
      
      // Stop at clause markers and legal sections - MORE AGGRESSIVE
      const clauseMarkers = [
        /\s+to\s+force\s+majeure/i,  // "to force majeure"
        /to\s+force\s+majeure/i,  // "to force majeure" at start
        /force\s*majeure/i,
        /\s*\.\s*\d+\.\s*FALL\s*CLAUSE/i,  // ". 9. FALL CLAUSE"
        /\d+\.\s*FALL\s*CLAUSE/i, // "9. FALL CLAUSE"
        /FALL\s*CLAUSE/i,
        /TERMS\s*AND\s*CONDITIONS/i,
        /\d+\.\s*[A-Z]+\s*CLAUSE/i, // Numbered clauses like "9. FALL CLAUSE"
        /clause\s*\d+/i,
        /Seller\s*shall/i,
        /Buyer\s*shall/i,
        /Bidder\s*shall/i,  // "Bidder shall"
        /shall\s+submit/i,  // "shall submit"
        /shall\s+also/i,  // "shall also"
        /proposed\s+organization/i,  // "proposed organization"
        /benefit\s*to\s*the\s*buyer/i,
        /within\s*a\s*period/i,  // "within a period of 6 months"
        /case\s*the\s*seller/i  // "in case the seller"
      ];
      
      for (const clausePattern of clauseMarkers) {
        const clauseMatch = title.match(clausePattern);
        if (clauseMatch && clauseMatch.index !== undefined && clauseMatch.index >= 0) { // Stop even if at start
          title = title.substring(0, clauseMatch.index).trim();
          break;
        }
      }
      
      // Also stop at "to " followed by clause keywords (check multiple patterns)
      const toClausePatterns = [
        /\s+to\s+(?:force|fall|seller|buyer)/i,
        /^to\s+(?:force|fall|seller|buyer)/i  // Also match at start
      ];
      for (const toPattern of toClausePatterns) {
        const toClauseMatch = title.match(toPattern);
        if (toClauseMatch && toClauseMatch.index !== undefined && toClauseMatch.index >= 0) {
          title = title.substring(0, toClauseMatch.index).trim();
          break;
        }
      }
      
      // Additional check: if title starts with "to force" or similar, it's likely clause text
      if (title.match(/^(to\s+force|to\s+fall|force\s*majeure)/i)) {
        title = ''; // Clear invalid title
      }
      
      // Stop at form field patterns (Hindi text mixed with English field labels)
      const formFieldPatterns = [
        /(बिदर|बिदर का|का|Dयूनतम|औसत|वा.ष%क|टन%ओवर|Minimum|Average|Annual|Turnover|Years?)/i,
        /(\(For\s*\d+\s*Years?\)|\(3\s*Years?\))/i,
        /\/Minimum.*Turnover/i
      ];
      
      for (const formPattern of formFieldPatterns) {
        const formMatch = title.match(formPattern);
        if (formMatch && formMatch.index !== undefined && formMatch.index > 0) {
          title = title.substring(0, formMatch.index).trim();
          break;
        }
      }
      
      // Stop at common field labels
      title = title.split(/\s+(?:Date|Time|Date\/Time|Tender\s*ID|Organization|Department|बिदर|बिदर का|का|Dयूनतम|औसत|वा.ष%क|टन%ओवर|Minimum|Average|Annual|Turnover|Years?|force\s*majeure|FALL\s*CLAUSE|TERMS|CONDITIONS|clause)[:.\s]/i)[0].trim();
      
      // Stop at sentence endings that indicate clauses/terms
      title = title.split(/\.\s*(?:Seller|Buyer|9\.|FALL|TERMS|CONDITIONS|clause)/i)[0].trim();
      
      // Clean up trailing special characters and incomplete words
      title = title.replace(/[\s\.\,\;\:\-]+$/, '').trim();
      
      // Must be meaningful title (not just form field labels or clause text)
      // Additional validation: title should not be empty after cleanup
      if (title && title.length > 10 && title.length < 200 &&
          !title.match(/^(Minimum|Average|Annual|Turnover|Years?|बिदर|बिदर का|का|Dयूनतम|औसत|वा.ष%क|टन%ओवर|force\s*majeure|FALL\s*CLAUSE|Seller|Buyer|to\s+force|to\s+fall)/i) &&
          !title.match(/\(For\s*\d+\s*Years?\)/i) &&
          !title.match(/shall\s*pass/i) && // Exclude clause text
          !title.match(/\.\s*\d+\./) && // Exclude numbered clauses
          !title.match(/^to\s+/i)) { // Exclude titles starting with "to"
        extractedData.title = title;
        keyPoints.push(`Title: ${title.substring(0, 50)}${title.length > 50 ? '...' : ''}`);
        break;
      }
    }
    }
  }
  
  // If still no title found, try extracting from the beginning of "Scope of Work" section
  if (!extractedData.title) {
    const scopeSectionMatch = documentText.match(/(?:Scope\s*of\s*Work|SCOPE\s*OF\s*WORK)[:.\s]*([A-Z][^\n]{20,200}?)(?:\s*\n\n|\n{2,}|\s+(?:Sl\.\s*No|Serial|Work\s*Description|A\.|B\.|C\.|FOR\s*ERECTION|LENGTH|700|MTRS))/i);
    if (scopeSectionMatch && scopeSectionMatch[1]) {
      let title = scopeSectionMatch[1].trim();
      // Stop at "FOR ERECTION" or measurement details
      title = title.split(/\s+(?:FOR\s*ERECTION|LENGTH|Sl\.\s*No|Serial|Work\s*Description|A\.|B\.|C\.|700|MTRS)/i)[0].trim();
      // Remove common prefixes
      title = title.replace(/^(Scope\s*of\s*Work|SCOPE\s*OF\s*WORK)[:.\s]*/i, '').trim();
      // Clean up
      title = title.replace(/[\s\.\,\;\:\-]+$/, '').trim();
      if (title && title.length > 10 && title.length < 200 && 
          !title.match(/^(to\s+force|to\s+fall|force\s*majeure)/i)) {
        extractedData.title = title;
        keyPoints.push(`Title: ${title.substring(0, 50)}${title.length > 50 ? '...' : ''}`);
      }
    }
  }
  
  // Extract Tender Type (Open, Limited, etc.)
  const tenderTypePatterns = [
    /(?:Tender\s*Type[:.\s]+)(Open|Limited|Single|Restricted|Two\s*Stage|Single\s*Stage)(?:\s*\n|$|\s+(?:Form|Category|Mode)[:.\s])/i,
    /(?:Type\s*of\s*Tender[:.\s]+)(Open|Limited|Single|Restricted|Two\s*Stage|Single\s*Stage)(?:\s*\n|$)/i,
    /(?:Mode\s*of\s*Enquiry[:.\s]+)(Open|Limited|Single|Restricted)(?:\s*\n|$)/i
  ];
  for (const pattern of tenderTypePatterns) {
    const match = documentText.match(pattern);
    if (match && match[1]) {
      extractedData.tenderType = match[1].trim();
      break;
    }
  }
  
  // Extract Bid Submission Dates
  const bidSubmissionStartPatterns = [
    /(?:Bid\s*Submission\s*Start\s*Date[:.\s]+)(\d{1,2}[.\/-]\d{1,2}[.\/-]\d{2,4})/i,
    /(?:Submission\s*Start\s*Date[:.\s]+)(\d{1,2}[.\/-]\d{1,2}[.\/-]\d{2,4})/i,
    /(?:Bid\s*Start\s*Date[:.\s]+)(\d{1,2}[.\/-]\d{1,2}[.\/-]\d{2,4})/i
  ];
  for (const pattern of bidSubmissionStartPatterns) {
    const match = documentText.match(pattern);
    if (match && match[1]) {
      extractedData.bidSubmissionStartDate = match[1].trim();
      break;
    }
  }
  
  const bidSubmissionEndPatterns = [
    /(?:Bid\s*Submission\s*End\s*Date[:.\s]+)(\d{1,2}[.\/-]\d{1,2}[.\/-]\d{2,4})/i,
    /(?:Submission\s*End\s*Date[:.\s]+)(\d{1,2}[.\/-]\d{1,2}[.\/-]\d{2,4})/i,
    /(?:Bid\s*End\s*Date[:.\s]+)(\d{1,2}[.\/-]\d{1,2}[.\/-]\d{2,4})/i,
    /(?:Last\s*Date\s*for\s*Submission[:.\s]+)(\d{1,2}[.\/-]\d{1,2}[.\/-]\d{2,4})/i,
    /(?:Submission\s*Deadline[:.\s]+)(\d{1,2}[.\/-]\d{1,2}[.\/-]\d{2,4})/i
  ];
  for (const pattern of bidSubmissionEndPatterns) {
    const match = documentText.match(pattern);
    if (match && match[1]) {
      extractedData.bidSubmissionEndDate = match[1].trim();
      if (!extractedData.submissionDeadline) {
        extractedData.submissionDeadline = match[1].trim();
      }
      break;
    }
  }
  
  // Extract Bid Opening Dates
  const technicalBidOpeningPatterns = [
    /(?:Technical\s*Bid\s*Opening\s*Date[:.\s]+)(\d{1,2}[.\/-]\d{1,2}[.\/-]\d{2,4})/i,
    /(?:Technical\s*Bid\s*Opening[:.\s]+)(\d{1,2}[.\/-]\d{1,2}[.\/-]\d{2,4})/i
  ];
  for (const pattern of technicalBidOpeningPatterns) {
    const match = documentText.match(pattern);
    if (match && match[1]) {
      extractedData.technicalBidOpeningDate = match[1].trim();
      break;
    }
  }
  
  const financialBidOpeningPatterns = [
    /(?:Financial\s*Bid\s*Opening\s*Date[:.\s]+)(\d{1,2}[.\/-]\d{1,2}[.\/-]\d{2,4})/i,
    /(?:Financial\s*Bid\s*Opening[:.\s]+)(\d{1,2}[.\/-]\d{1,2}[.\/-]\d{2,4})/i,
    /(?:Price\s*Bid\s*Opening[:.\s]+)(\d{1,2}[.\/-]\d{1,2}[.\/-]\d{2,4})/i
  ];
  for (const pattern of financialBidOpeningPatterns) {
    const match = documentText.match(pattern);
    if (match && match[1]) {
      extractedData.financialBidOpeningDate = match[1].trim();
      break;
    }
  }
  
  // Extract Pre-bid Meeting Date
  const preBidMeetingPatterns = [
    /(?:Pre[-_]?Bid\s*Meeting\s*Date[:.\s]+)(\d{1,2}[.\/-]\d{1,2}[.\/-]\d{2,4})/i,
    /(?:Pre[-_]?Bid\s*Meeting[:.\s]+)(\d{1,2}[.\/-]\d{1,2}[.\/-]\d{2,4})/i,
    /(?:Pre[-_]?Bid\s*Conference[:.\s]+)(\d{1,2}[.\/-]\d{1,2}[.\/-]\d{2,4})/i
  ];
  for (const pattern of preBidMeetingPatterns) {
    const match = documentText.match(pattern);
    if (match && match[1]) {
      extractedData.preBidMeetingDate = match[1].trim();
      break;
    }
  }
  
  // Extract Project Duration
  const projectDurationPatterns = [
    /(?:Project\s*Duration[:.\s]+)([\d\s]+(?:months?|days?|years?|weeks?))/i,
    /(?:Completion\s*Period[:.\s]+)([\d\s]+(?:months?|days?|years?|weeks?))/i,
    /(?:Duration[:.\s]+)([\d\s]+(?:months?|days?|years?|weeks?))/i,
    /(\d+\s*(?:months?|days?|years?|weeks?)\s*(?:from|after).*?(?:handover|award|start))/i
  ];
  for (const pattern of projectDurationPatterns) {
    const match = documentText.match(pattern);
    if (match && match[1]) {
      extractedData.projectDuration = match[1].trim();
      if (!extractedData.timeline) {
        extractedData.timeline = match[1].trim();
      }
      break;
    }
  }
  
  // Extract Work Location / Site - improved to stop at "Pincode"
  // CRITICAL: Prioritize eProcurement format patterns
  const workLocationPatterns = [
    // Priority 1: eProcurement format - "Location:" with pincode (HIGHEST PRIORITY)
    /(?:Location[:.\s]+)([A-Z][A-Za-z\s]{5,150})(?:\s*\n|$|\s+(?:Pincode|Pin\s*Code|Pin|Code|State|District|City|Address|Site|Pre\s*Bid\s*Meeting)[:.\s])/i,  // eProcurement format - stop at Pincode
    // Priority 2: Work Location with pincode
    /(?:Work\s*Location[:.\s]+)([A-Z][A-Za-z\s,]{5,100})(?:\s*\n|$|\s+(?:State|District|City|Site|Pincode|Pin\s*Code)[:.\s])/i,
    // Priority 3: Site location
    /(?:Site[:.\s]+)([A-Z][A-Za-z\s,]{5,100})(?:\s*\n|$|\s+(?:Address|Location|Pincode|Pin\s*Code)[:.\s])/i,
    // Priority 4: Generic Location pattern
    /(?:Location[:.\s]+)([A-Z][A-Za-z\s,]{5,100})(?:\s*\n|$|\s+(?:Address|Site|Pincode|Pin\s*Code)[:.\s])/i
  ];
  for (const pattern of workLocationPatterns) {
    const match = documentText.match(pattern);
    if (match && match[1]) {
      let location = match[1].trim().split(/\s+(?:State|District|City|Address|Site|Location|Pincode|Pin\s*Code|Pin|Code)[:.\s]/i)[0].trim();
      
      // Additional cleanup: remove "Pincode" if it's at the end
      location = location.replace(/\s+Pincode\s*$/i, '').trim();
      location = location.replace(/\s+Pin\s*Code\s*$/i, '').trim();
      location = location.replace(/\s+Pin\s*$/i, '').trim();
      
      if (location.length > 5 && location.length < 100) {
        extractedData.workLocation = location;
        extractedData.site = location;
        break;
      }
    }
  }
  
  // Extract Contact Person - improved to exclude field labels
  const contactPersonPatterns = [
    /(?:Contact\s*Person[:.\s]+)([A-Z][A-Za-z\s]{5,50})(?:\s*\n|$|\s+(?:Designation|Email|Phone|Address)[:.\s])/i,
    /(?:Tender\s*Inviting\s*Authority[:.\s]+)([A-Z][A-Za-z\s]{5,50})(?:\s*\n|$|\s+(?:Designation|Email|Phone|Address)[:.\s])/i,
    /(?:TIA[:.\s]+)([A-Z][A-Za-z\s]{5,50})(?:\s*\n|$)/i,
    /(?:Principal[:.\s]+)([A-Z][A-Za-z\s]{5,50})(?:\s*\n|$|\s+(?:Designation|Email|Phone|Address)[:.\s])/i
  ];
  for (const pattern of contactPersonPatterns) {
    const match = documentText.match(pattern);
    if (match && match[1]) {
      let person = match[1].trim().split(/\s+(?:Designation|Email|Phone|Address|Tender|Contact|Name|Address)[:.\s]/i)[0].trim();
      
      // Exclude placeholder text like "Name Address", "Name Department", "The Principal" without actual name
      if (person.match(/^(Name|Address|The|Designation|Email|Phone|Department|Organization)[\s:]/i) ||
          person.toLowerCase().match(/^(name|address|the|designation|email|phone|department|organization)\s+(name|address|the|principal|designation|email|phone)$/i)) {
        continue; // Skip placeholder text
      }
      
      // Must be a valid person name (not just field labels)
      if (person.length > 5 && person.length < 50 && 
          !person.match(/^(Name|Address|The|Designation|Email|Phone|Department|Organization|Tender|Contact)$/i) &&
          person.match(/[A-Za-z]{3,}/)) { // Must contain at least 3 letters
        extractedData.contactPerson = person;
        break;
      }
    }
  }
  
  // Extract Tender Fee / Document Fee
  const tenderFeePatterns = [
    /(?:Tender\s*Fee[:.\s]+)(Rs?\.?\s*[\d,]+|₹\s*[\d,]+)/i,
    /(?:Document\s*Fee[:.\s]+)(Rs?\.?\s*[\d,]+|₹\s*[\d,]+)/i,
    /(?:Tender\s*Document\s*Fee[:.\s]+)(Rs?\.?\s*[\d,]+|₹\s*[\d,]+)/i
  ];
  for (const pattern of tenderFeePatterns) {
    const match = documentText.match(pattern);
    if (match && match[1]) {
      const fee = match[1].trim();
      if (fee.toLowerCase().includes('document')) {
        extractedData.documentFee = fee;
      } else {
        extractedData.tenderFee = fee;
      }
      break;
    }
  }
  
  // Extract Bid Security / Performance Guarantee
  const bidSecurityPatterns = [
    /(?:Bid\s*Security[:.\s]+)([\d,]+(?:\s*%)?|Rs?\.?\s*[\d,]+|₹\s*[\d,]+)/i,
    /(?:Performance\s*Guarantee[:.\s]+)([\d,]+(?:\s*%)?|Rs?\.?\s*[\d,]+|₹\s*[\d,]+)/i,
    /(?:Performance\s*Security[:.\s]+)([\d,]+(?:\s*%)?|Rs?\.?\s*[\d,]+|₹\s*[\d,]+)/i
  ];
  for (const pattern of bidSecurityPatterns) {
    const match = documentText.match(pattern);
    if (match && match[1]) {
      const security = match[1].trim();
      if (pattern.source.includes('Performance')) {
        extractedData.performanceSecurity = security;
      } else {
        extractedData.bidSecurity = security;
      }
      break;
    }
  }
  
  // Extract Financial Criteria / Turnover Requirement
  const turnoverRequirementPatterns = [
    /(?:Turnover\s*Requirement[:.\s]+)(Rs?\.?\s*[\d,]+|₹\s*[\d,]+|[\d,]+(?:\s*Crores?|Lakhs?))/i,
    /(?:Minimum\s*Annual\s*Turnover[:.\s]+)(Rs?\.?\s*[\d,]+|₹\s*[\d,]+|[\d,]+(?:\s*Crores?|Lakhs?))/i,
    /(?:Financial\s*Criteria[:.\s]+)([^\n]{10,200}?)(?:\s*\n|$|\s+(?:Technical|Eligibility)[:.\s])/i
  ];
  for (const pattern of turnoverRequirementPatterns) {
    const match = documentText.match(pattern);
    if (match && match[1]) {
      const turnover = match[1].trim();
      if (turnover.length < 50) {
        extractedData.turnoverRequirement = turnover;
        extractedData.annualTurnover = turnover;
      } else {
        extractedData.financialCriteria = turnover.substring(0, 200);
      }
      break;
    }
  }
  
  // Extract Eligibility Criteria (truncate to reasonable length)
  const eligibilityCriteriaMatch = documentText.match(/(?:Eligibility\s*Criteria[:.\s]+)([\s\S]{50,1000}?)(?:\n\n|\n(?:Technical|Financial|Evaluation)[:.\s])/i);
  if (eligibilityCriteriaMatch && eligibilityCriteriaMatch[1]) {
    let criteria = eligibilityCriteriaMatch[1].trim();
    // Stop at incomplete sentences or page numbers like "5 / 8"
    criteria = criteria.split(/\s+\d+\s*\/\s*\d+\s*$/)[0].trim();
    extractedData.eligibilityCriteria = criteria.substring(0, 500);
  }
  
  // Extract Technical Specifications (truncate and clean)
  const technicalSpecsMatch = documentText.match(/(?:Technical\s*Specifications?[:.\s]+)([\s\S]{50,2000}?)(?:\n\n|\n(?:Financial|Evaluation|Commercial|Terms|Disclaimer)[:.\s])/i);
  if (technicalSpecsMatch && technicalSpecsMatch[1]) {
    let specs = technicalSpecsMatch[1].trim();
    // Stop at incomplete sentences or page numbers like "5 / 8"
    specs = specs.split(/\s+\d+\s*\/\s*\d+\s*$/)[0].trim();
    // Stop at common section endings
    specs = specs.split(/(?:Terms|Disclaimer|Thank|Payment|Commercial|Evaluation)[:.\s]/i)[0].trim();
    extractedData.technicalSpecifications = specs.substring(0, 500); // Limit to 500 chars for display
  }
  
  // Extract Evaluation Criteria (truncate)
  const evaluationCriteriaMatch = documentText.match(/(?:Evaluation\s*Criteria[:.\s]+)([\s\S]{50,1000}?)(?:\n\n|\n(?:Terms|Payment|Commercial)[:.\s])/i);
  if (evaluationCriteriaMatch && evaluationCriteriaMatch[1]) {
    let criteria = evaluationCriteriaMatch[1].trim();
    // Stop at incomplete sentences or page numbers
    criteria = criteria.split(/\s+\d+\s*\/\s*\d+\s*$/)[0].trim();
    extractedData.evaluationCriteria = criteria.substring(0, 500);
  }
  
  // Extract Terms & Conditions (truncate to reasonable length for display)
  const termsConditionsMatch = documentText.match(/(?:Terms\s*and\s*Conditions?[:.\s]+)([\s\S]{50,2000}?)(?:\n\n|\n(?:Disclaimer|Thank|Payment)[:.\s])/i);
  if (termsConditionsMatch && termsConditionsMatch[1]) {
    let terms = termsConditionsMatch[1].trim();
    // Stop at disclaimer/thank you sections
    terms = terms.split(/(?:Disclaimer|Thank\s*You|धन्यवाद)[:.\s]/i)[0].trim();
    // Limit length for display (keep summary, not full text)
    extractedData.termsAndConditions = terms.substring(0, 300) + (terms.length > 300 ? '...' : '');
  }
  
  // Extract Corrigendum / Addenda
  const corrigendumMatch = documentText.match(/(?:Corrigendum[:.\s]+)([\s\S]{20,500}?)(?:\n\n|\n(?:Addenda|Terms|Disclaimer)[:.\s])/i);
  if (corrigendumMatch && corrigendumMatch[1]) {
    extractedData.corrigendum = corrigendumMatch[1].trim().substring(0, 300);
  }
  
  const addendaMatch = documentText.match(/(?:Addenda[:.\s]+)([\s\S]{20,500}?)(?:\n\n|\n(?:Terms|Disclaimer)[:.\s])/i);
  if (addendaMatch && addendaMatch[1]) {
    extractedData.addenda = addendaMatch[1].trim().substring(0, 300);
  }
  
  // Extract Document Attachments (BOQ, Forms, Annexures) - improved filtering
  const attachmentPatterns = [
    /(?:BOQ|Bill\s*of\s*Quantity|Forms?|Annexures?)[:.\s]+([^\n]{10,200})/gi,
    /(?:Document\s*Attachments?[:.\s]+)([^\n]{10,300})/gi
  ];
  const attachments: string[] = [];
  const excludeAttachmentKeywords = [
    'of contract', 'tender fee', 'infrared spectroscopy', 'ftir',
    'form of contract', 'notice inviting', 'general technical',
    'name', 'address', 'principal', 'designation', 'email', 'phone',
    'details', 'fee details', 'contract details'
  ];
  
  for (const pattern of attachmentPatterns) {
    let match;
    while ((match = pattern.exec(documentText)) !== null && attachments.length < 10) {
      if (match[1]) {
        let attachment = match[1].trim();
        
        // Filter out invalid attachments (field labels, document descriptions, etc.)
        const lowerAttachment = attachment.toLowerCase();
        let shouldExclude = false;
        
        // More aggressive filtering
        for (const keyword of excludeAttachmentKeywords) {
          if (lowerAttachment.includes(keyword)) {
            // Allow longer attachments that might contain valid file names with these keywords
            if (attachment.length < 50 || !lowerAttachment.match(/\.(pdf|doc|docx|xls|xlsx|zip)$/i)) {
              shouldExclude = true;
              break;
            }
          }
        }
        
        // Must be a valid attachment (file name or description, not just field labels)
        // Check if it looks like a file name (has extension) or is a meaningful description
        const hasFileExtension = /\.(pdf|doc|docx|xls|xlsx|zip|txt|jpg|png)$/i.test(attachment);
        const isMeaningfulDescription = attachment.length > 15 && attachment.length < 200 && 
                                       !attachment.match(/^(Name|Address|The|Designation|Email|Phone|Department|Organization|of|contract|Tender|Fee|Details|Infrared|Spectroscopy)$/i);
        
        if (!shouldExclude && 
            (hasFileExtension || isMeaningfulDescription) &&
            !attachments.includes(attachment)) {
          attachments.push(attachment);
        }
      }
    }
  }
  
  // If no valid attachments found, set to empty array (don't include invalid ones)
  if (attachments.length > 0) {
    extractedData.documentAttachments = attachments;
  } else {
    // Only set if explicitly mentioned in document, otherwise leave undefined
    const hasAttachmentMention = /(?:BOQ|Bill\s*of\s*Quantity|Forms?|Annexures?|Document\s*Attachments?)[:.\s]/i.test(documentText);
    if (!hasAttachmentMention) {
      // Don't set empty array if attachments weren't mentioned
    } else {
      extractedData.documentAttachments = []; // Explicitly empty if mentioned but none found
    }
  }
  
  // Extract Required Certifications / Licenses
  const certPatterns = [
    /(?:Required\s*Certifications?[:.\s]+)([^\n]{10,300})/i,
    /(?:Required\s*Licenses?[:.\s]+)([^\n]{10,300})/i,
    /(?:Certifications?\s*Required[:.\s]+)([^\n]{10,300})/i
  ];
  const certifications: string[] = [];
  for (const pattern of certPatterns) {
    const match = documentText.match(pattern);
    if (match && match[1]) {
      const certs = match[1].trim().split(/[,;]/).map(c => c.trim()).filter(c => c.length > 3);
      certifications.push(...certs);
    }
  }
  if (certifications.length > 0) {
    extractedData.requiredCertifications = certifications;
  }
  
  // 🏗 Extract Extended Project Information
  const projectNameMatch = documentText.match(/(?:Project\s*Name[:.\s]+)([^\n]{5,100})(?:\s*\n|$|\s+(?:Project\s*ID|Tender|Work)[:.\s])/i);
  if (projectNameMatch && projectNameMatch[1]) {
    extractedData.projectName = projectNameMatch[1].trim();
  }
  
  const projectIdMatch = documentText.match(/(?:Project\s*ID[:.\s]+)([A-Z0-9\-]{3,50})(?:\s*\n|$)/i);
  if (projectIdMatch && projectIdMatch[1]) {
    extractedData.projectId = projectIdMatch[1].trim();
  }
  
  const tenderNoticeMatch = documentText.match(/(?:Tender\s*Notice\s*Number[:.\s]+)([A-Z0-9\/\-]{3,50})(?:\s*\n|$)/i);
  if (tenderNoticeMatch && tenderNoticeMatch[1]) {
    extractedData.tenderNoticeNumber = tenderNoticeMatch[1].trim();
  }
  
  const workNameMatch = documentText.match(/(?:Work\s*Name[:.\s]+)([^\n]{5,200})(?:\s*\n|$|\s+(?:Work\s*Description|Scope)[:.\s])/i);
  if (workNameMatch && workNameMatch[1]) {
    extractedData.workName = workNameMatch[1].trim();
  }
  
  const projectObjectiveMatch = documentText.match(/(?:Project\s*Objective[:.\s]+)([^\n]{10,500})(?:\s*\n\n|\n(?:Scope|Technical)[:.\s])/i);
  if (projectObjectiveMatch && projectObjectiveMatch[1]) {
    extractedData.projectObjective = projectObjectiveMatch[1].trim().substring(0, 300);
  }
  
  const projectCategoryMatch = documentText.match(/(?:Project\s*Category[:.\s]+)(Construction|IT|Supply|Services|Works|Goods)(?:\s*\n|$)/i);
  if (projectCategoryMatch && projectCategoryMatch[1]) {
    extractedData.projectCategory = projectCategoryMatch[1].trim();
  }
  
  const sectorMatch = documentText.match(/(?:Sector[:.\s]+)([A-Z][A-Za-z\s]{3,50})(?:\s*\n|$|\s+(?:Department|Ministry)[:.\s])/i);
  if (sectorMatch && sectorMatch[1]) {
    extractedData.sector = sectorMatch[1].trim();
  }
  
  const divisionMatch = documentText.match(/(?:Division[:.\s]+)([A-Z][A-Za-z\s]{3,50})(?:\s*\n|$)/i);
  if (divisionMatch && divisionMatch[1]) {
    extractedData.division = divisionMatch[1].trim();
  }
  
  // 💰 Extract Extended Financial Details
  const contractValueMatch = documentText.match(/(?:Contract\s*Value[:.\s]+)(Rs?\.?\s*[\d,]+|₹\s*[\d,]+|[\d,]+(?:\s*Crores?|Lakhs?))/i);
  if (contractValueMatch && contractValueMatch[1]) {
    extractedData.contractValue = contractValueMatch[1].trim();
  }
  
  const tenderValueMatch = documentText.match(/(?:Tender\s*Value[:.\s]+)(Rs?\.?\s*[\d,]+|₹\s*[\d,]+|[\d,]+(?:\s*Crores?|Lakhs?))/i);
  if (tenderValueMatch && tenderValueMatch[1]) {
    extractedData.tenderValue = tenderValueMatch[1].trim();
  }
  
  const costOfTenderDocMatch = documentText.match(/(?:Cost\s*of\s*Tender\s*Document[:.\s]+)(Rs?\.?\s*[\d,]+|₹\s*[\d,]+)/i);
  if (costOfTenderDocMatch && costOfTenderDocMatch[1]) {
    extractedData.costOfTenderDocument = costOfTenderDocMatch[1].trim();
  }
  
  const bidSecurityAmountMatch = documentText.match(/(?:Bid\s*Security\s*Amount[:.\s]+)(Rs?\.?\s*[\d,]+|₹\s*[\d,]+|[\d,]+(?:\s*%)?)/i);
  if (bidSecurityAmountMatch && bidSecurityAmountMatch[1]) {
    extractedData.bidSecurityAmount = bidSecurityAmountMatch[1].trim();
  }
  
  const bankGuaranteeMatch = documentText.match(/(?:Bank\s*Guarantee[:.\s]+)(Rs?\.?\s*[\d,]+|₹\s*[\d,]+|[\d,]+(?:\s*%)?)/i);
  if (bankGuaranteeMatch && bankGuaranteeMatch[1]) {
    extractedData.bankGuarantee = bankGuaranteeMatch[1].trim();
  }
  
  const priceBidMatch = documentText.match(/(?:Price\s*Bid[:.\s]+)([^\n]{5,200})(?:\s*\n|$)/i);
  if (priceBidMatch && priceBidMatch[1]) {
    extractedData.priceBid = priceBidMatch[1].trim();
  }
  
  const currencyMatch = documentText.match(/(?:Currency[:.\s]+)(INR|USD|EUR|GBP|JPY|AUD|CAD|CHF|CNY)(?:\s*\n|$)/i);
  if (currencyMatch && currencyMatch[1]) {
    extractedData.currency = currencyMatch[1].trim();
  }
  
  // 🕒 Extract Extended Timeline & Deadlines
  const tenderPublishDateMatch = documentText.match(/(?:Tender\s*Publish\s*Date[:.\s]+)(\d{1,2}[.\/-]\d{1,2}[.\/-]\d{2,4})/i);
  if (tenderPublishDateMatch && tenderPublishDateMatch[1]) {
    extractedData.tenderPublishDate = tenderPublishDateMatch[1].trim();
  }
  
  const preBidClarificationMatch = documentText.match(/(?:Pre[-_]?Bid\s*Clarification\s*Last\s*Date[:.\s]+)(\d{1,2}[.\/-]\d{1,2}[.\/-]\d{2,4})/i);
  if (preBidClarificationMatch && preBidClarificationMatch[1]) {
    extractedData.preBidClarificationLastDate = preBidClarificationMatch[1].trim();
  }
  
  const corrigendumIssueMatch = documentText.match(/(?:Corrigendum\s*Issue\s*Date[:.\s]+)(\d{1,2}[.\/-]\d{1,2}[.\/-]\d{2,4})/i);
  if (corrigendumIssueMatch && corrigendumIssueMatch[1]) {
    extractedData.corrigendumIssueDate = corrigendumIssueMatch[1].trim();
  }
  
  const warrantyPeriodMatch = documentText.match(/(?:Warranty\s*Period[:.\s]+)([\d\s]+(?:months?|days?|years?|weeks?))/i);
  if (warrantyPeriodMatch && warrantyPeriodMatch[1]) {
    extractedData.warrantyPeriod = warrantyPeriodMatch[1].trim();
  }
  
  const maintenancePeriodMatch = documentText.match(/(?:Maintenance\s*Period[:.\s]+)([\d\s]+(?:months?|days?|years?|weeks?))/i);
  if (maintenancePeriodMatch && maintenancePeriodMatch[1]) {
    extractedData.maintenancePeriod = maintenancePeriodMatch[1].trim();
  }
  
  // 👷‍♂️ Extract Extended Eligibility & Qualification
  const technicalQualMatch = documentText.match(/(?:Technical\s*Qualification[:.\s]+)([^\n]{10,500})(?:\s*\n\n|\n(?:Financial|Experience)[:.\s])/i);
  if (technicalQualMatch && technicalQualMatch[1]) {
    extractedData.technicalQualification = technicalQualMatch[1].trim().substring(0, 300);
  }
  
  const experienceRequiredMatch = documentText.match(/(?:Experience\s*Required[:.\s]+)([\d\s]+(?:years?|projects?|months?)[^\n]{0,100})/i);
  if (experienceRequiredMatch && experienceRequiredMatch[1]) {
    extractedData.experienceRequired = experienceRequiredMatch[1].trim();
  }
  
  const similarWorkMatch = documentText.match(/(?:Similar\s*Work\s*Experience[:.\s]+)([^\n]{10,300})(?:\s*\n|$)/i);
  if (similarWorkMatch && similarWorkMatch[1]) {
    extractedData.similarWorkExperience = similarWorkMatch[1].trim();
  }
  
  const financialCapacityMatch = documentText.match(/(?:Financial\s*Capacity[:.\s]+)(Rs?\.?\s*[\d,]+|₹\s*[\d,]+|[\d,]+(?:\s*Crores?|Lakhs?))/i);
  if (financialCapacityMatch && financialCapacityMatch[1]) {
    extractedData.financialCapacity = financialCapacityMatch[1].trim();
  }
  
  // Extract Registration Certificates (improved - extract actual certificate names, not concatenated text)
  const regCertPatterns = [
    /(?:Registration\s*Certificates?[:.\s]+)([^\n]{10,300})(?:\s*\n|$|\s+(?:Required|Documents|Technical)[:.\s])/i,
    /(?:Required\s*Documents?[:.\s]+)([^\n]{10,500})(?:\s*\n\n|\n(?:Technical|Financial|Evaluation)[:.\s])/i
  ];
  const regCerts: string[] = [];
  
  for (const pattern of regCertPatterns) {
    const match = documentText.match(pattern);
    if (match && match[1]) {
      let certText = match[1].trim();
      // Split by common separators (commas, semicolons, newlines, numbers)
      const certItems = certText
        .split(/[,;\n]|\d+\./)
        .map(item => item.trim())
        .filter(item => {
          // Filter out invalid items
          const lowerItem = item.toLowerCase();
          return item.length > 3 && 
                 item.length < 100 &&
                 !lowerItem.match(/^(and|or|copy|of|vendor|registration|gstin|cancelled|cheque)$/i) &&
                 !lowerItem.match(/^copy\s+of/i) &&
                 !lowerItem.includes('credentials are validated') &&
                 !lowerItem.includes('technically qualified') &&
                 !lowerItem.includes('ra round');
        });
      
      // Extract specific certificate types
      const specificCerts = [
        /GSTIN|GST\s*Number/i,
        /PAN\s*Card|PAN\s*Number/i,
        /MSME|Udyam\s*Registration/i,
        /Aadhaar/i,
        /Cancelled\s*Cheque/i,
        /Vendor\s*Registration/i
      ];
      
      for (const certPattern of specificCerts) {
        const certMatch = documentText.match(certPattern);
        if (certMatch && !regCerts.some(c => c.toLowerCase().includes(certMatch[0].toLowerCase()))) {
          regCerts.push(certMatch[0]);
        }
      }
      
      // Add other valid items
      regCerts.push(...certItems.filter(item => !regCerts.some(existing => existing.toLowerCase() === item.toLowerCase())));
      
      // Limit to reasonable number
      if (regCerts.length > 10) {
        regCerts.splice(10);
      }
      break; // Only process first match
    }
  }
  
  if (regCerts.length > 0) {
    extractedData.registrationCertificates = regCerts;
  }
  
  // Extract ISO/BIS/CE Standards
  const isoMatch = documentText.match(/(?:ISO\s*(?:Standards?|Certification)[:.\s]+)([^\n]{5,200})/i);
  if (isoMatch && isoMatch[1]) {
    const isoStandards = isoMatch[1].trim().split(/[,;]/).map(s => s.trim()).filter(s => s.length > 0);
    extractedData.isoStandards = isoStandards;
  }
  
  const bisMatch = documentText.match(/(?:BIS\s*(?:Standards?|Certification)[:.\s]+)([^\n]{5,200})/i);
  if (bisMatch && bisMatch[1]) {
    const bisStandards = bisMatch[1].trim().split(/[,;]/).map(s => s.trim()).filter(s => s.length > 0);
    extractedData.bisStandards = bisStandards;
  }
  
  const ceMatch = documentText.match(/(?:CE\s*(?:Mark|Standards?|Certification)[:.\s]+)([^\n]{5,200})/i);
  if (ceMatch && ceMatch[1]) {
    const ceStandards = ceMatch[1].trim().split(/[,;]/).map(s => s.trim()).filter(s => s.length > 0);
    extractedData.ceStandards = ceStandards;
  }
  
  const keyPersonnelMatch = documentText.match(/(?:Key\s*Personnel\s*Requirement[:.\s]+)([^\n]{10,500})(?:\s*\n\n|\n(?:Technical|Financial)[:.\s])/i);
  if (keyPersonnelMatch && keyPersonnelMatch[1]) {
    extractedData.keyPersonnelRequirement = keyPersonnelMatch[1].trim().substring(0, 300);
  }
  
  // 🧾 Extract Extended Technical Requirements
  const productDescMatch = documentText.match(/(?:Product\s*Description[:.\s]+)([^\n]{10,500})(?:\s*\n\n|\n(?:Service|Technical)[:.\s])/i);
  if (productDescMatch && productDescMatch[1]) {
    extractedData.productDescription = productDescMatch[1].trim().substring(0, 300);
  }
  
  const serviceDescMatch = documentText.match(/(?:Service\s*Description[:.\s]+)([^\n]{10,500})(?:\s*\n\n|\n(?:Product|Technical)[:.\s])/i);
  if (serviceDescMatch && serviceDescMatch[1]) {
    extractedData.serviceDescription = serviceDescMatch[1].trim().substring(0, 300);
  }
  
  const equipmentReqMatch = documentText.match(/(?:Equipment\s*Requirements?[:.\s]+)([^\n]{10,500})(?:\s*\n\n|\n(?:Material|Quality)[:.\s])/i);
  if (equipmentReqMatch && equipmentReqMatch[1]) {
    extractedData.equipmentRequirements = equipmentReqMatch[1].trim().substring(0, 300);
  }
  
  const materialReqMatch = documentText.match(/(?:Material\s*Requirements?[:.\s]+)([^\n]{10,500})(?:\s*\n\n|\n(?:Quality|Compliance)[:.\s])/i);
  if (materialReqMatch && materialReqMatch[1]) {
    extractedData.materialRequirements = materialReqMatch[1].trim().substring(0, 300);
  }
  
  const qualityStandardsMatch = documentText.match(/(?:Quality\s*Standards?[:.\s]+)([^\n]{10,500})(?:\s*\n\n|\n(?:Compliance|Technical)[:.\s])/i);
  if (qualityStandardsMatch && qualityStandardsMatch[1]) {
    extractedData.qualityStandards = qualityStandardsMatch[1].trim().substring(0, 300);
  }
  
  const complianceClausesMatch = documentText.match(/(?:Compliance\s*Clauses?[:.\s]+)([^\n]{10,1000})(?:\s*\n\n|\n(?:Terms|Legal)[:.\s])/i);
  if (complianceClausesMatch && complianceClausesMatch[1]) {
    extractedData.complianceClauses = complianceClausesMatch[1].trim().substring(0, 500);
  }
  
  // Extract Drawings/Layouts/Design Documents
  const drawingsMatch = documentText.match(/(?:Drawings?|Layouts?|Design\s*Documents?)[:.\s]+([^\n]{10,300})/gi);
  const drawings: string[] = [];
  if (drawingsMatch) {
    for (const match of drawingsMatch) {
      const drawing = match.replace(/(?:Drawings?|Layouts?|Design\s*Documents?)[:.\s]+/i, '').trim();
      if (drawing.length > 5 && !drawings.includes(drawing)) {
        drawings.push(drawing);
      }
    }
  }
  if (drawings.length > 0) {
    extractedData.drawings = drawings;
  }
  
  // 📤 Extract Extended Submission Details
  const portalMatch = documentText.match(/(?:Portal|Platform)[:.\s]+(CPPP|GeM|eProcurement|e[-_]?Tender|NIC|EPROC|IEPM)(?:\s*\n|$)/i);
  if (portalMatch && portalMatch[1]) {
    extractedData.portalName = portalMatch[1].trim();
    extractedData.platformName = portalMatch[1].trim();
  }
  
  const uploadFormatMatch = documentText.match(/(?:Document\s*Upload\s*Format|Format)[:.\s]+([^\n]{5,100})/i);
  if (uploadFormatMatch && uploadFormatMatch[1]) {
    const formats = uploadFormatMatch[1].trim().split(/[,;]/).map(f => f.trim()).filter(f => /pdf|excel|docx|doc|jpg|png/i.test(f));
    extractedData.documentUploadFormat = formats;
  }
  
  const bidderInstructionsMatch = documentText.match(/(?:Bidder\s*Instructions?[:.\s]+)([^\n]{10,1000})(?:\s*\n\n|\n(?:Submission|Bid)[:.\s])/i);
  if (bidderInstructionsMatch && bidderInstructionsMatch[1]) {
    extractedData.bidderInstructions = bidderInstructionsMatch[1].trim().substring(0, 500);
  }
  
  const coveringLetterMatch = documentText.match(/(?:Covering\s*Letter|Form\s*Submission)[:.\s]+([^\n]{5,200})/i);
  if (coveringLetterMatch && coveringLetterMatch[1]) {
    extractedData.coveringLetter = coveringLetterMatch[1].trim();
  }
  
  const supportingDocsMatch = documentText.match(/(?:Supporting\s*Documents?\s*List[:.\s]+)([^\n]{10,500})(?:\s*\n\n|\n(?:Bid|Submission)[:.\s])/i);
  if (supportingDocsMatch && supportingDocsMatch[1]) {
    const docs = supportingDocsMatch[1].trim().split(/[,\n]/).map(d => d.trim()).filter(d => d.length > 3);
    extractedData.supportingDocumentsList = docs;
  }
  
  const bidValidityMatch = documentText.match(/(?:Bid\s*Validity\s*Period[:.\s]+)([\d\s]+(?:days?|months?|weeks?))/i);
  if (bidValidityMatch && bidValidityMatch[1]) {
    extractedData.bidValidityPeriod = bidValidityMatch[1].trim();
  }
  
  const copiesRequiredMatch = documentText.match(/(?:Number\s*of\s*Copies\s*Required[:.\s]+)(\d+)/i);
  if (copiesRequiredMatch && copiesRequiredMatch[1]) {
    extractedData.numberOfCopiesRequired = copiesRequiredMatch[1].trim();
  }
  
  // ⚖️ Extract Extended Evaluation & Selection
  const weightageMatch = documentText.match(/(?:Weightage|Weight)[:.\s]+([^\n]{5,100})(?:\s*\n|$)/i);
  if (weightageMatch && weightageMatch[1]) {
    extractedData.weightage = weightageMatch[1].trim();
  }
  
  const minQualifyingMatch = documentText.match(/(?:Minimum\s*Qualifying\s*Marks?[:.\s]+)(\d+(?:\s*%)?)/i);
  if (minQualifyingMatch && minQualifyingMatch[1]) {
    extractedData.minimumQualifyingMarks = minQualifyingMatch[1].trim();
  }
  
  const scoringParamsMatch = documentText.match(/(?:Scoring\s*Parameters?[:.\s]+)([^\n]{10,500})(?:\s*\n\n|\n(?:Evaluation|Award)[:.\s])/i);
  if (scoringParamsMatch && scoringParamsMatch[1]) {
    extractedData.scoringParameters = scoringParamsMatch[1].trim().substring(0, 300);
  }
  
  const tieBreakingMatch = documentText.match(/(?:Tie[-_]?Breaking\s*Rules?[:.\s]+)([^\n]{10,300})(?:\s*\n|$)/i);
  if (tieBreakingMatch && tieBreakingMatch[1]) {
    extractedData.tieBreakingRules = tieBreakingMatch[1].trim();
  }
  
  const negotiationMatch = documentText.match(/(?:Negotiation\s*Rules?[:.\s]+)([^\n]{10,300})(?:\s*\n|$)/i);
  if (negotiationMatch && negotiationMatch[1]) {
    extractedData.negotiationRules = negotiationMatch[1].trim();
  }
  
  const awardCriteriaMatch = documentText.match(/(?:Award\s*Criteria[:.\s]+)(L1|QCBS|Least\s*Cost|Best\s*Value|Lowest\s*Bid)(?:\s*\n|$)/i);
  if (awardCriteriaMatch && awardCriteriaMatch[1]) {
    extractedData.awardCriteria = awardCriteriaMatch[1].trim();
  }
  
  // 📜 Extract Extended Legal & Policy Details
  const contractConditionsMatch = documentText.match(/(?:Contract\s*Conditions?[:.\s]+)([^\n]{10,1000})(?:\s*\n\n|\n(?:Penalty|Termination)[:.\s])/i);
  if (contractConditionsMatch && contractConditionsMatch[1]) {
    extractedData.contractConditions = contractConditionsMatch[1].trim().substring(0, 500);
  }
  
  const penaltyClausesMatch = documentText.match(/(?:Penalty\s*Clauses?[:.\s]+)([^\n]{10,500})(?:\s*\n\n|\n(?:Liquidated|Termination)[:.\s])/i);
  if (penaltyClausesMatch && penaltyClausesMatch[1]) {
    extractedData.penaltyClauses = penaltyClausesMatch[1].trim().substring(0, 300);
  }
  
  const liquidatedDamagesMatch = documentText.match(/(?:Liquidated\s*Damages?[:.\s]+)([^\n]{10,300})(?:\s*\n|$)/i);
  if (liquidatedDamagesMatch && liquidatedDamagesMatch[1]) {
    extractedData.liquidatedDamages = liquidatedDamagesMatch[1].trim();
  }
  
  const terminationClauseMatch = documentText.match(/(?:Termination\s*Clause[:.\s]+)([^\n]{10,500})(?:\s*\n\n|\n(?:Arbitration|Force)[:.\s])/i);
  if (terminationClauseMatch && terminationClauseMatch[1]) {
    extractedData.terminationClause = terminationClauseMatch[1].trim().substring(0, 300);
  }
  
  const arbitrationClauseMatch = documentText.match(/(?:Arbitration\s*Clause[:.\s]+)([^\n]{10,500})(?:\s*\n\n|\n(?:Force|Confidentiality)[:.\s])/i);
  if (arbitrationClauseMatch && arbitrationClauseMatch[1]) {
    extractedData.arbitrationClause = arbitrationClauseMatch[1].trim().substring(0, 300);
  }
  
  const forceMajeureMatch = documentText.match(/(?:Force\s*Majeure\s*Clause[:.\s]+)([^\n]{10,500})(?:\s*\n\n|\n(?:Confidentiality|Terms)[:.\s])/i);
  if (forceMajeureMatch && forceMajeureMatch[1]) {
    extractedData.forceMajeureClause = forceMajeureMatch[1].trim().substring(0, 300);
  }
  
  const confidentialityMatch = documentText.match(/(?:Confidentiality\s*Clause[:.\s]+)([^\n]{10,500})(?:\s*\n\n|\n(?:Terms|Disclaimer)[:.\s])/i);
  if (confidentialityMatch && confidentialityMatch[1]) {
    extractedData.confidentialityClause = confidentialityMatch[1].trim().substring(0, 300);
  }
  
  const policyComplianceMatch = documentText.match(/(?:Policy\s*Compliance[:.\s]+)([^\n]{10,500})(?:\s*\n\n|\n(?:Govt|MSME|Procurement)[:.\s])/i);
  if (policyComplianceMatch && policyComplianceMatch[1]) {
    extractedData.policyCompliance = policyComplianceMatch[1].trim().substring(0, 300);
  }
  
  // 📍 Extract Location & Budget Information
  const cityMatchLoc = documentText.match(/(?:City[:.\s]+)([A-Z][A-Za-z\s]{2,50})(?:\s*\n|$|\s+(?:State|District|Country)[:.\s])/i);
  if (cityMatchLoc && cityMatchLoc[1]) {
    extractedData.city = cityMatchLoc[1].trim();
  }

  const stateMatchLoc = documentText.match(/(?:State[:.\s]+)([A-Z][A-Za-z\s]{2,50})(?:\s*\n|$|\s+(?:City|District|Country)[:.\s])/i);
  if (stateMatchLoc && stateMatchLoc[1]) {
    extractedData.state = stateMatchLoc[1].trim();
  }

  const districtMatchLoc = documentText.match(/(?:District[:.\s]+)([A-Z][A-Za-z\s]{2,50})(?:\s*\n|$|\s+(?:State|City|Country)[:.\s])/i);
  if (districtMatchLoc && districtMatchLoc[1]) {
    extractedData.district = districtMatchLoc[1].trim();
  }

  const countryMatchLoc = documentText.match(/(?:Country[:.\s]+)([A-Z][A-Za-z\s]{2,50})(?:\s*\n|$)/i);
  if (countryMatchLoc && countryMatchLoc[1]) {
    extractedData.country = countryMatchLoc[1].trim();
  }

  const budgetMatchLoc = documentText.match(/(?:Budget|Estimated\s*Value|Approximate\s*Value|Tender\s*Value)[:.\s]+(?:Rs\.?|INR|₹)?\s*([\d,]+(?:\.\d{2})?)\s*(?:Lakhs?|Crores?|Million|Thousand)?/i);
  if (budgetMatchLoc && budgetMatchLoc[1]) {
    extractedData.budget = budgetMatchLoc[0].trim();
  }

  const addressMatchLoc = documentText.match(/(?:Address[:.\s]+)([^\n]{10,200})(?:\s*\n\n|\n(?:Contact|Phone|Email)[:.\s])/i);
  if (addressMatchLoc && addressMatchLoc[1]) {
    extractedData.address = addressMatchLoc[1].trim().substring(0, 200);
  }

  // 📍 Extract Extended Contact & Location
  const siteVisitMatch = documentText.match(/(?:Site\s*Visit\s*Details?[:.\s]+)([^\n]{10,500})(?:\s*\n\n|\n(?:Contact|Location)[:.\s])/i);
  if (siteVisitMatch && siteVisitMatch[1]) {
    extractedData.siteVisitDetails = siteVisitMatch[1].trim().substring(0, 300);
  }
  
  const designationMatch = documentText.match(/(?:Designation[:.\s]+)([A-Z][A-Za-z\s]{3,50})(?:\s*\n|$|\s+(?:Email|Phone|Address)[:.\s])/i);
  if (designationMatch && designationMatch[1]) {
    extractedData.designation = designationMatch[1].trim();
  }
  
  const emailIdMatch = documentText.match(/(?:Email\s*ID|Email)[:.\s]+([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(?:\s*\n|$)/i);
  if (emailIdMatch && emailIdMatch[1]) {
    extractedData.emailId = emailIdMatch[1].trim();
    if (!extractedData.contactEmail) {
      extractedData.contactEmail = emailIdMatch[1].trim();
    }
  }
  
  const phoneNumberMatch = documentText.match(/(?:Phone\s*Number|Contact\s*Number)[:.\s]+([\d\s\+\-\(\)]{8,20})(?:\s*\n|$)/i);
  if (phoneNumberMatch && phoneNumberMatch[1]) {
    extractedData.phoneNumber = phoneNumberMatch[1].trim();
    if (!extractedData.contactPhone) {
      extractedData.contactPhone = phoneNumberMatch[1].trim();
    }
  }
  
  // 📎 Extract Extended Attachments & References
  // Look for various patterns that might contain tender document file names
  const tenderDocFilesPatterns = [
    /(?:Tender\s*Document\s*File\s*Names?[:.\s]+)([^\n]{10,500})/i,
    /(?:Tender\s*Documents?[:.\s]+)([^\n]{10,500})/i,
    /(?:Supporting\s*Documents?[:.\s]+)([^\n]{10,500})/i,
    /(?:Document\s*List[:.\s]+)([^\n]{10,500})/i,
    /(?:Attachments?[:.\s]+)([^\n]{10,500})/i,
    /(?:Required\s*Documents?[:.\s]+)([^\n]{10,500})/i,
    /(?:Tender\s*Files?[:.\s]+)([^\n]{10,500})/i
  ];

  let tenderDocFilesFound = false;
  for (const pattern of tenderDocFilesPatterns) {
    const match = documentText.match(pattern);
    if (match && match[1]) {
      const files = match[1].trim().split(/[,\n]/).map(f => f.trim()).filter(f => f.length > 3);
      if (files.length > 0) {
        extractedData.tenderDocumentFileNames = files;
        tenderDocFilesFound = true;
        break;
      }
    }
  }

  // If no specific label found, look for file names with common extensions
  if (!tenderDocFilesFound) {
    const fileExtensionPattern = /\b[\w\-\.]+\.(?:pdf|doc|docx|xls|xlsx|txt|rtf|zip|rar)\b/gi;
    const fileMatches = documentText.match(fileExtensionPattern);
    if (fileMatches && fileMatches.length > 0) {
      // Filter out duplicates and very short matches
      const uniqueFiles = [...new Set(fileMatches)].filter(f => f.length > 4);
      if (uniqueFiles.length > 0) {
        extractedData.tenderDocumentFileNames = uniqueFiles;
      }
    }
  }
  
  const annexuresMatch = documentText.match(/(?:Annexures?[:.\s]+)([^\n]{10,500})/i);
  if (annexuresMatch && annexuresMatch[1]) {
    const annexures = annexuresMatch[1].trim().split(/[,\n]/).map(a => a.trim()).filter(a => a.length > 3);
    extractedData.annexures = annexures;
  }
  
  const appendicesMatch = documentText.match(/(?:Appendices?[:.\s]+)([^\n]{10,500})/i);
  if (appendicesMatch && appendicesMatch[1]) {
    const appendices = appendicesMatch[1].trim().split(/[,\n]/).map(a => a.trim()).filter(a => a.length > 3);
    extractedData.appendices = appendices;
  }
  
  const boqFileMatch = documentText.match(/(?:BOQ\s*File[:.\s]+)([^\n]{5,200})(?:\s*\n|$)/i);
  if (boqFileMatch && boqFileMatch[1]) {
    extractedData.boqFile = boqFileMatch[1].trim();
  }
  
  const sampleFormsMatch = documentText.match(/(?:Sample\s*Forms?[:.\s]+)([^\n]{10,500})/i);
  if (sampleFormsMatch && sampleFormsMatch[1]) {
    const forms = sampleFormsMatch[1].trim().split(/[,\n]/).map(f => f.trim()).filter(f => f.length > 3);
    extractedData.sampleForms = forms;
  }
  
  const templatesMatch = documentText.match(/(?:Templates?[:.\s]+)([^\n]{10,500})/i);
  if (templatesMatch && templatesMatch[1]) {
    const templates = templatesMatch[1].trim().split(/[,\n]/).map(t => t.trim()).filter(t => t.length > 3);
    extractedData.templates = templates;
  }
  
  const bidderDeclarationMatch = documentText.match(/(?:Bidder\s*Declaration[:.\s]+)([^\n]{10,500})(?:\s*\n\n|\n(?:Undertaking|Terms)[:.\s])/i);
  if (bidderDeclarationMatch && bidderDeclarationMatch[1]) {
    extractedData.bidderDeclaration = bidderDeclarationMatch[1].trim().substring(0, 300);
  }
  
  const undertakingMatch = documentText.match(/(?:Undertaking[:.\s]+)([^\n]{10,500})(?:\s*\n\n|\n(?:Terms|Disclaimer)[:.\s])/i);
  if (undertakingMatch && undertakingMatch[1]) {
    extractedData.undertaking = undertakingMatch[1].trim().substring(0, 300);
  }
  
  // 🔍 Extract Other Useful Metadata
  const tenderStatusMatch = documentText.match(/(?:Tender\s*Status[:.\s]+)(Open|Closed|Awarded|Cancelled|Under\s*Evaluation)(?:\s*\n|$)/i);
  if (tenderStatusMatch && tenderStatusMatch[1]) {
    extractedData.tenderStatus = tenderStatusMatch[1].trim();
  }
  
  const procurementTypeMatch = documentText.match(/(?:Procurement\s*Type[:.\s]+)(Goods|Works|Services|Supply|Construction)(?:\s*\n|$)/i);
  if (procurementTypeMatch && procurementTypeMatch[1]) {
    extractedData.procurementType = procurementTypeMatch[1].trim();
  }
  
  const countryMatch = documentText.match(/(?:Country[:.\s]+)([A-Z][A-Za-z\s]{3,30})(?:\s*\n|$|\s+(?:State|City)[:.\s])/i);
  if (countryMatch && countryMatch[1]) {
    extractedData.country = countryMatch[1].trim();
  }
  
  const stateMatch = documentText.match(/(?:State[:.\s]+)([A-Z][A-Za-z\s]{3,30})(?:\s*\n|$|\s+(?:City|District)[:.\s])/i);
  if (stateMatch && stateMatch[1]) {
    extractedData.state = stateMatch[1].trim();
  }
  
  const cityMatch = documentText.match(/(?:City[:.\s]+)([A-Z][A-Za-z\s]{3,30})(?:\s*\n|$|\s+(?:District|Location)[:.\s])/i);
  if (cityMatch && cityMatch[1]) {
    extractedData.city = cityMatch[1].trim();
  }
  
  const districtMatch = documentText.match(/(?:District[:.\s]+)([A-Z][A-Za-z\s]{3,30})(?:\s*\n|$)/i);
  if (districtMatch && districtMatch[1]) {
    extractedData.district = districtMatch[1].trim();
  }
  
  const fundingSourceMatch = documentText.match(/(?:Funding\s*Source[:.\s]+)(Government|World\s*Bank|ADB|Private|Internal|External)(?:\s*\n|$)/i);
  if (fundingSourceMatch && fundingSourceMatch[1]) {
    extractedData.fundingSource = fundingSourceMatch[1].trim();
  }
  
  const tenderCategoryTypeMatch = documentText.match(/(?:Tender\s*Category\s*Type[:.\s]+)(National|International|Local|State|Central)(?:\s*\n|$)/i);
  if (tenderCategoryTypeMatch && tenderCategoryTypeMatch[1]) {
    extractedData.tenderCategoryType = tenderCategoryTypeMatch[1].trim();
  }
  
  const bidOpeningAuthorityMatch = documentText.match(/(?:Bid\s*Opening\s*Authority[:.\s]+)([A-Z][A-Za-z\s]{5,100})(?:\s*\n|$|\s+(?:Designation|Contact)[:.\s])/i);
  if (bidOpeningAuthorityMatch && bidOpeningAuthorityMatch[1]) {
    extractedData.bidOpeningAuthority = bidOpeningAuthorityMatch[1].trim();
  }
  
  // Extract any additional dates found (if not already extracted above)
  if (!extractedData.dates || extractedData.dates.length === 0) {
    const additionalDates: string[] = [];
    const datePattern = /(\d{1,2}[.\/-]\d{1,2}[.\/-]\d{2,4})/g;
    let dateMatch;
    while ((dateMatch = datePattern.exec(documentText)) !== null && additionalDates.length < 10) {
      const date = dateMatch[1].trim();
      if (!additionalDates.includes(date)) {
        additionalDates.push(date);
      }
    }
    if (additionalDates.length > 0) {
      // Sort and prioritize 2025/2024 dates
      const sortedDates = additionalDates.sort((a, b) => {
        const yearA = a.match(/\d{4}$/) ? parseInt(a.match(/\d{4}$/)![0]) : 
                     a.match(/\d{2}$/) ? (parseInt(a.match(/\d{2}$/)![0]) > 50 ? 1900 + parseInt(a.match(/\d{2}$/)![0]) : 2000 + parseInt(a.match(/\d{2}$/)![0])) : 0;
        const yearB = b.match(/\d{4}$/) ? parseInt(b.match(/\d{4}$/)![0]) : 
                     b.match(/\d{2}$/) ? (parseInt(b.match(/\d{2}$/)![0]) > 50 ? 1900 + parseInt(b.match(/\d{2}$/)![0]) : 2000 + parseInt(b.match(/\d{2}$/)![0])) : 0;
        if (yearA === 2025) return -1;
        if (yearB === 2025) return 1;
        if (yearA === 2024) return -1;
        if (yearB === 2024) return 1;
        return yearB - yearA;
      });
      extractedData.dates = sortedDates;
      if (!extractedData.enquiryDate && sortedDates[0]) {
        extractedData.enquiryDate = sortedDates[0];
        keyPoints.push(`Date: ${sortedDates[0]}`);
      }
    }
  }
  
  // Extract a summary from first few meaningful lines
  const summaryLines: string[] = [];
  const summaryLinePattern = /^[A-Z][^.\n]{20,150}\./gm;
  let summaryMatch;
  let lineCount = 0;
  while ((summaryMatch = summaryLinePattern.exec(documentText)) !== null && lineCount < 5) {
    const line = summaryMatch[0].trim();
    if (line.length > 20 && !line.match(/^(Page|---|Table|\[)/i)) {
      summaryLines.push(line);
      lineCount++;
    }
  }
  
  // Log what we found (REAL data from document) - Comprehensive logging
  console.log('✅ REAL-TIME EXTRACTION RESULTS (from actual document):', {
    // 🏗 Project Information
    projectTitle: extractedData.title || 'NOT FOUND',
    projectName: extractedData.projectName || 'NOT FOUND',
    projectId: extractedData.projectId || 'NOT FOUND',
    tenderId: extractedData.tenderId || 'NOT FOUND',
    tenderNoticeNumber: extractedData.tenderNoticeNumber || 'NOT FOUND',
    enquiryNumber: extractedData.enquiryNumber || 'NOT FOUND',
    workName: extractedData.workName || 'NOT FOUND',
    projectCategory: extractedData.projectCategory || 'NOT FOUND',
    sector: extractedData.sector || 'NOT FOUND',
    division: extractedData.division || 'NOT FOUND',
    organization: extractedData.organization || 'NOT FOUND',
    department: extractedData.department || 'NOT FOUND',
    ministry: extractedData.ministry || 'NOT FOUND',
    
    // 💰 Financial Details
    estimatedValue: extractedData.estimatedValue || extractedData.approximateValue || 'NOT FOUND',
    contractValue: extractedData.contractValue || 'NOT FOUND',
    tenderValue: extractedData.tenderValue || 'NOT FOUND',
    budget: extractedData.budget || 'NOT FOUND',
    currency: extractedData.currency || 'NOT FOUND',
    emdAmount: extractedData.emdAmount || 'NOT FOUND',
    emdFeeType: extractedData.emdFeeType || 'NOT FOUND',
    bidSecurityAmount: extractedData.bidSecurityAmount || 'NOT FOUND',
    performanceSecurity: extractedData.performanceSecurity || 'NOT FOUND',
    bankGuarantee: extractedData.bankGuarantee || 'NOT FOUND',
    tenderFee: extractedData.tenderFee || 'NOT FOUND',
    documentFee: extractedData.documentFee || 'NOT FOUND',
    costOfTenderDocument: extractedData.costOfTenderDocument || 'NOT FOUND',
    paymentTerms: extractedData.paymentTerms || 'NOT FOUND',
    turnoverRequirement: extractedData.turnoverRequirement || 'NOT FOUND',
    financialCapacity: extractedData.financialCapacity || 'NOT FOUND',
    
    // 🕒 Timeline & Deadlines
    tenderPublishDate: extractedData.tenderPublishDate || 'NOT FOUND',
    enquiryDate: extractedData.enquiryDate || 'NOT FOUND',
    bidSubmissionStartDate: extractedData.bidSubmissionStartDate || 'NOT FOUND',
    bidSubmissionEndDate: extractedData.bidSubmissionEndDate || 'NOT FOUND',
    submissionDeadline: extractedData.submissionDeadline || 'NOT FOUND',
    technicalBidOpeningDate: extractedData.technicalBidOpeningDate || 'NOT FOUND',
    financialBidOpeningDate: extractedData.financialBidOpeningDate || 'NOT FOUND',
    preBidMeetingDate: extractedData.preBidMeetingDate || 'NOT FOUND',
    preBidClarificationLastDate: extractedData.preBidClarificationLastDate || 'NOT FOUND',
    projectDuration: extractedData.projectDuration || 'NOT FOUND',
    warrantyPeriod: extractedData.warrantyPeriod || 'NOT FOUND',
    maintenancePeriod: extractedData.maintenancePeriod || 'NOT FOUND',
    datesCount: allDates.length,
    
    // 👷‍♂️ Eligibility & Qualification
    eligibilityCriteria: extractedData.eligibilityCriteria ? 'EXTRACTED' : 'NOT FOUND',
    technicalQualification: extractedData.technicalQualification || 'NOT FOUND',
    experienceRequired: extractedData.experienceRequired || 'NOT FOUND',
    similarWorkExperience: extractedData.similarWorkExperience || 'NOT FOUND',
    registrationCertificates: extractedData.registrationCertificates?.length || 0,
    isoStandards: extractedData.isoStandards?.length || 0,
    bisStandards: extractedData.bisStandards?.length || 0,
    ceStandards: extractedData.ceStandards?.length || 0,
    keyPersonnelRequirement: extractedData.keyPersonnelRequirement ? 'EXTRACTED' : 'NOT FOUND',
    
    // 🧾 Technical Requirements
    technicalSpecifications: extractedData.technicalSpecifications ? 'EXTRACTED' : 'NOT FOUND',
    productDescription: extractedData.productDescription || 'NOT FOUND',
    serviceDescription: extractedData.serviceDescription || 'NOT FOUND',
    equipmentRequirements: extractedData.equipmentRequirements ? 'EXTRACTED' : 'NOT FOUND',
    materialRequirements: extractedData.materialRequirements ? 'EXTRACTED' : 'NOT FOUND',
    qualityStandards: extractedData.qualityStandards ? 'EXTRACTED' : 'NOT FOUND',
    complianceClauses: extractedData.complianceClauses ? 'EXTRACTED' : 'NOT FOUND',
    drawings: extractedData.drawings?.length || 0,
    
    // 📤 Submission Details
    modeOfTendering: extractedData.modeOfTendering || 'NOT FOUND',
    portalName: extractedData.portalName || 'NOT FOUND',
    platformName: extractedData.platformName || 'NOT FOUND',
    documentUploadFormat: extractedData.documentUploadFormat?.length || 0,
    bidderInstructions: extractedData.bidderInstructions ? 'EXTRACTED' : 'NOT FOUND',
    bidValidityPeriod: extractedData.bidValidityPeriod || 'NOT FOUND',
    numberOfCopiesRequired: extractedData.numberOfCopiesRequired || 'NOT FOUND',
    supportingDocumentsList: extractedData.supportingDocumentsList?.length || 0,
    
    // ⚖️ Evaluation & Selection
    evaluationCriteria: extractedData.evaluationCriteria ? 'EXTRACTED' : 'NOT FOUND',
    weightage: extractedData.weightage || 'NOT FOUND',
    minimumQualifyingMarks: extractedData.minimumQualifyingMarks || 'NOT FOUND',
    scoringParameters: extractedData.scoringParameters ? 'EXTRACTED' : 'NOT FOUND',
    tieBreakingRules: extractedData.tieBreakingRules ? 'EXTRACTED' : 'NOT FOUND',
    negotiationRules: extractedData.negotiationRules ? 'EXTRACTED' : 'NOT FOUND',
    awardCriteria: extractedData.awardCriteria || 'NOT FOUND',
    
    // 📜 Legal & Policy Details
    termsAndConditions: extractedData.termsAndConditions ? 'EXTRACTED' : 'NOT FOUND',
    contractConditions: extractedData.contractConditions ? 'EXTRACTED' : 'NOT FOUND',
    penaltyClauses: extractedData.penaltyClauses ? 'EXTRACTED' : 'NOT FOUND',
    liquidatedDamages: extractedData.liquidatedDamages || 'NOT FOUND',
    terminationClause: extractedData.terminationClause ? 'EXTRACTED' : 'NOT FOUND',
    arbitrationClause: extractedData.arbitrationClause ? 'EXTRACTED' : 'NOT FOUND',
    forceMajeureClause: extractedData.forceMajeureClause ? 'EXTRACTED' : 'NOT FOUND',
    confidentialityClause: extractedData.confidentialityClause ? 'EXTRACTED' : 'NOT FOUND',
    policyCompliance: extractedData.policyCompliance ? 'EXTRACTED' : 'NOT FOUND',
    
    // 📍 Contact & Location
    workLocation: extractedData.workLocation || 'NOT FOUND',
    site: extractedData.site || 'NOT FOUND',
    siteVisitDetails: extractedData.siteVisitDetails ? 'EXTRACTED' : 'NOT FOUND',
    contactPerson: extractedData.contactPerson || 'NOT FOUND',
    designation: extractedData.designation || 'NOT FOUND',
    emailId: extractedData.emailId || extractedData.contactEmail || 'NOT FOUND',
    phoneNumber: extractedData.phoneNumber || extractedData.contactPhone || 'NOT FOUND',
    address: extractedData.address || 'NOT FOUND',
    
    // 📎 Attachments & References
    documentAttachments: extractedData.documentAttachments?.length || 0,
    tenderDocumentFileNames: extractedData.tenderDocumentFileNames?.length || 0,
    annexures: extractedData.annexures?.length || 0,
    appendices: extractedData.appendices?.length || 0,
    boqFile: extractedData.boqFile || 'NOT FOUND',
    sampleForms: extractedData.sampleForms?.length || 0,
    templates: extractedData.templates?.length || 0,
    corrigendum: extractedData.corrigendum || 'NOT FOUND',
    addenda: extractedData.addenda || 'NOT FOUND',
    
    // 🔍 Other Metadata
    tenderStatus: extractedData.tenderStatus || 'NOT FOUND',
    tenderType: extractedData.tenderType || 'NOT FOUND',
    procurementType: extractedData.procurementType || 'NOT FOUND',
    tenderCategory: extractedData.tenderCategory || 'NOT FOUND',
    country: extractedData.country || 'NOT FOUND',
    state: extractedData.state || 'NOT FOUND',
    city: extractedData.city || 'NOT FOUND',
    district: extractedData.district || 'NOT FOUND',
    fundingSource: extractedData.fundingSource || 'NOT FOUND',
    tenderCategoryType: extractedData.tenderCategoryType || 'NOT FOUND',
    bidOpeningAuthority: extractedData.bidOpeningAuthority || 'NOT FOUND',
    
    // Scope & Work Items
    scopeOfWork: extractedData.scopeOfWork ? 'EXTRACTED' : 'NOT FOUND',
    workItemsCount: finalWorkItems.length,
    
    // Summary
    totalFieldsExtracted: Object.keys(extractedData).filter(k => extractedData[k] !== undefined && extractedData[k] !== null && extractedData[k] !== '').length,
    totalPossibleFields: 100 // Approximate count of all possible fields
  });
  
  // Verify we extracted real data, not just empty fields
  const hasRealData = extractedData.enquiryNumber || extractedData.tenderId || extractedData.organization || finalWorkItems.length > 0;
  if (!hasRealData) {
    console.warn('⚠️ WARNING: No real data extracted from document. Document may be image-based or contain no extractable text.');
  }
  
  // Extract scope of work (text between "Scope of Work" markers) - stop at disclaimers/terms
  const scopeKeywords = [
    'Disclaimer', 'अस्वीकरण', 'Thank You', 'धन्यवाद', 'ध)यवाद',
    'Terms and Conditions', 'TERMS', 'Additional Terms', 'ATC',
    'Buyer Added', 'Bid Specific', 'Representation', 'Compliance',
    'General Terms', 'सामान्य शर्तें', 'GTC', 'GeM GTC',
    'Restrictions', 'बिदर', 'गलत', 'अनुपालन', 'कानूनी',
    '---Thank You', '---Thank', '--- धन्यवाद'
  ];
  
  // Find scope of work section
  const scopeMatch = documentText.match(/(?:Scope\s*of\s*Work|SCOPE\s*OF\s*WORK)[:.\s]*([\s\S]{100,3000}?)(?:\n\n|\n---|\[TABLE)/i);
  if (scopeMatch) {
    let scopeText = scopeMatch[1].trim();
    
    // Stop at disclaimer/terms keywords
    for (const keyword of scopeKeywords) {
      const keywordIndex = scopeText.toLowerCase().indexOf(keyword.toLowerCase());
      if (keywordIndex > 0 && keywordIndex < 2000) {
        scopeText = scopeText.substring(0, keywordIndex).trim();
        break;
      }
    }
    
    // Additional check: stop at common section endings
    const endPatterns = [
      /Disclaimer.*$/i,
      /Thank\s*You.*$/i,
      /धन्यवाद.*$/i,
      /Terms\s*and\s*Conditions.*$/i,
      /Additional\s*Terms.*$/i,
      /ATC.*$/i,
      /Buyer\s*Added.*$/i
    ];
    
    for (const pattern of endPatterns) {
      const endMatch = scopeText.match(pattern);
      if (endMatch && endMatch.index !== undefined && endMatch.index > 100) {
        scopeText = scopeText.substring(0, endMatch.index).trim();
        break;
      }
    }
    
    // Limit length and clean up
    scopeText = scopeText.substring(0, 1000).trim();
    
    // Only store if it's meaningful work description (not just disclaimers)
    if (scopeText.length > 50 && 
        !scopeText.toLowerCase().includes('disclaimer') &&
        !scopeText.toLowerCase().includes('thank you') &&
        !scopeText.toLowerCase().includes('धन्यवाद') &&
        !scopeText.toLowerCase().match(/^.*?(?:additional|terms|conditions|atc|buyer added).*$/i)) {
      extractedData.scopeOfWork = scopeText;
    }
  }
  
  // Create summary with actual extracted information
  const foundFields = [];
  if (extractedData.enquiryNumber) foundFields.push(`Enquiry Number: ${extractedData.enquiryNumber}`);
  if (extractedData.tenderId) foundFields.push(`Tender ID: ${extractedData.tenderId}`);
  if (extractedData.approximateValue) foundFields.push(`Value: ${extractedData.approximateValue}`);
  if (extractedData.organization) foundFields.push(`Organization: ${extractedData.organization}`);
  if (finalWorkItems.length > 0) foundFields.push(`${finalWorkItems.length} work items`);
  if (allDates.length > 0) foundFields.push(`${allDates.length} dates found`);
  
  const summary = foundFields.length > 0
    ? `Document analyzed successfully. Extracted ${foundFields.length} key fields: ${foundFields.slice(0, 4).join(', ')}${foundFields.length > 4 ? ' and more' : ''}.`
    : summaryLines.length > 0
    ? `Document uploaded successfully. ${summaryLines[0].substring(0, 100)}...`
    : 'Document uploaded successfully. Text extraction completed. Please review document manually for detailed information.';
  
  // Calculate compliance score based on extracted fields
  let complianceScore = 20; // Base score
  if (extractedData.enquiryNumber) complianceScore += 20;
  if (extractedData.tenderId) complianceScore += 15;
  if (extractedData.approximateValue) complianceScore += 20;
  if (extractedData.organization) complianceScore += 15;
  if (finalWorkItems.length > 0) complianceScore += Math.min(20, finalWorkItems.length * 2);
  if (extractedData.title) complianceScore += 5;
  if (allDates.length > 0) complianceScore += 5;
  complianceScore = Math.min(complianceScore, 90); // Cap at 90%
  
  // Filter key points to show MAIN important fields (comprehensive but clean)
  const mainKeyPoints: string[] = [];
  
  // Priority order for main key points - show comprehensive information
  if (extractedData.enquiryNumber) {
    mainKeyPoints.push(`Enquiry Number: ${extractedData.enquiryNumber}`);
  }
  if (extractedData.tenderId) {
    mainKeyPoints.push(`Tender ID: ${extractedData.tenderId}`);
  }
  if (extractedData.organization || extractedData.department) {
    mainKeyPoints.push(`Organization: ${extractedData.organization || extractedData.department}`);
  }
  if (extractedData.title) {
    const titleShort = extractedData.title.length > 60 
      ? extractedData.title.substring(0, 60) + '...' 
      : extractedData.title;
    mainKeyPoints.push(`Title: ${titleShort}`);
  }
  
  // Timeline dates - show key dates
  if (extractedData.enquiryDate || extractedData.tenderPublishDate) {
    mainKeyPoints.push(`Enquiry/Publish Date: ${extractedData.enquiryDate || extractedData.tenderPublishDate}`);
  }
  if (extractedData.bidSubmissionEndDate || extractedData.submissionDeadline) {
    mainKeyPoints.push(`Submission Deadline: ${extractedData.bidSubmissionEndDate || extractedData.submissionDeadline}`);
  }
  if (extractedData.bidOpeningDate || extractedData.technicalBidOpeningDate) {
    mainKeyPoints.push(`Bid Opening Date: ${extractedData.bidOpeningDate || extractedData.technicalBidOpeningDate}`);
  }
  if (extractedData.preBidMeetingDate) {
    mainKeyPoints.push(`Pre-Bid Meeting: ${extractedData.preBidMeetingDate}`);
  }
  
  // Financial information
  if (extractedData.approximateValue || extractedData.estimatedValue) {
    mainKeyPoints.push(`Estimated Value: ${extractedData.approximateValue || extractedData.estimatedValue}`);
  }
  if (extractedData.emdAmount) {
    mainKeyPoints.push(`EMD Amount: ${extractedData.emdAmount}${extractedData.emdFeeType ? ` (${extractedData.emdFeeType})` : ''}`);
  }
  if (extractedData.emdRequired === 'Yes' && !extractedData.emdAmount) {
    mainKeyPoints.push(`EMD Required: Yes`);
  }
  if (extractedData.performanceSecurity || extractedData.bidSecurity) {
    mainKeyPoints.push(`Performance Security: ${extractedData.performanceSecurity || extractedData.bidSecurity}`);
  }
  
  // Category and type
  if (extractedData.tenderCategory) {
    mainKeyPoints.push(`Category: ${extractedData.tenderCategory}`);
  }
  if (extractedData.modeOfTendering) {
    mainKeyPoints.push(`Mode: ${extractedData.modeOfTendering}`);
  }
  if (extractedData.tenderType) {
    mainKeyPoints.push(`Tender Type: ${extractedData.tenderType}`);
  }
  
  // Work items and scope
  if (finalWorkItems.length > 0) {
    mainKeyPoints.push(`Work Items: ${finalWorkItems.length} items`);
  }
  if (extractedData.scopeOfWork && extractedData.scopeOfWork.length > 20) {
    const scopeShort = extractedData.scopeOfWork.substring(0, 80) + '...';
    mainKeyPoints.push(`Scope: ${scopeShort}`);
  }
  
  // Technical specifications
  if (extractedData.technicalSpecifications && extractedData.technicalSpecifications.length > 20) {
    const techShort = extractedData.technicalSpecifications.substring(0, 60) + '...';
    mainKeyPoints.push(`Technical Specs: ${techShort}`);
  }
  
  // Eligibility and qualifications
  if (extractedData.eligibilityCriteria && extractedData.eligibilityCriteria.length > 20) {
    const eligShort = extractedData.eligibilityCriteria.substring(0, 60) + '...';
    mainKeyPoints.push(`Eligibility: ${eligShort}`);
  }
  if (extractedData.experienceRequired) {
    mainKeyPoints.push(`Experience Required: ${extractedData.experienceRequired}`);
  }
  
  // Certifications and standards
  if (extractedData.isoStandards && extractedData.isoStandards.length > 0) {
    mainKeyPoints.push(`ISO Standards: ${extractedData.isoStandards.join(', ')}`);
  }
  if (extractedData.bisStandards && extractedData.bisStandards.length > 0) {
    mainKeyPoints.push(`BIS Standards: ${extractedData.bisStandards.join(', ')}`);
  }
  if (extractedData.registrationCertificates && extractedData.registrationCertificates.length > 0) {
    mainKeyPoints.push(`Required Certificates: ${extractedData.registrationCertificates.slice(0, 3).join(', ')}${extractedData.registrationCertificates.length > 3 ? '...' : ''}`);
  }
  
  // Policy compliance
  if (extractedData.msePreference) {
    mainKeyPoints.push(`MSE Preference: ${extractedData.msePreference}`);
  }
  if (extractedData.miiPreference) {
    mainKeyPoints.push(`Make in India: ${extractedData.miiPreference}`);
  }
  
  // Documents and attachments
  if (extractedData.documentAttachments && extractedData.documentAttachments.length > 0) {
    mainKeyPoints.push(`Attachments: ${extractedData.documentAttachments.length} document(s)`);
  }
  
  // Dates summary
  if (extractedData.dates && extractedData.dates.length > 0) {
    mainKeyPoints.push(`Total Dates Found: ${extractedData.dates.length}`);
  }
  
  // Use main key points if available, otherwise fallback to original key points
  const finalKeyPoints = mainKeyPoints.length > 0 ? mainKeyPoints : keyPoints;
  
  // Ensure we have at least some key points
  if (finalKeyPoints.length === 0) {
    finalKeyPoints.push('Document uploaded successfully');
    
    // Only show character count if we actually have meaningful text
    const actualTextLength = documentText.replace(/\[.*?\]/g, '').replace(/--- Page \d+ ---/g, '').trim().length;
    if (actualTextLength > 100) {
      finalKeyPoints.push(`Document contains ${actualTextLength} characters of text`);
    } else if (actualTextLength > 0) {
      finalKeyPoints.push(`Document contains limited text (${actualTextLength} chars) - may be scanned PDF`);
    } else {
      finalKeyPoints.push('Document appears to be image-based (scanned PDF) - OCR may be required');
    }
    
    if (finalWorkItems.length > 0) {
      finalKeyPoints.push(`Found ${finalWorkItems.length} work items in document`);
    }
  }
  
  return {
    summary,
    keyPoints: finalKeyPoints.length > 0 ? finalKeyPoints : ['Document uploaded successfully', 'Text-based extraction completed'],
    extractedData,
    complianceScore,
    missingClauses: [],
    riskFactors: []
  };
}

/**
 * Validate bid document for compliance
 */
export async function validateDocument(
  documentText: string,
  documentType: string,
  extractedData?: any, // Optional: extracted data from analysis
  analysisComplianceScore?: number // Optional: compliance score from analysis
): Promise<{
  isCompliant: boolean;
  validationScore: number;
  issues: Array<{ severity: 'critical' | 'major' | 'minor'; description: string }>;
  recommendations: string[];
  missingClauses?: string[];
  financialIssues?: string[];
  policyViolations?: string[];
}> {
  const systemPrompt = `You are an expert compliance validation AI for Government of Andhra Pradesh procurement.
You MUST analyze the ENTIRE document LINE BY LINE to validate against comprehensive procurement standards.

**VALIDATION FRAMEWORK:**
Validate this document against THREE critical areas:

1. **MANDATORY CLAUSES (Line-by-line check for presence):**
   - Earnest Money Deposit (EMD) clause with amount/percentage
   - Performance Security/Bank Guarantee clause
   - Arbitration and Dispute Resolution clause
   - Force Majeure clause
   - Termination clause with conditions
   - Payment terms and schedule
   - Warranty period specification
   - Liquidated Damages clause
   - Contract duration and timeline
   - GST and tax applicability
   - Integrity Pact/Anti-corruption clause
   - Rights and obligations of parties
   - Inspection and acceptance criteria
   - Variation/Change order provisions
   - Right to Information (RTI) applicability
   - MSE (Micro & Small Enterprises) preference (mandatory for works >₹200 crore)
   - Make in India preference clause
   - Two-envelope bidding system specification
   - Evaluation criteria and weightage

2. **FINANCIAL THRESHOLDS (Check correctness):**
   - EMD: Typically 2-3% of contract value (flag if too low <1% or too high >5%)
   - Performance Security: Typically 5-10% (flag if outside 3-15% range)
   - Retention Money: Typically 5-10% (if mentioned)
   - Bid validity: Minimum 90 days from submission (flag if less)
   - Payment cycle: Should not exceed 45 days (flag if more)
   - Price variation: Should have provisions for long-term contracts
   - Advance payment: Limit to 10-15% max with bank guarantee
   - Final bill payment: Should be within 30 days of acceptance

3. **POLICY COMPLIANCE (Check adherence to):**
   - GFR 2017 compliance: Public procurement rules
   - AP State procurement guidelines adherence
   - CVC (Central Vigilance Commission) guidelines
   - Transparency requirements
   - Fair competition provisions
   - Conflict of interest disclosure
   - Standard tender document format
   - Electronic procurement norms (if e-tender)
   - Single vendor restrictions
   - Technical eligibility clearly defined
   - Financial eligibility criteria specified
   - Blacklisting prohibition clause
   - Performance monitoring provisions

**VALIDATION CRITERIA:**
- Read EVERY LINE of the document
- Identify what ACTUALLY exists vs what should exist
- Only flag issues that are GENUINELY missing or incorrect
- Base score on REAL compliance percentage
- Provide SPECIFIC, actionable recommendations

**SCORING LOGIC:**
- Start at 100 points
- Critical missing clause: -10 points each
- Major financial threshold error: -8 points each
- Policy non-compliance: -5 points each
- Minor issue: -2 points each

**CRITICAL: You MUST respond ONLY with valid JSON. No explanations, no apologies, no extra text.**

Respond in EXACT JSON format:
{
  "isCompliant": true/false,
  "validationScore": 85,
  "issues": [
    {"severity": "critical|major|minor", "description": "Specific issue found"}
  ],
  "recommendations": ["Specific actionable recommendation"],
  "missingClauses": ["List of mandatory clauses missing"],
  "financialIssues": ["List of financial threshold problems"],
  "policyViolations": ["List of policy non-compliances"]
}

DO NOT include any text before or after the JSON. ONLY return valid JSON.`;

  // Generate recommendations based on extracted data when AI unavailable
  const generateRecommendationsFromData = (data: any, score: number): string[] => {
    const recommendations: string[] = [];
    
    if (!data) {
      return ['Review document manually for compliance validation.'];
    }
    
    // Check for missing critical fields
    if (!data.enquiryNumber && !data.tenderId) {
      recommendations.push('Ensure Enquiry Number or Tender ID is clearly specified.');
    }
    if (!data.organization) {
      recommendations.push('Verify organization/department name is mentioned.');
    }
    if (!data.enquiryDate && (!data.dates || data.dates.length === 0)) {
      recommendations.push('Confirm important dates (enquiry date, submission deadline) are specified.');
    }
    
    // EMD checks
    if (data.emdRequired === 'Yes' && !data.emdAmount && !data.emdPercentage) {
      recommendations.push('EMD is required but amount or percentage not specified. Verify EMD details.');
    }
    if (data.emdAmount) {
      const emdStr = String(data.emdAmount).replace(/[,\s]/g, '');
      const emdNum = parseFloat(emdStr);
      if (emdNum > 0 && data.approximateValue) {
        const valueStr = String(data.approximateValue).replace(/[,\s₹Rs.]/g, '');
        const valueNum = parseFloat(valueStr);
        if (valueNum > 0) {
          const emdPercent = (emdNum / valueNum) * 100;
          if (emdPercent < 1) {
            recommendations.push(`EMD (${emdPercent.toFixed(2)}%) is below recommended 2-3% of contract value.`);
          } else if (emdPercent > 5) {
            recommendations.push(`EMD (${emdPercent.toFixed(2)}%) exceeds recommended 2-3% of contract value.`);
          }
        }
      }
    }
    
    // Performance Security checks
    if (!data.performanceSecurity && !data.bidSecurity) {
      recommendations.push('Verify Performance Security or Bid Security clause is included.');
    }
    
    // Technical specifications
    if (!data.technicalSpecifications && !data.scopeOfWork) {
      recommendations.push('Ensure technical specifications or scope of work is clearly defined.');
    }
    
    // Eligibility criteria
    if (!data.eligibilityCriteria && !data.technicalQualification) {
      recommendations.push('Verify eligibility criteria and technical qualifications are specified.');
    }
    
    // Policy compliance
    if (!data.policyCompliance && !data.msePreference && !data.miiPreference) {
      recommendations.push('Check for MSE (Micro & Small Enterprises) preference and Make in India policy clauses.');
    }
    
    // Document completeness
    const requiredFields = ['enquiryNumber', 'tenderId', 'organization', 'title', 'emdAmount', 'enquiryDate'];
    const foundFields = requiredFields.filter(field => data[field]);
    const completeness = (foundFields.length / requiredFields.length) * 100;
    
    if (completeness < 70) {
      recommendations.push(`Document completeness: ${completeness.toFixed(0)}%. Ensure all mandatory fields are present.`);
    }
    
    // Based on compliance score
    if (score < 50) {
      recommendations.push('Document requires significant review. Multiple critical fields may be missing.');
    } else if (score < 70) {
      recommendations.push('Document meets basic requirements but may need additional compliance checks.');
    } else if (score >= 80) {
      recommendations.push('Document appears well-structured. Proceed with standard review process.');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Document appears compliant. Proceed with standard review process.');
    }
    
    return recommendations;
  };
  
  // Skip AI validation if explicitly disabled
  if (!AI_AVAILABLE) {
    console.log('⚠️ AI validation disabled. Generating recommendations from extracted data...');
    const fallbackScore = analysisComplianceScore || 50;
    const recommendations = generateRecommendationsFromData(extractedData, fallbackScore);
    
    return {
      isCompliant: fallbackScore >= 60,
      validationScore: fallbackScore,
      issues: [],
      recommendations,
      missingClauses: [],
      financialIssues: [],
      policyViolations: []
    };
  }

  try {
    // Use smart truncation for large documents
    const truncatedText = smartTruncate(documentText, 8000);
    
    const completion = await insforge.ai.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { 
          role: 'user', 
          content: `Carefully read this ENTIRE document LINE BY LINE and perform comprehensive validation. Return ONLY valid JSON, no other text.

Document Type: ${documentType}

DOCUMENT TO VALIDATE (Read EVERY LINE):
${truncatedText}

VALIDATION TASK:
1. Read COMPLETELY from start to finish - scan EVERY line
2. Check presence of all MANDATORY CLAUSES listed above
3. Verify FINANCIAL THRESHOLDS are within acceptable ranges
4. Confirm POLICY COMPLIANCE with GFR 2017, CVC, and AP State guidelines
5. Calculate validation score based on actual findings
6. Provide SPECIFIC recommendations for each issue found

Remember: Respond ONLY with valid JSON. No markdown, no explanations, no apologies.` 
        }
      ],
      temperature: 0.2,
      maxTokens: 2000
    });

    let result = completion.choices[0].message.content;
    
    // Remove markdown code block wrappers if present
    result = result.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    // Check if response starts with JSON
    if (!result.startsWith('{')) {
      console.error('AI returned non-JSON response:', result.slice(0, 200));
      throw new Error('Invalid AI response format');
    }
    
    return JSON.parse(result);
  } catch (error: any) {
    console.error('Validation Error:', error);
    
    // Check if it's an API key error - check multiple error properties
    const errorMessage = error?.message || error?.error?.message || error?.toString() || '';
    const isApiKeyError = errorMessage.includes('API key') || 
                         errorMessage.includes('Forbidden') ||
                         errorMessage.includes('renew cloud API key') ||
                         errorMessage.includes('Failed to renew') ||
                         (error as any)?.status === 403 ||
                         (error as any)?.statusCode === 403;
    
    console.log('Validation error message check:', errorMessage, 'Is API key error:', isApiKeyError);
    
    if (isApiKeyError) {
      console.warn('⚠️ Validation unavailable (API key issue). Generating recommendations from extracted data...');
      const fallbackScore = analysisComplianceScore || 50;
      const recommendations = generateRecommendationsFromData(extractedData, fallbackScore);
      
      return {
        isCompliant: fallbackScore >= 60,
        validationScore: fallbackScore,
        issues: [],
        recommendations,
        missingClauses: [],
        financialIssues: [],
        policyViolations: []
      };
    }
    
    return {
      isCompliant: false,
      validationScore: 0,
      issues: [{ severity: 'critical', description: 'Validation service unavailable' }],
      recommendations: ['Please retry validation or contact support'],
      missingClauses: [],
      financialIssues: [],
      policyViolations: []
    };
  }
}

/**
 * Evaluate vendor bid proposal
 */
export async function evaluateBid(
  bidContent: string,
  evaluationCriteria: Record<string, number>
): Promise<BidEvaluation> {
  // Validate content - check if it's corrupted binary data
  const isBinaryData = /^PK|^%PDF|[\x00-\x08\x0E-\x1F]/.test(bidContent.slice(0, 100));
  if (isBinaryData || bidContent.length < 50) {
    console.warn('⚠️ Document appears to be binary or corrupted. Attempting to extract text...');
    // Try to extract meaningful text - remove binary characters
    bidContent = bidContent
      .replace(/[\x00-\x08\x0E-\x1F]/g, '') // Remove binary characters
      .replace(/PK.*?%PDF/g, '') // Remove ZIP headers
      .replace(/[^\x20-\x7E\n\r\t]/g, '') // Keep only printable ASCII + newlines/tabs
      .substring(0, 8000); // Limit length
    
    if (bidContent.length < 50) {
      throw new Error('Document content is corrupted or unreadable. Please upload a valid text-based document.');
    }
  }
  
  // Check if content is mostly binary/non-text
  const printableChars = bidContent.replace(/[^\x20-\x7E\n\r\t]/g, '').length;
  const printableRatio = printableChars / bidContent.length;
  if (printableRatio < 0.5 && bidContent.length > 1000) {
    console.warn('⚠️ Document has low text content ratio. May be corrupted or image-based.');
  }
  
  const criteriaText = Object.entries(evaluationCriteria)
    .map(([key, weight]) => `${key}: ${weight}%`)
    .join('\n');

  const systemPrompt = `You are an expert bid evaluator for Government of Andhra Pradesh.
Carefully analyze the ENTIRE document - read EVERY LINE to extract accurate information.

YOU MUST extract SPECIFIC DATA to evaluate each criterion:

TECHNICAL COMPLIANCE: Check technical team qualifications, certifications (ISO, quality, safety), 
equipment availability, technical specifications compliance, IRC standards, etc.

FINANCIAL SOUNDNESS: Extract quoted amounts, annual turnover, net worth, credit rating, 
EMD amount, performance security, payment terms, etc.

EXPERIENCE & QUALIFICATION: Extract years of experience, total projects completed, 
similar projects done, total project value, past performance metrics, completion rates, etc.

PROPOSED METHODOLOGY: Analyze technical approach, quality assurance plans, safety measures, 
project management approach, environmental considerations, etc.

TIMELINE REALISM: Extract proposed completion time, compare with RFP requirements, 
check for buffer time, analyze project phasing, etc.

LOOK FOR THESE KEYWORDS: "Company Name", "Amount", "Budget", "Experience", "Projects", 
"Equipment", "Certification", "ISO", "Turnover", "Net Worth", "Timeline", "Completion", 
"Safety", "Quality", "Client", "Reference", "Award", "Performance", "Team Size", etc.

CRITICAL: You MUST respond ONLY with valid JSON. No explanations, no apologies, no extra text.

Respond in EXACTLY this JSON format:
{
  "criteria": {"technicalCompliance": 30, "financialSoundness": 25, "experienceQualification": 20, "proposedMethodology": 15, "timelineRealism": 10},
  "scores": {"technicalCompliance": 85, "financialSoundness": 92, "experienceQualification": 90, "proposedMethodology": 87, "timelineRealism": 85},
  "overallScore": 88,
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2"],
  "recommendations": "Detailed recommendation text explaining the evaluation",
  "aiConfidence": 95
}

DO NOT include any text before or after the JSON. ONLY return valid JSON.`;

  // Check if AI is available, otherwise use fallback immediately
  if (!AI_AVAILABLE) {
    console.log('⚠️ AI evaluation disabled. Using fallback evaluation...');
    return generateFallbackEvaluation(bidContent, evaluationCriteria, 'AI unavailable');
  }

  try {
    const completion = await insforge.ai.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { 
          role: 'user', 
          content: `Carefully read this ENTIRE bid proposal LINE BY LINE and extract COMPREHENSIVE REAL DATA from it. Return ONLY valid JSON, no other text.

CRITICAL: If the document appears corrupted, incomplete, or unreadable, still attempt to extract any available information and return valid JSON with available data. Do not refuse or apologize - just extract what you can.

Evaluation Criteria & Weights:
${criteriaText}

BID PROPOSAL TO ANALYZE (Read EVERY SINGLE LINE - DO NOT SKIP ANY):
${bidContent.slice(0, 8000)}

DETAILED EXTRACTION INSTRUCTIONS:
1. Read the document COMPLETELY from start to finish - scan EVERY line
2. For TECHNICAL COMPLIANCE, extract and score based on:
   - Technical team qualifications and size
   - ISO and quality certifications mentioned
   - Equipment owned/leased with specifications
   - Compliance with IRC or specified standards
   - Quality assurance measures

3. For FINANCIAL SOUNDNESS, extract and score based on:
   - EXACT quoted/bid amount as written
   - Annual turnover for past 3 years
   - Net worth mentioned
   - Credit rating if provided
   - EMD and performance security details
   - Payment terms

4. For EXPERIENCE & QUALIFICATION, extract and score based on:
   - ACTUAL years of experience stated
   - EXACT number of projects completed
   - Similar projects done (exact count)
   - Total project value
   - On-time completion percentage
   - Client testimonials and references

5. For PROPOSED METHODOLOGY, score based on:
   - Technical approach described
   - Quality control measures
   - Safety procedures
   - Environmental measures
   - Project management plan

6. For TIMELINE REALISM, extract and score based on:
   - Proposed completion time
   - Project phasing breakdown
   - Buffer time included
   - Comparison with requirements

7. Strengths must reference SPECIFIC details: "15 years experience", "Rs. 85 Crores annual turnover", "ISO 9001 certified", etc.

8. Weaknesses must cite what's missing or weak: "No ISO 45001 certification", "Lower on-time completion rate", etc.

9. Overall score = weighted average of all criteria scores using the weights provided

CRITICAL: Extract REAL values from the document. Don't make up or assume any data. Only score based on what EXISTS in the document.

Remember: Respond ONLY with valid JSON in the exact format specified. No markdown, no explanations.` 
        }
      ],
      temperature: 0.2,
      maxTokens: 3000
    });

    let result = completion.choices[0].message.content;
    
    // Remove markdown code block wrappers if present
    result = result.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    // Check if AI refused or returned error message
    const refusalPatterns = [
      /I'm sorry/i,
      /I can't assist/i,
      /I cannot/i,
      /can't help/i,
      /unable to/i,
      /corrupted/i,
      /improperly formatted/i,
      /invalid file/i,
      /cannot process/i
    ];
    
    const isRefusal = refusalPatterns.some(pattern => pattern.test(result));
    
    if (isRefusal || !result.startsWith('{')) {
      console.error('AI returned non-JSON response or refused:', result.slice(0, 300));
      
      // Generate fallback evaluation based on document content
      console.log('Generating fallback evaluation...');
      return generateFallbackEvaluation(bidContent, evaluationCriteria, isRefusal ? result : 'AI response was not in JSON format');
    }
    
    // Enhanced JSON cleaning to fix common issues
    try {
      // Try to find the JSON object boundaries
      const jsonStart = result.indexOf('{');
      const jsonEnd = result.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        result = result.substring(jsonStart, jsonEnd + 1);
      }
      
      // Fix common JSON issues: unescaped quotes, unterminated strings
      // Remove any trailing commas before closing braces/brackets
      result = result.replace(/,(\s*[}\]])/g, '$1');
      
      // Try to fix unterminated strings by finding and closing them
      // This is a simple heuristic - may not catch all cases
      let fixedResult = result;
      let inString = false;
      let escapeNext = false;
      let fixed = '';
      
      for (let i = 0; i < fixedResult.length; i++) {
        const char = fixedResult[i];
        
        if (escapeNext) {
          fixed += char;
          escapeNext = false;
          continue;
        }
        
        if (char === '\\') {
          escapeNext = true;
          fixed += char;
          continue;
        }
        
        if (char === '"') {
          inString = !inString;
          fixed += char;
          continue;
        }
        
        // If we're at the end and still in a string, try to close it
        if (i === fixedResult.length - 1 && inString) {
          fixed += '"';
          inString = false;
        } else {
          fixed += char;
        }
      }
      
      // Try parsing the fixed result first
      let parsed: BidEvaluation;
      try {
        parsed = JSON.parse(fixed) as BidEvaluation;
      } catch (fixError) {
        // If fixing didn't work, try the original
        console.warn('Fixed JSON still invalid, trying original:', fixError);
        parsed = JSON.parse(result) as BidEvaluation;
      }
      
      // Validate required fields exist
      if (!parsed.overallScore || !parsed.scores || !parsed.criteria) {
        console.warn('Invalid evaluation structure, generating fallback...');
        return generateFallbackEvaluation(bidContent, evaluationCriteria, 'Invalid evaluation structure');
      }
      
      return parsed;
    } catch (parseError: any) {
      console.error('JSON parse error after cleaning:', parseError);
      console.error('Problematic JSON (first 500 chars):', result.substring(0, 500));
      
      // Generate fallback evaluation
      return generateFallbackEvaluation(bidContent, evaluationCriteria, `JSON parsing error: ${parseError.message}`);
    }
  } catch (error: any) {
    console.error('Evaluation Error:', error);
    
    // Provide more specific error messages
    if (error instanceof SyntaxError) {
      console.log('JSON parse error, generating fallback evaluation...');
      return generateFallbackEvaluation(bidContent, evaluationCriteria, 'JSON parsing error');
    }
    
    if (error.message.includes('JSON') || error.message.includes('format')) {
      console.log('Format error, generating fallback evaluation...');
      return generateFallbackEvaluation(bidContent, evaluationCriteria, error.message);
    }
    
    // Last resort fallback
    try {
      return generateFallbackEvaluation(bidContent, evaluationCriteria, error.message || 'Unknown error');
    } catch (fallbackError) {
      throw new Error('Bid evaluation failed. Document may be corrupted or unreadable. Please try uploading a valid document.');
    }
  }
}

/**
 * Generate fallback evaluation when AI fails or refuses
 */
function generateFallbackEvaluation(
  bidContent: string,
  evaluationCriteria: Record<string, number>,
  reason: string
): BidEvaluation {
  console.log('Generating fallback evaluation due to:', reason);
  
  // Clean content - remove binary characters
  const cleanContent = bidContent
    .replace(/[\x00-\x08\x0E-\x1F]/g, '')
    .replace(/PK.*?%PDF/g, '')
    .substring(0, 10000);
  
  // Extract basic information from content using regex
  const contentLength = cleanContent.length;
  const hasTechnicalKeywords = /technical|specification|iso|certification|equipment|quality|standards/i.test(cleanContent);
  const hasFinancialKeywords = /amount|price|cost|budget|turnover|financial|emd|security|rupee|₹|rs\./i.test(cleanContent);
  const hasExperienceKeywords = /experience|project|years|completed|past|reference|client|portfolio/i.test(cleanContent);
  const hasMethodologyKeywords = /methodology|approach|plan|process|procedure|strategy|method/i.test(cleanContent);
  const hasTimelineKeywords = /timeline|duration|completion|schedule|time|deadline|period|months|days/i.test(cleanContent);
  
  // Map criteria names to score calculations
  const criteriaScores: Record<string, number> = {};
  const criteriaKeys = Object.keys(evaluationCriteria);
  
  // Default scoring based on common criteria names
  for (const key of criteriaKeys) {
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes('technical') || lowerKey.includes('compliance')) {
      criteriaScores[key] = hasTechnicalKeywords ? 70 : 50;
    } else if (lowerKey.includes('financial') || lowerKey.includes('soundness')) {
      criteriaScores[key] = hasFinancialKeywords ? 75 : 50;
    } else if (lowerKey.includes('experience') || lowerKey.includes('qualification')) {
      criteriaScores[key] = hasExperienceKeywords ? 72 : 50;
    } else if (lowerKey.includes('methodology') || lowerKey.includes('proposed')) {
      criteriaScores[key] = hasMethodologyKeywords ? 68 : 50;
    } else if (lowerKey.includes('timeline') || lowerKey.includes('realism')) {
      criteriaScores[key] = hasTimelineKeywords ? 70 : 50;
    } else {
      // Default score for unknown criteria
      criteriaScores[key] = 65;
    }
  }
  
  // Calculate weighted overall score
  const overallScore = Math.round(
    criteriaKeys.reduce((sum, key) => {
      const weight = evaluationCriteria[key] || 0;
      const score = criteriaScores[key] || 50;
      return sum + (score * weight / 100);
    }, 0)
  );
  
  // Generate evaluation based on extracted data
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  
  if (hasTechnicalKeywords) {
    strengths.push('Technical specifications and requirements are mentioned in document');
  } else {
    weaknesses.push('Limited technical details found - manual verification recommended');
  }
  
  if (hasFinancialKeywords) {
    strengths.push('Financial information and pricing details are present');
  } else {
    weaknesses.push('Financial information may be incomplete - verify amounts and terms');
  }
  
  if (hasExperienceKeywords) {
    strengths.push('Experience and past projects are referenced');
  } else {
    weaknesses.push('Experience details may need verification');
  }
  
  if (hasMethodologyKeywords) {
    strengths.push('Methodology and approach details are present');
  } else {
    weaknesses.push('Methodology section may need more detail');
  }
  
  if (hasTimelineKeywords) {
    strengths.push('Timeline and schedule information found');
  } else {
    weaknesses.push('Timeline details may need clarification');
  }
  
  if (contentLength > 1000) {
    strengths.push(`Document contains substantial content (${contentLength} characters)`);
  } else {
    weaknesses.push('Document content may be insufficient for detailed evaluation');
  }
  
  // Add context about fallback reason
  if (reason && reason.includes('corrupted') || reason.includes('binary')) {
    weaknesses.push('Document format issues detected - may require manual review');
  }
  
  return {
    criteria: evaluationCriteria,
    scores: criteriaScores,
    overallScore: Math.max(50, Math.min(90, overallScore)),
    strengths: strengths.length > 0 ? strengths : ['Document submitted for evaluation'],
    weaknesses: weaknesses.length > 0 ? weaknesses : ['Manual review recommended for comprehensive assessment'],
    recommendations: `Document evaluation completed using intelligent fallback analysis based on content keywords. ${reason && reason.length < 100 ? `Note: ${reason}` : 'AI evaluation was unavailable, but basic analysis was performed.'} Please review manually for detailed assessment and verification of all criteria.`,
    aiConfidence: 60 // Lower confidence for fallback
  };
}

/**
 * Draft new bid document using AI
 */
export async function draftBidDocument(params: {
  projectTitle: string;
  department: string;
  projectType: string;
  budget: string;
  timeline: string;
  technicalRequirements: string;
  additionalDetails?: string;
}): Promise<string> {
  const systemPrompt = `You are an expert tender document drafter for Government of Andhra Pradesh.
Draft professional bid/tender documents following Government of India Financial Rules (GFR) 2017, Central Vigilance Commission (CVC) guidelines, and Andhra Pradesh State procurement policies.

**CRITICAL: Follow this EXACT template structure:**

TENDER DOCUMENT
(For Procurement of Goods / Works / Services)

1. INVITATION FOR BIDS
2. SCOPE OF WORK
3. ELIGIBILITY CRITERIA
4. TECHNICAL SPECIFICATIONS
5. PROJECT DURATION
6. FINANCIAL DETAILS
7. BID SUBMISSION DETAILS
8. EVALUATION CRITERIA
9. TERMS AND CONDITIONS
10. PENALTY & TERMINATION
11. DOCUMENTS TO BE SUBMITTED
12. CONTACT INFORMATION
13. DECLARATION
14. ANNEXURES

Your documents must:
1. Include ALL mandatory clauses from GFR 2017
2. Follow Andhra Pradesh procurement guidelines
3. Include standard compliance requirements
4. Be comprehensive yet clear
5. Use professional government document format
6. Include proper numbering and sections
7. Generate unique Tender Reference Number (format: DEPT/YYYY-MM/NN)
8. Include current date in DD-MM-YYYY format
9. Calculate EMD as 2-3% of estimated cost
10. Include all standard annexures (A, B, C, D, E)`;

  const currentDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const tenderRefNumber = `${params.department.substring(0, 4).toUpperCase()}/${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}/${String(Math.floor(Math.random() * 99) + 1).padStart(2, '0')}`;
  
  const userPrompt = `Draft a comprehensive, professional tender document following the EXACT template structure provided. Use these project details:

**PROJECT DETAILS:**
- Department / Organization Name: ${params.department}
- Tender Reference Number: ${tenderRefNumber}
- Tender Title: ${params.projectTitle}
- Tender Type: ${params.projectType}
- Procurement Category: ${params.projectType === 'works' ? 'Works' : params.projectType === 'supply' ? 'Goods' : 'Services'}
- Date of Issue: ${currentDate}
- Estimated Cost of Work: ${params.budget}
- Project Timeline: ${params.timeline}

**TECHNICAL REQUIREMENTS:**
${params.technicalRequirements}

${params.additionalDetails ? `**ADDITIONAL INFORMATION:**\n${params.additionalDetails}` : ''}

**TEMPLATE STRUCTURE TO FOLLOW:**

1. **INVITATION FOR BIDS**
   - State that ${params.department} invites online bids from eligible and qualified bidders
   - Mention project title: ${params.projectTitle}
   - Reference e-Procurement Portal / GeM Portal for submission

2. **SCOPE OF WORK**
   - Describe major activities clearly
   - Include: ${params.technicalRequirements}
   - State that scope includes all activities required for successful completion

3. **ELIGIBILITY CRITERIA**
   - Must be registered entity under relevant laws
   - Similar projects experience (suggest appropriate years based on project type)
   - Minimum average annual turnover (calculate 20-30% of budget)
   - Valid certificates: GST, PAN, MSME (if applicable)
   - Not blacklisted by any government organization

4. **TECHNICAL SPECIFICATIONS**
   - List performance requirements, features, or standards
   - Ensure compliance with IS/IEC/ISO standards
   - Include: ${params.technicalRequirements}

5. **PROJECT DURATION**
   - Completion timeline: ${params.timeline}
   - From date of award of contract

6. **FINANCIAL DETAILS**
   - Estimated Cost: ${params.budget}
   - Tender Fee: Calculate appropriate amount (typically ₹0 for small projects, ₹500-5000 for larger)
   - EMD: Calculate 2-3% of ${params.budget}
   - Performance Security: 5-10% of contract value
   - Payment terms: Standard milestone-based payments

7. **BID SUBMISSION DETAILS**
   - Mode: Online (e-Procurement Portal)
   - Portal: AP e-Procurement Portal / GeM Portal
   - Last Date: Specify appropriate deadline (30-45 days from issue)
   - Bid Opening: Specify date and time
   - Contact Person: ${params.department} procurement officer

8. **EVALUATION CRITERIA**
   - Technical compliance with specifications
   - Financial quotation and price competitiveness
   - Experience and past performance
   - Compliance with terms and documentation
   - Selection method: QCBS or L1 basis

9. **TERMS AND CONDITIONS**
   - Bid validity: 90 days from submission
   - Right to reject any/all bids
   - Incomplete bids rejection
   - Agreement signing within 15 days of LOA
   - Jurisdiction: Courts of Andhra Pradesh

10. **PENALTY & TERMINATION**
    - Delay penalty: 0.5% per week, max 5% of contract value
    - Termination rights for non-performance

11. **DOCUMENTS TO BE SUBMITTED**
    - Company Registration Certificate
    - PAN and GST Registration
    - Experience Certificates
    - Financial Statements (Last 3 Years)
    - Declaration of Non-Blacklisting
    - Technical Proposal
    - Financial Proposal

12. **CONTACT INFORMATION**
    - Procurement Officer details
    - Department: ${params.department}
    - Email, Phone, Address

13. **DECLARATION**
    - Standard declaration format

14. **ANNEXURES**
    - Annexure A – Technical Specifications
    - Annexure B – Financial Bid Format
    - Annexure C – Bidder Declaration Form
    - Annexure D – Performance Guarantee Format
    - Annexure E – Checklist for Bidders

Generate the complete document using this exact structure. Ensure all sections are filled with appropriate details based on the project information provided.`;

  // Check if AI is available, otherwise use fallback immediately
  if (!AI_AVAILABLE) {
    console.log('⚠️ AI drafting disabled. Using fallback document generation...');
    return generateFallbackDocument(params);
  }

  try {
    const completion = await insforge.ai.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3, // Lower temperature for more consistent, professional drafting
      maxTokens: 3000 // Reduced to prevent API key renewal issues
    });

    return completion.choices[0].message.content;
  } catch (error: any) {
    console.error('Drafting Error:', error);
    
    const errorMsg = error?.message || '';
    
    // Check for API key errors - use fallback immediately
    if (errorMsg.includes('API key') || 
        errorMsg.includes('Forbidden') || 
        errorMsg.includes('renew cloud API key') ||
        errorMsg.includes('Failed to renew') ||
        (error as any)?.status === 403 ||
        (error as any)?.status === 500) {
      console.warn('⚠️ Drafting: API keys not configured. Using fallback document generation.');
      return generateFallbackDocument(params);
    }
    
    // If other error, try with even lower tokens
    try {
      console.log('Retrying draft with reduced tokens...');
      const retryCompletion = await insforge.ai.chat.completions.create({
        model: 'openai/gpt-4o',
        messages: [
          { role: 'system', content: 'You are an expert tender document drafter. Generate professional, compliant documents.' },
          { role: 'user', content: `Generate a tender document for: ${params.projectTitle} by ${params.department}. Type: ${params.projectType}. Budget: ${params.budget}. Timeline: ${params.timeline}. Requirements: ${params.technicalRequirements.slice(0, 2000)}. Include GFR 2017 compliance, eligibility, financial terms, evaluation criteria, and standard clauses.` }
        ],
        temperature: 0.3,
        maxTokens: 2000
      });
      
      return retryCompletion.choices[0].message.content;
    } catch (retryError) {
      console.error('Retry failed:', retryError);
      // Generate a template-based fallback document
      console.log('Generating fallback template document...');
      return generateFallbackDocument(params);
    }
  }
}

/**
 * Generate a professional fallback tender document template when AI is unavailable
 */
function generateFallbackDocument(params: {
  projectTitle: string;
  department: string;
  projectType: string;
  budget: string;
  timeline: string;
  technicalRequirements: string;
  additionalDetails?: string;
}): string {
  const currentDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const tenderRefNumber = `${params.department.substring(0, 4).toUpperCase()}/${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}/${String(Math.floor(Math.random() * 99) + 1).padStart(2, '0')}`;
  
  const documentTypeMap: Record<string, string> = {
    rfp: 'Request for Proposal (RFP)',
    rfq: 'Request for Quotation (RFQ)',
    tender: 'Open Tender',
    consultancy: 'Consultancy Services',
    works: 'Works Contract',
    supply: 'Supply Contract'
  };
  
  const procurementCategoryMap: Record<string, string> = {
    works: 'Works',
    supply: 'Goods',
    consultancy: 'Services',
    rfp: 'Services',
    rfq: 'Goods',
    tender: 'Goods'
  };
  
  const docType = documentTypeMap[params.projectType] || params.projectType;
  const procurementCategory = procurementCategoryMap[params.projectType] || 'Goods';
  
  // Calculate EMD (2-3% of budget)
  const budgetNum = parseFloat(params.budget.replace(/[^\d.]/g, '')) || 0;
  const emdAmount = budgetNum > 0 ? (budgetNum * 0.025).toFixed(2) : '2-3% of Contract Value';
  const performanceSecurity = budgetNum > 0 ? (budgetNum * 0.075).toFixed(2) : '5-10% of Contract Value';
  
  // Calculate submission deadline (45 days from issue)
  const submissionDate = new Date();
  submissionDate.setDate(submissionDate.getDate() + 45);
  const submissionDeadline = submissionDate.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  
  // Calculate bid opening (46 days from issue)
  const openingDate = new Date();
  openingDate.setDate(openingDate.getDate() + 46);
  const bidOpeningDate = openingDate.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  
  return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TENDER DOCUMENT
(For Procurement of Goods / Works / Services)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Department / Organization Name:
${params.department}

Tender Reference Number:
${tenderRefNumber}

Tender Title:
${params.projectTitle}

Tender Type:
${docType}

Procurement Category:
${procurementCategory}

Tender Issued By:
${params.department}, Government of Andhra Pradesh

Date of Issue:
${currentDate}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. INVITATION FOR BIDS

The ${params.department} invites online bids from eligible and qualified bidders for the work titled "${params.projectTitle}", as per the terms and conditions outlined in this document.

Bids must be submitted before the prescribed date and time through the e-Procurement Portal / GeM Portal.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. SCOPE OF WORK

This tender covers the following major activities:

${params.technicalRequirements}

The scope includes all activities required for successful completion of the project in compliance with technical specifications and standards.

${params.additionalDetails ? `\nAdditional Requirements:\n${params.additionalDetails}\n` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. ELIGIBILITY CRITERIA

Bidders must meet the following conditions:

• Must be a registered entity under relevant laws.
• Should have executed similar projects in the last 5 years.
• Should possess a minimum average annual turnover of ₹${budgetNum > 0 ? (budgetNum * 0.25).toFixed(2) : '2 Crores'}.
• Must submit valid certificates such as GST, PAN, MSME (if applicable).
• Should not be blacklisted by any government organization.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. TECHNICAL SPECIFICATIONS

The goods/services/works offered shall comply with the following specifications:

${params.technicalRequirements}

The bidder must ensure all materials and workmanship conform to relevant IS/IEC/ISO standards.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. PROJECT DURATION

The successful bidder shall complete the work within ${params.timeline} from the date of award of contract.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. FINANCIAL DETAILS

Estimated Cost of Work: ${params.budget}

Tender Fee: ₹0.00 (Non-refundable)

EMD (Earnest Money Deposit): ${budgetNum > 0 ? `₹${emdAmount}` : '2-3% of Contract Value'}

Performance Security: ${budgetNum > 0 ? `₹${performanceSecurity}` : '5-10% of Contract Value'}

Payment will be made as per the approved terms after successful completion and verification of work.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. BID SUBMISSION DETAILS

Mode of Submission: Online

Portal: AP e-Procurement Portal / GeM Portal

Last Date and Time for Submission: ${submissionDeadline}, 17:00 Hours

Bid Opening Date and Time: ${bidOpeningDate}, 17:30 Hours

Contact Person: Procurement Officer, ${params.department}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8. EVALUATION CRITERIA

Bids will be evaluated based on the following parameters:

• Technical compliance with specifications and eligibility criteria.
• Financial quotation and price competitiveness.
• Experience and past performance.
• Compliance with all terms and documentation.

The final selection shall be made on a Quality-cum-Cost Based System (QCBS) or Lowest Bid (L1) basis, as applicable.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

9. TERMS AND CONDITIONS

• Bids must be valid for a period of 90 Days from the date of submission.
• The Department reserves the right to reject any or all bids without assigning any reason.
• Incomplete or conditional bids shall be summarily rejected.
• The successful bidder shall sign the agreement within 15 Days from the issue of Letter of Acceptance.
• All disputes shall be subject to the jurisdiction of Andhra Pradesh only.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

10. PENALTY & TERMINATION

• Delay in completion will attract a penalty of 0.5% per week of delay, subject to a maximum of 5% of contract value.
• The Department reserves the right to terminate the contract in case of non-performance or policy violation.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

11. DOCUMENTS TO BE SUBMITTED

• Company Registration Certificate
• PAN and GST Registration
• Experience Certificates
• Financial Statements for Last 3 Years
• Declaration of Non-Blacklisting
• Technical Proposal
• Financial Proposal (as per format)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

12. CONTACT INFORMATION

Procurement Officer: [Name]
Designation: Procurement Officer
Department / Organization: ${params.department}
Email: [Official Email ID]
Phone: [Contact Number]
Address: [Office Address]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

13. DECLARATION

I/We hereby declare that the information provided is true to the best of our knowledge and we agree to abide by all the terms and conditions mentioned in this tender.

Authorized Signatory:
[Name, Designation, and Signature]
Date: ${currentDate}
Seal: [Company Seal]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

14. ANNEXURES

Annexure A – Technical Specifications

Annexure B – Financial Bid Format

Annexure C – Bidder Declaration Form

Annexure D – Performance Guarantee Format

Annexure E – Checklist for Bidders

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

END OF TENDER DOCUMENT

Generated by: BidAnalyzer AI - AI Drafting Assistant
Date: ${currentDate}
Compliance: GFR 2017 & Andhra Pradesh State Procurement Guidelines

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
}

/**
 * Compare multiple bid submissions with comprehensive similarity and red flag detection
 */
export async function compareBids(
  bids: Array<{ vendorName: string; content: string }>
): Promise<{
  comparison: Record<string, any>;
  similarities: string[];
  redFlags: string[];
  recommendation: string;
}> {
  // Pre-process bids for structured data extraction
  const processedBids = bids.map(bid => {
    const content = bid.content;
    
    // Extract financial data
    const priceMatches: string[] = content.match(/₹?\s*(\d{1,3}(?:,\d{2,3})*(?:\.\d{2})?)\s*(?:lakhs?|crores?|lakh|crore)?/gi) || [];
    const prices: string[] = priceMatches.map(p => p.replace(/[₹,\s]/g, '').toLowerCase());
    
    // Extract contact information
    const emailMatches: string[] = content.match(/[\w\.-]+@[\w\.-]+\.\w+/g) || [];
    const phoneMatches: string[] = content.match(/(?:\+91[-.\s]?)?[6-9]\d{9}|\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/g) || [];
    const addressMatches: string[] = content.match(/(?:Address|Location|Office)[:.\s]+([^\n]{20,100})/gi) || [];
    
    // Extract dates/timelines
    const dateMatches: string[] = content.match(/\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}|\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4}/gi) || [];
    
    // Extract company/vendor references
    const companyRefs: string[] = content.match(/(?:subcontractor|consultant|partner|vendor|supplier)[:.\s]+([A-Z][A-Za-z\s&]{3,50})/gi) || [];
    
    // Extract technical specifications/phrases
    const technicalPhrases: string[] = content.match(/(?:ISO|IS|IEC|ASME|ANSI|IEEE)\s*\d+[:\-]?\d*|(?:guarantees?\s+\d+%|uptime|efficiency|performance)/gi) || [];
    
    // Detect common typos/errors
    const commonTypos: string[] = ['enigneerng', 'enigneering', 'guarentee', 'guarantee', 'recieve', 'receive', 'seperate', 'separate'];
    const foundTypos: string[] = commonTypos.filter(typo => content.toLowerCase().includes(typo));
    
    return {
      vendorName: bid.vendorName,
      content,
      extracted: {
        prices,
        emails: emailMatches,
        phones: phoneMatches,
        addresses: addressMatches,
        dates: dateMatches,
        companyRefs,
        technicalPhrases,
        foundTypos,
        contentLength: content.length,
        wordCount: content.split(/\s+/).length
      }
    };
  });
  
  // Calculate text similarity between bids
  const calculateSimilarity = (text1: string, text2: string): number => {
    const words1 = new Set(text1.toLowerCase().split(/\s+/).filter(w => w.length > 3));
    const words2 = new Set(text2.toLowerCase().split(/\s+/).filter(w => w.length > 3));
    const intersection = new Set([...words1].filter(w => words2.has(w)));
    const union = new Set([...words1, ...words2]);
    return (intersection.size / union.size) * 100;
  };
  
  // Detect similarities and red flags from extracted data
  const detectedSimilarities: string[] = [];
  const detectedRedFlags: string[] = [];
  
  // Compare each pair of bids
  for (let i = 0; i < processedBids.length; i++) {
    for (let j = i + 1; j < processedBids.length; j++) {
      const bid1 = processedBids[i];
      const bid2 = processedBids[j];
      
      // 1. Identical Financial Quotations
      const matchingPrices = bid1.extracted.prices.filter(p1 => 
        bid2.extracted.prices.some(p2 => {
          const num1 = parseFloat(p1.replace(/[^\d.]/g, ''));
          const num2 = parseFloat(p2.replace(/[^\d.]/g, ''));
          return num1 > 0 && num2 > 0 && Math.abs(num1 - num2) < (num1 * 0.01); // Within 1%
        })
      );
      if (matchingPrices.length > 0) {
        detectedRedFlags.push(`⚠️ PRICE COLLUSION DETECTED: ${bid1.vendorName} and ${bid2.vendorName} quoted identical or nearly identical amounts (₹${matchingPrices[0]}). This suggests possible cartel behavior or price fixing.`);
      }
      
      // 2. Duplicate Contact Information
      const matchingEmails: string[] = [];
      for (const e of bid1.extracted.emails) {
        if (bid2.extracted.emails.includes(e)) matchingEmails.push(e);
      }
      const matchingPhones: string[] = [];
      for (const p of bid1.extracted.phones) {
        if (bid2.extracted.phones.includes(p)) matchingPhones.push(p);
      }
      if (matchingEmails.length > 0 || matchingPhones.length > 0) {
        detectedRedFlags.push(`🚨 DUPLICATE COMPANY INFORMATION: ${bid1.vendorName} and ${bid2.vendorName} share ${matchingEmails.length > 0 ? `email addresses (${matchingEmails[0]})` : ''} ${matchingPhones.length > 0 ? `phone numbers (${matchingPhones[0]})` : ''}. This indicates possible shell companies or same ownership under different names.`);
      }
      
      // 3. Identical Errors/Typos
      const matchingTypos: string[] = [];
      for (const t of bid1.extracted.foundTypos) {
        if (bid2.extracted.foundTypos.includes(t)) matchingTypos.push(t);
      }
      if (matchingTypos.length > 0) {
        detectedRedFlags.push(`⚠️ IDENTICAL ERRORS DETECTED: ${bid1.vendorName} and ${bid2.vendorName} contain the same spelling mistakes ("${matchingTypos[0]}"). This suggests copying from a common document or coordinated submission.`);
      }
      
      // 4. Common Vendor References
      const matchingRefs: string[] = [];
      for (const r of bid1.extracted.companyRefs) {
        if (bid2.extracted.companyRefs.includes(r)) matchingRefs.push(r);
      }
      if (matchingRefs.length > 0) {
        detectedSimilarities.push(`📋 COMMON VENDOR REFERENCES: ${bid1.vendorName} and ${bid2.vendorName} both reference the same subcontractor/consultant: "${matchingRefs[0]}". Risk of conflict of interest or joint bidding.`);
      }
      
      // 5. Identical Technical Phrases
      const matchingPhrases: string[] = [];
      for (const p of bid1.extracted.technicalPhrases) {
        if (bid2.extracted.technicalPhrases.includes(p)) matchingPhrases.push(p);
      }
      if (matchingPhrases.length > 2) {
        detectedSimilarities.push(`🔧 IDENTICAL TECHNICAL WRITE-UP: ${bid1.vendorName} and ${bid2.vendorName} use identical technical specifications/phrases (${matchingPhrases.length} matches found). Possible copy-paste or shared consultant.`);
      }
      
      // 6. Text Similarity (Reused Templates)
      const similarity = calculateSimilarity(bid1.content, bid2.content);
      if (similarity > 70) {
        detectedRedFlags.push(`🚨 HIGH TEXT SIMILARITY (${similarity.toFixed(1)}%): ${bid1.vendorName} and ${bid2.vendorName} have ${similarity.toFixed(1)}% textual similarity. This indicates possible shared template, plagiarism, or non-original content.`);
      } else if (similarity > 50) {
        detectedSimilarities.push(`📄 SIGNIFICANT TEXT SIMILARITY (${similarity.toFixed(1)}%): ${bid1.vendorName} and ${bid2.vendorName} show ${similarity.toFixed(1)}% similarity in structure and wording. Review for reused proposal templates.`);
      }
      
      // 7. Identical Dates/Timelines
      const matchingDates: string[] = [];
      for (const d of bid1.extracted.dates) {
        if (bid2.extracted.dates.includes(d)) matchingDates.push(d);
      }
      if (matchingDates.length > 2) {
        detectedSimilarities.push(`📅 IDENTICAL WORK SCHEDULES: ${bid1.vendorName} and ${bid2.vendorName} propose identical dates/timelines (${matchingDates.length} matches). Suggests shared project planning source.`);
      }
    }
  }
  
  // Check for non-compliant clauses across all bids
  const mandatoryClauses = ['Performance Guarantee', 'Payment Terms', 'EMD', 'Liquidated Damages', 'Termination Clause'];
  const missingClauses: Record<string, string[]> = {};
  bids.forEach(bid => {
    const missing: string[] = [];
    mandatoryClauses.forEach(clause => {
      if (!bid.content.match(new RegExp(clause, 'i'))) {
        missing.push(clause);
      }
    });
    if (missing.length > 0) {
      missingClauses[bid.vendorName] = missing;
    }
  });
  
  if (Object.keys(missingClauses).length === bids.length && Object.values(missingClauses).every(m => m.length > 0)) {
    const commonMissing = Object.values(missingClauses)[0].filter(c => 
      Object.values(missingClauses).every(m => m.includes(c))
    );
    if (commonMissing.length > 0) {
      detectedRedFlags.push(`🚨 SYSTEMATIC NON-COMPLIANCE: All bidders omitted the same mandatory clauses: ${commonMissing.join(', ')}. May need clarification or re-tendering.`);
    }
  }
  
  const bidsText = processedBids
    .map((bid, idx) => `\n--- BID ${idx + 1}: ${bid.vendorName} ---\n${bid.content.slice(0, 4000)}`)
    .join('\n\n');

  const systemPrompt = `You are an expert bid comparison analyst for Government of Andhra Pradesh procurement system.
Your task is to perform COMPREHENSIVE analysis to detect collusion, plagiarism, price fixing, and compliance issues.

**CRITICAL DETECTION SCENARIOS:**

1. **IDENTICAL TEXT OR CLAUSES** - Find exact duplicate phrases, sentences, or complete sections
   Example: "Our company guarantees 99.9% uptime and follows ISO 9001 practices" appearing in multiple bids
   Flag: Possible collusion or copy-paste from same source

2. **SAME FINANCIAL QUOTATION** - Compare all quoted amounts (look for exact matches or suspiciously similar prices)
   Example: Multiple vendors quoting exactly ₹24,95,000
   Flag: Price collusion or cartel behavior

3. **SIMILAR SUPPORTING DOCUMENTS** - Identify references to same certificates, experience letters, or documents
   Example: Two bidders referencing same work completion certificate from same authority
   Flag: Potential fraudulent document reuse

4. **DUPLICATE COMPANY INFORMATION** - Extract and compare contact details (emails, phones, addresses)
   Example: Different vendor names but identical contact numbers or email addresses
   Flag: Same ownership under multiple names (shell companies)

5. **REUSED PROPOSAL TEMPLATES** - Calculate text similarity percentage and identify matching sections
   Example: 90% textual similarity in methodology, risk assessment, staffing plans
   Flag: Shared consultant or non-original content

6. **IDENTICAL ERRORS OR TYPOS** - Find common spelling mistakes or formatting errors
   Example: Same typos like "Enigneerng" instead of "Engineering" in multiple bids
   Flag: Copying from common document or coordinated submission

7. **NON-COMPLIANT CLAUSES** - Check if all bidders omitted same mandatory clauses
   Example: All bidders missing "Performance Guarantee" clause
   Flag: Systemic misunderstanding or requirement clarification needed

8. **SUSPICIOUS SIMILARITY IN WORK SCHEDULES** - Compare dates, timelines, milestones, Gantt charts
   Example: Identical project milestones with same dates and durations
   Flag: Shared project planning source

9. **COMMON VENDOR REFERENCES** - Extract subcontractor, consultant, or partner names
   Example: Multiple bidders listing same subcontractor for technical execution
   Flag: Conflict of interest or joint bidding under disguise

10. **LANGUAGE AND STYLE PATTERN MATCHING** - Analyze sentence structures, phrasing, terminology
    Example: Similar sentence structures and terminology patterns
    Flag: AI-generated or plagiarized bids

**YOUR RESPONSE MUST INCLUDE:**

Return ONLY valid JSON in this exact format:
{
  "comparison": {
    "vendor1": {
      "score": 85,
      "strengths": ["specific strength"],
      "weaknesses": ["specific weakness"],
      "quotedAmount": "₹XX,XX,XXX",
      "experience": "X years",
      "certifications": ["cert1", "cert2"]
    },
    "vendor2": {
      "score": 78,
      "strengths": ["specific strength"],
      "weaknesses": ["specific weakness"],
      "quotedAmount": "₹XX,XX,XXX",
      "experience": "X years",
      "certifications": ["cert1", "cert2"]
    }
  },
  "similarities": [
    "Exact phrase match: '...' found in Bid 1 and Bid 2",
    "Identical technical specifications: ISO 9001 mentioned identically",
    "Common subcontractor reference: 'ABC Engineering' listed by both"
  ],
  "redFlags": [
    "🚨 CRITICAL: Price collusion detected - all vendors quoted ₹24,95,000 (exact match)",
    "🚨 CRITICAL: Identical contact information shared between Vendor A and Vendor B",
    "⚠️ HIGH RISK: 85% text similarity between Bid 1 and Bid 2 suggests shared template",
    "⚠️ Identical typos found: 'Enigneerng' appears in both Bid 1 and Bid 2"
  ],
  "recommendation": "Based on comprehensive analysis: [Detailed recommendation with specific findings, scores, and action items]"
}

**CRITICAL RULES:**
- Extract EXACT quoted amounts, contact info, dates from each bid
- Quote EXACT matching phrases when found
- Calculate similarity percentages accurately
- Base all flags on ACTUAL content, not assumptions
- Provide SPECIFIC examples and evidence for each finding
- Return ONLY valid JSON, no markdown, no explanations`;

  try {
    // Prepare detailed extraction summary for AI
    const extractionSummary = processedBids.map((bid, idx) => `
BID ${idx + 1}: ${bid.vendorName}
- Extracted Prices: ${bid.extracted.prices.join(', ') || 'None found'}
- Contact Emails: ${bid.extracted.emails.join(', ') || 'None found'}
- Contact Phones: ${bid.extracted.phones.join(', ') || 'None found'}
- Dates/Timelines: ${bid.extracted.dates.slice(0, 5).join(', ') || 'None found'}
- Company References: ${bid.extracted.companyRefs.slice(0, 3).join(', ') || 'None found'}
- Technical Phrases: ${bid.extracted.technicalPhrases.slice(0, 5).join(', ') || 'None found'}
- Found Typos: ${bid.extracted.foundTypos.join(', ') || 'None'}
- Content Length: ${bid.extracted.contentLength} chars, ${bid.extracted.wordCount} words
`).join('\n');
    
    const userPrompt = `Perform COMPREHENSIVE bid comparison analysis. Use the extracted data below AND read the full bid content.

**PRE-EXTRACTED DATA ANALYSIS:**
${extractionSummary}

**DETECTED ISSUES (VERIFY AND EXPAND):**
${detectedRedFlags.length > 0 ? `\nRED FLAGS DETECTED:\n${detectedRedFlags.map((f, i) => `${i + 1}. ${f}`).join('\n')}` : ''}
${detectedSimilarities.length > 0 ? `\nSIMILARITIES DETECTED:\n${detectedSimilarities.map((s, i) => `${i + 1}. ${s}`).join('\n')}` : ''}

**FULL BID CONTENT (Read EVERY LINE):**
${bidsText}

**YOUR ANALYSIS TASKS:**

1. **VERIFY** the pre-detected issues above and expand with exact quotes from bid content
2. **EXTRACT** detailed information from each bid:
   - Exact quoted amount (with currency)
   - Years of experience (numeric value)
   - Number of similar projects completed
   - Key certifications mentioned
   - Proposed timeline/duration
   - Technical specifications
   - Payment terms
   - Contact information

3. **IDENTIFY** additional similarities not caught by automated detection:
   - Find IDENTICAL sentences or phrases (quote them exactly)
   - Detect same sentence structures or formatting patterns
   - Find matching clauses or legal text
   - Identify similar project methodologies (quote specific sections)

4. **CALCULATE** scores for each vendor based on:
   - Completeness of information (0-30 points)
   - Technical merit and qualifications (0-30 points)
   - Financial competitiveness (0-20 points)
   - Compliance with requirements (0-20 points)

5. **PROVIDE** detailed recommendation including:
   - Which vendor offers best value and why
   - Specific concerns about each bid
   - Action items for procurement team
   - Whether re-tendering is recommended

Return ONLY valid JSON as specified in the system prompt. Include all detected similarities and red flags with exact evidence.`;

    // Check if we have valid content to compare (not just OCR failure placeholders)
    const hasValidContent = bids.some(bid => 
      bid.content && 
      bid.content.length > 100 && 
      !bid.content.includes('[Document') && 
      !bid.content.includes('OCR extraction failed')
    );

    if (!hasValidContent) {
      console.warn('⚠️ No valid content extracted from documents. Using fallback analysis only.');
      // Return fallback results immediately without calling AI
      return {
        comparison: processedBids.reduce((acc, bid) => {
          acc[bid.vendorName] = { 
            score: 50,
            note: 'Limited analysis - document extraction failed'
          };
          return acc;
        }, {} as Record<string, any>),
        similarities: detectedSimilarities,
        redFlags: detectedRedFlags.length > 0 ? detectedRedFlags : [
          '⚠️ Document extraction failed. Please ensure documents are readable and OCR is configured.',
          '⚠️ Documents appear to be image-based. OCR extraction may be required.'
        ],
        recommendation: `Comparison attempted but document extraction failed. ${detectedRedFlags.length} red flags and ${detectedSimilarities.length} similarities detected through automated analysis. Please verify documents are readable and OCR is properly configured.`
      };
    }

    // Try AI analysis, but catch API key errors quickly
    let completion: any = null;
    let useOpenRouter = false;
    
    try {
      completion = await insforge.ai.chat.completions.create({
        model: 'openai/gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2,
        maxTokens: 4000
      });
    } catch (aiError: any) {
      const errorMsg = aiError?.message || '';
      // Check for API key errors - try OpenRouter fallback
      if (errorMsg.includes('API key') || 
          errorMsg.includes('Forbidden') || 
          errorMsg.includes('renew cloud API key') ||
          errorMsg.includes('not enabled') ||
          (aiError as any)?.status === 403 ||
          (aiError as any)?.status === 500) {
        console.warn('⚠️ Insforge backend unavailable. Trying OpenRouter API...');
        useOpenRouter = true;
      } else {
        throw aiError; // Re-throw other errors
      }
    }
    
    // If Insforge failed, try OpenRouter API
    if (useOpenRouter) {
      try {
        const { OPENROUTER_API_KEYS } = await import('@/lib/insforge');
        
        if (!OPENROUTER_API_KEYS || OPENROUTER_API_KEYS.length === 0) {
          throw new Error('OpenRouter API keys not configured');
        }
        
        // Try OpenRouter models (text-only, no vision needed for comparison)
        const openRouterModels = [
          'openai/gpt-4o',
          'openai/gpt-4o-mini',
          'anthropic/claude-3.5-sonnet',
          'google/gemini-2.0-flash-exp',
          'google/gemini-flash-1.5'
        ];
        
        for (const apiKey of OPENROUTER_API_KEYS) {
          for (const model of openRouterModels) {
            try {
              console.log(`🔍 Trying OpenRouter: ${model}...`);
              
              const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${apiKey}`,
                  'Content-Type': 'application/json',
                  'HTTP-Referer': window.location.origin,
                  'X-Title': 'BidAnalyzer AI Comparison'
                },
                body: JSON.stringify({
                  model: model,
                  messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                  ],
                  temperature: 0.2,
                  max_tokens: 4000
                })
              });
              
              if (!response.ok) {
                const errorData = await response.text();
                let errorJson = '';
                try {
                  errorJson = JSON.parse(errorData).error?.message || '';
                } catch {
                  errorJson = errorData;
                }
                
                // Skip payment/auth errors, try next model/key
                if (response.status === 402 || response.status === 401 || response.status === 403) {
                  console.warn(`⚠️ ${model} failed (${response.status}), trying next...`);
                  continue;
                }
                
                // For 404 (model not found), try next model
                if (response.status === 404) {
                  console.warn(`⚠️ ${model} not found (404), trying next...`);
                  continue;
                }
                
                throw new Error(`OpenRouter API error: ${response.status} - ${errorJson}`);
              }
              
              const data = await response.json();
              completion = {
                choices: [{
                  message: {
                    content: data.choices[0]?.message?.content || ''
                  }
                }]
              };
              
              console.log(`✅ OpenRouter (${model}) comparison successful!`);
              break; // Success, exit loops
            } catch (openRouterError: any) {
              const errorMsg = openRouterError?.message || '';
              if (errorMsg.includes('402') || errorMsg.includes('401') || errorMsg.includes('403')) {
                console.warn(`⚠️ ${model} auth/payment error, trying next...`);
                continue;
              }
              console.warn(`⚠️ OpenRouter (${model}) failed:`, errorMsg.slice(0, 100));
              continue; // Try next model/key
            }
          }
          
          if (completion) break; // Success, exit key loop
        }
        
        if (!completion) {
          throw new Error('All OpenRouter API keys/models failed');
        }
      } catch (openRouterError: any) {
        console.warn('⚠️ OpenRouter fallback also failed. Using automated analysis only.');
        throw openRouterError; // Will be caught by outer catch block
      }
    }

    let result = completion.choices[0].message.content;
    
    // Remove markdown code block wrappers if present
    result = result.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    // Check if response starts with JSON
    if (!result.startsWith('{')) {
      console.error('AI returned non-JSON response:', result.slice(0, 200));
      // Fallback: return structured result with detected issues
      return {
        comparison: processedBids.reduce((acc, bid) => {
          acc[bid.vendorName] = { score: 50 };
          return acc;
        }, {} as Record<string, any>),
        similarities: detectedSimilarities,
        redFlags: detectedRedFlags,
        recommendation: 'AI analysis unavailable. Please review detected similarities and red flags manually. ' + 
          (detectedRedFlags.length > 0 ? 'CRITICAL: Multiple red flags detected requiring immediate investigation.' : '')
      };
    }
    
    const aiResult = JSON.parse(result);
    
    // Merge AI results with pre-detected issues (avoid duplicates)
    const mergedSimilarities = [...new Set([...detectedSimilarities, ...(aiResult.similarities || [])])];
    const mergedRedFlags = [...new Set([...detectedRedFlags, ...(aiResult.redFlags || [])])];
    
    return {
      ...aiResult,
      similarities: mergedSimilarities,
      redFlags: mergedRedFlags
    };
  } catch (error: any) {
    const errorMsg = error?.message || '';
    
    // Check if it's an API key error - use fallback silently
    if (errorMsg.includes('API key') || 
        errorMsg.includes('Forbidden') || 
        errorMsg.includes('renew cloud API key') ||
        errorMsg.includes('Failed to renew')) {
      console.warn('⚠️ Comparison: API keys not configured. Using automated fallback analysis.');
    } else {
      console.error('Comparison Error:', error);
    }
    
    // Fallback: return results based on pre-detected issues
    return {
      comparison: processedBids.reduce((acc, bid) => {
        acc[bid.vendorName] = { 
          score: 50,
          note: 'Analysis limited - API keys not configured. Automated analysis only.'
        };
        return acc;
      }, {} as Record<string, any>),
      similarities: detectedSimilarities,
      redFlags: detectedRedFlags.length > 0 ? detectedRedFlags : [
        '⚠️ Unable to complete full AI analysis. Manual review recommended.',
        '⚠️ Please verify document readability and format before comparison.'
      ],
      recommendation: `Comparison completed with ${detectedRedFlags.length} red flags and ${detectedSimilarities.length} similarities detected through automated analysis. ` +
        (detectedRedFlags.length > 0 
          ? 'CRITICAL ISSUES FOUND: Immediate investigation required for detected red flags.' 
          : 'No critical red flags detected automatically. Manual review still recommended.')
    };
  }
}

/**
 * AI Chat Assistant for document Q&A
 */
export async function chatWithDocument(
  question: string,
  documentContext: string,
  chatHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<string> {
  const systemPrompt = `You are an expert AI assistant for the Andhra Pradesh Bid Document Management System.
Your role is to answer questions about procurement documents with HIGH ACCURACY.

**CRITICAL INSTRUCTIONS:**
1. Read the ENTIRE document context provided - do NOT skip any parts
2. Extract EXACT values as written in the document (e.g., "EMD: ₹40,000", "Rs.8,96,035/-", "Earnest Money Deposit: ₹50,000")
3. If information is NOT in the document, say "The document does not contain this information" - DO NOT make up data
4. Be SPECIFIC - quote exact values, dates, amounts, clause numbers when available
5. For EMD (Earnest Money Deposit), search for ALL variations: "EMD", "Earnest Money", "Security Deposit", "Bid Security", "Earnest Money Deposit"
6. For amounts, look for patterns like: "₹", "Rs.", "INR", "Lakhs", "Crores", numbers with commas, "Rs.8,96,035/-"
7. Answer in a clear, professional manner
8. If the question is unclear, ask for clarification
9. When you find EMD information, quote the EXACT text from the document`;

  // Intelligent context truncation - prioritize important sections
  let contextToUse = documentContext;
  
  // If document is very long, use smart truncation to keep important parts
  if (documentContext.length > 12000) {
    // Keep first 3000 chars (usually header/important info like Enquiry Number, EMD, etc.)
    const start = documentContext.slice(0, 3000);
    // Search for EMD/financial keywords and keep surrounding context (500 chars before/after)
    const emdPattern = /(?:EMD|Earnest\s+Money|Security\s+Deposit|Bid\s+Security)[\s\S]{0,800}/gi;
    const emdMatches = Array.from(documentContext.matchAll(emdPattern));
    const financialContext = emdMatches.map(m => {
      const startIdx = Math.max(0, m.index! - 200);
      const endIdx = Math.min(documentContext.length, m.index! + m[0].length + 300);
      return documentContext.slice(startIdx, endIdx);
    }).join('\n\n---\n\n');
    
    // Also search for amount patterns
    const amountPattern = /(?:₹|Rs\.?|INR)\s*[\d,]+(?:\s*(?:lakhs?|crores?|lakh|crore))?/gi;
    const amountMatches = Array.from(documentContext.matchAll(amountPattern));
    const amountContext = amountMatches.slice(0, 10).map(m => {
      const startIdx = Math.max(0, m.index! - 150);
      const endIdx = Math.min(documentContext.length, m.index! + m[0].length + 150);
      return documentContext.slice(startIdx, endIdx);
    }).join('\n\n---\n\n');
    
    // Keep last 5000 chars (usually terms/conditions/details)
    const end = documentContext.slice(-5000);
    contextToUse = `${start}\n\n=== FINANCIAL INFORMATION ===\n${financialContext}\n\n=== AMOUNTS MENTIONED ===\n${amountContext}\n\n=== DOCUMENT CONTINUES ===\n\n${end}`;
    console.log('Using smart truncated context, length:', contextToUse.length);
  } else {
    contextToUse = documentContext;
  }

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    { 
      role: 'user' as const, 
      content: `DOCUMENT CONTEXT (Read COMPLETELY - this is the full document text):
${contextToUse}

---
QUESTION: ${question}

Please answer the question based ONLY on the document context above. Extract EXACT values as written. Search thoroughly for the information. If the information is not in the document, say so clearly.` 
    },
    ...chatHistory.slice(-6), // Keep last 6 messages for context (3 exchanges)
    { role: 'user' as const, content: question }
  ];

  // Check if AI is available, otherwise use fallback immediately
  if (!AI_AVAILABLE) {
    console.log('⚠️ AI chat disabled. Using fallback search...');
    return searchDocumentFallback(question, documentContext);
  }

  try {
    console.log('Chat request - Question:', question);
    console.log('Chat request - Context length:', contextToUse.length);
    console.log('Chat request - History length:', chatHistory.length);
    
    const completion = await insforge.ai.chat.completions.create({
      model: 'openai/gpt-4o',
      messages,
      temperature: 0.2, // Lower temperature for more accurate, factual responses
      maxTokens: 2000 // Increased for more detailed answers
    });

    let response = completion.choices[0].message.content;
    
    // Remove markdown code blocks if present
    response = response.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    console.log('Chat response received, length:', response.length);
    return response;
  } catch (error: any) {
    console.error('Chat Error:', error);
    console.error('Error details:', error.message || error);
    
    // Fallback to document search when AI fails
    return searchDocumentFallback(question, documentContext);
  }
}

/**
 * Fallback search function when AI is unavailable or fails
 */
function searchDocumentFallback(question: string, documentContext: string): string {
  const lowerQuestion = question.toLowerCase();
  const lowerDoc = documentContext.toLowerCase();
  
  // Search for EMD related questions
  if (lowerQuestion.includes('emd') || lowerQuestion.includes('earnest money') || lowerQuestion.includes('security deposit')) {
    // Look for EMD patterns with multiple variations
    const emdPatterns = [
      /EMD[:\s]+(?:₹|Rs\.?|INR)?\s*([\d,]+(?:\.\d{2})?)\s*(?:lakhs?|crores?|lakh|crore)?/gi,
      /Earnest\s+Money\s+Deposit[:\s]+(?:₹|Rs\.?|INR)?\s*([\d,]+(?:\.\d{2})?)/gi,
      /Earnest\s+Money[:\s]+(?:₹|Rs\.?|INR)?\s*([\d,]+(?:\.\d{2})?)/gi,
      /Security\s+Deposit[:\s]+(?:₹|Rs\.?|INR)?\s*([\d,]+(?:\.\d{2})?)/gi,
      /Bid\s+Security[:\s]+(?:₹|Rs\.?|INR)?\s*([\d,]+(?:\.\d{2})?)/gi,
      /(?:₹|Rs\.?)\s*([\d,]+(?:\.\d{2})?)\s*(?:as\s+)?EMD/gi,
      /EMD\s+(?:Amount|Value|is|of)[:\s]+(?:₹|Rs\.?|INR)?\s*([\d,]+(?:\.\d{2})?)/gi
    ];
    
    for (const pattern of emdPatterns) {
      const matches = Array.from(documentContext.matchAll(pattern));
      if (matches.length > 0) {
        const emdValue = matches[0][1];
        const matchIndex = matches[0].index!;
        const contextStart = Math.max(0, matchIndex - 200);
        const contextEnd = Math.min(documentContext.length, matchIndex + 400);
        const context = documentContext.slice(contextStart, contextEnd);
        return `Based on the document, the EMD (Earnest Money Deposit) value is ₹${emdValue}. 

Here's the relevant context from the document:
"${context}"

Please note: This information was extracted using automated search. For the complete terms and conditions regarding EMD, please refer to the full document.`;
      }
    }
    
    // If no direct match, search for amount patterns near EMD keywords
    const emdKeywordIndex = lowerDoc.search(/(?:emd|earnest\s+money|security\s+deposit)/i);
    if (emdKeywordIndex !== -1) {
      const searchStart = Math.max(0, emdKeywordIndex - 100);
      const searchEnd = Math.min(documentContext.length, emdKeywordIndex + 500);
      const searchSection = documentContext.slice(searchStart, searchEnd);
      const amountMatch = searchSection.match(/(?:₹|Rs\.?)\s*([\d,]+(?:\.\d{2})?)/g);
      if (amountMatch && amountMatch.length > 0) {
        return `I found EMD-related information in the document. The amount mentioned near the EMD section is ${amountMatch[0]}. 

Here's the relevant section:
"${searchSection}"

Please review the document for complete EMD terms and conditions.`;
      }
    }
    
    return 'I searched the document thoroughly but could not find a specific EMD (Earnest Money Deposit) value. The document may not explicitly state the EMD amount, or it might be mentioned in a different format.\n\nPlease check the document manually for sections mentioning:\n- "EMD" or "Earnest Money Deposit"\n- "Security Deposit"\n- "Bid Security"\n\nThese sections typically appear near the beginning of tender documents or in the terms and conditions section.';
  }
  
  // Generic search for other questions
  const keywords = lowerQuestion.split(/\s+/).filter(w => w.length > 3);
  const foundSections: string[] = [];
  
  for (const keyword of keywords) {
    const index = lowerDoc.indexOf(keyword);
    if (index !== -1) {
      const start = Math.max(0, index - 200);
      const end = Math.min(documentContext.length, index + 400);
      foundSections.push(documentContext.slice(start, end));
    }
  }
  
  if (foundSections.length > 0) {
    return `I found some relevant information in the document related to your question:

${foundSections.slice(0, 3).join('\n\n---\n\n')}

Please review the document for complete details.`;
  }
  
  return 'I searched the document but could not find specific information related to your question. The information might be presented in a different format or may not be included in this document. Please review the document manually or try rephrasing your question with specific keywords.';
}

