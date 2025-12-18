import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FileText, Upload, BarChart3, Clock, CheckCircle, AlertCircle, 
  TrendingUp, Users, Shield, Activity, Sparkles, GitCompare,
  Calendar, DollarSign, Target, Eye, ArrowRight, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { insforge } from "@/lib/insforge";
import { toast } from "sonner";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardData {
  totalTenders: number;
  activeTenders: number;
  inactiveTenders: number;
  activeBids: number;
  underEvaluation: number;
  underCompliance: number;
  upcomingDeadlines: number;
  upcomingEvaluations: number;
  totalBudget: number;
  allocatedBudget: number;
  remainingBudget: number;
  avgCompliance: number;
  compliantTenders: number;
  nonCompliantTenders: number;
  pendingEvaluations: number;
  completedEvaluations: number;
}

interface Tender {
  id: string;
  filename: string;
  document_type: string;
  status: string;
  created_at: string;
  file_size?: number;
  complianceScore?: number;
  estimatedValue?: number;
}

interface EvaluationStatus {
  document_id: string;
  filename: string;
  tenderRank: number;
  evaluationProgress: number;
  vendorName?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalTenders: 0,
    activeTenders: 0,
    inactiveTenders: 0,
    activeBids: 0,
    underEvaluation: 0,
    underCompliance: 0,
    upcomingDeadlines: 0,
    upcomingEvaluations: 0,
    totalBudget: 0,
    allocatedBudget: 0,
    remainingBudget: 0,
    avgCompliance: 0,
    compliantTenders: 0,
    nonCompliantTenders: 0,
    pendingEvaluations: 0,
    completedEvaluations: 0
  });
  const [activeTenders, setActiveTenders] = useState<Tender[]>([]);
  const [evaluationStatus, setEvaluationStatus] = useState<EvaluationStatus[]>([]);
  const [recentDocuments, setRecentDocuments] = useState<Tender[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<EvaluationStatus[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<any[]>([]);
  const [complianceDistribution, setComplianceDistribution] = useState<any[]>([]);
  const [departmentSpend, setDepartmentSpend] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
    // Refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const isAdmin =
        typeof window !== "undefined" && localStorage.getItem("isAdmin") === "true";

      const { data: userData, error: authError } = await insforge.auth.getCurrentUser() as any;
      
      if (!isAdmin && (authError || !userData?.user?.id)) {
        toast.error('Please sign in to access dashboard');
        navigate('/');
        return;
      }

      // Record login for admin view (local-only history) for normal users
      if (!isAdmin && userData?.user) {
        try {
          const email = userData.user.email || "";
          const meta: any = (userData as any).user?.user_metadata || {};
          const name =
            meta.full_name ||
            meta.name ||
            email.split("@")[0] ||
            "User";

          if (email) {
            const raw = localStorage.getItem("userLogins");
            const parsed: Array<{ email: string; name: string; lastLogin: string }> =
              raw ? JSON.parse(raw) : [];
            const now = new Date().toISOString();
            const existingIndex = parsed.findIndex((u) => u.email === email);
            if (existingIndex >= 0) {
              parsed[existingIndex] = { ...parsed[existingIndex], name, lastLogin: now };
            } else {
              parsed.push({ email, name, lastLogin: now });
            }
            localStorage.setItem("userLogins", JSON.stringify(parsed));
          }
        } catch (e) {
          console.warn("Failed to record login history:", e);
        }
      }

      // Fetch all documents
      let allDocs: any[] = [];
      try {
        let documentsQuery = insforge.database
          .from('documents')
          .select('*')
          .order('created_at', { ascending: false });

        // Non-admin users only see their own documents
        if (!isAdmin && userData?.user?.id) {
          documentsQuery = documentsQuery.eq('user_id', userData.user.id);
        }

        const { data: documents, error: docsError } = await documentsQuery;

        if (docsError) {
          console.warn('Error fetching documents:', docsError);
          // Table might not exist yet, continue with empty array
        } else {
          allDocs = documents || [];
        }
      } catch (err) {
        console.warn('Failed to fetch documents:', err);
        // Continue with empty array
      }

      // Fetch document analyses
      let allAnalyses: any[] = [];
      try {
        const { data: analyses, error: analysesError } = await insforge.database
          .from('document_analyses')
          .select('*');

        if (analysesError) {
          console.warn('Error fetching analyses:', analysesError);
          // Table might not exist yet, continue with empty array
        } else {
          allAnalyses = analyses || [];
        }
      } catch (err) {
        console.warn('Failed to fetch analyses:', err);
        // Continue with empty array
      }

      // Fetch evaluations
      let allEvaluations: any[] = [];
      try {
        let evaluationsQuery = insforge.database
          .from('evaluations')
          .select('*');

        // Non-admin users only see their own evaluations
        if (!isAdmin && userData?.user?.id) {
          evaluationsQuery = evaluationsQuery.eq('evaluator_id', userData.user.id);
        }

        const { data: evaluations, error: evalsError } = await evaluationsQuery;

        if (evalsError) {
          console.warn('Error fetching evaluations:', evalsError);
          // Table might not exist yet, continue with empty array
        } else {
          allEvaluations = evaluations || [];
        }
      } catch (err) {
        console.warn('Failed to fetch evaluations:', err);
        // Continue with empty array
      }

      // Calculate statistics

      // Map analyses to documents
      const docsWithAnalysis = allDocs.map(doc => {
        const analysis = allAnalyses.find(a => a.document_id === doc.id);
        const extractedData = analysis?.extracted_data || {};
        const estimatedValue = parseFloat(extractedData.estimatedValue || extractedData.budget || '0') || 0;
        return {
          ...doc,
          complianceScore: analysis ? Number(analysis.compliance_score) || 0 : 0,
          estimatedValue: estimatedValue
        };
      });

      // Calculate KPIs
      const totalTenders = allDocs.length;
      const activeTendersList = docsWithAnalysis.filter(d => d.status === 'analyzed' || d.status === 'uploaded');
      const activeTendersCount = activeTendersList.length;
      const inactiveTendersCount = totalTenders - activeTendersCount;

      const underEvaluation = docsWithAnalysis.filter(d => 
        d.status === 'uploaded' && !allEvaluations.find(e => e.document_id === d.id)
      ).length;
      const underCompliance = docsWithAnalysis.filter(d => 
        d.status === 'analyzed' && (d.complianceScore || 0) < 60
      ).length;
      const activeBids = underEvaluation + underCompliance;

      // Calculate budgets
      const totalBudget = docsWithAnalysis.reduce((sum, d) => sum + (d.estimatedValue || 0), 0) / 10000000; // Convert to Crores
      const allocatedBudget = docsWithAnalysis
        .filter(d => d.status === 'analyzed')
        .reduce((sum, d) => sum + (d.estimatedValue || 0), 0) / 10000000;
      const remainingBudget = totalBudget - allocatedBudget;

      // Calculate compliance
      const complianceScores = docsWithAnalysis
        .map(d => d.complianceScore)
        .filter(score => score > 0);
      const avgCompliance = complianceScores.length > 0
        ? Math.round(complianceScores.reduce((sum, s) => sum + s, 0) / complianceScores.length)
        : 0;
      const compliantTenders = docsWithAnalysis.filter(d => (d.complianceScore || 0) >= 60).length;
      const nonCompliantTenders = docsWithAnalysis.filter(d => (d.complianceScore || 0) > 0 && (d.complianceScore || 0) < 60).length;

      // Evaluations
      const pendingEvaluations = allDocs.filter(d => 
        d.status === 'analyzed' && !allEvaluations.find(e => e.document_id === d.id)
      ).length;
      const completedEvaluations = allEvaluations.length;

      // Upcoming deadlines (within next 7 days)
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      const upcomingDeadlines = 0; // TODO: Calculate from extracted dates
      const upcomingEvaluations = 0; // TODO: Calculate from evaluation deadlines

      setDashboardData({
        totalTenders,
        activeTenders: activeTendersCount,
        inactiveTenders: inactiveTendersCount,
        activeBids,
        underEvaluation,
        underCompliance,
        upcomingDeadlines,
        upcomingEvaluations,
        totalBudget: Math.round(totalBudget * 100) / 100,
        allocatedBudget: Math.round(allocatedBudget * 100) / 100,
        remainingBudget: Math.round(remainingBudget * 100) / 100,
        avgCompliance,
        compliantTenders,
        nonCompliantTenders,
        pendingEvaluations,
        completedEvaluations
      });

      // Set active tenders
      setActiveTenders(activeTendersList.slice(0, 5));

      // Set evaluation status
      const evalStatus: EvaluationStatus[] = docsWithAnalysis.slice(0, 5).map(doc => {
        const evaluation = allEvaluations.find(e => e.document_id === doc.id);
        const overallScore = evaluation ? Number(evaluation.overall_score) || 0 : 0;
        return {
          document_id: doc.id,
          filename: doc.filename,
          tenderRank: overallScore,
          evaluationProgress: evaluation ? 100 : 0,
          vendorName: 'Unknown Vendor'
        };
      });
      setEvaluationStatus(evalStatus);

      // Set recent documents
      setRecentDocuments(docsWithAnalysis.slice(0, 5));

      // Set pending approvals (documents with low compliance or no evaluation)
      const pending = docsWithAnalysis
        .filter(d => (d.complianceScore || 0) < 60 || !allEvaluations.find(e => e.document_id === d.id))
        .slice(0, 2)
        .map(doc => ({
          document_id: doc.id,
          filename: doc.filename,
          tenderRank: doc.complianceScore || 0,
          evaluationProgress: allEvaluations.find(e => e.document_id === doc.id) ? 100 : 0,
          vendorName: 'Unknown Vendor'
        }));
      setPendingApprovals(pending);

      // Generate monthly trend data (last 12 months)
      const monthlyData: any[] = [];
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const monthDocs = allDocs.filter(d => {
          const docDate = new Date(d.created_at);
          return docDate >= monthStart && docDate <= monthEnd;
        });
        const monthBudget = docsWithAnalysis
          .filter(d => {
            const docDate = new Date(d.created_at);
            return docDate >= monthStart && docDate <= monthEnd;
          })
          .reduce((sum, d) => sum + (d.estimatedValue || 0), 0) / 10000000;

        monthlyData.push({
          month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          tenders: monthDocs.length,
          budget: Math.round(monthBudget * 100) / 100
        });
      }
      setMonthlyTrend(monthlyData);

      // Generate compliance distribution
      const complianceRanges = [
        { range: '90-100', min: 90, max: 100, count: 0 },
        { range: '80-89', min: 80, max: 89, count: 0 },
        { range: '70-79', min: 70, max: 79, count: 0 },
        { range: '<70', min: 0, max: 69, count: 0 }
      ];
      
      docsWithAnalysis.forEach(doc => {
        const score = doc.complianceScore || 0;
        if (score >= 90) complianceRanges[0].count++;
        else if (score >= 80) complianceRanges[1].count++;
        else if (score >= 70) complianceRanges[2].count++;
        else if (score > 0) complianceRanges[3].count++;
      });

      setComplianceDistribution(complianceRanges.map(r => ({
        range: r.range,
        count: r.count
      })));

      // Generate department spend (using document types as departments)
      const departmentMap: Record<string, number> = {};
      docsWithAnalysis.forEach(doc => {
        const dept = doc.document_type || 'Other';
        departmentMap[dept] = (departmentMap[dept] || 0) + (doc.estimatedValue || 0);
      });

      const departmentData = Object.entries(departmentMap).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value: Math.round((value / 10000000) * 100) / 100
      }));

      if (departmentData.length === 0) {
        departmentData.push({ name: 'Tender Value', value: totalBudget });
      }

      setDepartmentSpend(departmentData);

    } catch (error: any) {
      console.error('Dashboard error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container px-4 max-w-7xl">
          {/* Title Section */}
          <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-slate-200/50">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Procurement Dashboard
            </h1>
                <p className="text-slate-600 font-medium">
              bidalert.in
            </p>
              </div>
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg border border-green-200">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">Live Data</span>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Total Tenders */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <TrendingUp className="h-5 w-5 text-blue-600 opacity-50" />
                </div>
                <div className="text-4xl font-bold mb-1 text-slate-800">{dashboardData.totalTenders}</div>
                <div className="text-sm font-semibold text-slate-600 mb-2">Total Tenders</div>
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-blue-200/50">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs font-medium text-slate-600">{dashboardData.activeTenders} Active</span>
                  </div>
                  <span className="text-xs text-slate-400">•</span>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 bg-slate-400 rounded-full"></div>
                    <span className="text-xs font-medium text-slate-600">{dashboardData.inactiveTenders} Inactive</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Bids */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-100/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <TrendingUp className="h-5 w-5 text-green-600 opacity-50" />
                </div>
                <div className="text-4xl font-bold mb-1 text-slate-800">{dashboardData.activeBids}</div>
                <div className="text-sm font-semibold text-slate-600 mb-2">Active Bids</div>
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-green-200/50">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-xs font-medium text-slate-600">{dashboardData.underEvaluation} Under Evaluation</span>
                  </div>
                  <span className="text-xs text-slate-400">•</span>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                    <span className="text-xs font-medium text-slate-600">{dashboardData.underCompliance} Under Compliance</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-amber-100/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <Clock className="h-5 w-5 text-orange-600 opacity-50" />
                </div>
                <div className="text-4xl font-bold mb-1 text-slate-800">{dashboardData.upcomingDeadlines}</div>
                <div className="text-sm font-semibold text-slate-600 mb-2">Upcoming Deadlines</div>
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-orange-200/50">
                  <div className="flex items-center gap-1">
                    <FileText className="h-3 w-3 text-orange-600" />
                    <span className="text-xs font-medium text-slate-600">{dashboardData.upcomingDeadlines} Tenders</span>
                  </div>
                  <span className="text-xs text-slate-400">•</span>
                  <div className="flex items-center gap-1">
                    <BarChart3 className="h-3 w-3 text-orange-600" />
                    <span className="text-xs font-medium text-slate-600">{dashboardData.upcomingEvaluations} Evaluations</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Budget */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-violet-100/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 shadow-lg">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <TrendingUp className="h-5 w-5 text-purple-600 opacity-50" />
                </div>
                <div className="text-4xl font-bold mb-1 text-slate-800">₹{dashboardData.totalBudget.toFixed(2)} Cr</div>
                <div className="text-sm font-semibold text-slate-600 mb-2">Total Budget</div>
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-purple-200/50">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                    <span className="text-xs font-medium text-slate-600">₹{dashboardData.allocatedBudget.toFixed(2)} Cr Allocated</span>
                  </div>
                  <span className="text-xs text-slate-400">•</span>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 bg-slate-400 rounded-full"></div>
                    <span className="text-xs font-medium text-slate-600">₹{dashboardData.remainingBudget.toFixed(2)} Cr Remaining</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Avg Compliance */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-indigo-50 to-blue-100/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div className={`h-3 w-3 rounded-full ${dashboardData.avgCompliance >= 60 ? 'bg-green-500' : dashboardData.avgCompliance >= 40 ? 'bg-yellow-500' : 'bg-red-500'} animate-pulse`}></div>
                </div>
                <div className="text-4xl font-bold mb-1 text-slate-800">{dashboardData.avgCompliance}%</div>
                <div className="text-sm font-semibold text-slate-600 mb-2">Avg Compliance</div>
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-indigo-200/50">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span className="text-xs font-medium text-slate-600">{dashboardData.compliantTenders} Compliant</span>
                  </div>
                  <span className="text-xs text-slate-400">•</span>
                  <div className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 text-red-600" />
                    <span className="text-xs font-medium text-slate-600">{dashboardData.nonCompliantTenders} Non-Compliant</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Evaluations */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-teal-50 to-cyan-100/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <Activity className="h-5 w-5 text-teal-600 opacity-50" />
                </div>
                <div className="text-4xl font-bold mb-1 text-slate-800">{dashboardData.pendingEvaluations}</div>
                <div className="text-sm font-semibold text-slate-600 mb-2">Evaluations</div>
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-teal-200/50">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-orange-600" />
                    <span className="text-xs font-medium text-slate-600">{dashboardData.pendingEvaluations} Pending</span>
                  </div>
                  <span className="text-xs text-slate-400">•</span>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span className="text-xs font-medium text-slate-600">{dashboardData.completedEvaluations} Completed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            <Button asChild className="h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 border-0">
              <Link to="/upload" className="flex items-center justify-center">
                <Upload className="mr-2 h-5 w-5" />
                <span className="font-semibold">Upload</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-14 border-2 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 shadow-sm hover:shadow-md">
              <Link to="/documents" className="flex items-center justify-center">
                <FileText className="mr-2 h-5 w-5" />
                <span className="font-semibold">Documents</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-14 border-2 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 shadow-sm hover:shadow-md">
              <Link to="/evaluation" className="flex items-center justify-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                <span className="font-semibold">Evaluate</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-14 border-2 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 shadow-sm hover:shadow-md">
              <Link to="/compare" className="flex items-center justify-center">
                <GitCompare className="mr-2 h-5 w-5" />
                <span className="font-semibold">Compare</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-14 border-2 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 shadow-sm hover:shadow-md">
              <Link to="/audit" className="flex items-center justify-center">
                <Shield className="mr-2 h-5 w-5" />
                <span className="font-semibold">Audit</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-14 border-2 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 shadow-sm hover:shadow-md">
              <Link to="/draft" className="flex items-center justify-center">
                <Target className="mr-2 h-5 w-5" />
                <span className="font-semibold">Goals</span>
              </Link>
            </Button>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Monthly Trend */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <CardTitle className="text-xl font-bold text-slate-800">Monthly Trend</CardTitle>
                <CardDescription className="text-slate-600">Tenders and budget at a glance over time</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                    <YAxis yAxisId="left" stroke="#64748b" fontSize={12} />
                    <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Legend />
                    <Line 
                      yAxisId="left" 
                      type="monotone" 
                      dataKey="tenders" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', r: 4 }}
                      name="Tenders" 
                    />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="budget" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: '#10b981', r: 4 }}
                      name="Budget (Cr)" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Spend Analysis by Department */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                <CardTitle className="text-xl font-bold text-slate-800">Spend Analysis by Department</CardTitle>
                <CardDescription className="text-slate-600">Budget allocation distribution</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={departmentSpend}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {departmentSpend.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value: any) => `₹${value} Cr`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Compliance Distribution */}
          <Card className="mb-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
              <CardTitle className="text-xl font-bold text-slate-800">Compliance Distribution</CardTitle>
              <CardDescription className="text-slate-600">View item compliance scores across projects</CardDescription>
            </CardHeader>
                <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={complianceDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="range" 
                    stroke="#64748b" 
                    fontSize={12}
                    tick={{ fill: '#64748b' }}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={12}
                    tick={{ fill: '#64748b' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="url(#colorGradient)" 
                    name="Number of Documents"
                    radius={[8, 8, 0, 0]}
                  >
                    {complianceDistribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          entry.range === '90-100' ? '#10b981' :
                          entry.range === '80-89' ? '#3b82f6' :
                          entry.range === '70-79' ? '#f59e0b' :
                          '#ef4444'
                        } 
                      />
                    ))}
                  </Bar>
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Lists Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Active Tenders */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                <CardTitle className="text-xl font-bold text-slate-800">Active Tenders</CardTitle>
                <CardDescription className="text-slate-600">Tender ID, department, budget, and timeline</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {activeTenders.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                      <p className="text-sm text-slate-500">No active tenders</p>
                    </div>
                  ) : (
                    <>
                      {activeTenders.map((tender) => (
                        <div key={tender.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-green-300 hover:bg-green-50/50 transition-all duration-200 group">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                              <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm truncate text-slate-800">{tender.filename}</p>
                              <p className="text-xs text-slate-500 mt-1">{tender.document_type}</p>
                            </div>
                          </div>
                          <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-sm">
                            Active
                          </Badge>
                        </div>
                      ))}
                      <Button asChild variant="outline" className="w-full mt-4 border-2 hover:bg-slate-50 hover:border-slate-300 transition-all">
                        <Link to="/documents" className="flex items-center justify-center">
                          View All ({dashboardData.totalTenders}) <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </>
                  )}
                  </div>
                </CardContent>
              </Card>

            {/* Bid Evaluation Status */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                <CardTitle className="text-xl font-bold text-slate-800">Bid Evaluation Status</CardTitle>
                <CardDescription className="text-slate-600">Tender ranking and evaluation progress</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {evaluationStatus.length === 0 ? (
                    <div className="text-center py-8">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                      <p className="text-sm text-slate-500">No evaluations in progress</p>
                    </div>
                  ) : (
                    <>
                      {evaluationStatus.map((evalItem) => (
                        <div key={evalItem.document_id} className="p-4 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all duration-200">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 rounded-lg bg-purple-100">
                              <FileText className="h-4 w-4 text-purple-600" />
                            </div>
                            <p className="font-semibold text-sm text-slate-800">{evalItem.vendorName || 'Unknown Vendor'}</p>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-xs mb-2">
                                <span className="font-medium text-slate-600">Tender Rank</span>
                                <span className="font-bold text-slate-800">{evalItem.tenderRank}/100</span>
                              </div>
                              <Progress value={evalItem.tenderRank} className="h-2.5 bg-slate-100" />
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-2">
                                <span className="font-medium text-slate-600">Evaluation</span>
                                <span className="font-bold text-slate-800">{evalItem.evaluationProgress}/100</span>
                              </div>
                              <Progress value={evalItem.evaluationProgress} className="h-2.5 bg-slate-100" />
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button asChild variant="outline" className="w-full mt-4 border-2 hover:bg-slate-50 hover:border-slate-300 transition-all">
                        <Link to="/evaluation" className="flex items-center justify-center">
                          View All ({dashboardData.pendingEvaluations + dashboardData.completedEvaluations}) <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Documents & Pending Approvals */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Recent Documents */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <CardTitle className="text-xl font-bold text-slate-800">Recent Documents</CardTitle>
                <CardDescription className="text-slate-600">Latest uploaded and analyzed documents</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                {recentDocuments.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                      <p className="text-sm text-slate-500">No recent documents</p>
                  </div>
                ) : (
                    recentDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 group">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                            <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate text-slate-800">{doc.filename}</p>
                            <p className="text-xs text-slate-500 mt-1">
                              {new Date(doc.created_at).toLocaleDateString('en-IN', { 
                                day: 'numeric', 
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {doc.complianceScore !== undefined && (
                            <Badge 
                              variant="outline" 
                              className={`font-bold ${
                                doc.complianceScore >= 80 ? 'border-green-500 text-green-700 bg-green-50' :
                                doc.complianceScore >= 60 ? 'border-yellow-500 text-yellow-700 bg-yellow-50' :
                                'border-red-500 text-red-700 bg-red-50'
                              }`}
                            >
                              {doc.complianceScore}%
                            </Badge>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => navigate(`/documents`)}
                            className="border-2 hover:bg-blue-50 hover:border-blue-300"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                  </div>
              </CardContent>
            </Card>

            {/* Pending Approvals */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b">
                <CardTitle className="text-xl font-bold text-slate-800">Pending Approvals</CardTitle>
                <CardDescription className="text-slate-600">Items requiring your immediate attention</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {pendingApprovals.length === 0 ? (
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <div className="p-2 rounded-lg bg-green-100">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <p className="text-sm font-semibold text-green-900">All items approved</p>
                    </div>
                  ) : (
                    <>
                      {pendingApprovals.map((approval) => (
                        <div key={approval.document_id} className="p-4 rounded-xl border-2 border-orange-300 bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 transition-all duration-200">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 rounded-lg bg-orange-100">
                              <AlertTriangle className="h-4 w-4 text-orange-600" />
                            </div>
                            <p className="font-semibold text-sm text-slate-800">{approval.vendorName || 'Unknown Vendor'}</p>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-xs mb-2">
                                <span className="font-medium text-slate-600">Tender Rank</span>
                                <span className="font-bold text-slate-800">{approval.tenderRank}/100</span>
                              </div>
                              <Progress value={approval.tenderRank} className="h-2.5 bg-orange-100" />
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-2">
                                <span className="font-medium text-slate-600">Evaluation</span>
                                <span className="font-bold text-slate-800">{approval.evaluationProgress}/100</span>
                              </div>
                              <Progress value={approval.evaluationProgress} className="h-2.5 bg-orange-100" />
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button asChild variant="outline" className="w-full mt-4 border-2 border-orange-300 hover:bg-orange-50 hover:border-orange-400 transition-all">
                        <Link to="/evaluation" className="flex items-center justify-center">
                          View All ({pendingApprovals.length}) <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
                
          {/* Budget Status */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
            <CardHeader className="bg-white/50 border-b">
              <CardTitle className="text-xl font-bold text-slate-800">Budget Status</CardTitle>
              <CardDescription className="text-slate-600">Spend vs allocated budget breakdown</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-purple-200 shadow-sm">
                    <p className="text-sm font-medium text-slate-600 mb-2">Total Allocation</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                      ₹{dashboardData.totalBudget.toFixed(2)} Cr
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-blue-200 shadow-sm">
                    <p className="text-sm font-medium text-slate-600 mb-2">Estimated Spend</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      ₹{dashboardData.allocatedBudget.toFixed(2)} Cr
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-green-200 shadow-sm">
                    <p className="text-sm font-medium text-slate-600 mb-2">Remaining</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {dashboardData.totalBudget > 0 
                        ? ((dashboardData.remainingBudget / dashboardData.totalBudget) * 100).toFixed(1)
                        : 0}%
                    </p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-700">Budget Utilization</span>
                    <span className="text-sm font-bold text-slate-800">
                      {dashboardData.totalBudget > 0 
                        ? ((dashboardData.allocatedBudget / dashboardData.totalBudget) * 100).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                  <Progress 
                    value={dashboardData.totalBudget > 0 
                      ? (dashboardData.allocatedBudget / dashboardData.totalBudget) * 100 
                      : 0} 
                    className="h-4 bg-slate-100" 
                  />
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

export default Dashboard;
