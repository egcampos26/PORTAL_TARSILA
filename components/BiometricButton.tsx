import React from 'react';

interface BiometricButtonProps {
    onClick: () => void;
    isLoading: boolean;
}

const BiometricButton: React.FC<BiometricButtonProps> = ({ onClick, isLoading }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold py-3.5 rounded-xl text-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
        >
            {isLoading ? (
                <>
                    <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Verificando biometria...</span>
                </>
            ) : (
                <>
                    {/* Ícone de digital */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
                    <span>Entrar com Biometria</span>
                </>
            )}
        </button>
    );
};

export default BiometricButton;
