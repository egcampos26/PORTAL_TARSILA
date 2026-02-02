
import React, { useState, useEffect } from 'react';
import WelcomeCard from './components/WelcomeCard';
import LoginCard from './components/LoginCard';
import PasswordChangeCard from '../components/PasswordChangeCard';
import Dashboard from './components/Dashboard';
import { AppScreen, User } from './types';

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.LOGIN);
  const [user, setUser] = useState<User | null>(null);
  const [tempUser, setTempUser] = useState<any | null>(null);
  const [isRequirePasswordChange, setIsRequirePasswordChange] = useState(false);

  // Check for saved session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('portal_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setScreen(AppScreen.DASHBOARD);
    }
  }, []);

  const handleLogin = (userData: any) => {
    const mappedUser: User = {
      name: userData.name,
      email: userData.email,
      role: userData.category || 'User',
      gender: (userData.visual_id === 'F' || userData.name?.toLowerCase().endsWith('a')) ? 'F' : 'M'
    };
    setUser(mappedUser);
    localStorage.setItem('portal_user', JSON.stringify(mappedUser));
    setScreen(AppScreen.DASHBOARD);
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
    </div>
  );
};

export default App;
