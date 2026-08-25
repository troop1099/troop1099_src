import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { AdminProvider } from '@/lib/AdminContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

import SiteLayout from './components/layout/SiteLayout';
import Home from './pages/Home';
import Adventures from './pages/Adventures';
import Events from './pages/Events';
import Advancement from './pages/Advancement';
import About from './pages/About';
import Contact from './pages/Contact';
import EaglesNest from './pages/EaglesNest';
import Leadership from './pages/Leadership';
import MeritBadges from './pages/MeritBadges';
import Gear from './pages/Gear';
import NewScoutInfo from './pages/NewScoutInfo';
import TroopGuidelines from './pages/TroopGuidelines';
import LifeToEagle from './pages/LifeToEagle';
import PhotoGallery from './pages/PhotoGallery';
import Pinestraw from './pages/Pinestraw';
import Dues from './pages/Dues';
import GearCheckout from './pages/GearCheckout';
import Announcements from './pages/Announcements';

import LeaderTraining from './pages/LeaderTraining';
import ForParents from './pages/ForParents';
import OutingPrep from './pages/OutingPrep';
import PLCRoles from './pages/PLCRoles';
import TroopPolicies from './pages/TroopPolicies';
import SummerCamp from './pages/SummerCamp';
import CampingChecklist from './pages/CampingChecklist';
import OutingManager from './pages/OutingManager';
import SubmitReimbursement from './pages/SubmitReimbursement';
import AdminReimbursement from './pages/AdminReimbursement';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#1a2744]/30 border-t-[#1a2744] rounded-full animate-spin" />
          <span className="text-xs tracking-widest text-gray-500">Loading</span>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') return <UserNotRegisteredError />;
    else if (authError.type === 'auth_required') { navigateToLogin(); return null; }
  }

  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/adventures" element={<Adventures />} />
        <Route path="/events" element={<Events />} />
        <Route path="/advancement" element={<Advancement />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/eagles" element={<EaglesNest />} />
        <Route path="/leadership" element={<Leadership />} />
        <Route path="/merit-badges" element={<MeritBadges />} />
        <Route path="/gear" element={<Gear />} />
        <Route path="/new-scout" element={<NewScoutInfo />} />
        <Route path="/guidelines" element={<TroopGuidelines />} />
        <Route path="/life-to-eagle" element={<LifeToEagle />} />
        <Route path="/photos" element={<PhotoGallery />} />
        <Route path="/pinestraw" element={<Pinestraw />} />
        <Route path="/dues" element={<Dues />} />
        <Route path="/gear-checkout" element={<GearCheckout />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/leader-training" element={<LeaderTraining />} />
        <Route path="/for-parents" element={<ForParents />} />
        <Route path="/outing-prep" element={<OutingPrep />} />
        <Route path="/plc-roles" element={<PLCRoles />} />
        <Route path="/policies" element={<TroopPolicies />} />
        <Route path="/summer-camp" element={<SummerCamp />} />
        <Route path="/camping-checklist" element={<CampingChecklist />} />
        <Route path="/outing-manager" element={<OutingManager />} />
        <Route path="/submit-reimbursement" element={<SubmitReimbursement />} />
        <Route path="/admin-reimbursement" element={<AdminReimbursement />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <AdminProvider>
          <Router>
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </AdminProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App