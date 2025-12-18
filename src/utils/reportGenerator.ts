/**
 * Report Generator Utility
 * Generates beautiful HTML reports for bid evaluations in the same format as demo-output.html
 */

export interface EvaluationReportData {
  tenderId: string;
  projectTitle: string;
  department: string;
  estimatedValue: string;
  evaluationDate: string;
  vendors: Array<{
    name: string;
    technical: number;
    financial: number;
    bonus: number;
    total: number;
    rank: number;
    remarks: string;
  }>;
  validationResults: {
    missingClauses: number;
    financialThreshold: string;
    technicalEligibility: string;
    policyCompliance: string;
    completeness: string;
    environmentalClearance: string;
    complianceScore?: number; // Optional compliance score from validation
    // Real-time validation details
    missingClausesDetails?: string;
    financialThresholdDetails?: string;
    technicalEligibilityDetails?: string;
    policyComplianceDetails?: string;
    completenessDetails?: string;
    environmentalClearanceDetails?: string;
  };
  evaluationMatch: number;
  processingTime: string;
  aiConfidence: number;
  auditTrail: Array<{
    time: string;
    action: string;
    description: string;
  }>;
  extractedData?: any; // Optional extracted data from AI analysis
  aiAnalysis?: { // AI Analysis summary and key points
    summary?: string;
    keyPoints?: string[];
    complianceScore?: number;
  };
}

