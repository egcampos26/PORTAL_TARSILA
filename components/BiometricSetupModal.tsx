import React, { useState } from 'react';
import { registerBiometric } from '../hooks/useBiometric';

interface BiometricSetupModalProps {
    userId: string;
    userName: string;
    onDone: () => void; // chamado após cadastro ou recusa
}

const BiometricSetupModal: React.FC<BiometricSetupModalProps> = ({ userId, userName, onDone }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleRegister = async () => {
        setIsLoading(true);
        setError(null);

        const result = await registerBiometric(userId, userName);

        setIsLoading(false);

        if (result.success) {
            setSuccess(true);
            // Aguarda 1.5s para o usuário ver a mensagem de sucesso e depois prossegue
            setTimeout(onDone, 1500);
        } else {
            setError(result.error || 'Não foi possível cadastrar a biometria.');
        }
    };

    return (
        /* Backdrop */
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center gap-5 animate-scale-in">

                {/* Ícone */}
                <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
                        <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
                        <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
                        <path d="M2 12a10 10 0 0 1 18-6" />
                        <path d="M2 17c1 .5 2.5 1.5 6 1.5" />
                        <path d="M4.17 12.35a10 10 0 0 0 .93 7.38" />
                        <path d="M5 10a7 7 0 0 1 12.15-4.76" />
                        <path d="M7 8.8V8a5 5 0 0 1 8.2-3.84" />
                        <path d="M7 12.05a7 7 0 0 0 2 4.27" />
                        <path d="M9 18.5a17.4 17.4 0 0 0 2.19 3.43" />
                        <path d="M9 7a3 3 0 0 1 5.47-.87" />
                    </svg>
                </div>

                {/* Conteúdo conforme estado */}
                {success ? (
                    <>
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                            <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-gray-800 font-bold text-lg text-center">Biometria cadastrada!</p>
                        <p className="text-gray-500 text-sm text-center">Na próxima vez, entre sem precisar de senha.</p>
                    </>
                ) : (
                    <>
                        <div className="text-center">
                            <h2 className="text-gray-800 font-black text-xl mb-2">Ativar login biométrico?</h2>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Cadastre sua biometria neste dispositivo para entrar no portal com apenas um toque —
                                sem precisar digitar senha.
                            </p>
                        </div>

                        {error && (
                            <div className="w-full bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-xl text-xs text-center font-bold">
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col gap-3 w-full">
                            <button
                                onClick={handleRegister}
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl text-sm transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Aguardando biometria...
                                    </>
                                ) : (
                                    'Cadastrar Agora'
                                )}
                            </button>

                            <button
                                onClick={onDone}
                                disabled={isLoading}
                                className="w-full text-gray-400 hover:text-gray-600 font-bold py-2 rounded-xl text-sm transition-colors disabled:opacity-50"
                            >
                                Agora não
                            </button>
                        </div>

                        <p className="text-gray-400 text-[10px] text-center uppercase tracking-wider">
                            Sua biometria nunca sai deste dispositivo
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default BiometricSetupModal;
