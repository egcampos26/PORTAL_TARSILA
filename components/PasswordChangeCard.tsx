import React, { useState } from 'react';
import { supabase } from '../supabase';

interface PasswordChangeCardProps {
    onPasswordChanged: (newPassword: string) => void;
    onCancel: () => void;
    userEmail: string;
    userId: string;  // Changed from number to string to match id_func type
}

const PasswordChangeCard: React.FC<PasswordChangeCardProps> = ({ onPasswordChanged, onCancel, userEmail, userId }) => {
    const [username, setUsername] = useState('');
    // CPF state removed
    const [newPassword, setNewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Requisitos de senha
    const requirements = [
        { label: "Pelo menos 6 caracteres", test: (pw: string) => pw.length >= 6 },
        { label: "Uma letra maiúscula", test: (pw: string) => /[A-Z]/.test(pw) },
        { label: "Uma letra minúscula", test: (pw: string) => /[a-z]/.test(pw) },
        { label: "Um número", test: (pw: string) => /[0-9]/.test(pw) },
        { label: "Um caractere especial (!@#$%^&*)", test: (pw: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pw) },
    ];

    const isPasswordValid = requirements.every(req => req.test(newPassword));
    // CPF validation removed

    // CPF helper functions removed

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username.trim()) {
            setError("O nome de usuário é obrigatório.");
            return;
        }

        // CPF validation block removed

        if (!isPasswordValid) {
            setError("A senha não atende a todos os requisitos.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const { data, error: rpcError } = await supabase.rpc('update_user_password', {
                user_id_input: userId,
                new_password_input: newPassword,
                new_username_input: username,
                // cpf_input removed, defaulting to NULL in backend
            });

            if (rpcError) throw rpcError;

            if (data) {
                onPasswordChanged(newPassword);
            } else {
                setError("Erro ao atualizar senha. Verifique se o CPF e usuário estão corretos.");
            }
        } catch (err: any) {
            console.error("Password update error:", err);
            const errorMessage = err.message || err.details || "Erro de conexão com o Supabase.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#3b5998] w-full max-w-md rounded-[40px] shadow-2xl p-10 flex flex-col justify-center transition-all animate-fade-in-up">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Primeiro Acesso</h2>
                <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">
                    Para sua segurança e vinculação com o Portal, você deve definir seu nome de usuário e alterar sua senha inicial.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                    <label className="text-[10px] text-white/70 font-bold uppercase tracking-widest ml-1">E-mail: {userEmail}</label>
                </div>

                <div className="grid grid-cols-1 gap-5">
                    {/* CPF field removed */}

                    <div className="space-y-1">
                        <label className="text-[10px] text-white/70 font-bold uppercase tracking-widest ml-1">Nome de Usuário</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => { setUsername(e.target.value); setError(null); }}
                            placeholder="Crie seu nome de usuário"
                            className="w-full px-5 py-3 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all border-none font-bold"
                            required
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] text-white/70 font-bold uppercase tracking-widest ml-1">Nova Senha</label>
                    <div className="relative">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => { setNewPassword(e.target.value); setError(null); }}
                            placeholder="Digite a nova senha"
                            className="w-full px-5 py-3 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all border-none pr-12 font-bold"
                            required
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3b5998] transition-colors focus:outline-none"
                            tabIndex={-1}
                        >
                            {showNewPassword ? (
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
                    <div className="px-1 pt-3 space-y-1.5">
                        <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-1.5">Requisitos da Senha:</p>
                        {requirements.map((req, index) => {
                            const met = req.test(newPassword);
                            return (
                                <div key={index} className="flex items-center gap-2 transition-all duration-300">
                                    <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center transition-colors ${met ? 'bg-green-400' : 'bg-white/10'}`}>
                                        {met ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-[#3b5998]">
                                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <div className="w-1 h-1 bg-white/30 rounded-full" />
                                        )}
                                    </div>
                                    <span className={`text-[11px] font-medium transition-colors ${met ? 'text-green-300' : 'text-white/60'}`}>
                                        {req.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] text-white/70 font-bold uppercase tracking-widest ml-1">Confirmar Senha</label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => { setConfirmPassword(e.target.value); setError(null); }}
                            placeholder="Confirme a nova senha"
                            className="w-full px-5 py-3 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all border-none pr-12 font-bold"
                            required
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors focus:outline-none"
                            tabIndex={-1}
                        >
                            {showConfirmPassword ? (
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

                <div className="flex flex-col gap-3 mt-4">
                    <button
                        type="submit"
                        className="w-full bg-white text-blue-600 font-black py-4 rounded-xl text-sm shadow-xl hover:bg-slate-50 active:scale-95 transition-all uppercase tracking-[0.2em] disabled:opacity-50"
                        disabled={isLoading || !isPasswordValid}
                    >
                        {isLoading ? 'Vinculando...' : 'Salvar e Acessar'}
                    </button>

                    <button
                        type="button"
                        onClick={onCancel}
                        className="w-full bg-transparent border-2 border-white/30 text-white font-bold py-3 rounded-xl text-[10px] hover:bg-white/10 active:scale-95 transition-all uppercase tracking-[0.2em] disabled:opacity-50"
                        disabled={isLoading}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PasswordChangeCard;
