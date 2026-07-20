import React, { useState, useEffect } from 'react';
import { MFEConfig } from '../types';
import { createMFEMessageListener } from '../postMessageUtils';

interface DashboardProps {
  userId: string;
  userEmail: string;
  userName: string;
  userGender: 'M' | 'F';
  userRole: string;
  onLogout: () => void;
}

interface AppTileProps {
  title: string;
  icon: React.ReactNode;
  iconColor: string;
  onClick?: () => void;
  isNew?: boolean;
}

const AppTile: React.FC<AppTileProps> = ({ title, icon, iconColor, onClick, isNew }) => {
  if (isNew) {
    return (
      <button
        onClick={onClick}
        className="group relative flex flex-col items-center justify-center gap-6 w-full aspect-square md:w-72 md:h-72 backdrop-blur-md bg-white/5 border-2 border-white/20 rounded-[2rem] hover:bg-white/10 hover:border-white/40 transition-all duration-300 active:scale-95 shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
      >
        <div className="text-white/50 group-hover:text-white/80 transition-colors">
          <svg className="w-16 h-16 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <span className="text-[12px] font-bold text-white uppercase tracking-widest text-center mt-2 group-hover:text-white transition-colors">
          {title}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center justify-center gap-8 w-full aspect-square md:w-72 md:h-72 backdrop-blur-md bg-white/10 border border-white/20 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:-translate-y-2 active:scale-95 relative overflow-hidden"
    >
      <div className={`absolute inset-0 opacity-10 ${iconColor} group-hover:opacity-20 transition-opacity`}></div>
      <div className={`relative z-10 w-28 h-28 flex items-center justify-center text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <span className="relative z-10 text-[12px] md:text-[14px] font-bold text-white uppercase tracking-[0.1em] text-center px-4 leading-tight drop-shadow-md">
        {title}
      </span>
    </button>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ userId, userEmail, userName, userGender, userRole, onLogout }) => {
  const [activeApp, setActiveApp] = useState<MFEConfig | null>(null);
  const [isLoadingApp, setIsLoadingApp] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [screenMode, setScreenMode] = useState<'desktop' | 'tablet' | 'smartphone'>('desktop');
  const [isScreenMenuOpen, setIsScreenMenuOpen] = useState(false);
  const [bgOpacity, setBgOpacity] = useState(40);

  const apps: MFEConfig[] = [
    {
      id: 'academico',
      title: "Painel Acadêmico",
      bgColor: "bg-[#8b5cf6]",
      url: import.meta.env.VITE_ACADEMICO_URL || "https://mfe-academico.tarsila.edu.br",
      icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    },
    {
      id: 'carometro-alunos',
      title: "Carômetro dos Alunos",
      bgColor: "bg-[#2563eb]",
      url: "https://carometro-alunos-v2.vercel.app",
      icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
    },
    {
      id: 'almoxarifado-pedagogico',
      title: "Almoxarifado Pedagógico",
      bgColor: "bg-[#f59e0b]",
      url: import.meta.env.VITE_ALMOXARIFADO_URL || "https://mfe-estoque-pedagogico.tarsila.edu.br",
      icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
    },
    {
      id: 'tarefas',
      title: "Tarefas",
      bgColor: "bg-[#10b981]",
      url: import.meta.env.VITE_TAREFAS_URL || "https://mfe-tarefas.tarsila.edu.br",
      icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
    },
  ];

  useEffect(() => {
    const messageListener = createMFEMessageListener(
      () => {
        setIsLoadingApp(false);
      },
      (error) => {
        console.error('[Portal] MFE authentication failed:', error);
        setIsLoadingApp(false);
      },
      () => {
        // Ready
      }
    );

    const carometroListener = (event: MessageEvent) => {
      const CAROMETRO_URL = "https://carometro-alunos-v2.vercel.app";
      if (event.origin !== CAROMETRO_URL) return;

      if (event.data?.type === 'CAROMETRO_READY') {
        const frame = document.getElementById('carometro-frame') as HTMLIFrameElement;
        if (frame && frame.contentWindow) {
          frame.contentWindow.postMessage({
            type: 'AUTH_USER',
            payload: {
              id_func: userId,
              nome_func: userName,
              email_func: userEmail,
              tipo_usuario: userRole
            }
          }, CAROMETRO_URL);
        }
      }
    };

    window.addEventListener('message', messageListener);
    window.addEventListener('message', carometroListener);

    return () => {
      window.removeEventListener('message', messageListener);
      window.removeEventListener('message', carometroListener);
    };
  }, [userId, userName, userEmail, userRole]);

  const handleOpenApp = (app: MFEConfig) => {
    setIsSettingsOpen(false);
    setIsLoadingApp(true);
    setActiveApp(app);
  };

  const handleCloseApp = () => {
    setActiveApp(null);
    setIsSettingsOpen(false);
    setScreenMode('desktop');
    setIsScreenMenuOpen(false);
  };

  const handleOpenSettings = () => {
    if (isSettingsOpen) {
      handleCloseApp();
    } else {
      setActiveApp(null);
      setIsSettingsOpen(true);
    }
  };

  const greeting = userGender === 'F' ? 'SEJA BEM-VINDA' : 'SEJA BEM-VINDO';

  const getAppUrl = (app: MFEConfig) => {
    if (app.id === 'carometro-alunos') {
      return `${app.url}/?user_name=${encodeURIComponent(userName)}&user_role=${encodeURIComponent(userRole)}&prod=true`;
    }
    return `${app.url}?user=${encodeURIComponent(userName)}&email=${encodeURIComponent(userEmail)}`;
  };

  const handleIframeLoad = () => {
    setIsLoadingApp(false);
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-slate-900 overflow-hidden font-sans">
      {/* Imagem de Fundo (Fachada) com sobreposição */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: "url('/fachada.png')" }}
      >
        <div 
          className="absolute inset-0 backdrop-blur-[2px] transition-colors duration-200"
          style={{ backgroundColor: `rgba(0, 0, 0, ${bgOpacity / 100})` }}
        ></div>
      </div>

      <header className="relative z-50 px-6 md:px-12 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            {activeApp && (
              <button
                onClick={handleCloseApp}
                className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/40 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </button>
            )}
            <h1 className="text-white font-black text-sm md:text-xl uppercase tracking-widest drop-shadow-md">
              PORTAL EMEF TARSILA DO AMARAL
            </h1>
          </div>
          <span className="text-white/80 font-bold text-[10px] md:text-xs uppercase tracking-widest pl-0 md:pl-11 drop-shadow-md">
            {greeting}, <span className="text-white">{userName}</span>
          </span>
        </div>

        <div className="flex items-center gap-4 md:gap-6 self-end md:self-auto">
          <div className="hidden lg:flex items-center gap-2 mr-4 bg-black/20 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
            <span className="text-[9px] text-white/70 font-bold uppercase tracking-widest">Fundo:</span>
            <input 
              type="range" 
              min="0" max="100" 
              value={bgOpacity} 
              onChange={(e) => setBgOpacity(Number(e.target.value))}
              className="w-24 accent-white cursor-pointer"
            />
            <span className="text-[9px] text-white font-bold w-6 text-right">{bgOpacity}%</span>
          </div>

          <span className="hidden sm:block text-[10px] md:text-xs font-bold text-white/80 uppercase tracking-widest drop-shadow-md">
            {userEmail}
          </span>

          <button onClick={handleOpenSettings} className="p-2 text-white/80 hover:text-white transition-colors">
            <svg className="w-5 h-5 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </button>
          
          <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/30 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors backdrop-blur-sm">
            SAIR <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      </header>

      <main className={`flex-1 relative z-10 flex flex-col items-center p-4 ${(!activeApp && !isLoadingApp && !isSettingsOpen) ? 'justify-center' : 'justify-start'}`}>
        {isLoadingApp && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-md flex flex-col items-center justify-center z-40">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[12px] font-black text-white uppercase tracking-[0.3em] drop-shadow-lg">Abrindo Aplicativo...</p>
          </div>
        )}

        {!activeApp && !isLoadingApp && !isSettingsOpen && (
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6 animate-fade-in">
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 w-full mb-2">
              {apps.slice(0, 3).map((app) => (
                <div key={app.id} className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-1rem)] max-w-[320px]">
                  <AppTile title={app.title} icon={app.icon} iconColor={app.bgColor} onClick={() => handleOpenApp(app)} />
                </div>
              ))}
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 w-full">
              {apps.slice(3).map((app) => (
                <div key={app.id} className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-1rem)] max-w-[320px]">
                  <AppTile title={app.title} icon={app.icon} iconColor={app.bgColor} onClick={() => handleOpenApp(app)} />
                </div>
              ))}
              <div className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-1rem)] max-w-[320px]">
                <AppTile title="Novo App" iconColor="" icon={null} isNew={true} onClick={() => alert("Gerenciador de MFE")} />
              </div>
            </div>
          </div>
        )}

        {isSettingsOpen && (
          <div className="w-full max-w-3xl mx-auto backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-12 text-white shadow-2xl animate-fade-in">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 drop-shadow-md">{userName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] text-white/60 font-black uppercase tracking-widest mb-2">E-mail</label>
                <div className="bg-black/20 p-4 rounded-2xl font-bold border border-white/10">{userEmail}</div>
              </div>
            </div>
            <button onClick={handleCloseApp} className="mt-8 px-6 py-3 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-colors">Voltar</button>
          </div>
        )}

        {activeApp && (
          <div className="absolute inset-0 flex flex-col items-center animate-fade-in bg-slate-900/50 backdrop-blur-md pt-4">
            <div className="w-full h-full bg-white rounded-t-[2rem] overflow-hidden shadow-2xl flex flex-col">
               <iframe
                id={activeApp.id === 'carometro-alunos' ? 'carometro-frame' : undefined}
                src={getAppUrl(activeApp)}
                title={activeApp.title}
                style={{ width: '100%', height: '100%', flex: '1', border: 'none', display: 'block' }}
                onLoad={handleIframeLoad}
              />
            </div>
          </div>
        )}
      </main>

      <footer className="relative z-10 py-6 text-center border-t border-white/10 bg-black/20 backdrop-blur-md">
        <p className="text-[10px] text-white/70 font-bold uppercase tracking-[0.2em] drop-shadow-md">
          &copy; 2024 EMEF Tarsila do Amaral &bull; Shell de Micro Front-Ends v2.4
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
