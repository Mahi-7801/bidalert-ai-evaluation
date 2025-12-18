import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FileText, MessageSquare, Send, Loader2, Download, Eye, Trash2, 
  Bot, User as UserIcon, Clock, BarChart3, Search 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { insforge } from "@/lib/insforge";
import { chatWithDocument } from "@/services/aiService";
import { readFileAsText } from "@/utils/pdfExtractor";
import { toast } from "sonner";

interface Document {
  id: string;
  filename: string;
  document_type: string;
  status: string;
  file_url: string;
  file_key: string;
  upload_date: string;
  file_size: number;
}

interface DocumentAnalysis {
  document_id: string;
  summary: string;
  compliance_score: number;
  key_points: string[];
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const Documents = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [analyses, setAnalyses] = useState<Record<string, DocumentAnalysis>>({});
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [documentContent, setDocumentContent] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await insforge.auth.getCurrentUser();
        if (error || !data?.user?.id) {
          toast.error('Please sign in to access the Document Library');
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
      setLoading(true);

      const { data: userData, error: authError } = await insforge.auth.getCurrentUser();
      
      if (authError || !userData?.user?.id) {
        toast.error('Please sign in to view documents');
        navigate('/');
        return;
      }

      // Fetch documents
      const { data: docs, error: docsError } = await insforge.database
        .from('documents')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false });

      if (docsError) {
        throw new Error('Failed to load documents');
      }

      setDocuments(docs || []);

      // Fetch analyses
      const { data: analysesData, error: analysesError } = await insforge.database
        .from('document_analyses')
        .select('*');

      if (analysesError) {
        console.error('Error loading analyses:', analysesError);
      }

      // Create analyses map
      const analysesMap: Record<string, DocumentAnalysis> = {};
      analysesData?.forEach(analysis => {
        analysesMap[analysis.document_id] = analysis;
      });
      setAnalyses(analysesMap);

    } catch (error: any) {
      console.error('Error loading documents:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const selectDocument = async (doc: Document) => {
    setSelectedDoc(doc);
    setChatMessages([]);
    setDocumentContent("");
    
    try {
      // Load document content using proper extraction
      const { data: blob, error } = await insforge.storage
        .from('bid-documents')
        .download(doc.file_key);
      
      if (error) throw error;
      
      // Convert blob to File for readFileAsText utility
      const file = new File([blob], doc.filename, { type: blob.type });
      
      // Use proper extraction utility (handles PDF, DOCX, TXT, ZIP)
      const text = await readFileAsText(file);
      
      if (!text || text.trim().length === 0) {
        throw new Error('Document appears to be empty or unreadable');
      }
      
      setDocumentContent(text);
      console.log('Document loaded successfully, length:', text.length);
      console.log('First 500 chars:', text.slice(0, 500));

      // Add welcome message
      setChatMessages([{
        role: 'assistant',
        content: `I'm ready to answer questions about "${doc.filename}". I have loaded the document content and can answer questions about EMD values, tender details, dates, amounts, and other information. What would you like to know?`,
        timestamp: new Date()
      }]);
    } catch (error: any) {
      console.error('Error loading document:', error);
      toast.error(`Could not load document content: ${error.message || 'Unknown error'}`);
      
      // Set error message in chat
      setChatMessages([{
        role: 'assistant',
        content: `Sorry, I couldn't load the document content. Please try uploading the document again or contact support.`,
        timestamp: new Date()
      }]);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !selectedDoc || !documentContent) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput("");
    setChatLoading(true);

    try {
      // Prepare chat history for AI
      const history = chatMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Get analysis data if available for additional context
      const analysis = analyses[selectedDoc.id];
      let enhancedContext = documentContent;
      
      // If we have extracted data from analysis, prepend it as structured context
      if (analysis && analysis.key_points) {
        const extractedInfo = Array.isArray(analysis.key_points) 
          ? analysis.key_points.join('\n')
          : typeof analysis.key_points === 'string'
            ? analysis.key_points
            : '';
        
        if (extractedInfo) {
          enhancedContext = `=== EXTRACTED DATA FROM DOCUMENT ANALYSIS ===\n${extractedInfo}\n\n=== FULL DOCUMENT TEXT ===\n${documentContent}`;
        }
      }
      
      // Get AI response with full document content + extracted data
      const response = await chatWithDocument(
        chatInput,
        enhancedContext, // Use enhanced context with extracted data
        history
      );

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, assistantMessage]);

      // Save to Q&A history
      const { data: userData } = await insforge.auth.getCurrentUser();
      if (userData?.user?.id) {
        await insforge.database.from('qna_history').insert([{
          user_id: userData.user.id,
          question: chatInput,
          answer: response,
          context_type: 'document'
        }]);
      }

    } catch (error: any) {
      console.error('Chat error:', error);
      toast.error('Failed to get AI response');
      
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const { error } = await insforge.database
        .from('documents')
        .delete()
        .eq('id', docId);

      if (error) throw error;

      toast.success('Document deleted successfully');
      loadDocuments();
      
      if (selectedDoc?.id === docId) {
        setSelectedDoc(null);
        setChatMessages([]);
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error('Failed to delete document');
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.document_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'analyzed':
        return <Badge className="bg-green-100 text-green-800">Analyzed</Badge>;
      case 'uploaded':
        return <Badge className="bg-blue-100 text-blue-800">Uploaded</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 bg-background">
        <div className="container px-4 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Document Library</h1>
            <p className="text-muted-foreground">
              Browse, analyze, and chat with your bid documents using AI
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Document List */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Documents ({documents.length})</CardTitle>
                  <div className="mt-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search-documents"
                        name="search-documents"
                        placeholder="Search documents..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px] pr-4">
                    {filteredDocuments.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
                        <p className="text-muted-foreground mb-4">No documents found</p>
                        <Button onClick={() => navigate('/upload')} size="sm">
                          Upload Document
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {filteredDocuments.map((doc) => {
                          const analysis = analyses[doc.id];
                          const isSelected = selectedDoc?.id === doc.id;
                          
                          return (
                            <div
                              key={doc.id}
                              onClick={() => selectDocument(doc)}
                              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                isSelected 
                                  ? 'border-primary bg-primary/5' 
                                  : 'hover:border-primary/50 hover:bg-muted/50'
                              }`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <FileText className={`h-4 w-4 flex-shrink-0 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">{doc.filename}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {doc.document_type.replace(/_/g, ' ').toUpperCase()}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(doc.id);
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                              
                              <div className="flex items-center justify-between text-xs">
                                {getStatusBadge(doc.status)}
                                {analysis && (
                                  <Badge variant="outline" className="text-xs">
                                    {analysis.compliance_score}% Compliant
                                  </Badge>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Document Details & Chat */}
            <div className="lg:col-span-2 space-y-4">
              {selectedDoc ? (
                <>
                  {/* Document Info */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{selectedDoc.filename}</CardTitle>
                          <CardDescription>
                            {selectedDoc.document_type.replace(/_/g, ' ').toUpperCase()}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <a href={selectedDoc.file_url} target="_blank" rel="noopener noreferrer">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </a>
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => navigate('/evaluation')}>
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Evaluate
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {analyses[selectedDoc.id] && (
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-semibold mb-1">AI Summary</h4>
                            <p className="text-sm text-muted-foreground">
                              {analyses[selectedDoc.id].summary}
                            </p>
                          </div>
                          
                          {analyses[selectedDoc.id].key_points?.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold mb-1">Key Points</h4>
                              <ul className="list-disc list-inside space-y-1">
                                {analyses[selectedDoc.id].key_points.slice(0, 3).map((point, idx) => (
                                  <li key={idx} className="text-sm text-muted-foreground">{point}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* AI Chat */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        <CardTitle>AI Document Assistant</CardTitle>
                      </div>
                      <CardDescription>
                        Ask questions about this document and get instant AI-powered answers
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Chat Messages */}
                      <ScrollArea className="h-[400px] mb-4 rounded-lg border p-4">
                        <div className="space-y-4">
                          {chatMessages.map((msg, idx) => (
                            <div
                              key={idx}
                              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              {msg.role === 'assistant' && (
                                <div className="flex-shrink-0">
                                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Bot className="h-5 w-5 text-primary" />
                                  </div>
                                </div>
                              )}
                              
                              <div
                                className={`max-w-[80%] rounded-lg p-3 ${
                                  msg.role === 'user'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                }`}
                              >
                                <p className="text-sm whitespace-pre-line">{msg.content}</p>
                                <p className="text-xs mt-1 opacity-70">
                                  {msg.timestamp.toLocaleTimeString()}
                                </p>
                              </div>

                              {msg.role === 'user' && (
                                <div className="flex-shrink-0">
                                  <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center">
                                    <UserIcon className="h-5 w-5 text-secondary" />
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                          
                          {chatLoading && (
                            <div className="flex gap-3">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <Bot className="h-5 w-5 text-primary" />
                              </div>
                              <div className="bg-muted rounded-lg p-3">
                                <Loader2 className="h-4 w-4 animate-spin" />
                              </div>
                            </div>
                          )}
                        </div>
                      </ScrollArea>

                      {/* Chat Input */}
                      <div className="flex gap-2">
                        <Input
                          placeholder="Ask a question about this document..."
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          disabled={chatLoading}
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!chatInput.trim() || chatLoading}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>

                      <Alert className="mt-4">
                        <Bot className="h-4 w-4" />
                        <AlertDescription>
                          <strong>AI Powered:</strong> Responses are generated by GPT-4o based on document content. 
                          All conversations are logged for audit purposes.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="py-20 text-center">
                    <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                    <h3 className="text-lg font-medium mb-2">Select a Document</h3>
                    <p className="text-muted-foreground mb-6">
                      Choose a document from the list to view details and chat with AI
                    </p>
                    <Button onClick={() => navigate('/upload')}>
                      <FileText className="mr-2 h-4 w-4" />
                      Upload New Document
                    </Button>
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

export default Documents;
