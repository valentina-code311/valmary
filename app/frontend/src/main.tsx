import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/shared/ui/sonner'
import { AuthProvider } from '@/shared/providers/auth-context'
import NotFoundPage from '@/shared/pages/not-found-page'
import HomePage from '@/features/home/pages/home-page'
import OurLovePage from '@/features/our-love/pages/our-love-page'
import CeremonyPage from '@/features/ceremony/pages/ceremony-page'
import BestWishesPage from '@/features/wishes/pages/best-wishes-page'
import ChallengePage from '@/features/challenge/pages/challenge-page'
import AuthPage from '@/features/auth/pages/auth-page'
import AdminLayout from '@/features/admin/components/admin-layout'
import AdminDashboardPage from '@/features/admin/pages/dashboard-page'
import AdminChallengesPage from '@/features/admin/pages/challenges-page'
import AdminContentPage from '@/features/admin/pages/content-page'
import AdminSettingsPage from '@/features/admin/pages/settings-page'
import AdminWishesPage from '@/features/admin/pages/wishes-page'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/our_love" element={<OurLovePage />} />
          <Route path="/ceremony" element={<CeremonyPage />} />
          <Route path="/best_wishes" element={<BestWishesPage />} />
          <Route path="/challenge" element={<ChallengePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="challenges" element={<AdminChallengesPage />} />
            <Route path="content" element={<AdminContentPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="wishes" element={<AdminWishesPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </AuthProvider>
  </StrictMode>
)
