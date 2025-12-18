import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import Upload from "./pages/Upload";
import Evaluation from "./pages/Evaluation";
import Audit from "./pages/Audit";
import Draft from "./pages/Draft";
import Compare from "./pages/Compare";
import NotFound from "./pages/NotFound";
import TestDatabase from "./TestDatabase";
import TestLogin from "./TestLogin";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/evaluation" element={<Evaluation />} />
          <Route path="/audit" element={<Audit />} />
          <Route path="/draft" element={<Draft />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/test-database" element={<TestDatabase />} />
          <Route path="/test-login" element={<TestLogin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
