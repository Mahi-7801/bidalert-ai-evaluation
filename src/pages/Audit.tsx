import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Clock, User, FileText, Activity, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { insforge } from "@/lib/insforge";
import { toast } from "sonner";

interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  action_type?: string;
  document_id?: string | null;
  details?: any;
  changes?: any; // For backward compatibility
  entity_type?: string | null; // For backward compatibility
  entity_id?: string | null; // For backward compatibility
  timestamp?: string;
  created_at?: string;
}

const Audit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [filterAction, setFilterAction] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await insforge.auth.getCurrentUser();
        if (error || !data?.user?.id) {
          toast.error('Please sign in to access audit logs');
          navigate('/');
        }
      } catch (err) {
        navigate('/');
      }
    };
    checkAuth();
    loadAuditLogs();
  }, [navigate]);

  useEffect(() => {
    filterLogs();
  }, [logs, filterAction, searchTerm]);

  const loadAuditLogs = async () => {
    try {
      setLoading(true);

      const { data: userData, error: authError } = await insforge.auth.getCurrentUser();
      
      if (authError || !userData?.user?.id) {
        toast.error('Please sign in to access audit logs');
        navigate('/');
        return;
      }

      // Fetch real audit logs with correct column names
      // Try with specific columns first, fallback to * if columns don't exist
      try {
        // First, try to get table schema to see what columns exist
        const { data, error } = await insforge.database
          .from('audit_logs')
          .select('*') // Use * to avoid column mismatch errors
          .eq('user_id', userData.user.id)
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) {
          console.error('Audit logs query error:', error);
          // Check if it's a column error or permission error
          const errorMessage = error?.message || '';
          if (errorMessage.includes('column') || errorMessage.includes('does not exist')) {
            console.warn('Column mismatch detected, trying with minimal columns...');
            // Try with just basic columns
            const { data: minData, error: minError } = await insforge.database
              .from('audit_logs')
              .select('id, user_id, created_at')
              .eq('user_id', userData.user.id)
              .order('created_at', { ascending: false })
              .limit(100);
            
            if (minError) {
              console.error('Minimal query also failed:', minError);
              toast.error('Could not load audit logs. Database schema may need updating.');
              setLogs([]);
              return;
            }
            
            if (minData && minData.length > 0) {
              // Map minimal data to our interface
              const mappedData = minData.map((log: any) => ({
                id: log.id,
                user_id: log.user_id,
                action: log.action || log.action_type || '',
                action_type: log.action_type,
                document_id: log.document_id || null,
                details: log.details || log.changes || {},
                created_at: log.created_at || log.timestamp
              }));
              setLogs(mappedData);
              return;
            }
          }
          
          toast.error('Could not load audit logs. Please try again later.');
          setLogs([]);
          return;
        }

        if (data && data.length > 0) {
          // Map data to ensure consistent format
          const mappedData = data.map((log: any) => ({
            id: log.id,
            user_id: log.user_id,
            action: log.action || log.action_type || '',
            action_type: log.action_type,
            document_id: log.document_id,
            details: log.details || log.changes || {},
            created_at: log.created_at || log.timestamp
          }));
          setLogs(mappedData);
        } else {
          // No logs yet - show empty state, not demo data
          setLogs([]);
        }
      } catch (dbError: any) {
        console.error('Database query failed:', dbError);
        toast.error('Could not load audit logs. Please try again later.');
        setLogs([]);
      }
    } catch (error: any) {
      console.error('Error loading audit logs:', error);
      toast.error('Could not load audit logs. Please try again later.');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = logs;

    // Filter by action type (check both action and action_type fields)
    if (filterAction !== "all") {
      filtered = filtered.filter(log => 
        log.action === filterAction || 
        log.action_type === filterAction ||
        (log.action || '').toLowerCase() === filterAction.toLowerCase() ||
        (log.action_type || '').toLowerCase() === filterAction.toLowerCase()
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        JSON.stringify(log.details || log.changes || {}).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLogs(filtered);
  };

  const getActionName = (action?: string, actionType?: string): string => {
    // Use action_type if available, otherwise parse from action
    const type = (actionType || action || '').toLowerCase().trim();
    
    const actionNameMap: Record<string, string> = {
      upload: 'Document Upload',
      evaluation: 'Bid Evaluation',
      draft: 'AI Document Draft',
      comparison: 'Bid Comparison',
      'document upload': 'Document Upload',
      'bid evaluation': 'Bid Evaluation',
      'ai draft': 'AI Document Draft',
      'document comparison': 'Bid Comparison',
      document_upload: 'Document Upload',
      bid_evaluation: 'Bid Evaluation',
      ai_processing: 'AI Processing',
      document_analysis: 'Document Analysis',
      document_validation: 'Document Validation'
    };

    return actionNameMap[type] || action || actionType || 'Unknown Action';
  };

  const getActionBadge = (action: string, actionType?: string) => {
    // Use action_type if available, otherwise parse from action
    const type = (actionType || action || '').toLowerCase().trim();
    
    const badgeMap: Record<string, { label: string; color: string }> = {
      upload: { label: 'Upload', color: 'bg-blue-100 text-blue-800' },
      evaluation: { label: 'Evaluation', color: 'bg-green-100 text-green-800' },
      draft: { label: 'Draft', color: 'bg-purple-100 text-purple-800' },
      comparison: { label: 'Comparison', color: 'bg-indigo-100 text-indigo-800' },
      'document upload': { label: 'Upload', color: 'bg-blue-100 text-blue-800' },
      'bid evaluation': { label: 'Evaluation', color: 'bg-green-100 text-green-800' },
      'ai draft': { label: 'Draft', color: 'bg-purple-100 text-purple-800' },
      'document comparison': { label: 'Comparison', color: 'bg-indigo-100 text-indigo-800' },
      document_upload: { label: 'Upload', color: 'bg-blue-100 text-blue-800' },
      bid_evaluation: { label: 'Evaluation', color: 'bg-green-100 text-green-800' },
      ai_processing: { label: 'AI Process', color: 'bg-purple-100 text-purple-800' },
      document_analysis: { label: 'Analysis', color: 'bg-orange-100 text-orange-800' },
      document_validation: { label: 'Validation', color: 'bg-teal-100 text-teal-800' }
    };

    const badge = badgeMap[type] || { label: action || 'Unknown', color: 'bg-gray-100 text-gray-800' };
    return <Badge className={badge.color}>{badge.label}</Badge>;
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return {
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString()
      };
    } catch (error) {
      return {
        date: 'N/A',
        time: 'N/A'
      };
    }
  };

  // Filter out empty strings and null/undefined values for Select component
  // Include both action and action_type to ensure all action types are available
  const uniqueActions = Array.from(new Set(
    logs
      .map(log => log.action_type || log.action || '')
      .filter(action => action && action.trim() !== '')
  ));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading audit trail...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-6 md:py-12 bg-background">
        <div className="container px-4 max-w-6xl">
        <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-4xl font-bold mb-2 flex items-center gap-2 md:gap-3">
              <Shield className="h-6 w-6 md:h-10 md:w-10 text-primary" />
              Audit Trail
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Complete transparency log of all system activities and AI operations
            </p>
        </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
            <Card className="border-0 shadow-md">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground">Total Logs</p>
                    <p className="text-xl md:text-2xl font-bold">{logs.length}</p>
                  </div>
                  <Activity className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
            </div>
              </CardContent>
          </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground">Documents</p>
                    <p className="text-xl md:text-2xl font-bold">
                      {logs.filter(l => l.action_type === 'upload' || l.action?.toLowerCase().includes('upload')).length}
                    </p>
                  </div>
                  <FileText className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
            </div>
              </CardContent>
          </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground">Evaluations</p>
                    <p className="text-xl md:text-2xl font-bold">
                      {logs.filter(l => l.action_type === 'evaluation' || l.action?.toLowerCase().includes('evaluation')).length}
                    </p>
                  </div>
                  <Shield className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />
            </div>
              </CardContent>
          </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground">AI Operations</p>
                    <p className="text-xl md:text-2xl font-bold">
                      {logs.filter(l => l.action_type === 'draft' || l.action?.toLowerCase().includes('draft')).length}
                    </p>
                  </div>
                  <Activity className="h-6 w-6 md:h-8 md:w-8 text-orange-600" />
            </div>
              </CardContent>
          </Card>
        </div>

          {/* Filters */}
          <Card className="mb-4 md:mb-6 border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Filter className="h-4 w-4 md:h-5 md:w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <Label htmlFor="filter-action" className="text-xs md:text-sm font-medium mb-1 md:mb-2 block">Filter by Action</Label>
                  <Select value={filterAction} onValueChange={setFilterAction}>
                    <SelectTrigger id="filter-action" name="filter-action" className="h-9 md:h-10">
                      <SelectValue placeholder="All actions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      {uniqueActions.map(action => {
                        // Ensure action is not empty and is a valid string
                        const safeAction = (action || 'unknown').trim();
                        if (!safeAction || safeAction === '') return null;
                        // Get formatted action name
                        const formattedName = getActionName(safeAction, safeAction);
                        return (
                          <SelectItem key={safeAction} value={safeAction}>
                            {formattedName}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="search-audit-logs" className="text-xs md:text-sm font-medium mb-1 md:mb-2 block">Search</Label>
            <Input
              id="search-audit-logs"
              name="search-audit-logs"
              placeholder="Search audit logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-9 md:h-10"
            />
          </div>
              </div>
            </CardContent>
        </Card>

          {/* Audit Logs */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg">Activity Log</CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Showing {filteredLogs.length} of {logs.length} total entries
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-8 md:py-12">
                  <Shield className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                  <p className="text-sm md:text-base text-muted-foreground">No audit logs found</p>
                  {logs.length === 0 && (
                    <p className="text-xs md:text-sm text-muted-foreground mt-2">
                      Audit logs will appear here after you perform actions like uploading documents or evaluating bids.
                    </p>
                  )}
                </div>
              ) : (
          <div className="space-y-3 md:space-y-4">
                  {filteredLogs.map((log) => {
                    const { date, time } = formatTimestamp(log.created_at || log.timestamp || new Date().toISOString());
                    const details = log.details || log.changes || {};
                    
                    return (
                      <div 
                        key={log.id} 
                        className="p-3 md:p-4 rounded-lg border hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                          <div className="flex items-start gap-2 md:gap-3 flex-1">
                            {getActionBadge(log.action, log.action_type)}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm md:text-base break-words">
                                {getActionName(log.action, log.action_type)}
                              </p>
                              <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 flex-shrink-0" />
                                <span className="break-words">{date} at {time}</span>
                      </div>
                    </div>
                  </div>
                </div>

                        {details && Object.keys(details).length > 0 && (
                          <div className="mt-3 p-2 md:p-3 bg-muted/50 rounded-md">
                            <p className="text-xs font-medium text-muted-foreground mb-2">Details:</p>
                            <div className="text-xs md:text-sm space-y-1">
                              {Object.entries(details).map(([key, value]) => (
                                <div key={key} className="flex flex-col sm:flex-row sm:gap-2 break-words">
                                  <span className="font-medium capitalize min-w-fit">{key.replace(/_/g, ' ')}:</span>
                                  <span className="text-muted-foreground break-all">
                                    {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                                  </span>
              </div>
            ))}
          </div>
            </div>
                        )}
                </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Compliance Info */}
          <Card className="mt-4 md:mt-6 bg-green-50 border-green-200 border-0 shadow-md">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start gap-2 md:gap-3">
                <Shield className="h-5 w-5 md:h-6 md:w-6 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm md:text-base text-green-900 mb-1">
                    Full Audit Trail Compliance
                  </h3>
                  <p className="text-xs md:text-sm text-green-800">
                    All system activities are logged with timestamps, user information, and detailed changes 
                    to ensure full transparency and compliance with Government of India audit requirements.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
      </main>

      <Footer />
    </div>
  );
};

export default Audit;
