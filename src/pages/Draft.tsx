import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Loader2, Sparkles, CheckCircle, Download, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { insforge } from "@/lib/insforge";
import { draftBidDocument } from "@/services/aiService";
import { toast } from "sonner";

const Draft = () => {
  const navigate = useNavigate();
  const [drafting, setDrafting] = useState(false);
  const [draftedDocument, setDraftedDocument] = useState("");
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await insforge.auth.getCurrentUser();
        if (error || !data?.user?.id) {
          toast.error('Please sign in to access the Drafting Assistant');
          navigate('/');
        }
      } catch (err) {
        navigate('/');
      }
    };
    checkAuth();
  }, [navigate]);

  // Form fields
  const [projectTitle, setProjectTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [projectType, setProjectType] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [technicalRequirements, setTechnicalRequirements] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");

  const handleDraft = async () => {
    // Validate required fields
    if (!projectTitle || !department || !projectType || !budget || !timeline || !technicalRequirements) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setDrafting(true);

      // Get current user for audit logging
      const { data: userData, error: authError } = await insforge.auth.getCurrentUser();
      
      if (authError || !userData?.user?.id) {
        toast.error('Please sign in to draft documents');
        navigate('/');
        return;
      }

      // Call AI service to draft document
      const drafted = await draftBidDocument({
        projectTitle,
        department,
        projectType,
        budget,
        timeline,
        technicalRequirements,
        additionalDetails: additionalDetails || undefined
      });

      setDraftedDocument(drafted);

      // Log audit trail (non-critical)
      try {
        await insforge.database.from('audit_logs').insert([{
          user_id: userData.user.id,
          action_type: 'draft', // Only action_type exists, not action
          details: { 
            project_title: projectTitle,
            department: department,
            type: projectType,
            timestamp: new Date().toISOString()
          }
        }]);
      } catch (auditError) {
        console.error('Error saving audit log:', auditError);
      }

      // Check if we got a fallback document or AI-generated content
      if (drafted.includes('AI-generated template') || drafted.includes('END OF TENDER DOCUMENT')) {
        toast.success('Document generated using template (AI unavailable)!');
      } else {
        toast.success('Document drafted successfully with AI!');
      }
    } catch (error: any) {
      console.error('Drafting error:', error);
      toast.error(error.message || 'Failed to draft document');
    } finally {
      setDrafting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(draftedDocument);
    toast.success('Document copied to clipboard!');
  };

  const handleDownload = () => {
    const blob = new Blob([draftedDocument], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectTitle.replace(/\s+/g, '_')}_Draft.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Document downloaded!');
  };

  const handleSave = async () => {
    if (!draftedDocument) {
      toast.error('No document to save');
      return;
    }

    try {
      const { data: userData } = await insforge.auth.getCurrentUser();
      
      if (!userData?.user?.id) {
        toast.error('Please sign in to save documents');
        return;
      }

      // Create a text file and upload it
      const blob = new Blob([draftedDocument], { type: 'text/plain' });
      const fileName = `${Date.now()}_${projectTitle.replace(/\s+/g, '_')}_Draft.txt`;
      
      const { data: storageData, error: storageError } = await insforge.storage
        .from('bid-documents')
        .upload(fileName, blob);

      if (storageError) {
        throw storageError;
      }

      // Save document metadata
      await insforge.database.from('documents').insert([{
        user_id: userData.user.id,
        filename: `${projectTitle.replace(/\s+/g, '_')}_Draft.txt`,
        file_url: storageData.url,
        file_key: storageData.key,
        document_type: projectType,
        file_size: blob.size
      }]);

      // Log audit trail
      try {
        await insforge.database.from('audit_logs').insert([{
          user_id: userData.user.id,
          document_id: null,
          action_type: 'upload', // Only action_type exists, not action
          details: { 
            filename: fileName,
            type: 'AI_DRAFT',
            timestamp: new Date().toISOString()
          }
        }]);
      } catch (auditError) {
        console.error('Error saving audit log:', auditError);
        // Non-critical, continue anyway
      }

      toast.success('Document saved successfully!');
      navigate('/documents');
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error('Failed to save document');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 bg-background">
        <div className="container px-4 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Sparkles className="h-10 w-10 text-primary" />
              AI Drafting Assistant
            </h1>
            <p className="text-muted-foreground">
              Generate tender documents using AI templates and government guidelines
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Form */}
            <div className="space-y-6">
              {/* Quick Templates Card */}
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Templates</CardTitle>
                  <CardDescription>
                    Start with a pre-filled template
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setProjectType('works');
                        setTechnicalRequirements('Minimum 5 years experience in similar projects. Valid ISO certification. Adequate financial capacity.');
                      }}
                    >
                      Works Contract
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setProjectType('supply');
                        setTechnicalRequirements('Valid trade license. Product certifications as per standards. GST registration mandatory.');
                      }}
                    >
                      Supply Contract
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setProjectType('consultancy');
                        setTechnicalRequirements('Qualified professionals with relevant experience. Company registration. Tax compliance certificates.');
                      }}
                    >
                      Consultancy
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setTechnicalRequirements('Technical specifications, quality standards, delivery requirements, warranty terms.');
                        setBudget('As per quoted rates');
                      }}
                    >
                      E-Tender
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Information</CardTitle>
                  <CardDescription>
                    Enter details to generate a comprehensive tender document
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="project-title">Project Title *</Label>
                    <Input
                      id="project-title"
                      name="project-title"
                      placeholder="e.g., Construction of Four-Lane Highway"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="department">Department *</Label>
                    <Input
                      id="department"
                      name="department"
                      placeholder="e.g., Infrastructure & Investment Department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="project-type">Project Type *</Label>
                    <Select value={projectType} onValueChange={setProjectType}>
                      <SelectTrigger id="project-type" name="project-type">
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rfp">Request for Proposal (RFP)</SelectItem>
                        <SelectItem value="rfq">Request for Quotation (RFQ)</SelectItem>
                        <SelectItem value="tender">Open Tender</SelectItem>
                        <SelectItem value="consultancy">Consultancy Services</SelectItem>
                        <SelectItem value="works">Works Contract</SelectItem>
                        <SelectItem value="supply">Supply Contract</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="budget">Budget / Estimated Value *</Label>
                    <Input
                      id="budget"
                      name="budget"
                      placeholder="e.g., ₹82 Crores"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="timeline">Project Timeline *</Label>
                    <Input
                      id="timeline"
                      name="timeline"
                      placeholder="e.g., 18 months from award date"
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="technical-requirements">Technical Requirements *</Label>
                    <Textarea
                      id="technical-requirements"
                      name="technical-requirements"
                      placeholder="Describe technical specifications, eligibility criteria, and key requirements..."
                      value={technicalRequirements}
                      onChange={(e) => setTechnicalRequirements(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="additional-details">Additional Details (Optional)</Label>
                    <Textarea
                      id="additional-details"
                      name="additional-details"
                      placeholder="Any additional information or special conditions..."
                      value={additionalDetails}
                      onChange={(e) => setAdditionalDetails(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <Button 
                    onClick={handleDraft} 
                    disabled={!projectTitle || !department || !projectType || !budget || !timeline || !technicalRequirements || drafting}
                    className="w-full"
                    size="lg"
                  >
                    {drafting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Drafting Document with AI...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Tender Document
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertDescription>
                  The AI drafting assistant follows Government of India (GFR 2017) and 
                  Andhra Pradesh State procurement guidelines to ensure compliance and completeness.
                </AlertDescription>
              </Alert>
            </div>

            {/* Right Column - Output */}
            <div className="space-y-6">
              {draftedDocument ? (
                <>
                  <Card className="border-success">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-success" />
                          <CardTitle>Document Drafted</CardTitle>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          AI Generated
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={draftedDocument}
                        onChange={(e) => setDraftedDocument(e.target.value)}
                        className="min-h-[500px] font-mono text-sm"
                        readOnly
                      />
                    </CardContent>
                  </Card>

                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="flex-1">
                      <Download className="mr-2 h-4 w-4" />
                      Save to Library
                    </Button>
                    <Button onClick={handleDownload} variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button onClick={handleCopy} variant="outline">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                  </div>

                  <Alert>
                    <FileText className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Review Required:</strong> This AI-generated document should be reviewed 
                      and customized for your specific needs. All standard clauses and compliance requirements 
                      have been included.
                    </AlertDescription>
                  </Alert>
                </>
              ) : (
                <Card>
                  <CardContent className="py-20 text-center">
                    <Sparkles className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                    <h3 className="text-lg font-medium mb-2">Ready to Generate</h3>
                    <p className="text-muted-foreground">
                      Fill in the form and click "Generate Tender Document" to create a comprehensive 
                      bid document using AI
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

export default Draft;

