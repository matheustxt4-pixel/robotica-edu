import React from 'react';
import { Navbar } from '../components/ui/Navbar';
import { StudentSidebar } from '../components/layout/StudentSidebar';
import { StudentRightPanel } from '../components/layout/StudentRightPanel';
import { StudentBottomNav } from '../components/layout/StudentBottomNav';
import { useAuth } from '../context/AuthContext';
import { Outlet, useLocation } from 'react-router-dom';

export const MainLayout: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isStudent = user && (user.role === 'student' || user.role === 'super_admin');
  const isLegoPage = location.pathname.startsWith('/lego');
  const isGamePage = location.pathname.startsWith('/game');

  const hideRightPanel = isLegoPage || isGamePage;

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-800 font-display">
      <Navbar />

      {isStudent ? (
        /* LAYOUT GAMIFICADO DO ALUNO (3 COLUNAS NO DESKTOP + BARRA INFERIOR NO CELULAR) */
        <div className="flex-1 max-w-7xl w-full mx-auto p-3 md:p-6 pb-24 md:pb-12 flex gap-6 items-start justify-center">
          <StudentSidebar />

          <main className={`flex-1 w-full min-w-0 ${hideRightPanel ? 'max-w-6xl' : 'max-w-3xl'}`}>
            <Outlet />
          </main>

          {!hideRightPanel && <StudentRightPanel />}

          <StudentBottomNav />
        </div>
      ) : (
        /* LAYOUT PADRÃO PARA PROFESSORES E PÁGINAS PÚBLICAS */
        <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 pb-12">
          <Outlet />
        </main>
      )}
    </div>
  );
};