export function generateEvaluationReport(data: EvaluationReportData): string {
  console.log('generateEvaluationReport called with data:', data);

  const templateBgUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/Bidalert%20template.png`
      : "/Bidalert%20template.png";

  const logoUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/bid3d.png`
      : "/bid3d.png";

  const vendorsTableRows = data.vendors.map((vendor, idx) => {
    const rankBadge = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '';
    const rankClass = idx === 0 ? 'rank-1' : idx === 1 ? 'rank-2' : idx === 2 ? 'rank-3' : '';
    
    return `
      <tr>
        <td><span class="rank-badge ${rankClass}">${rankBadge} ${vendor.rank}</span></td>
        <td><strong>${vendor.name}</strong></td>
        <td>${vendor.technical}</td>
        <td>${vendor.financial}</td>
        <td>${vendor.bonus}</td>
        <td><strong>${vendor.total}</strong></td>
        <td>${vendor.remarks}</td>
      </tr>
    `;
  }).join('');

  const auditTrailItems = data.auditTrail.map(item => `
    <div class="timeline-item">
      <div class="timeline-time">${item.time}</div>
      <div class="timeline-content">
        <strong>${item.action}</strong><br>
        ${item.description}
      </div>
    </div>
  `).join('');

  console.log('Generated vendorsTableRows:', vendorsTableRows.substring(0, 200));
  console.log('Generated auditTrailItems:', auditTrailItems.substring(0, 200));
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Bid Evaluation Report - ${data.projectTitle}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #ffffff;
            padding: 0;
            color: #333;
        }

        .page-bg {
            max-width: 768px;
            margin: 0 auto;
            min-height: 1086px;
            background: #ffffff url('${templateBgUrl}') no-repeat top center;
            background-size: contain;
            padding: 160px 40px 40px 40px; /* push content below header art */
        }
        
        .container {
            max-width: 100%;
            margin: 0 auto;
            background: transparent;
            border-radius: 0;
            box-shadow: none;
            overflow: hidden;
        }
        
        .header {
            background: transparent;
            color: #003366;
            padding: 40px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px;
        }
        
        .section {
            margin-bottom: 40px;
            padding: 30px;
            background: #f8fafc;
            border-radius: 15px;
            border-left: 5px solid #3b82f6;
        }
        
        .section h2 {
            color: #1e3a8a;
            margin-bottom: 20px;
            font-size: 1.8rem;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 700;
            line-height: 1.3;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        
        .info-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .info-card h3 {
            color: #3b82f6;
            font-size: 0.9rem;
            margin-bottom: 8px;
            text-transform: uppercase;
        }
        
        .info-card p {
            color: #1e293b;
            font-size: 1.1rem;
            font-weight: 600;
        }
        
        .vendor-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background: white;
            border-radius: 10px;
            overflow: hidden;
        }
        
        .vendor-table th {
            background: #1e3a8a;
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: 600;
        }
        
        .vendor-table td {
            padding: 15px;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .vendor-table tr:hover {
            background: #f1f5f9;
        }
        
        .rank-badge {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 1.1rem;
        }
        
        .rank-1 {
            background: #ffd700;
            color: #1e293b;
        }
        
        .rank-2 {
            background: #c0c0c0;
            color: #1e293b;
        }
        
        .rank-3 {
            background: #cd7f32;
            color: white;
        }
        
        .status-badge {
            display: inline-block;
            padding: 5px 12px;
            border-radius: 15px;
            font-size: 0.85rem;
            font-weight: 600;
        }
        
        .status-pass {
            background: #10b981;
            color: white;
        }
        
        .status-warning {
            background: #f59e0b;
            color: white;
        }
        
        .status-fail {
            background: #ef4444;
            color: white;
        }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        
        .metric-card {
            background: white;
            padding: 25px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            border-top: 4px solid #3b82f6;
        }
        
        .metric-value {
            font-size: 2.5rem;
            font-weight: bold;
            color: #1e3a8a;
            margin: 10px 0;
        }
        
        .metric-label {
            color: #64748b;
            font-size: 0.95rem;
        }
        
        .success-criteria {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 30px;
            border-radius: 15px;
            margin-top: 30px;
        }
        
        .success-criteria h3 {
            font-size: 1.5rem;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .criteria-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }
        
        .criteria-item {
            background: rgba(255,255,255,0.2);
            padding: 20px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
        }
        
        .criteria-item h4 {
            margin-bottom: 10px;
        }
        
        .criteria-item p {
            font-size: 1.8rem;
            font-weight: bold;
        }
        
        .footer {
            background: #1e293b;
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .timeline {
            position: relative;
            padding-left: 30px;
            margin-top: 20px;
        }
        
        .timeline::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 2px;
            background: #3b82f6;
        }
        
        .timeline-item {
            position: relative;
            padding-bottom: 20px;
        }
        
        .timeline-item::before {
            content: '';
            position: absolute;
            left: -35px;
            top: 5px;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #3b82f6;
        }
        
        .timeline-time {
            color: #64748b;
            font-size: 0.9rem;
            margin-bottom: 5px;
        }
        
        .timeline-content {
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        @media print {
            body {
                background: white;
                padding: 0;
            }
            .container {
                box-shadow: none;
            }
        }
        
        /* Responsive layout for smaller screens */
        @media (max-width: 768px) {
            body {
                padding: 0 8px;
            }

            .page-bg {
                max-width: 100%;
                min-height: auto;
                padding: 120px 12px 24px 12px;
                background-size: cover;
            }

            .header {
                padding: 24px 16px 16px 16px;
            }

            .header h1 {
                font-size: 1.6rem;
            }

            .header p {
                font-size: 0.95rem;
            }

            .content {
                padding: 24px 16px;
            }

            .section {
                padding: 18px 14px;
                margin-bottom: 24px;
            }

            .info-grid,
            .metrics-grid,
            .criteria-grid {
                grid-template-columns: 1fr;
            }

            .info-card h3 {
                font-size: 0.8rem;
            }

            .info-card p {
                font-size: 1rem;
            }

            .vendor-table,
            .vendor-table thead,
            .vendor-table tbody,
            .vendor-table tr,
            .vendor-table th,
            .vendor-table td {
                font-size: 0.85rem;
            }

            /* Allow wide tables to scroll instead of overflowing */
            .vendor-table {
                display: block;
                width: 100%;
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
            }

            .timeline {
                padding-left: 20px;
            }

            .timeline-item::before {
                left: -25px;
            }

            .footer {
                flex-direction: column;
                align-items: flex-start;
                gap: 8px;
            }
        }
    </style>
</head>
<body>
    <div class="page-bg">
    <div class="container">
        <div class="header">
            <h1>🧠 AI-Based Bid Document Evaluation</h1>
            <p>Government of Andhra Pradesh - Infrastructure & Investment Department</p>
            <p style="font-size: 1rem; margin-top: 10px;">AI-Powered Evaluation Report</p>
        </div>
        
        <div class="content">
            <!-- AI Analysis Summary -->
            ${data.aiAnalysis?.summary ? `
            <div class="section">
                <h2>🧠 AI Analysis Complete</h2>
                <div style="background: white; padding: 25px; border-radius: 10px; margin-top: 15px;">
                    <p style="font-size: 1.1rem; color: #1e293b; margin-bottom: 15px;">
                        ${data.aiAnalysis.summary}
                    </p>
                    ${data.aiAnalysis.complianceScore !== undefined ? `
                    <div style="margin-top: 20px; padding: 15px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 10px; text-align: center;">
                        <span style="color: white; font-size: 0.9rem; opacity: 0.9;">Compliance Score</span>
                        <div style="color: white; font-size: 2.5rem; font-weight: bold; margin-top: 5px;">${data.aiAnalysis.complianceScore}%</div>
                    </div>
                    ` : ''}
                </div>
            </div>
            ` : ''}
            
            <!-- Key Points -->
            ${data.aiAnalysis?.keyPoints && data.aiAnalysis.keyPoints.length > 0 ? `
            <div class="section">
                <h2>📌 Key Points</h2>
                <div style="background: white; padding: 25px; border-radius: 10px; margin-top: 15px;">
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        ${data.aiAnalysis.keyPoints.map((point: string) => `
                            <li style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; display: flex; align-items: start;">
                                <span style="color: #3b82f6; font-size: 1.2rem; margin-right: 10px;">•</span>
                                <span style="color: #1e293b; font-size: 1rem;">${point}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
            ` : ''}
            
            <!-- Bid Details -->
            <div class="section">
                <h2>📄 Bid Details</h2>
                <div class="info-grid">
                    <div class="info-card">
                        <h3>Tender ID</h3>
                        <p>${data.tenderId}</p>
                    </div>
                    <div class="info-card">
                        <h3>Project Title</h3>
                        <p>${data.projectTitle}</p>
                    </div>
                    <div class="info-card">
                        <h3>Department</h3>
                        <p>${data.department}</p>
                    </div>
                    <div class="info-card">
                        <h3>Estimated Value</h3>
                        <p>${data.estimatedValue}</p>
                    </div>
                    <div class="info-card">
                        <h3>Evaluation Date</h3>
                        <p>${data.evaluationDate}</p>
                    </div>
                </div>
            </div>
            
            <!-- Validation Results -->
            <div class="section">
                <h2>🔍 Automated Validation Results</h2>
                ${data.validationResults.complianceScore !== undefined ? `
                <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; text-align: center;">
                    <div style="font-size: 0.9rem; opacity: 0.9; margin-bottom: 5px;">Compliance Score</div>
                    <div style="font-size: 3rem; font-weight: bold;">${data.validationResults.complianceScore}%</div>
                </div>
                ` : ''}
                <table class="vendor-table">
                    <thead>
                        <tr>
                            <th>Validation Check</th>
                            <th>Status</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Missing Clauses</td>
                            <td><span class="status-badge ${data.validationResults.missingClauses > 0 ? 'status-warning' : 'status-pass'}">${data.validationResults.missingClauses > 0 ? `Found (${data.validationResults.missingClauses})` : 'None'}</span></td>
                            <td>${data.validationResults.missingClausesDetails || (data.validationResults.missingClauses > 0 ? 'Review required' : 'All clauses present')}</td>
                        </tr>
                        <tr>
                            <td>Financial Threshold</td>
                            <td><span class="status-badge ${data.validationResults.financialThreshold.includes('Pass') ? 'status-pass' : 'status-fail'}">${data.validationResults.financialThreshold}</span></td>
                            <td>${data.validationResults.financialThresholdDetails || 'EMD compliance verified'}</td>
                        </tr>
                        <tr>
                            <td>Technical Eligibility</td>
                            <td><span class="status-badge ${data.validationResults.technicalEligibility.includes('Pass') ? 'status-pass' : 'status-fail'}">${data.validationResults.technicalEligibility}</span></td>
                            <td>${data.validationResults.technicalEligibilityDetails || 'Criteria clearly defined'}</td>
                        </tr>
                        <tr>
                            <td>Policy Compliance</td>
                            <td><span class="status-badge ${data.validationResults.policyCompliance.includes('Pass') ? 'status-pass' : 'status-fail'}">${data.validationResults.policyCompliance}</span></td>
                            <td>${data.validationResults.policyComplianceDetails || 'GFR 2017 & AP Manual aligned'}</td>
                        </tr>
                        <tr>
                            <td>Document Completeness</td>
                            <td><span class="status-badge ${data.validationResults.completeness.includes('Pass') ? 'status-pass' : 'status-fail'}">${data.validationResults.completeness}</span></td>
                            <td>${data.validationResults.completenessDetails || 'All sections present'}</td>
                        </tr>
                        <tr>
                            <td>Environmental Clearance</td>
                            <td><span class="status-badge ${data.validationResults.environmentalClearance.includes('Mentioned') ? 'status-pass' : 'status-fail'}">${data.validationResults.environmentalClearance}</span></td>
                            <td>${data.validationResults.environmentalClearanceDetails || 'Impact assessment'}</td>
                        </tr>
                    </tbody>
                </table>
                ${data.aiAnalysis?.complianceScore !== undefined && data.validationResults.complianceScore === undefined ? `
                <div style="margin-top: 20px; padding: 15px; background: #f0f9ff; border-left: 4px solid #3b82f6; border-radius: 5px;">
                    <strong style="color: #1e3a8a;">AI Analysis Compliance Score: ${data.aiAnalysis.complianceScore}%</strong>
                </div>
                ` : ''}
            </div>
            
            <!-- Bid Evaluation -->
            <div class="section">
                <h2>🏗️ Bid Evaluation Engine</h2>
                <table class="vendor-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Vendor</th>
                            <th>Technical</th>
                            <th>Financial</th>
                            <th>Bonus</th>
                            <th>Total</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${vendorsTableRows}
                    </tbody>
                </table>
                <div style="margin-top: 20px; text-align: center;">
                    <h3 style="color: #10b981; font-size: 1.5rem;">✅ AI-Human Evaluation Match: ${data.evaluationMatch}%</h3>
                    <p style="color: #64748b;">Evaluation completed in ${data.processingTime} | AI Confidence: ${data.aiConfidence}%</p>
                </div>
            </div>
            
            <!-- Audit Trail -->
            <div class="section">
                <h2>🔐 Audit Trail Snapshot</h2>
                <div class="timeline">
                    ${auditTrailItems}
                </div>
            </div>
            
            ${data.extractedData ? `
            <!-- Extracted Document Data -->
            <div class="section">
                <h2>📋 Extracted Document Information</h2>
                <div style="background: #f8fafc; padding: 20px; border-radius: 10px; border-left: 4px solid #3b82f6;">
                    ${Object.entries(data.extractedData)
                      .filter(([key, value]) => {
                        // Filter out null, empty, undefined, and also skip if value is just "%" or similar
                        if (value === null || value === '' || value === undefined) return false;
                        
                        // Skip dateFieldMap (it's an object used for internal mapping)
                        if (key.toLowerCase() === 'datefieldmap' || key.toLowerCase() === 'date_field_map') return false;
                        
                        // Skip workItems ALWAYS - they'll be displayed in a separate section
                        if (key.toLowerCase() === 'workitems' || key.toLowerCase() === 'work_items') {
                          return false; // Always skip - will be displayed in dedicated work items section
                        }
                        
                        // Skip objects (except arrays) to prevent [object Object] display
                        if (typeof value === 'object' && value !== null && !Array.isArray(value)) return false;
                        
                        // Skip arrays of objects (they show as [object Object] when stringified)
                        if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
                          return false; // Skip arrays of objects
                        }
                        
                        const strValue = String(value).trim();
                        // Skip values that are just "%" or "% value" without actual percentage
                        if (key.toLowerCase().includes('emd') && strValue === '%' || strValue === '% value') return false;
                        // Skip invalid document attachments (field labels, placeholders)
                        if (key.toLowerCase() === 'documentattachments' || key.toLowerCase() === 'document_attachments') {
                          if (Array.isArray(value)) {
                            const validAttachments = value.filter(item => {
                              const itemStr = String(item).toLowerCase();
                              return !itemStr.includes('of contract') && 
                                     !itemStr.includes('tender fee details') &&
                                     !itemStr.includes('infrared spectroscopy') &&
                                     !itemStr.includes('ftir') &&
                                     itemStr.length > 5;
                            });
                            return validAttachments.length > 0;
                          }
                        }
                        return true;
                      })
                      .map(([key, value]) => {
                        // Clean up field names for display
                        let displayKey = key
                          .replace(/([A-Z])/g, ' $1') // Add space before capital letters
                          .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
                          .replace(/Id/g, 'ID') // Fix ID capitalization
                          .replace(/Emd/g, 'EMD') // Fix EMD capitalization
                          .replace(/Percentage/g, 'Percentage') // Keep Percentage as is
                          .trim();
                        
                        // Special handling for EMD percentage - show actual value
                        if (key.toLowerCase() === 'emdpercentage' || key.toLowerCase() === 'emd_percentage' || key.toLowerCase() === 'emd percentage') {
                          const cleanValue = String(value).replace(/\n/g, ' ').trim();
                          // If it's just "% value of Quotation", try to get from applicabilityOfEMD or calculate from amount
                          if (cleanValue === '% value of Quotation' || cleanValue === '% value' || cleanValue === '%' || cleanValue.toLowerCase().includes('% value')) {
                            // Try to get percentage from applicabilityOfEMD
                            const applicabilityEMD = data.extractedData?.applicabilityOfEMD;
                            if (applicabilityEMD) {
                              const applicabilityStr = String(applicabilityEMD).trim();
                              // Extract percentage from applicabilityOfEMD (e.g., "2% value of Quotation" or "3%")
                              const percentMatch = applicabilityStr.match(/(\d+(?:\.\d+)?)\s*%/);
                              if (percentMatch) {
                                value = `${percentMatch[1]}%`;
                              } else {
                                // If no percentage in applicabilityOfEMD, try to calculate from emdAmount and estimatedValue
                                const emdAmount = data.extractedData?.emdAmount;
                                const estimatedValue = data.extractedData?.estimatedValue || data.extractedData?.approximateValue;
                                if (emdAmount && estimatedValue) {
                                  // Extract numeric values
                                  const emdNum = parseFloat(String(emdAmount).replace(/[^\d.]/g, ''));
                                  const estNum = parseFloat(String(estimatedValue).replace(/[^\d.]/g, ''));
                                  if (emdNum > 0 && estNum > 0) {
                                    const calculatedPercent = ((emdNum / estNum) * 100).toFixed(2);
                                    value = `${calculatedPercent}%`;
                                  } else {
                                    value = applicabilityStr; // Fallback to applicability text
                                  }
                                } else {
                                  value = applicabilityStr; // Show applicability text
                                }
                              }
                            } else {
                              // Try to calculate from emdAmount and estimatedValue if no applicabilityOfEMD
                              const emdAmount = data.extractedData?.emdAmount;
                              const estimatedValue = data.extractedData?.estimatedValue || data.extractedData?.approximateValue;
                              if (emdAmount && estimatedValue) {
                                const emdNum = parseFloat(String(emdAmount).replace(/[^\d.]/g, ''));
                                const estNum = parseFloat(String(estimatedValue).replace(/[^\d.]/g, ''));
                                if (emdNum > 0 && estNum > 0) {
                                  const calculatedPercent = ((emdNum / estNum) * 100).toFixed(2);
                                  value = `${calculatedPercent}%`;
                                } else {
                                  return ''; // Skip if can't calculate
                                }
                              } else {
                                return ''; // Skip if no data available
                              }
                            }
                          }
                        }
                        
                        // Clean up values (remove newlines, trim whitespace)
                        let displayValue: string;
                        if (Array.isArray(value)) {
                          // Handle work items array specially
                          if (key.toLowerCase() === 'workitems' || key.toLowerCase() === 'work_items') {
                            if (value.length > 0 && typeof value[0] === 'object') {
                              // Format work items as a table
                              displayValue = `
                                <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
                                  <thead>
                                    <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
                                      <th style="padding: 8px; text-align: left; border: 1px solid #cbd5e1;">Sl. No.</th>
                                      <th style="padding: 8px; text-align: left; border: 1px solid #cbd5e1;">Description</th>
                                      <th style="padding: 8px; text-align: left; border: 1px solid #cbd5e1;">Quantity</th>
                                      <th style="padding: 8px; text-align: left; border: 1px solid #cbd5e1;">Unit</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    ${value.map((item: any) => `
                                      <tr>
                                        <td style="padding: 8px; border: 1px solid #cbd5e1;">${item.serialNumber || '-'}</td>
                                        <td style="padding: 8px; border: 1px solid #cbd5e1;">${item.description || '-'}</td>
                                        <td style="padding: 8px; border: 1px solid #cbd5e1;">${item.quantity || '-'}</td>
                                        <td style="padding: 8px; border: 1px solid #cbd5e1;">${item.unit || '-'}</td>
                                      </tr>
                                    `).join('')}
                                  </tbody>
                                </table>
                              `;
                            } else {
                              // Regular array
                              displayValue = `<ul style="margin: 5px 0 10px 0; padding-left: 20px;">${value
                                .filter(item => item !== null && item !== '')
                                .map(item => `<li>${String(item).replace(/\n/g, ' ').trim()}</li>`)
                                .join('')}</ul>`;
                            }
                          } else {
                            // Regular array
                            displayValue = `<ul style="margin: 5px 0 10px 0; padding-left: 20px;">${value
                              .filter(item => item !== null && item !== '')
                              .map(item => `<li>${String(item).replace(/\n/g, ' ').trim()}</li>`)
                              .join('')}</ul>`;
                          }
                        } else {
                          const cleanValue = String(value).replace(/\n/g, ' ').trim();
                          // For EMD percentage, ensure it shows actual percentage value
                          if (key.toLowerCase().includes('emd') && key.toLowerCase().includes('percentage')) {
                            // Value should already be processed above, but double-check
                            if (cleanValue.includes('% value of Quotation') || cleanValue === '% value' || cleanValue === '%') {
                              // This should have been handled above, but as fallback try applicabilityOfEMD
                              const applicabilityEMD = data.extractedData?.applicabilityOfEMD;
                              if (applicabilityEMD) {
                                const percentMatch = String(applicabilityEMD).match(/(\d+(?:\.\d+)?)\s*%/);
                                if (percentMatch) {
                                  displayValue = `<strong>${percentMatch[1]}%</strong>`;
                                } else {
                                  displayValue = `<strong>${String(applicabilityEMD).replace(/\n/g, ' ').trim()}</strong>`;
                                }
                              } else {
                                displayValue = `<strong>Not specified</strong>`;
                              }
                            } else {
                              displayValue = `<strong>${cleanValue}</strong>`;
                            }
                          } else {
                            displayValue = `<strong>${cleanValue}</strong>`;
                          }
                        }
                        
                        // Skip empty display values
                        if (!displayValue || displayValue === '<strong></strong>' || displayValue === '<strong>%</strong>') {
                          return '';
                        }
                        
                        return `
                          <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #e2e8f0;">
                            <span style="color: #64748b; font-size: 0.9rem; font-weight: 500;">${displayKey}:</span><br>
                            ${displayValue}
                          </div>
                        `;
                      })
                      .filter(html => html !== '') // Remove empty entries
                      .join('')}
                </div>
            </div>
            
            <!-- Work Items Section -->
            ${data.extractedData?.workItems && Array.isArray(data.extractedData.workItems) && data.extractedData.workItems.length > 0 && typeof data.extractedData.workItems[0] === 'object' ? `
            <div class="section">
                <h2>📋 Scope of Work Items</h2>
                <div style="background: #f8fafc; padding: 20px; border-radius: 10px; border-left: 4px solid #3b82f6; overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
                        <thead>
                            <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
                                <th style="padding: 10px; text-align: left; border: 1px solid #cbd5e1; font-weight: 600;">Sl. No.</th>
                                <th style="padding: 10px; text-align: left; border: 1px solid #cbd5e1; font-weight: 600;">Description</th>
                                <th style="padding: 10px; text-align: left; border: 1px solid #cbd5e1; font-weight: 600;">Quantity</th>
                                <th style="padding: 10px; text-align: left; border: 1px solid #cbd5e1; font-weight: 600;">Unit</th>
                                ${data.extractedData.workItems.some((item: any) => item.unitPrice || item.totalPrice) ? `
                                <th style="padding: 10px; text-align: left; border: 1px solid #cbd5e1; font-weight: 600;">Unit Price</th>
                                <th style="padding: 10px; text-align: left; border: 1px solid #cbd5e1; font-weight: 600;">Total Price</th>
                                ` : ''}
                            </tr>
                        </thead>
                        <tbody>
                            ${data.extractedData.workItems.map((item: any, idx: number) => `
                            <tr style="border-bottom: 1px solid #e2e8f0;">
                                <td style="padding: 10px; border: 1px solid #cbd5e1;">${item.serialNumber || idx + 1}</td>
                                <td style="padding: 10px; border: 1px solid #cbd5e1;">${String(item.description || '-').replace(/\n/g, ' ').trim()}</td>
                                <td style="padding: 10px; border: 1px solid #cbd5e1;">${String(item.quantity || '-').replace(/\n/g, ' ').trim()}</td>
                                <td style="padding: 10px; border: 1px solid #cbd5e1;">${String(item.unit || '-').replace(/\n/g, ' ').trim()}</td>
                                ${data.extractedData.workItems.some((i: any) => i.unitPrice || i.totalPrice) ? `
                                <td style="padding: 10px; border: 1px solid #cbd5e1;">${String(item.unitPrice || '-').replace(/\n/g, ' ').trim()}</td>
                                <td style="padding: 10px; border: 1px solid #cbd5e1;">${String(item.totalPrice || '-').replace(/\n/g, ' ').trim()}</td>
                                ` : ''}
                            </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            ` : ''}
            ` : ''}
        </div>
        
        <div class="footer" style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: space-between; gap: 16px;">
            <div>
              <p style="font-weight: 600; font-size: 0.95rem; margin-bottom: 4px;">Bidalert</p>
              <p style="font-size: 0.85rem; color: #4b5563; line-height: 1.4;">
                Ramannapet 1st Ln, Lakshmipuram, Naidupet,<br/>
                Guntur, Andhra Pradesh 522007
              </p>
            </div>
            <div>
              <img src="${logoUrl}" alt="Bidalert Logo" style="height: 48px; width: auto;" />
            </div>
        </div>
    </div>
    </div>
</body>
</html>`;
}

export async function downloadReport(htmlContent: string, filename: string) {
  console.log('downloadReport called with filename:', filename);
  console.log('HTML content length:', htmlContent.length);
  
  // Create a blob URL and open in new window for printing
  try {
    console.log('Creating blob URL and opening print dialog...');
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const blobUrl = URL.createObjectURL(blob);
    
    // Open in new window
    const printWindow = window.open(blobUrl, '_blank');
    
    if (printWindow) {
      // Wait for content to load
      printWindow.addEventListener('load', () => {
        setTimeout(() => {
          printWindow.print();
          console.log('Print dialog opened successfully');
        }, 500);
      });
      
      // Clean up blob URL after a delay
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 10000);
    } else {
      throw new Error('Failed to open print window (popup blocked?)');
    }
  } catch (printError) {
    console.error('Error with print approach:', printError);
    
    // Fallback - Direct download of HTML file
    console.log('Falling back to HTML download');
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.replace('.pdf', '.html');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export interface ContractorEvaluation {
  name: string;
  evaluations: {
    [clauseKey: string]: {
      status?: string; // "Compliant", "Not Compliant", "Under Review", "N/A"
      remarks?: string;
    };
  };
  qualification?: string; // "Qualified" or "Not Qualified"
}

export interface QualificationRequirementsData {
  tenderNoticeNo: string;
  tenderDate: string;
  workName: string;
  extractedData?: any;
  evaluation?: any;
  contractor1Name?: string;
  contractor2Name?: string;
  contractors?: ContractorEvaluation[]; // Array of contractor evaluations
  contractorRemarks?: string;
  committeeSignature?: string; // Base64/data URL for committee signature image
}

export function generateQualificationRequirementsReport(data: QualificationRequirementsData): string {
  const getStringValue = (value: any): string => {
    if (Array.isArray(value)) {
      return value.length > 0 ? String(value[0]) : '';
    }
    return String(value || '');
  };

  const getValue = (key: string, defaultValue: string = ''): string => {
    if (data.extractedData && data.extractedData[key]) {
      return getStringValue(data.extractedData[key]);
    }
    return defaultValue;
  };

  const tenderNoticeNo = data.tenderNoticeNo || getValue('tenderNoticeNo') || getValue('tenderNumber') || getValue('enquiryNumber') || '';
  const tenderDate =
    data.tenderDate ||
    getValue('enquiryDate') ||
    getValue('tenderDate') ||
    getValue('bidSubmissionEndDate') ||
    '';
  const workName = data.workName || getValue('title') || getValue('projectTitle') || getValue('workName') || '';
  
  // Get contractor names - use provided names or defaults
  const contractor1Name = data.contractor1Name || (data.contractors && data.contractors[0]?.name) || 'Name of Contractor – 1';
  const contractor2Name = data.contractor2Name || (data.contractors && data.contractors[1]?.name) || 'Name of Contractor – 2';
  
  // Helper function to get contractor evaluation for a specific clause
  const getContractorEvaluation = (contractorIndex: number, clauseKey: string): { status: string; remarks: string } => {
    if (data.contractors && data.contractors[contractorIndex]) {
      const contractor = data.contractors[contractorIndex];
      const evaluation = contractor.evaluations?.[clauseKey];
      if (evaluation) {
        return {
          status: evaluation.status || '',
          remarks: evaluation.remarks || ''
        };
      }
    }
    return { status: '', remarks: '' };
  };
  
  // Get contractor cell content (status + remarks if available)
  const getContractorCell = (contractorIndex: number, clauseKey: string): string => {
    const evaluation = getContractorEvaluation(contractorIndex, clauseKey);
    if (evaluation.status || evaluation.remarks) {
      // Map UI statuses to official wording
      let mappedStatus = evaluation.status || '';
      if (mappedStatus === 'Compliant') mappedStatus = 'Complied';
      else if (mappedStatus === 'Not Compliant') mappedStatus = 'Not Complied';
      else if (mappedStatus === 'N/A') mappedStatus = 'Not Applicable';
      else if (mappedStatus === 'Under Review') mappedStatus = ''; // avoid "Under Review" in official PDF

      let content = mappedStatus;
      if (evaluation.remarks) {
        content += content ? `<br>${evaluation.remarks}` : evaluation.remarks;
      }
      return content;
    }
    return ''; // Empty cell if no evaluation data
  };

  // Extract specific values from document - format as shown in user's example
  // EMD should be just the number (e.g., "18000" not "Rs. 18000")
  const emdAmountRaw = getValue('emdAmount', '');
  let emdAmount = 'XXXX';
  if (emdAmountRaw) {
    // Extract just the number
    const numberMatch = emdAmountRaw.match(/[\d,]+/);
    if (numberMatch) {
      emdAmount = numberMatch[0].replace(/,/g, '');
    } else {
      emdAmount = emdAmountRaw.replace(/Rs\.?\s*/gi, '').replace(/INR\s*/gi, '').trim();
    }
  }
  
  const tenderFeeRaw = getValue('tenderFee', '');
  let tenderFee = 'XXXX';
  if (tenderFeeRaw) {
    const numberMatch = tenderFeeRaw.match(/[\d,]+/);
    if (numberMatch) {
      tenderFee = numberMatch[0].replace(/,/g, '');
    } else {
      tenderFee = tenderFeeRaw.replace(/Rs\.?\s*/gi, '').replace(/INR\s*/gi, '').trim();
    }
  }
  
  const avgAnnualTurnover = getValue('averageAnnualTurnover', 'Rs. XXXX Crores');
  const solvencyCertificate = getValue('solvencyCertificate', 'Rs. XXXX Crores');
  
  // Extract experience years - format like "3 Year (s)"
  const experienceYearsRaw = getValue('experienceRequired', '');
  const experienceYears = experienceYearsRaw ? `${experienceYearsRaw} Year (s)` : 'XXXX Year (s)';
  
  const similarWorkValue = getValue('similarWorkValue', 'Rs. XXXXX');
  const contractPeriod = getValue('contractPeriod', 'XXXX');

  // Report metadata: evaluation date and place
  const getCurrentDateFormatted = (): string => {
    try {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return '';
    }
  };

  const reportDate = getCurrentDateFormatted();
  const reportPlace =
    getValue('workLocation') ||
    getValue('city') ||
    getValue('district') ||
    getValue('state') ||
    '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Evaluation of Qualification Requirements – Technical Bid</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Times New Roman', serif;
            padding: 40px;
            color: #000;
            line-height: 1.6;
            background: white;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
        }
        
        .header h1 {
            font-size: 18pt;
            font-weight: bold;
            margin-bottom: 10px;
            text-transform: uppercase;
        }
        
        .tender-details {
            margin-bottom: 30px;
        }
        
        .tender-details h2 {
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 10px;
            text-decoration: underline;
        }
        
        .tender-details p {
            margin: 5px 0;
            font-size: 12pt;
        }
        
        .evaluation-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 11pt;
        }
        
        .evaluation-table th,
        .evaluation-table td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
            vertical-align: top;
        }
        
        .evaluation-table th {
            background-color: #f0f0f0;
            font-weight: bold;
            text-align: center;
        }
        
        .evaluation-table td {
            min-height: 40px;
        }
        
        .clause-col {
            width: 8%;
            text-align: center;
        }
        
        .criteria-col {
            width: 40%;
        }
        
        .contractor-col {
            width: 20%;
        }
        
        .remarks-col {
            width: 12%;
        }
        
        .conclusion {
            margin-top: 40px;
            margin-bottom: 30px;
        }
        
        .conclusion h2 {
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 15px;
            text-decoration: underline;
        }
        
        .conclusion table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        
        .conclusion table td {
            padding: 10px;
            border: 1px solid #000;
        }
        
        .signatures {
            margin-top: 50px;
            margin-bottom: 30px;
        }
        
        .signatures h2 {
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 15px;
            text-decoration: underline;
        }
        
        .signature-line {
            margin-top: 60px;
            border-top: 1px solid #000;
            padding-top: 5px;
            width: 200px;
        }

        .signature-image {
            max-height: 60px;
            margin-bottom: 10px;
            display: block;
        }
        
        .signature-section {
            display: flex;
            justify-content: space-between;
            margin-top: 40px;
        }
        
        .signature-box {
            width: 45%;
        }
        
        @media print {
            body {
                padding: 20px;
            }
            .evaluation-table {
                page-break-inside: avoid;
            }
        }

        /* Responsive layout for smaller screens */
        @media (max-width: 768px) {
            body {
                padding: 16px;
            }

            .header {
                margin-bottom: 20px;
                padding-bottom: 12px;
            }

            .header h1 {
                font-size: 14pt;
            }

            .tender-details h2 {
                font-size: 12pt;
            }

            .tender-details p {
                font-size: 11pt;
            }

            .evaluation-table {
                display: block;
                width: 100%;
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
                font-size: 10pt;
            }

            .evaluation-table th,
            .evaluation-table td {
                padding: 6px;
            }

            .conclusion {
                margin-top: 24px;
                margin-bottom: 20px;
            }

            .signatures {
                margin-top: 30px;
                margin-bottom: 20px;
            }

            .signature-section {
                flex-direction: column;
                gap: 24px;
            }

            .signature-box {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Evaluation of Qualification Requirements – Technical Bid</h1>
    </div>
    
    <div class="tender-details">
        <h2>Name of Work</h2>
        <p>${workName || ''}</p>
        
        <h2 style="margin-top: 20px;">Tender Details</h2>
        <p>Tender Notice No.: ${tenderNoticeNo || ''}</p>
        <p>Date: ${tenderDate || ''}</p>
        
        <h2 style="margin-top: 20px;">Evaluation of the Qualification Requirements of the Technical Bid</h2>
    </div>
    
    <table class="evaluation-table">
        <thead>
            <tr>
                <th class="clause-col">S. No / Clause</th>
                <th class="criteria-col">Eligibility Criteria as per RFP</th>
                <th class="contractor-col">${contractor1Name}</th>
                <th class="contractor-col">${contractor2Name}</th>
                <th class="remarks-col">Remarks</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1.6.4</td>
                <td>Joint Venture / Consortium Requirements: JV Agreement specific to the Contract including objectives, management structure, distribution of financial & technical responsibilities, contribution of each partner, joint & several liability, recourse/sanctions, indemnities, and validity till completion including Defect Liability Period.</td>
                <td>${getContractorCell(0, '1.6.4')}</td>
                <td>${getContractorCell(1, '1.6.4')}</td>
                <td></td>
            </tr>
            <tr>
                <td>2</td>
                <td>Clause 1.6 (Section–1)<br>
                    Technical Capacity – Similar Works: Satisfactory completion of similar works in any one year during the last ${experienceYears} ending (date) of costing not less than ${similarWorkValue}. Similar work means construction of Marine works like Fishing Harbours, etc.<br><br>
                    Execution of Specialized Quantities (in any one year during last XXXX years):<br>
                    • Breakwater construction of at least XXXXX Rmt<br>
                    • Capital dredging of at least XXXXX Cum for creating water depth of XXX below chart datum<br>
                    • Piling work with minimum XXXX dia completed of XXXX Rmt<br>
                    (Up to 50% of total value may be met through 1–3 specialized subcontractors)</td>
                <td>${getContractorCell(0, '2')}</td>
                <td>${getContractorCell(1, '2')}</td>
                <td></td>
            </tr>
            <tr>
                <td>3</td>
                <td>Minimum Average Annual Construction Turnover (5 years): Completion as prime contractor in civil engineering category in any one financial year ending (date) of value not less than ${avgAnnualTurnover}.<br>
                    (For JV/Consortium: MEC except financial turnover can be met collectively; Lead Partner must meet financial turnover)</td>
                <td>${getContractorCell(0, '3')}</td>
                <td>${getContractorCell(1, '3')}</td>
                <td></td>
            </tr>
            <tr>
                <td>4</td>
                <td>Financial Capacity: As per latest audited financial statements.<br>
                    Minimum Average Annual Turnover: ${avgAnnualTurnover} (income from operations only).<br>
                    Available Bid Capacity > Total Bid Value.<br>
                    Formula: A × N × 3 – B<br>
                    Where:<br>
                    A = Max value of works executed in any one year during last ${contractPeriod} (current prices)<br>
                    N = Contract completion period (years)<br>
                    B = Value of ongoing commitments for next N years (CA certified).</td>
                <td>${getContractorCell(0, '4')}</td>
                <td>${getContractorCell(1, '4')}</td>
                <td></td>
            </tr>
            <tr>
                <td>5</td>
                <td>Solvency Certificate: From bankers for ${solvencyCertificate}, not older than three months as on bid submission date.</td>
                <td>${getContractorCell(0, '5')}</td>
                <td>${getContractorCell(1, '5')}</td>
                <td></td>
            </tr>
            <tr>
                <td>1.6.2</td>
                <td>Mandatory Documents (No Alterations): Signed & stamped Tender Document (all pages) with undertaking as per Form‑12.</td>
                <td>${getContractorCell(0, '1.6.2')}</td>
                <td>${getContractorCell(1, '1.6.2')}</td>
                <td></td>
            </tr>
            <tr>
                <td>6</td>
                <td>Company Registration Certificate (Companies Act, 1956/2013).</td>
                <td>${getContractorCell(0, '6')}</td>
                <td>${getContractorCell(1, '6')}</td>
                <td></td>
            </tr>
            <tr>
                <td>7</td>
                <td>EPF Code & ESI Registration Certificates.</td>
                <td>${getContractorCell(0, '7')}</td>
                <td>${getContractorCell(1, '7')}</td>
                <td></td>
            </tr>
            <tr>
                <td>8</td>
                <td>PAN Card & GST Registration Certificate.</td>
                <td>${getContractorCell(0, '8')}</td>
                <td>${getContractorCell(1, '8')}</td>
                <td></td>
            </tr>
            <tr>
                <td>9</td>
                <td>Power of Attorney for Authorized Signatory (Form‑2). For Consortium: POA in favour of Lead Member (Form‑15).</td>
                <td>${getContractorCell(0, '9')}</td>
                <td>${getContractorCell(1, '9')}</td>
                <td></td>
            </tr>
            <tr>
                <td>10</td>
                <td>Average Annual Financial Turnover for last 3 years with audited Balance Sheet & P&L (Form‑4).</td>
                <td>${getContractorCell(0, '10')}</td>
                <td>${getContractorCell(1, '10')}</td>
                <td></td>
            </tr>
            <tr>
                <td>11</td>
                <td>Experience of Similar Works during last 7 years with value, client details, completion certificates (Forms 5A, 5B, 5C). For JV works, CA/Client certified share of work. TDS certificates required for private works. Government works certificates to be issued by Executive Engineer and countersigned by Superintending Engineer.</td>
                <td>${getContractorCell(0, '11')}</td>
                <td>${getContractorCell(1, '11')}</td>
                <td></td>
            </tr>
            <tr>
                <td>12</td>
                <td>List of Major Construction Equipment proposed (Form‑8).</td>
                <td>${getContractorCell(0, '12')}</td>
                <td>${getContractorCell(1, '12')}</td>
                <td></td>
            </tr>
            <tr>
                <td>13</td>
                <td>Personnel / Staff proposed for the Project (Form‑9).</td>
                <td>${getContractorCell(0, '13')}</td>
                <td>${getContractorCell(1, '13')}</td>
                <td></td>
            </tr>
            <tr>
                <td>14</td>
                <td>Declaration of No Exceptions/Deviations (Form‑12).</td>
                <td>${getContractorCell(0, '14')}</td>
                <td>${getContractorCell(1, '14')}</td>
                <td></td>
            </tr>
            <tr>
                <td>15</td>
                <td>Copy of Tender Fee Receipt for Rs. ${tenderFee}.</td>
                <td>${getContractorCell(0, '15')}</td>
                <td>${getContractorCell(1, '15')}</td>
                <td></td>
            </tr>
            <tr>
                <td>Clause 1.6.4 (g)</td>
                <td>Copy of EMD Receipt for ${emdAmount}. (EMD may be furnished by any partner but in the name of the JV/Consortium only. BG must correctly reflect JV composition. Non‑compliance leads to rejection.)</td>
                <td>${getContractorCell(0, '1.6.4g')}</td>
                <td>${getContractorCell(1, '1.6.4g')}</td>
                <td></td>
            </tr>
            <tr>
                <td>Clause 1.12 – Form 14</td>
                <td>Joint & Several Liability of all JV/Consortium partners for execution of the Project. Delineation of duties and responsibilities.</td>
                <td>${getContractorCell(0, '1.12')}</td>
                <td>${getContractorCell(1, '1.12')}</td>
                <td></td>
            </tr>
        </tbody>
    </table>
    
    <div class="conclusion">
        <h2>Conclusion / Recommendation</h2>
        <p>Based on the above evaluation, the technical bids are found to be:</p>
        <table>
            <tr>
                <td><strong>${contractor1Name}:</strong> ${data.contractors && data.contractors[0]?.qualification ? data.contractors[0].qualification : 'Qualified / Not Qualified'}</td>
            </tr>
            <tr>
                <td><strong>${contractor2Name}:</strong> ${data.contractors && data.contractors[1]?.qualification ? data.contractors[1].qualification : 'Qualified / Not Qualified'}</td>
            </tr>
        </table>
        <p style="margin-top: 20px;"><strong>Remarks of Evaluation Committee:</strong></p>
        <p style="margin-top: 10px; padding: 10px; border: 1px solid #000; min-height: 100px;">
            ${data.contractorRemarks || '(Provide detailed justification)'}
        </p>
    </div>
    
    <div class="signatures">
        <div class="signature-section">
            <div class="signature-box">
                ${data.committeeSignature ? `<img src="${data.committeeSignature}" alt="Signature of Technical Evaluation Committee" class="signature-image" />` : ''}
                <div class="signature-line">
                    <strong>Signatures of Technical Evaluation Committee</strong>
                </div>
            </div>
            <div class="signature-box">
                <p><strong>Date:</strong> ${reportDate || '_____________'}</p>
                <p style="margin-top: 10px;"><strong>Place:</strong> ${reportPlace || '_____________'}</p>
            </div>
        </div>
    </div>
</body>
</html>`;
}

export async function downloadQualificationReport(htmlContent: string, filename: string) {
  console.log('downloadQualificationReport called with filename:', filename);
  
  try {
    // Use html2pdf.js for PDF generation
    const html2pdf = (await import('html2pdf.js')).default;
    
    // Create a temporary container element with proper structure
    const element = document.createElement('div');
    element.style.width = '210mm'; // A4 width
    element.style.padding = '20px';
    element.style.backgroundColor = 'white';
    element.innerHTML = htmlContent;
    
    // Append to body temporarily (but keep it visible for html2canvas)
    element.style.position = 'fixed';
    element.style.top = '0';
    element.style.left = '0';
    element.style.zIndex = '-9999';
    element.style.opacity = '0';
    document.body.appendChild(element);
    
    // Wait a bit for styles to apply
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Configure PDF options
    const opt = {
      margin: [5, 5, 5, 5] as [number, number, number, number],
      filename: filename,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: false,
        letterRendering: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' as const
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    
    // Generate and download PDF
    await html2pdf().set(opt).from(element).save();
    
    // Clean up
    document.body.removeChild(element);
    
    console.log('PDF downloaded successfully');
  } catch (pdfError) {
    console.error('Error generating PDF:', pdfError);
    
    // Clean up element if it exists
    const existingElement = document.querySelector('div[style*="z-index: -9999"]');
    if (existingElement) {
      document.body.removeChild(existingElement);
    }
    
    // Fallback to print dialog
    try {
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const blobUrl = URL.createObjectURL(blob);
      
      const printWindow = window.open(blobUrl, '_blank');
      
      if (printWindow) {
        printWindow.addEventListener('load', () => {
          setTimeout(() => {
            printWindow.print();
            console.log('Print dialog opened successfully');
          }, 500);
        });
        
        setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
        }, 10000);
      } else {
        throw new Error('Failed to open print window');
      }
    } catch (printError) {
      console.error('Error with print approach:', printError);
      
      // Final fallback - Direct download of HTML file
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename.replace('.pdf', '.html');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }
}

