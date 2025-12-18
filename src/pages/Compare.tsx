import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FileText, Loader2, GitCompare, AlertTriangle, CheckCircle, 
  TrendingUp, Shield, Users, X, Plus 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { insforge } from "@/lib/insforge";
import { compareBids } from "@/services/aiService";
import { readFileAsText } from "@/utils/pdfExtractor";
import { toast } from "sonner";

interface Document {
  id: string;
  filename: string;
  document_type: string;
  file_key: string;
}

interface BidSelection {
  id: string;
  filename: string;
  vendorName: string;
  file_key: string;
  content?: string; // Will be extracted when comparing
}

const Compare = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedBids, setSelectedBids] = useState<BidSelection[]>([]);
  const [comparing, setComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<any>(null);
  const [vendorInput, setVendorInput] = useState("");
  const [addingBid, setAddingBid] = useState(false);
  const [addingBidProgress, setAddingBidProgress] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await insforge.auth.getCurrentUser();
        if (error || !data?.user?.id) {
          toast.error('Please sign in to access the Comparison Tool');
          navigate('/');
        }
      } catch (err) {
        navigate('/');
      }
    };
    checkAuth();
    loadDocuments();
  }, [navigate]);

  const loadDocuments = async () => {
    try {
      const { data: userData, error: authError } = await insforge.auth.getCurrentUser();
      
      if (authError || !userData?.user?.id) {
        toast.error('Please sign in to compare documents');
        navigate('/');
        return;
      }

      const { data, error } = await insforge.database
        .from('documents')
        .select('id, filename, document_type, file_key')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setDocuments(data || []);
    } catch (error: any) {
      console.error('Error loading documents:', error);
      toast.error('Failed to load documents');
    }
  };

  const handleAddBid = async () => {
    if (!documentSelect || !vendorInput) {
      toast.error('Please select a document and enter vendor name');
      return;
    }

    const doc = documents.find(d => d.id === documentSelect);
    if (!doc) return;

    // Check if this bid is already selected
    if (selectedBids.find(b => b.id === doc.id)) {
      toast.error('This document is already selected');
      return;
    }

    try {
      setAddingBid(true);
      setAddingBidProgress('Adding bid...');
      
      // Just store the document reference - extraction will happen when comparing
      setSelectedBids(prev => [...prev, {
        id: doc.id,
        filename: doc.filename,
        vendorName: vendorInput,
        file_key: doc.file_key
      }]);

      setDocumentSelect("");
      setVendorInput("");
      toast.success(`Bid "${vendorInput}" added. Click "Compare Bids" to analyze.`);
    } catch (error: any) {
      console.error('Error adding bid:', error);
      toast.error(`Failed to add bid: ${error.message || 'Unknown error'}`);
    } finally {
      setAddingBid(false);
      setAddingBidProgress("");
    }
  };

  const handleRemoveBid = (id: string) => {
    setSelectedBids(prev => prev.filter(b => b.id !== id));
  };

  const handleCompare = async () => {
    if (selectedBids.length < 2) {
      toast.error('Please select at least 2 bids to compare');
      return;
    }

    try {
      setComparing(true);
      setAddingBidProgress('Preparing documents for comparison...');

      const { data: userData } = await insforge.auth.getCurrentUser();
      
      if (!userData?.user?.id) {
        toast.error('Please sign in');
        return;
      }

      // Step 1: Extract text from all selected bids
      const bidsWithContent = [];
      for (let i = 0; i < selectedBids.length; i++) {
        const bid = selectedBids[i];
        
        // If content already extracted, use it
        if (bid.content) {
          bidsWithContent.push({
            vendorName: bid.vendorName,
            content: bid.content
          });
          continue;
        }

        // Extract text from document
        setAddingBidProgress(`Extracting text from ${bid.vendorName} (${i + 1}/${selectedBids.length})...`);
        
        try {
          const { data: blob, error } = await insforge.storage
            .from('bid-documents')
            .download(bid.file_key);
          
          if (error) throw error;
          
          // Convert blob to File for readFileAsText utility
          const file = new File([blob], bid.filename, { type: blob.type });
          
          // Use proper extraction utility (handles PDF, DOCX, TXT, ZIP)
          const content = await readFileAsText(file);
          
          if (!content || content.trim().length === 0) {
            console.warn(`⚠️ Document "${bid.filename}" extracted 0 characters. May be image-based PDF.`);
            // Instead of throwing, use a placeholder and show warning
            toast.warning(`Document "${bid.filename}" appears to be image-based. OCR extraction failed. Comparison may be limited.`);
            bidsWithContent.push({
              vendorName: bid.vendorName,
              content: `[Document "${bid.filename}" - OCR extraction failed. Document appears to be image-based or scanned.]`
            });
          } else {
            bidsWithContent.push({
              vendorName: bid.vendorName,
              content
            });
          }

          // Update selectedBids with extracted content for future use
          setSelectedBids(prev => prev.map(b => 
            b.id === bid.id ? { ...b, content } : b
          ));
        } catch (error: any) {
          console.error(`Error extracting text from ${bid.vendorName}:`, error);
          throw new Error(`Failed to extract text from "${bid.vendorName}": ${error.message || 'Unknown error'}`);
        }
      }

      // Step 2: Analyze and compare bids
      setAddingBidProgress('Analyzing documents with AI...');
      
      const result = await compareBids(bidsWithContent);
      setComparisonResult(result);

      // Log audit trail
      try {
        await insforge.database.from('audit_logs').insert([{
          user_id: userData.user.id,
          action_type: 'comparison', // Only action_type exists, not action
          details: { 
            bids_count: selectedBids.length,
            vendors: selectedBids.map(b => b.vendorName),
            timestamp: new Date().toISOString()
          }
        }]);
      } catch (auditError) {
        console.error('Error saving audit log:', auditError);
      }

      toast.success('Comparison completed successfully!');
    } catch (error: any) {
      console.error('Comparison error:', error);
      toast.error(error.message || 'Failed to compare bids');
    } finally {
      setComparing(false);
      setAddingBidProgress("");
    }
  };

  const [documentSelect, setDocumentSelect] = useState("");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 bg-background">
        <div className="container px-4 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <GitCompare className="h-10 w-10 text-primary" />
              Document Comparison
            </h1>
            <p className="text-muted-foreground">
              Compare multiple bid submissions to identify similarities, red flags, and best value
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Bid Selection */}
            <div className="lg:col-span-1 space-y-6 order-2 lg:order-1">
              <Card>
                <CardHeader>
                  <CardTitle>Select Bids</CardTitle>
                  <CardDescription>
                    Add documents to compare (minimum 2)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="document">Document</Label>
                    <Select value={documentSelect} onValueChange={setDocumentSelect}>
                      <SelectTrigger id="document" name="document">
                        <SelectValue placeholder="Select document" />
                      </SelectTrigger>
                      <SelectContent>
                        {documents.map((doc) => (
                          <SelectItem key={doc.id} value={doc.id}>
                            {doc.filename}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="vendor">Vendor Name</Label>
                    <Input
                      id="vendor"
                      name="vendor"
                      placeholder="Enter vendor/bidder name"
                      value={vendorInput}
                      onChange={(e) => setVendorInput(e.target.value)}
                    />
                  </div>

                  <Button 
                    onClick={handleAddBid} 
                    className="w-full"
                    variant="outline"
                    disabled={addingBid}
                  >
                    {addingBid ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {addingBidProgress || 'Processing...'}
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Bid
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Selected Bids List */}
              {selectedBids.length > 0 && (
                <Card className="sticky top-4 z-10">
                  <CardHeader>
                    <CardTitle>Selected Bids ({selectedBids.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {selectedBids.map((bid) => (
                        <div 
                          key={bid.id}
                          className="flex items-center justify-between p-3 rounded-lg border"
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <Users className="h-4 w-4 text-primary flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-sm truncate">{bid.vendorName}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {bid.filename}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveBid(bid.id)}
                            className="flex-shrink-0 ml-2"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <Button 
                      onClick={handleCompare}
                      disabled={selectedBids.length < 2 || comparing}
                      className="w-full mt-4 sticky bottom-0"
                      size="lg"
                    >
                      {comparing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          <span className="truncate">{addingBidProgress || 'Comparing...'}</span>
                        </>
                      ) : (
                        <>
                          <GitCompare className="mr-2 h-4 w-4" />
                          <span>Compare Bids ({selectedBids.length})</span>
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Results */}
            <div className="lg:col-span-2 space-y-6 order-1 lg:order-2">
              {comparisonResult ? (
                <>
                  {/* Comparison Summary */}
                  <Card className="border-primary">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <CardTitle>Comparison Summary</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground whitespace-pre-line">
                        {comparisonResult.recommendation}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Similarities */}
                  {comparisonResult.similarities?.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                          Identified Similarities
                        </CardTitle>
                        <CardDescription>
                          Potential concerns or noteworthy similarities across bids
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {comparisonResult.similarities.map((similarity: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                              <span className="text-sm">{similarity}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Red Flags */}
                  {comparisonResult.redFlags?.length > 0 && (
                    <Card className="border-red-200 bg-red-50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                          Red Flags
                        </CardTitle>
                        <CardDescription>
                          Critical issues requiring investigation
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {comparisonResult.redFlags.map((flag: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                              <span className="text-sm">{flag}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Individual Comparisons */}
                  {comparisonResult.comparison && Object.keys(comparisonResult.comparison).length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Detailed Comparison</CardTitle>
                        <CardDescription>
                          Real-time extracted data and scores for each vendor
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {Object.entries(comparisonResult.comparison).map(([vendor, data]: [string, any]) => (
                            <div key={vendor} className="p-4 rounded-lg border-2 border-primary/20 bg-primary/5">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <Shield className="h-5 w-5 text-primary" />
                                  <span className="font-semibold text-lg">{vendor}</span>
                                </div>
                                {data.score && (
                                  <Badge className={`text-base px-3 py-1 ${
                                    data.score >= 80 ? 'bg-green-100 text-green-800' :
                                    data.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    Score: {data.score}/100
                                  </Badge>
                                )}
                              </div>
                              
                              {/* Quoted Amount */}
                              {data.quotedAmount && (
                                <div className="mb-2">
                                  <span className="text-sm font-medium text-muted-foreground">Quoted Amount: </span>
                                  <span className="text-sm font-semibold text-primary">{data.quotedAmount}</span>
                                </div>
                              )}
                              
                              {/* Experience */}
                              {data.experience && (
                                <div className="mb-2">
                                  <span className="text-sm font-medium text-muted-foreground">Experience: </span>
                                  <span className="text-sm">{data.experience}</span>
                                </div>
                              )}
                              
                              {/* Certifications */}
                              {data.certifications && Array.isArray(data.certifications) && data.certifications.length > 0 && (
                                <div className="mb-2">
                                  <span className="text-sm font-medium text-muted-foreground">Certifications: </span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {data.certifications.map((cert: string, idx: number) => (
                                      <Badge key={idx} variant="outline" className="text-xs">
                                        {cert}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Strengths */}
                              {data.strengths && Array.isArray(data.strengths) && data.strengths.length > 0 && (
                                <div className="mb-2">
                                  <span className="text-sm font-medium text-green-700 flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    Strengths:
                                  </span>
                                  <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                                    {data.strengths.map((strength: string, idx: number) => (
                                      <li key={idx} className="text-xs text-muted-foreground">{strength}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {/* Weaknesses */}
                              {data.weaknesses && Array.isArray(data.weaknesses) && data.weaknesses.length > 0 && (
                                <div>
                                  <span className="text-sm font-medium text-orange-700 flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3" />
                                    Weaknesses:
                                  </span>
                                  <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                                    {data.weaknesses.map((weakness: string, idx: number) => (
                                      <li key={idx} className="text-xs text-muted-foreground">{weakness}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex gap-2">
                    <Button onClick={() => {
                      setComparisonResult(null);
                      setSelectedBids([]);
                    }} variant="outline" className="flex-1">
                      New Comparison
                    </Button>
                    <Button onClick={() => navigate('/audit')} variant="outline" className="flex-1">
                      View Audit Trail
                    </Button>
                  </div>
                </>
              ) : selectedBids.length === 0 ? (
                <Card>
                  <CardContent className="py-20 text-center">
                    <GitCompare className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                    <h3 className="text-lg font-medium mb-2">Ready to Compare</h3>
                    <p className="text-muted-foreground">
                      Add at least 2 bids from the left panel to start comparison
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-20 text-center">
                    <GitCompare className="h-16 w-16 mx-auto mb-4 text-primary opacity-30" />
                    <h3 className="text-lg font-medium mb-2">Ready to Compare</h3>
                    <p className="text-muted-foreground">
                      Click "Compare Bids" to analyze similarities and red flags
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Compare;

