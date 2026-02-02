
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="w-full max-w-[320px] aspect-square bg-white rounded-[2.5rem] flex items-center justify-center overflow-hidden">
        <img
          src="/images/tarsila_logo_final.jpg"
          alt="Logo EMEF Tarsila do Amaral"
          className="w-full h-full object-contain animate-fade-in"
        />
      </div>

      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Logo;
