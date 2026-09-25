import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Lazy loading das páginas para otimização de performance e code splitting PWA
const Home = lazy(() => import('../pages/Home').then(m => ({ default: m.Home })));
const Login = lazy(() => import('../pages/Login').then(m => ({ default: m.Login })));
const MapPage = lazy(() => import('../pages/MapPage').then(m => ({ default: m.MapPage })));
const LessonPage = lazy(() => import('../pages/LessonPage').then(m => ({ default: m.LessonPage })));
const GamePage = lazy(() => import('../pages/GamePage').then(m => ({ default: m.GamePage })));
const RankingPage = lazy(() => import('../pages/RankingPage').then(m => ({ default: m.RankingPage })));
const TeacherDashboard = lazy(() => import('../pages/TeacherDashboard').then(m => ({ default: m.TeacherDashboard })));
const ProfilePage = lazy(() => import('../pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const LegoPage = lazy(() => import('../pages/LegoPage').then(m => ({ default: m.LegoPage })));

const PageLoader: React.FC = () => (
  <div className="min-h-[60vh] flex items-center justify-center font-display">
    <div className="flex flex-col items-center gap-3">
      <div className="w-12 h-12 border-4 border-robo-blue border-t-transparent rounded-full animate-spin" />
      <p className="font-extrabold text-slate-600 text-sm">Carregando conteúdo...</p>
    </div>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<MainLayout />}>
          {/* Rotas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Rotas do Aluno */}
          <Route
            path="/map"
            element={
              <ProtectedRoute allowedRoles={['student', 'super_admin']}>
                <MapPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/lesson/:lessonId"
            element={
              <ProtectedRoute allowedRoles={['student', 'super_admin']}>
                <LessonPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/game/:gameType"
            element={
              <ProtectedRoute allowedRoles={['student', 'super_admin']}>
                <GamePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/lego"
            element={
              <ProtectedRoute allowedRoles={['student', 'super_admin']}>
                <LegoPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ranking"
            element={
              <ProtectedRoute>
                <RankingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Rotas do Professor */}
          <Route
            path="/teacher"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'school_admin', 'super_admin']}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
