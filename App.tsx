
import React, { useState, useEffect } from 'react';
import WelcomeCard from './components/WelcomeCard';
import LoginCard from './components/LoginCard';
import PasswordChangeCard from './components/PasswordChangeCard';
import Dashboard from './components/Dashboard';
import BiometricSetupModal from './components/BiometricSetupModal';
import { AppScreen, User } from './types';
import { checkBiometricSupport, getLocalCredential } from './hooks/useBiometric';

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.LOGIN);
  const [user, setUser] = useState<User | null>(null);
  const [tempUser, setTempUser] = useState<any | null>(null);
  const [isRequirePasswordChange, setIsRequirePasswordChange] = useState(false);

  // Biometria: controla exibição do modal de cadastro
  const [showBiometricSetup, setShowBiometricSetup] = useState(false);
  const [pendingUser, setPendingUser] = useState<{ mappedUser: User; rawUser: any } | null>(null);

  // Check for saved session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('portal_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setScreen(AppScreen.DASHBOARD);
    }
  }, []);

  const handleLogin = async (userData: any) => {
    const mappedUser: User = {
      id: userData.user_id,
      name: userData.name,
      email: userData.email,
      role: userData.category || 'User',
      gender: (userData.visual_id === 'F' || userData.name?.toLowerCase().endsWith('a')) ? 'F' : 'M'
    };

    // Verificar se deve oferecer cadastro biométrico
    const biometricSupported = await checkBiometricSupport();
    const alreadyRegistered = getLocalCredential(userData.user_id);

    if (biometricSupported && !alreadyRegistered) {
      // Guardar usuário pendente e exibir modal de cadastro biométrico
      setPendingUser({ mappedUser, rawUser: userData });
      setShowBiometricSetup(true);
    } else {
      // Biometria não disponível ou já cadastrada — ir direto ao Dashboard
      commitLogin(mappedUser);
    }
  };

  const commitLogin = (mappedUser: User) => {
    setUser(mappedUser);
    localStorage.setItem('portal_user', JSON.stringify(mappedUser));
    setScreen(AppScreen.DASHBOARD);
  };

  const handleBiometricSetupDone = () => {
    setShowBiometricSetup(false);
    if (pendingUser) {
      commitLogin(pendingUser.mappedUser);
      setPendingUser(null);
    }
  };

  const handleRequirePasswordChange = (userData: any) => {
    setTempUser(userData);
    setIsRequirePasswordChange(true);
  };

  const handlePasswordChanged = () => {
    if (!tempUser) return;
    handleLogin(tempUser);
    setIsRequirePasswordChange(false);
    setTempUser(null);
  };

  const handleCancelPasswordChange = () => {
    setIsRequirePasswordChange(false);
    setTempUser(null);
  };

  const handleLogout = () => {
    setScreen(AppScreen.LOGIN);
    setUser(null);
    localStorage.removeItem('portal_user');
  };

  if (screen === AppScreen.DASHBOARD && user) {
    return (
      <Dashboard
        userId={user.id}
        userEmail={user.email}
        userName={user.name}
        userGender={user.gender}
        userRole={user.role}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-900 via-blue-700 to-cyan-500 flex items-center justify-center p-6 sm:p-12 overflow-hidden">
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20">

        {!isRequirePasswordChange && (
          <div className="w-full flex justify-center md:justify-end animate-fade-in-up">
            <WelcomeCard />
          </div>
        )}

        <div className="w-full flex justify-center md:justify-start">
          {isRequirePasswordChange ? (
            <PasswordChangeCard
              userEmail={tempUser?.email}
              userId={tempUser?.user_id}
              onPasswordChanged={handlePasswordChanged}
              onCancel={handleCancelPasswordChange}
            />
          ) : (
            <div className="w-full flex justify-center md:justify-start animate-fade-in-down">
              <LoginCard
                onLogin={handleLogin}
                onRequirePasswordChange={handleRequirePasswordChange}
              />
            </div>
          )}
        </div>

      </div>

      {/* Modal de cadastro de biometria (aparece após primeiro login bem-sucedido em dispositivo compatível) */}
      {showBiometricSetup && pendingUser && (
        <BiometricSetupModal
          userId={pendingUser.rawUser.user_id}
          userName={pendingUser.rawUser.name}
          onDone={handleBiometricSetupDone}
        />
      )}
    </div>
  );
};

export default App;
