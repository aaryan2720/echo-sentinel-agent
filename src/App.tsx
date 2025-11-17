import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Agents from "./pages/Agents";
import Network from "./pages/Network";
import Incidents from "./pages/Incidents";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import DatabaseTest from "./pages/DatabaseTest";
import AgentTest from "./pages/AgentTest";
import VisualAgentTest from "./pages/VisualAgentTest";
import URLAnalysisPage from "./pages/URLAnalysisPage";
import SystemStatus from "./pages/SystemStatus";
import InstagramMonitoring from "./pages/InstagramMonitoring";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/network" element={<Network />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/db-test" element={<DatabaseTest />} />
          <Route path="/agent-test" element={<AgentTest />} />
          <Route path="/visual-test" element={<VisualAgentTest />} />
          <Route path="/url-analysis" element={<URLAnalysisPage />} />
          <Route path="/system-status" element={<SystemStatus />} />
          <Route path="/instagram-monitoring" element={<InstagramMonitoring />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
