
import React, { useState } from 'react';
import { supabase } from '../supabase';

interface LoginCardProps {
  onLogin: (userData: any) => void;
  onRequirePasswordChange: (userData: any) => void;
}

const LoginCard: React.FC<LoginCardProps> = ({ onLogin, onRequirePasswordChange }) => {
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: rpcError } = await supabase.rpc('check_user_login', {
        login_input: loginInput.trim(),
        password_input: password.trim()
      });

      if (rpcError) {
        setError(`Erro RPC: ${rpcError.message}`);
        return;
      }

      if (data && data.length > 0) {
        const userRaw = data[0];
        console.log('Login response raw:', userRaw); // Debugging

        const user = {
          user_id: userRaw.id_func,      // Changed from ID_Login to id_func
          name: userRaw.nome_func,       // Changed from nome to nome_func
          email: userRaw.email,
          username: userRaw.usuario,
          category: userRaw.categoria,
          visual_id: userRaw.identificacao_visual,
          needs_password_change: !!userRaw.needs_password_change
        };

        if (user.needs_password_change) {
          onRequirePasswordChange(user);
        } else {
          onLogin(user);
        }
      } else {
        setError("Usuário ou senha incorretos.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(`Erro ao conectar: ${err.message || 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-blue-600 w-full max-w-sm rounded-[40px] shadow-2xl p-8 flex flex-col justify-center h-full transition-all hover:scale-[1.02]">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <label className="text-[10px] text-white/70 font-bold uppercase tracking-widest ml-1">E-mail ou Usuário</label>
          <input
            type="text"
            value={loginInput}
            onChange={(e) => setLoginInput(e.target.value)}
            placeholder="Digite seu acesso"
            className="w-full px-5 py-3 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all border-none"
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] text-white/70 font-bold uppercase tracking-widest ml-1">Senha</label>
          <div className="relative group">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-5 py-3 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all border-none pr-12"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.421 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider text-center">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <div
            onClick={() => !isLoading && setRememberMe(!rememberMe)}
            className="cursor-pointer flex items-center group"
          >
            <div className={`w-5 h-5 border-2 border-white rounded flex items-center justify-center transition-colors ${rememberMe ? 'bg-white' : 'bg-transparent'}`}>
              {rememberMe && (
                <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="ml-2 text-white text-xs font-bold uppercase tracking-wider opacity-90 group-hover:opacity-100 transition-opacity">Lembrar de mim</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-white text-blue-600 font-black py-4 rounded-xl text-sm shadow-xl hover:bg-slate-50 active:scale-95 transition-all mt-4 uppercase tracking-[0.2em] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Verificando...' : 'Acessar Portal'}
        </button>

        <p className="text-center text-white/40 text-[9px] font-bold uppercase tracking-widest mt-4">
          Acesso Restrito a Colaboradores
        </p>
      </form>
    </div>
  );
};

export default LoginCard;
