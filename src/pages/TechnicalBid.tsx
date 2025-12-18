import { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";
import { analyzeDocument, evaluateBid } from "@/services/aiService";
import { generateEvaluationReport, downloadReport } from "@/utils/reportGenerator";
import { readFileAsText } from "@/utils/pdfExtractor";

type YesNo = "yes" | "no" | "";

type ClauseStatus = "" | "Complied" | "Not Complied";

const CLAUSES = [
  { id: "1.6.4", label: "JV / Consortium (Clause 1.6.4)" },
  { id: "tech", label: "Technical Capacity" },
  { id: "fin", label: "Financial Eligibility" },
  { id: "stat", label: "Statutory Registrations" },
  { id: "forms", label: "Mandatory Forms & Declarations" },
] as const;

const TechnicalBid = () => {
  // 0. Tender & bidder context
  const [tenderNumber, setTenderNumber] = useState("");
  const [bidderNames, setBidderNames] = useState<string[]>(["Contractor – 1", "Contractor – 2"]);
  const [selectedBidderIndex, setSelectedBidderIndex] = useState<number>(0);

  // 1. Workflow text sections
  const [receiptDetails, setReceiptDetails] = useState("");
  const [closingDetails, setClosingDetails] = useState("");
  const [biddersList, setBiddersList] = useState("");
  const [openingDetails, setOpeningDetails] = useState("");

  const [mandatoryOk, setMandatoryOk] = useState<YesNo>("");
  const [mandatoryRemarks, setMandatoryRemarks] = useState("");

  const [jvOk, setJvOk] = useState<YesNo>("");
  const [jvRemarks, setJvRemarks] = useState("");

  const [technicalCapacityRemarks, setTechnicalCapacityRemarks] = useState("");
  const [financialEligibilityRemarks, setFinancialEligibilityRemarks] = useState("");
  const [statutoryRemarks, setStatutoryRemarks] = useState("");
  const [formsRemarks, setFormsRemarks] = useState("");

  const [clarificationsRequired, setClarificationsRequired] = useState<YesNo>("");
  const [clarificationsDetails, setClarificationsDetails] = useState("");

  const [clauseEvaluation, setClauseEvaluation] = useState("");

  const [technicallyQualified, setTechnicallyQualified] = useState<YesNo>("");
  const [qualificationRemarks, setQualificationRemarks] = useState("");

  const [reportSummary, setReportSummary] = useState("");
  const [authorityApprovalDetails, setAuthorityApprovalDetails] = useState("");
  const [financialOpeningDetails, setFinancialOpeningDetails] = useState("");

  // Clause-wise matrix
  const [clauseStates, setClauseStates] = useState<
    Record<
      (typeof CLAUSES)[number]["id"],
      { status: ClauseStatus; remarks: string; docRef: string }
    >
  >(() => {
    const initial: any = {};
    CLAUSES.forEach((c) => {
      initial[c.id] = { status: "", remarks: "", docRef: "" };
    });
    return initial;
  });

  // Technical capacity quick fields
  const [similarWorkType, setSimilarWorkType] = useState("");
  const [workValue, setWorkValue] = useState<number | "">("");
  const [completionYear, setCompletionYear] = useState<number | "">("");
  const [certificateVerified, setCertificateVerified] = useState<YesNo>("");

  // Financial eligibility quick fields
  const [turnoverYear1, setTurnoverYear1] = useState<number | "">("");
  const [turnoverYear2, setTurnoverYear2] = useState<number | "">("");
  const [turnoverYear3, setTurnoverYear3] = useState<number | "">("");
  const [solvencyAmount, setSolvencyAmount] = useState<number | "">("");
  const [bidCapacityA, setBidCapacityA] = useState<number | "">("");
  const [bidCapacityN, setBidCapacityN] = useState<number | "">("");
  const [bidCapacityB, setBidCapacityB] = useState<number | "">("");

  // Statutory quick checklist
  const [panStatus, setPanStatus] = useState<"valid" | "invalid" | "na">("valid");
  const [gstStatus, setGstStatus] = useState<"valid" | "invalid" | "na">("valid");
  const [epfStatus, setEpfStatus] = useState<"valid" | "invalid" | "na">("valid");

  // Clarification status
  const [clarificationStatus, setClarificationStatus] = useState<"none" | "awaiting" | "replied">(
    "none"
  );

  // Finalization state
  const [finalized, setFinalized] = useState(false);

  // AI-related state
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [analyzingDoc, setAnalyzingDoc] = useState(false);
  const [analyzingForm, setAnalyzingForm] = useState(false);
  const [aiEvaluation, setAiEvaluation] = useState<any | null>(null);

  // Fixed criteria weights reused from Evaluation screen
  const evaluationCriteria = {
    technicalCompliance: 30,
    financialSoundness: 25,
    experienceQualification: 20,
    proposedMethodology: 15,
    timelineRealism: 10,
  };

  const currentBidderName = bidderNames[selectedBidderIndex] || "Not Selected";

  const techPass =
    certificateVerified === "yes" &&
    typeof workValue === "number" &&
    workValue > 0 &&
    typeof completionYear === "number" &&
    completionYear > 2000;

  const bidCapacity =
    typeof bidCapacityA === "number" &&
    typeof bidCapacityN === "number" &&
    typeof bidCapacityB === "number"
      ? bidCapacityA * bidCapacityN * 3 - bidCapacityB
      : null;

  const financialEligible =
    typeof solvencyAmount === "number" &&
    solvencyAmount > 0 &&
    bidCapacity !== null &&
    bidCapacity > 0;

  const statutoryValid = panStatus !== "invalid" && gstStatus !== "invalid" && epfStatus !== "invalid";

  const allClausesFilled = CLAUSES.every((c) => {
    const cs = clauseStates[c.id];
    if (!cs.status) return false;
    if (cs.status === "Not Complied" && !cs.remarks.trim()) return false;
    return true;
  });

  const allClausesComplied = CLAUSES.every((c) => clauseStates[c.id].status === "Complied");

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setAnalyzingDoc(true);
      setUploadedFileName(file.name);
      toast.info("Reading document and extracting key details...");

      const text = await readFileAsText(file);
      const analysis = await analyzeDocument(text, "technical-bid", file.size);
      const extracted = analysis.extractedData || {};

      // Helper to only overwrite empty fields
      const ensure = (current: string, next: string) => (current?.trim() ? current : next);

      const receiptText = [
        "Technical bids received via",
        extracted.portalName || "GeM Portal",
        extracted.enquiryNumber || extracted.tenderNumber || extracted.tenderId
          ? `under reference ${extracted.enquiryNumber || extracted.tenderNumber || extracted.tenderId}.`
          : "",
        extracted.enquiryDate ? `Enquiry dated ${extracted.enquiryDate}.` : "",
      ]
        .filter(Boolean)
        .join(" ");

      const closingText = [
        extracted.bidSubmissionEndDate || extracted.bidEndDate
          ? `Bid submission closed on ${extracted.bidSubmissionEndDate || extracted.bidEndDate}.`
          : "",
        extracted.technicalBidOpeningDate
          ? `Technical bid opening scheduled on ${extracted.technicalBidOpeningDate}.`
          : "",
      ]
        .filter(Boolean)
        .join(" ");

      const openingText = [
        extracted.technicalBidOpeningDate
          ? `Technical bids opened on ${extracted.technicalBidOpeningDate}.`
          : "",
        extracted.bidOpeningAuthority ? `Opening authority: ${extracted.bidOpeningAuthority}.` : "",
      ]
        .filter(Boolean)
        .join(" ");

      // Some extracted fields like bidders/participants are not part of the strict type
      const extendedExtracted: any = extracted || {};

      const biddersArray = extendedExtracted.bidders || extendedExtracted.participants;
      const biddersText = Array.isArray(biddersArray)
        ? biddersArray
            .map((b: any, idx: number) =>
              typeof b === "string" ? `${idx + 1}. ${b}` : `${idx + 1}. ${b?.name || ""}`
            )
            .join("\n")
        : "";

      setReceiptDetails((prev) => ensure(prev, receiptText));
      setClosingDetails((prev) => ensure(prev, closingText));
      setOpeningDetails((prev) => ensure(prev, openingText));
      setBiddersList((prev) => ensure(prev, biddersText));

      setTechnicalCapacityRemarks((prev) =>
        ensure(
          prev,
          extracted.similarWorkExperience ||
            extracted.experienceRequired ||
            extracted.eligibilityCriteria ||
            ""
        )
      );

      setFinancialEligibilityRemarks((prev) =>
        ensure(
          prev,
          [
            extracted.financialCriteria,
            extracted.annualTurnover && `Annual turnover: ${extracted.annualTurnover}`,
            extracted.emdAmount && `EMD: ${extracted.emdAmount}`,
            extracted.performanceSecurity &&
              `Performance security: ${extracted.performanceSecurity}`,
          ]
            .filter(Boolean)
            .join("\n")
        )
      );

      setStatutoryRemarks((prev) =>
        ensure(prev, (extracted.registrationCertificates || []).join(", "))
      );

      setFormsRemarks((prev) =>
        ensure(prev, (extracted.supportingDocumentsList || extracted.requiredDocuments || []).join(", "))
      );

      setReportSummary((prev) => ensure(prev, analysis.summary || ""));

      if (extracted.financialBidOpeningDate) {
        setFinancialOpeningDetails((prev) =>
          ensure(
            prev,
            `Financial bids scheduled to open on ${extracted.financialBidOpeningDate}.`
          )
        );
      }

      toast.success("AI has auto-filled fields where information was available.");
    } catch (error: any) {
      console.error("Error auto-filling from document:", error);
      toast.error(error?.message || "Failed to analyze document");
    } finally {
      setAnalyzingDoc(false);
    }
  };

  const handleAnalyzeForm = async () => {
    try {
      setAnalyzingForm(true);
      toast.info("Analyzing technical bid workflow notes with AI...");

      const content = `
Technical Bid Evaluation – Workflow Notes

1. Receipt & Opening:
- Receipt Details: ${receiptDetails}
- Closing & Auto-Lock: ${closingDetails}
- Participating Bidders: ${biddersList}
- Opening Details: ${openingDetails}

2. Preliminary Scrutiny & JV:
- Mandatory Compliance: ${mandatoryOk || "not recorded"}
- Mandatory Remarks: ${mandatoryRemarks}
- JV Compliance: ${jvOk || "not recorded"}
- JV Remarks: ${jvRemarks}

3. Detailed Technical & Financial Evaluation:
- Technical Capacity: ${technicalCapacityRemarks}
- Financial Eligibility: ${financialEligibilityRemarks}
- Statutory Registrations: ${statutoryRemarks}
- Mandatory Forms: ${formsRemarks}

4. Clarifications & Clause-wise Evaluation:
- Clarifications Required: ${clarificationsRequired || "not recorded"}
- Clarification Details: ${clarificationsDetails}
- Clause-wise Evaluation Summary: ${clauseEvaluation}

5. Technical Qualification, Report & Approvals:
- Technical Qualification: ${technicallyQualified || "not recorded"}
- Qualification Remarks: ${qualificationRemarks}
- Report Summary: ${reportSummary}
- Authority Approval Details: ${authorityApprovalDetails}
- Financial Bid Opening Note: ${financialOpeningDetails}

Computed Final Technical Status: ${finalStatus}
      `;

      const evaluation = await evaluateBid(content, evaluationCriteria);
      setAiEvaluation(evaluation);
      toast.success("AI analysis completed.");
    } catch (error: any) {
      console.error("Error analyzing workflow notes:", error);
      toast.error(error?.message || "Failed to analyze with AI");
    } finally {
      setAnalyzingForm(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!aiEvaluation) {
      toast.error("Run AI analysis before downloading the report.");
      return;
    }

    try {
      const reportData = {
        tenderId: "",
        projectTitle: "Technical Bid Evaluation – Workflow",
        department: "",
        estimatedValue: "",
        evaluationDate: new Date().toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        vendors: [
          {
            name: "Technical Bid",
            technical: aiEvaluation.scores?.technicalCompliance || 0,
            financial: aiEvaluation.scores?.financialSoundness || 0,
            bonus: aiEvaluation.scores?.proposedMethodology || 0,
            total: aiEvaluation.overallScore || 0,
            rank: 1,
            remarks: finalStatus,
          },
        ],
        validationResults: {
          missingClauses: 0,
          financialThreshold: "As per committee notes",
          technicalEligibility: finalStatus,
          policyCompliance: "As per tender conditions",
          completeness: "As per recorded workflow",
          environmentalClearance: "Not evaluated here",
          complianceScore: aiEvaluation.overallScore || 0,
          missingClausesDetails: clauseEvaluation || "Refer clause-wise evaluation section.",
          financialThresholdDetails:
            financialEligibilityRemarks || "Refer financial eligibility notes.",
          technicalEligibilityDetails:
            technicalCapacityRemarks || "Refer technical capacity notes.",
          policyComplianceDetails: "",
          completenessDetails: "",
          environmentalClearanceDetails: "",
        },
        evaluationMatch: aiEvaluation.aiConfidence || 0,
        processingTime: "",
        aiConfidence: aiEvaluation.aiConfidence || 0,
        auditTrail: [],
      };

      const htmlReport = generateEvaluationReport(reportData);
      const filename = `Technical_Bid_Evaluation_${Date.now()}.pdf`;
      await downloadReport(htmlReport, filename);
      toast.success("Report ready – use Print / Save as PDF.");
    } catch (error: any) {
      console.error("Error generating technical bid report:", error);
      toast.error(error?.message || "Failed to generate report");
    }
  };

  const handleUpdateClauseStatus = (
    id: (typeof CLAUSES)[number]["id"],
    updates: Partial<{ status: ClauseStatus; remarks: string; docRef: string }>
  ) => {
    if (finalized) return;
    setClauseStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...updates,
      },
    }));
  };

  const handleFinalizeEvaluation = () => {
    if (finalized) return;

    if (!tenderNumber.trim()) {
      toast.error("Enter Tender / GeM Bid No. before finalizing.");
      return;
    }
    if (!mandatoryOk || !jvOk) {
      toast.error("Record Mandatory Compliance and JV Compliance before finalizing.");
      return;
    }
    if (!allClausesFilled) {
      toast.error("Fill all clause-wise compliance rows (with remarks for Not Complied).");
      return;
    }

    const autoQualified =
      mandatoryOk === "yes" &&
      jvOk !== "no" &&
      allClausesComplied &&
      techPass &&
      financialEligible &&
      statutoryValid &&
      clarificationStatus !== "awaiting";

    setTechnicallyQualified(autoQualified ? "yes" : "no");
    setFinalized(true);

    toast.success(
      autoQualified
        ? "Evaluation finalized. System decision: Technically Qualified."
        : "Evaluation finalized. System decision: Technically Disqualified."
    );
  };

  const finalStatus =
    mandatoryOk === "no" || jvOk === "no" || technicallyQualified === "no"
      ? "Technically Disqualified"
      : technicallyQualified === "yes"
      ? "Technically Qualified"
      : "Pending Decision";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-10 bg-background">
        <div className="container px-4 max-w-5xl space-y-8">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Evaluation Technical Bid – Workflow</h1>
              <p className="text-muted-foreground text-sm">
                Capture each stage of the official GeM-compliant technical bid evaluation flow. Use this screen during
                committee meetings to record decisions and remarks step-by-step.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Logged in evaluators can enter and finalize data in real time. Bid documents remain read-only on GeM –
                this screen only records evaluation decisions.
              </p>
            </div>
          </div>

          {/* Tender & bidder context */}
          <section className="bg-card border rounded-lg p-4 sm:p-5 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  1. Login & Role Access / Tender Selection
                </label>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <input
                    type="text"
                    className="w-full sm:w-64 rounded-md border bg-background px-3 py-2 text-sm"
                    placeholder="Tender / GeM Bid No."
                    value={tenderNumber}
                    onChange={(e) => setTenderNumber(e.target.value)}
                    disabled={finalized}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={!tenderNumber.trim()}
                    className="mt-2 sm:mt-0"
                  >
                    Evaluate Technical Bid
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Only authorized technical evaluators can edit this form. Bidder documents are treated as read-only.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Currently Evaluating Bidder</p>
                <div className="flex flex-wrap gap-2">
                  {bidderNames.map((name, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => !finalized && setSelectedBidderIndex(idx)}
                      className={`rounded-full border px-3 py-1 text-xs ${
                        selectedBidderIndex === idx
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-foreground hover:bg-muted"
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Form entries below are being recorded for:{" "}
                  <span className="font-semibold">{currentBidderName}</span>
                </p>
              </div>
            </div>
          </section>

          {/* 1. Receipt & Opening */}
          <section className="bg-card border rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">1. Receipt & Opening of Technical Bids</h2>
              <span className="text-xs text-muted-foreground">START → Bid Opening</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Receipt of Technical Bids (via GeM Portal)
                </label>
                <textarea
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[80px]"
                  placeholder="Date & time of receipt window, portal reference, any remarks…"
                  value={receiptDetails}
                  onChange={(e) => setReceiptDetails(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Bid Closing & System Auto-Lock
                </label>
                <textarea
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[80px]"
                  placeholder="Bid closing date & time, confirmation of auto-lock, any deviations…"
                  value={closingDetails}
                  onChange={(e) => setClosingDetails(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">
                  List of Participating Bidders
                </label>
                <textarea
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[80px]"
                  placeholder="Enter bidder names / GeM IDs / JV details…"
                  value={biddersList}
                  onChange={(e) => setBiddersList(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Opening of Technical Bids (Committee Details)
                </label>
                <textarea
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[80px]"
                  placeholder="Date & time of opening, committee members present, any observations…"
                  value={openingDetails}
                  onChange={(e) => setOpeningDetails(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* 2. Preliminary Scrutiny & JV */}
          <section className="bg-card border rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">2. Preliminary Scrutiny & JV / Consortium</h2>
              <span className="text-xs text-muted-foreground">Preliminary Scrutiny → JV Check</span>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Preliminary Scrutiny (Tender Fee, EMD, Mandatory Documents)
              </label>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="text-muted-foreground">Is Mandatory Compliance OK?</span>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-1">
                    <input
                      type="radio"
                      className="h-4 w-4"
                      checked={mandatoryOk === "yes"}
                      onChange={() => setMandatoryOk("yes")}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="inline-flex items-center gap-1">
                    <input
                      type="radio"
                      className="h-4 w-4"
                      checked={mandatoryOk === "no"}
                      onChange={() => setMandatoryOk("no")}
                    />
                    <span>No (Bid Rejected)</span>
                  </label>
                </div>
              </div>
              <textarea
                className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[70px]"
                placeholder="Record missing documents / EMD issues / reasons for rejection, if any…"
                value={mandatoryRemarks}
                onChange={(e) => setMandatoryRemarks(e.target.value)}
              />
            </div>

            <div className="pt-4 border-t">
              <label className="block text-sm font-medium mb-1">
                Verification of JV / Consortium (Clause 1.6.4)
              </label>
              <div className="flex flex-wrap items-center gap-4 text-sm mb-2">
                <span className="text-muted-foreground">Is JV Compliance OK?</span>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-1">
                    <input
                      type="radio"
                      className="h-4 w-4"
                      checked={jvOk === "yes"}
                      onChange={() => setJvOk("yes")}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="inline-flex items-center gap-1">
                    <input
                      type="radio"
                      className="h-4 w-4"
                      checked={jvOk === "no"}
                      onChange={() => setJvOk("no")}
                    />
                    <span>No (Technical Disqualification)</span>
                  </label>
                </div>
              </div>
              <textarea
                className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[70px]"
                placeholder="Objectives, lead partner, share of responsibility, DLP validity, any non-compliance…"
                value={jvRemarks}
                onChange={(e) => setJvRemarks(e.target.value)}
              />
            </div>
          </section>

          {/* 3. Detailed Technical & Financial Evaluation */}
          <section className="bg-card border rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">3. Detailed Technical & Financial Evaluation</h2>
              <span className="text-xs text-muted-foreground">Technical Capacity → Financial → Statutory</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Evaluation of Technical Capacity (Similar Works Experience)
                </label>
                <textarea
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[80px]"
                  placeholder="Similar works, quantities, completion certificates, performance, execution period…"
                  value={technicalCapacityRemarks}
                  onChange={(e) => setTechnicalCapacityRemarks(e.target.value)}
                  disabled={finalized}
                />

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium mb-1">Similar Work Type</label>
                    <select
                      className="w-full rounded-md border bg-background px-2 py-1.5 text-xs"
                      value={similarWorkType}
                      onChange={(e) => setSimilarWorkType(e.target.value)}
                      disabled={finalized}
                    >
                      <option value="">Select type</option>
                      <option value="marine">Breakwater / Marine Structures</option>
                      <option value="dredging">Capital Dredging Works</option>
                      <option value="piling">Piling Works</option>
                      <option value="other">Other Similar Work</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Work Value (₹)</label>
                    <input
                      type="number"
                      className="w-full rounded-md border bg-background px-2 py-1.5 text-xs"
                      value={workValue === "" ? "" : workValue}
                      onChange={(e) =>
                        setWorkValue(e.target.value ? Number(e.target.value) : "")
                      }
                      disabled={finalized}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Completion Year</label>
                    <input
                      type="number"
                      className="w-full rounded-md border bg-background px-2 py-1.5 text-xs"
                      value={completionYear === "" ? "" : completionYear}
                      onChange={(e) =>
                        setCompletionYear(e.target.value ? Number(e.target.value) : "")
                      }
                      disabled={finalized}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Certificate Verified</label>
                    <div className="flex items-center gap-3 text-xs">
                      <label className="inline-flex items-center gap-1">
                        <input
                          type="radio"
                          className="h-3 w-3"
                          checked={certificateVerified === "yes"}
                          onChange={() => setCertificateVerified("yes")}
                          disabled={finalized}
                        />
                        <span>Yes</span>
                      </label>
                      <label className="inline-flex items-center gap-1">
                        <input
                          type="radio"
                          className="h-3 w-3"
                          checked={certificateVerified === "no"}
                          onChange={() => setCertificateVerified("no")}
                          disabled={finalized}
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </div>
                </div>

                <p className="mt-2 text-xs">
                  Technical Capacity Status:{" "}
                  <span className={techPass ? "text-emerald-700 font-medium" : "text-red-700 font-medium"}>
                    {techPass ? "✔ Pass (minimum criteria met)" : "✖ Pending / Fail"}
                  </span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Evaluation of Financial Eligibility (Turnover, Solvency, Bid Capacity)
                </label>
                <textarea
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[80px]"
                  placeholder="Turnover figures, solvency details, bid capacity calculation (A × N × 3 – B)…"
                  value={financialEligibilityRemarks}
                  onChange={(e) => setFinancialEligibilityRemarks(e.target.value)}
                  disabled={finalized}
                />

                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Turnover Y1 (₹)</label>
                    <input
                      type="number"
                      className="w-full rounded-md border bg-background px-2 py-1.5 text-xs"
                      value={turnoverYear1 === "" ? "" : turnoverYear1}
                      onChange={(e) =>
                        setTurnoverYear1(e.target.value ? Number(e.target.value) : "")
                      }
                      disabled={finalized}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Turnover Y2 (₹)</label>
                    <input
                      type="number"
                      className="w-full rounded-md border bg-background px-2 py-1.5 text-xs"
                      value={turnoverYear2 === "" ? "" : turnoverYear2}
                      onChange={(e) =>
                        setTurnoverYear2(e.target.value ? Number(e.target.value) : "")
                      }
                      disabled={finalized}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Turnover Y3 (₹)</label>
                    <input
                      type="number"
                      className="w-full rounded-md border bg-background px-2 py-1.5 text-xs"
                      value={turnoverYear3 === "" ? "" : turnoverYear3}
                      onChange={(e) =>
                        setTurnoverYear3(e.target.value ? Number(e.target.value) : "")
                      }
                      disabled={finalized}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">A (Available Capacity)</label>
                    <input
                      type="number"
                      className="w-full rounded-md border bg-background px-2 py-1.5 text-xs"
                      value={bidCapacityA === "" ? "" : bidCapacityA}
                      onChange={(e) =>
                        setBidCapacityA(e.target.value ? Number(e.target.value) : "")
                      }
                      disabled={finalized}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">N (Number of Years)</label>
                    <input
                      type="number"
                      className="w-full rounded-md border bg-background px-2 py-1.5 text-xs"
                      value={bidCapacityN === "" ? "" : bidCapacityN}
                      onChange={(e) =>
                        setBidCapacityN(e.target.value ? Number(e.target.value) : "")
                      }
                      disabled={finalized}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">B (Booked Work)</label>
                    <input
                      type="number"
                      className="w-full rounded-md border bg-background px-2 py-1.5 text-xs"
                      value={bidCapacityB === "" ? "" : bidCapacityB}
                      onChange={(e) =>
                        setBidCapacityB(e.target.value ? Number(e.target.value) : "")
                      }
                      disabled={finalized}
                    />
                  </div>
                  <div className="sm:col-span-3 text-xs">
                    <p>
                      Bid Capacity = A × N × 3 – B:{" "}
                      <span className="font-semibold">
                        {bidCapacity !== null ? `₹${bidCapacity.toLocaleString("en-IN")}` : "—"}
                      </span>
                    </p>
                    <p>
                      Financial Eligibility Status:{" "}
                      <span
                        className={
                          financialEligible
                            ? "text-emerald-700 font-medium"
                            : "text-red-700 font-medium"
                        }
                      >
                        {financialEligible ? "✔ Eligible" : "✖ Not Eligible / Incomplete"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Verification of Statutory Registrations
                </label>
                <textarea
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[80px]"
                  placeholder="PAN, GST, EPF, ESI, Company Registration – validity and observations…"
                  value={statutoryRemarks}
                  onChange={(e) => setStatutoryRemarks(e.target.value)}
                  disabled={finalized}
                />

                <div className="mt-3 text-xs space-y-1">
                  <p className="font-medium">Statutory Status (quick check)</p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    <div>
                      <p className="mb-1">PAN</p>
                      <select
                        className="w-full rounded-md border bg-background px-2 py-1.5"
                        value={panStatus}
                        onChange={(e) => setPanStatus(e.target.value as any)}
                        disabled={finalized}
                      >
                        <option value="valid">✔ Valid</option>
                        <option value="invalid">✖ Invalid / Expired</option>
                        <option value="na">N/A</option>
                      </select>
                    </div>
                    <div>
                      <p className="mb-1">GST</p>
                      <select
                        className="w-full rounded-md border bg-background px-2 py-1.5"
                        value={gstStatus}
                        onChange={(e) => setGstStatus(e.target.value as any)}
                        disabled={finalized}
                      >
                        <option value="valid">✔ Active</option>
                        <option value="invalid">✖ Cancelled / Inactive</option>
                        <option value="na">N/A</option>
                      </select>
                    </div>
                    <div>
                      <p className="mb-1">EPF</p>
                      <select
                        className="w-full rounded-md border bg-background px-2 py-1.5"
                        value={epfStatus}
                        onChange={(e) => setEpfStatus(e.target.value as any)}
                        disabled={finalized}
                      >
                        <option value="valid">✔ Valid</option>
                        <option value="invalid">✖ Expired / Not Available</option>
                        <option value="na">N/A</option>
                      </select>
                    </div>
                  </div>
                  <p>
                    Overall Statutory Status:{" "}
                    <span
                      className={
                        statutoryValid ? "text-emerald-700 font-medium" : "text-red-700 font-medium"
                      }
                    >
                      {statutoryValid ? "✔ Acceptable" : "✖ Issues to be resolved"}
                    </span>
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Verification of Mandatory Forms (PoA, Experience Forms, Declarations)
                </label>
                <textarea
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[80px]"
                  placeholder="Availability and correctness of all prescribed forms and declarations…"
                  value={formsRemarks}
                  onChange={(e) => setFormsRemarks(e.target.value)}
                  disabled={finalized}
                />
              </div>
            </div>
          </section>

          {/* 4. Clarifications & Clause-wise Evaluation */}
          <section className="bg-card border rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">4. Clarifications & Clause-wise Technical Evaluation</h2>
              <span className="text-xs text-muted-foreground">Clarifications → Clause-wise Compliance</span>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="text-muted-foreground">Clarifications Required?</span>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-1">
                    <input
                      type="radio"
                      className="h-4 w-4"
                          checked={clarificationsRequired === "yes"}
                          onChange={() => {
                            setClarificationsRequired("yes");
                            setClarificationStatus("awaiting");
                          }}
                          disabled={finalized}
                        />
                    <span>Yes (via GeM)</span>
                  </label>
                  <label className="inline-flex items-center gap-1">
                    <input
                      type="radio"
                      className="h-4 w-4"
                          checked={clarificationsRequired === "no"}
                          onChange={() => {
                            setClarificationsRequired("no");
                            setClarificationStatus("none");
                          }}
                          disabled={finalized}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
              <textarea
                className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[70px]"
                placeholder="Clarification queries raised through GeM and summary of replies examined…"
                value={clarificationsDetails}
                onChange={(e) => setClarificationsDetails(e.target.value)}
                disabled={finalized}
              />
              <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={finalized || clarificationStatus === "awaiting"}
                    onClick={() => {
                      setClarificationsRequired("yes");
                      setClarificationStatus("awaiting");
                      toast.info("Clarification marked as sent via GeM. Status set to Awaiting Reply.");
                    }}
                  >
                    Seek Clarification
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={finalized || clarificationStatus !== "awaiting"}
                    onClick={() => {
                      setClarificationStatus("replied");
                      toast.success("Clarification reply received. You can finalize the clause.");
                    }}
                  >
                    Mark Reply Received
                  </Button>
                </div>
                <div>
                  Status:{" "}
                  <span className="font-semibold">
                    {clarificationStatus === "none"
                      ? "No Clarification"
                      : clarificationStatus === "awaiting"
                      ? "⏳ Awaiting Reply"
                      : "✔ Reply Received"}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t space-y-3">
              <label className="block text-sm font-medium mb-1">
                Clause-wise Technical Evaluation (Live Entry)
              </label>
              <div className="overflow-x-auto text-xs border rounded-md">
                <table className="w-full border-collapse">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">Clause</th>
                      <th className="px-3 py-2 text-left font-medium">Compliance</th>
                      <th className="px-3 py-2 text-left font-medium">Remarks</th>
                      <th className="px-3 py-2 text-left font-medium">Doc Ref</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CLAUSES.map((clause) => {
                      const cs = clauseStates[clause.id];
                      return (
                        <tr key={clause.id} className="border-t">
                          <td className="px-3 py-2 align-top">{clause.label}</td>
                          <td className="px-3 py-2 align-top">
                            <div className="flex flex-col gap-1">
                              <label className="inline-flex items-center gap-1">
                                <input
                                  type="radio"
                                  className="h-3 w-3"
                                  checked={cs.status === "Complied"}
                                  onChange={() =>
                                    handleUpdateClauseStatus(clause.id, { status: "Complied" })
                                  }
                                  disabled={finalized}
                                />
                                <span>Complied</span>
                              </label>
                              <label className="inline-flex items-center gap-1">
                                <input
                                  type="radio"
                                  className="h-3 w-3"
                                  checked={cs.status === "Not Complied"}
                                  onChange={() =>
                                    handleUpdateClauseStatus(clause.id, { status: "Not Complied" })
                                  }
                                  disabled={finalized}
                                />
                                <span>Not Complied</span>
                              </label>
                            </div>
                          </td>
                          <td className="px-3 py-2 align-top">
                            <textarea
                              className="w-full rounded-md border bg-background px-2 py-1 min-h-[48px]"
                              placeholder={
                                cs.status === "Not Complied"
                                  ? "Remarks (mandatory when Not Complied)…"
                                  : "Optional remarks…"
                              }
                              value={cs.remarks}
                              onChange={(e) =>
                                handleUpdateClauseStatus(clause.id, { remarks: e.target.value })
                              }
                              disabled={finalized}
                            />
                          </td>
                          <td className="px-3 py-2 align-top">
                            <input
                              className="w-full rounded-md border bg-background px-2 py-1"
                              placeholder="File / page / GeM reference…"
                              value={cs.docRef}
                              onChange={(e) =>
                                handleUpdateClauseStatus(clause.id, { docRef: e.target.value })
                              }
                              disabled={finalized}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <textarea
                className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[80px]"
                placeholder="Free-text clause-wise summary, if required…"
                value={clauseEvaluation}
                onChange={(e) => setClauseEvaluation(e.target.value)}
                disabled={finalized}
              />
            </div>
          </section>

          {/* 5. Technical Qualification & Approvals */}
          <section className="bg-card border rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">5. Technical Qualification, Report & Approvals</h2>
              <span className="text-xs text-muted-foreground">Technical Decision → Financial Bid Opening → END</span>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="text-muted-foreground">Is Bid Technically Qualified?</span>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-1">
                    <input
                      type="radio"
                      className="h-4 w-4"
                          checked={technicallyQualified === "yes"}
                          readOnly
                    />
                    <span>Yes</span>
                  </label>
                  <label className="inline-flex items-center gap-1">
                    <input
                      type="radio"
                      className="h-4 w-4"
                          checked={technicallyQualified === "no"}
                          readOnly
                    />
                    <span>No (Rejected with Reasons)</span>
                  </label>
                </div>
              </div>
              <textarea
                className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[80px]"
                placeholder="Technical qualification decision with reasons for acceptance / rejection…"
                value={qualificationRemarks}
                onChange={(e) => setQualificationRemarks(e.target.value)}
                disabled={finalized}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Preparation of Technical Evaluation Report
                </label>
                <textarea
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[80px]"
                  placeholder="Summary of evaluation report, file reference, annexures attached…"
                  value={reportSummary}
                  onChange={(e) => setReportSummary(e.target.value)}
                  disabled={finalized}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Approval by Competent Authority & Approval for Financial Bid Opening
                </label>
                <textarea
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[80px]"
                  placeholder="Authority name/designation, approval note number & date, approval for opening financial bids…"
                  value={authorityApprovalDetails}
                  onChange={(e) => setAuthorityApprovalDetails(e.target.value)}
                  disabled={finalized}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Opening of Financial Bids (GeM Portal) – Brief Note
              </label>
              <textarea
                className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[70px]"
                placeholder="Date & time, GeM reference, any remarks (only after technical qualification & approval)…"
                value={financialOpeningDetails}
                onChange={(e) => setFinancialOpeningDetails(e.target.value)}
                disabled={finalized}
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">Final Technical Status</p>
                <p
                  className={`mt-1 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                    finalStatus === "Technically Qualified"
                      ? "bg-emerald-100 text-emerald-800"
                      : finalStatus === "Technically Disqualified"
                      ? "bg-red-100 text-red-800"
                      : "bg-slate-100 text-slate-800"
                  }`}
                >
                  {finalStatus}
                </p>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="font-semibold">Outputs from this screen:</p>
                <p>• Technical Evaluation Report notes</p>
                <p>• List of Technically Qualified Bidders (as per inputs above)</p>
                <p>• Approval note basis for Financial Bid Opening</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <Button
                type="button"
                size="sm"
                onClick={handleFinalizeEvaluation}
                disabled={finalized}
              >
                {finalized ? "Evaluation Finalized" : "Finalize Evaluation"}
              </Button>
              <div className="text-[11px] text-muted-foreground space-y-0.5">
                <p>Real-time safeguards applied:</p>
                <p>✔ Clause-wise completeness check before finalization</p>
                <p>✔ Auto decision for Technical Qualification (rules-based)</p>
                <p>✔ No edits allowed after final submission</p>
              </div>
            </div>

            {aiEvaluation && (
              <div className="mt-4 border rounded-lg bg-slate-50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">AI Analysis Overview</p>
                    <p className="text-xs text-muted-foreground">
                      Overall Score: {Math.round(aiEvaluation.overallScore)} / 100
                    </p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>AI Confidence</p>
                    <p className="font-semibold">{aiEvaluation.aiConfidence}%</p>
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  {Object.entries(aiEvaluation.scores || {}).map(([key, value]) => (
                    <div key={key} className="text-xs">
                      <div className="flex justify-between">
                        <span className="capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        <span className="font-semibold">{value as number}/100</span>
                      </div>
                    </div>
                  ))}
                </div>

                {!!aiEvaluation.strengths?.length && (
                  <div className="text-xs">
                    <p className="font-semibold mb-1">Strengths</p>
                    <ul className="list-disc list-inside space-y-0.5">
                      {aiEvaluation.strengths.map((s: string, idx: number) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {!!aiEvaluation.weaknesses?.length && (
                  <div className="text-xs">
                    <p className="font-semibold mb-1">Weaknesses / Risks</p>
                    <ul className="list-disc list-inside space-y-0.5">
                      {aiEvaluation.weaknesses.map((w: string, idx: number) => (
                        <li key={idx}>{w}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {aiEvaluation.recommendations && (
                  <div className="text-xs">
                    <p className="font-semibold mb-1">AI Recommendations</p>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {aiEvaluation.recommendations}
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TechnicalBid;

