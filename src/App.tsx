import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import Layout from "./components/Layout";
import Progress from "./pages/Progress";
import DailyActivities from "./pages/DailyActivities";
import Boxing from "./pages/Boxing";
import Gym from "./pages/Gym";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Oud from "./pages/Oud";
import Spanish from "./pages/Spanish";
import German from "./pages/German";
import ActivityTemplate from "./pages/ActivityTemplate";
import BoxingTemplatePage from "./pages/templates/BoxingTemplatePage";
import GymTemplatePage from "./pages/templates/GymTemplatePage";
import MusicTemplatePage from "./pages/templates/MusicTemplatePage";
import LanguageTemplatePage from "./pages/templates/LanguageTemplatePage";
import { useActivityStore } from "./lib/activityStore";
import Debug from "./pages/Debug";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import { useDataSync } from "./hooks/useDataSync";

function CustomActivityRoute() {
  const { slug } = useParams();
  const entry = useActivityStore((s) => (slug ? s.customActivities[slug] : undefined));
  if (!slug || !entry) return <NotFound />;
  const template = entry.template || 'none';
  if (template === 'boxing') return <BoxingTemplatePage slug={slug} name={entry.name} />;
  if (template === 'gym') return <GymTemplatePage slug={slug} name={entry.name} />;
  if (template === 'music') return <MusicTemplatePage slug={slug} name={entry.name} />;
  if (template === 'language') return <LanguageTemplatePage slug={slug} name={entry.name} />;
  return <ActivityTemplate slug={slug} name={entry.name} />;
}

const queryClient = new QueryClient();

function Guard({ hiddenKey, children }: { hiddenKey: 'boxing'|'gym'|'oud'|'spanish'|'german'; children: JSX.Element }) {
  const isHidden = useActivityStore((s) => !!s.hiddenActivities[hiddenKey]);
  if (isHidden) return <NotFound />;
  return children;
}

// Component that requires authentication
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Data sync wrapper component
function DataSyncWrapper({ children }: { children: React.ReactNode }) {
  useDataSync(); // This will handle syncing data to backend
  return <>{children}</>;
}

function AppContent() {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      {/* Login route */}
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
      } />
      
      {/* Admin dashboard - separate from main app, no Layout */}
      <Route path="/admin" element={<AdminDashboard />} />
      
      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Dashboard and app routes - all protected */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DataSyncWrapper>
            <Layout>
              <Progress />
            </Layout>
          </DataSyncWrapper>
        </ProtectedRoute>
      } />
      
      <Route path="/daily-activities" element={
        <ProtectedRoute>
          <DataSyncWrapper>
            <Layout>
              <DailyActivities />
            </Layout>
          </DataSyncWrapper>
        </ProtectedRoute>
      } />
      
      <Route path="/boxing" element={
        <ProtectedRoute>
          <DataSyncWrapper>
            <Layout>
              <Guard hiddenKey="boxing"><Boxing /></Guard>
            </Layout>
          </DataSyncWrapper>
        </ProtectedRoute>
      } />
      
      <Route path="/gym" element={
        <ProtectedRoute>
          <DataSyncWrapper>
            <Layout>
              <Guard hiddenKey="gym"><Gym /></Guard>
            </Layout>
          </DataSyncWrapper>
        </ProtectedRoute>
      } />
      
      <Route path="/oud" element={
        <ProtectedRoute>
          <DataSyncWrapper>
            <Layout>
              <Guard hiddenKey="oud"><Oud /></Guard>
            </Layout>
          </DataSyncWrapper>
        </ProtectedRoute>
      } />
      
      <Route path="/spanish" element={
        <ProtectedRoute>
          <DataSyncWrapper>
            <Layout>
              <Guard hiddenKey="spanish"><Spanish /></Guard>
            </Layout>
          </DataSyncWrapper>
        </ProtectedRoute>
      } />
      
      <Route path="/german" element={
        <ProtectedRoute>
          <DataSyncWrapper>
            <Layout>
              <Guard hiddenKey="german"><German /></Guard>
            </Layout>
          </DataSyncWrapper>
        </ProtectedRoute>
      } />
      
      <Route path="/activity/:slug" element={
        <ProtectedRoute>
          <DataSyncWrapper>
            <Layout>
              <CustomActivityRoute />
            </Layout>
          </DataSyncWrapper>
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute>
          <DataSyncWrapper>
            <Layout>
              <Settings />
            </Layout>
          </DataSyncWrapper>
        </ProtectedRoute>
      } />
      
      <Route path="/debug" element={
        <ProtectedRoute>
          <DataSyncWrapper>
            <Layout>
              <Debug />
            </Layout>
          </DataSyncWrapper>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
