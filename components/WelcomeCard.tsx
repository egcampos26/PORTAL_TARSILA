
import React from 'react';
import Logo from './Logo';

const WelcomeCard: React.FC = () => {
  return (
    <div className="bg-white w-full max-w-[420px] rounded-[40px] shadow-2xl p-10 flex flex-col items-center justify-center h-full transition-all">
      <h2 className="text-[#3b5998] font-montserrat text-6xl font-black tracking-tighter mb-8 uppercase text-center italic leading-[0.8]">
        Portal
      </h2>

      <div className="w-full flex items-center justify-center">
        <Logo />
      </div>

      <p className="font-pacifico text-[#3b5998] text-5xl mt-10">
        Bem-vindo
      </p>
    </div>
  );
};

export default WelcomeCard;
