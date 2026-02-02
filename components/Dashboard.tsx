
import React, { useState } from 'react';
import { MFEConfig } from '../types';

interface DashboardProps {
  userEmail: string;
  userName: string;
  userGender: 'M' | 'F';
  userRole: string;
  onLogout: () => void;
}

interface AppTileProps {
  title: string;
  icon: React.ReactNode;
  bgColor: string;
  onClick?: () => void;
  isNew?: boolean;
}

const AppTile: React.FC<AppTileProps> = ({ title, icon, bgColor, onClick, isNew }) => {
  if (isNew) {
    return (
      <button
        onClick={onClick}
        className="group relative flex flex-col items-center justify-center gap-4 w-full aspect-square border-2 border-dashed border-slate-200 rounded-[2.5rem] hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-300 active:scale-95"
      >
        <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 group-hover:text-blue-400 group-hover:border-blue-300 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
        </div>
        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] group-hover:text-blue-400 transition-colors">
          Novo App
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center justify-center gap-6 w-full aspect-square bg-white rounded-[2.5rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 active:scale-95"
    >
      <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[1.8rem] ${bgColor} flex items-center justify-center text-white shadow-lg shadow-inherit group-hover:scale-110 transition-transform duration-300`}>
        <div className="w-8 h-8 md:w-10 md:h-10">
          {icon}
        </div>
      </div>
      <span className="text-[10px] md:text-[11px] font-black text-slate-700 uppercase tracking-widest text-center px-4 leading-tight">
        {title}
      </span>
    </button>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ userEmail, userName, userGender, userRole, onLogout }) => {
  const [activeApp, setActiveApp] = useState<MFEConfig | null>(null);
  const [isLoadingApp, setIsLoadingApp] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAltHeader, setIsAltHeader] = useState(false);

  const apps: MFEConfig[] = [
    {
      id: 'academico',
      title: "Painel Acadêmico",
      bgColor: "bg-[#8b5cf6]",
      url: "https://mfe-academico.tarsila.edu.br",
      icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    },
    {
      id: 'carometro-alunos',
      title: "Carometro dos Alunos",
      bgColor: "bg-[#2563eb]",
      url: "http://localhost:3001",
      icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
    },
    {
      id: 'carometro-funcionarios',
      title: "Carometro Funcionários",
      bgColor: "bg-[#3b82f6]",
      url: "https://mfe-carometro-funcionarios.tarsila.edu.br",
      icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
    },
    {
      id: 'almoxarifado-pedagogico',
      title: "Almoxarifado Pedagógico",
      bgColor: "bg-[#f59e0b]",
      url: "https://mfe-estoque-pedagogico.tarsila.edu.br",
      icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
    },
    {
      id: 'tarefas',
      title: "Tarefas",
      bgColor: "bg-[#10b981]",
      url: "https://mfe-tarefas.tarsila.edu.br",
      icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
    },
  ];

  const handleOpenApp = (app: MFEConfig) => {
    setIsSettingsOpen(false);
    setIsLoadingApp(true);
    setTimeout(() => {
      setActiveApp(app);
      setIsLoadingApp(false);
    }, 800);
  };

  const handleCloseApp = () => {
    setActiveApp(null);
    setIsSettingsOpen(false);
  };

  const handleOpenSettings = () => {
    setActiveApp(null);
    setIsSettingsOpen(true);
  };

  const greeting = userGender === 'F' ? 'SEJA BEM-VINDA' : 'SEJA BEM-VINDO';

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <header className={`${isAltHeader ? 'bg-white border-b border-slate-200' : 'bg-[#3b5998] shadow-lg'} px-4 md:px-12 py-3 md:py-5 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4 z-50 transition-all duration-500`}>
        <div className="flex flex-col md:flex-row items-center gap-1 md:gap-8 w-full md:w-auto">
          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            <button
              onClick={handleCloseApp}
              className={`transition-all flex items-center gap-2 ${(activeApp || isSettingsOpen) ? 'opacity-100' : 'opacity-0 pointer-events-none w-0 overflow-hidden'}`}
            >
              <div className={`w-8 h-8 rounded-full ${isAltHeader ? 'bg-[#3b5998]/10 text-[#3b5998] hover:bg-[#3b5998]/20' : 'bg-white/20 text-white hover:bg-white/40'} flex items-center justify-center transition-colors`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </div>
            </button>
            <h1
              className={`${isAltHeader ? 'text-[#3b5998]' : 'text-white'} font-black text-xs sm:text-sm md:text-lg uppercase tracking-[0.1em] md:tracking-[0.2em] cursor-pointer truncate transition-colors`}
              onClick={handleCloseApp}
            >
              PORTAL EMEF TARSILA DO AMARAL
            </h1>
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setIsAltHeader(!isAltHeader)}
                className={`p-1.5 rounded-lg transition-all ${isAltHeader ? 'text-[#3b5998] hover:bg-[#3b5998]/10' : 'text-white hover:bg-white/10'}`}
                title="Trocar tema"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
              </button>
              <button onClick={handleOpenSettings} className={`p-1.5 rounded-lg transition-all ${isSettingsOpen ? (isAltHeader ? 'bg-[#3b5998] text-white shadow-md' : 'bg-white text-[#3b5998] shadow-md') : (isAltHeader ? 'text-[#3b5998] hover:bg-[#3b5998]/10' : 'text-white hover:bg-white/10')}`}>
                <svg className={`w-4 h-4 ${isSettingsOpen ? 'animate-spin-slow' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </button>
              <button onClick={onLogout} className={`p-1.5 rounded-lg border transition-all active:scale-95 ${isAltHeader ? 'text-[#3b5998] border-[#3b5998]/30 hover:bg-[#3b5998] hover:text-white' : 'text-white border-white/30 hover:bg-white hover:text-[#3b5998]'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
            </div>
          </div>
          <div className={`hidden md:block w-px h-6 transition-colors ${isAltHeader ? 'bg-[#3b5998]/20' : 'bg-white/20'}`}></div>
          <span className={`font-bold text-[10px] sm:text-xs md:text-base uppercase tracking-widest whitespace-nowrap opacity-80 md:opacity-100 transition-colors ${isAltHeader ? 'text-[#3b5998]/90' : 'text-white/90'}`}>
            {greeting}, <span className={isAltHeader ? 'text-[#3b5998]' : 'text-white'}>{userName}</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-4 md:gap-6">
          <span className={`hidden sm:block text-[10px] font-bold uppercase tracking-widest transition-colors ${isAltHeader ? 'text-[#3b5998]/60' : 'text-white/60'}`}>{userEmail}</span>

          <button
            onClick={() => setIsAltHeader(!isAltHeader)}
            className={`p-2 rounded-lg transition-all ${isAltHeader ? 'text-[#3b5998] hover:bg-[#3b5998]/10' : 'text-white hover:bg-white/10'}`}
            title="Trocar tema do cabeçalho"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
          </button>

          <button onClick={handleOpenSettings} className={`p-2 rounded-lg transition-all ${isSettingsOpen ? (isAltHeader ? 'bg-[#3b5998] text-white shadow-md' : 'bg-white text-[#3b5998] shadow-md') : (isAltHeader ? 'text-[#3b5998] hover:bg-[#3b5998]/10' : 'text-white hover:bg-white/10')}`}>
            <svg className={`w-5 h-5 ${isSettingsOpen ? 'animate-spin-slow' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </button>
          <button onClick={onLogout} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all active:scale-95 border ${isAltHeader ? 'text-[#3b5998] border-[#3b5998]/30 hover:bg-[#3b5998] hover:text-white' : 'text-white border-white/30 hover:bg-white hover:text-[#3b5998]'}`}>
            Sair <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden">
        {/* Loading Overlay */}
        {isLoadingApp && (
          <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-sm flex flex-col items-center justify-center z-40 animate-fade-in">
            <div className="w-16 h-16 border-4 border-[#3b5998] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[10px] font-black text-[#3b5998] uppercase tracking-[0.3em]">Abrindo Aplicativo...</p>
          </div>
        )}

        {/* Dashboard View */}
        {!activeApp && !isLoadingApp && !isSettingsOpen && (
          <div className="max-w-7xl mx-auto w-full px-8 md:px-16 py-16 animate-fade-in-tiles">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {apps.map((app) => (
                <AppTile key={app.id} title={app.title} icon={app.icon} bgColor={app.bgColor} onClick={() => handleOpenApp(app)} />
              ))}
              <AppTile title="Novo App" bgColor="" icon={null} isNew={true} onClick={() => alert("Gerenciador de MFE")} />
            </div>
          </div>
        )}

        {/* User Settings */}
        {isSettingsOpen && (
          <div className="absolute inset-0 bg-slate-50 overflow-auto animate-mfe-enter">
            <div className="max-w-3xl mx-auto px-6 py-12">
              <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100 p-12">
                <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-4">{userName}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">E-mail</label>
                    <div className="bg-slate-50 p-4 rounded-2xl font-bold">{userEmail}</div>
                  </div>
                </div>
                <button onClick={handleCloseApp} className="mt-8 text-[#3b5998] font-black text-[10px] uppercase tracking-widest">Voltar</button>
              </div>
            </div>
          </div>
        )}

        {/* MFE View */}
        {activeApp && (
          <div className={`absolute inset-0 animate-mfe-enter flex flex-col ${activeApp.id === 'carometro-alunos' ? 'p-0 bg-white' : 'p-1 md:p-8 bg-white'}`}>
            <div className={`flex-1 w-full h-full border-none overflow-hidden ${activeApp.id === 'carometro-alunos' ? 'bg-white' : 'bg-slate-50'}`}>
              <iframe
                src={
                  activeApp.id === 'carometro-alunos'
                    ? `${import.meta.env.VITE_CAROMETRO_URL || activeApp.url}/#/?user_name=${encodeURIComponent(userName)}&user_role=${encodeURIComponent(userRole)}&prod=true`
                    : `${activeApp.url}?user=${encodeURIComponent(userName)}&email=${encodeURIComponent(userEmail)}`
                }
                title={activeApp.title}
                style={
                  activeApp.id === 'carometro-alunos'
                    ? { width: '100%', height: '100%', border: 'none', borderRadius: '0' }
                    : { width: '100%', height: '100%', border: 'none' }
                }
                className={activeApp.id !== 'carometro-alunos' ? "w-full h-full border-none" : "w-full h-full border-none mx-auto block"}
                onLoad={() => setIsLoadingApp(false)}
              />
            </div>
          </div>
        )}
      </main>

      <footer className="py-6 text-center border-t border-slate-100 bg-white">
        <p className="text-[9px] text-slate-300 font-bold uppercase tracking-[0.4em]">
          &copy; 2024 EMEF Tarsila do Amaral • Shell de Micro Front-Ends v2.4
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
