import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onContinue: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onContinue }) => {
  const [progress, setProgress] = useState(28);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          clearInterval(timer);
          return 100;
        }
        return prev + 6;
      });
    }, 450);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full min-h-[844px] bg-[#F7FBFB] overflow-hidden flex flex-col justify-between text-[#0F1E36] select-none">
      {/* Flowing Translucent Organic Background Waves */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Wave 1: Top Right subtle glow */}
        <svg className="absolute -top-16 -right-24 w-[380px] h-[340px] opacity-40" viewBox="0 0 380 340" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M70 40C160 -20 280 10 330 90C380 170 370 290 290 320C210 350 110 310 50 240C-10 170 -20 100 70 40Z" fill="url(#grad-top)"></path>
          <defs>
            <linearGradient id="grad-top" x1="50" y1="20" x2="350" y2="300" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2DD4BF" stopOpacity="0.35"></stop>
              <stop offset="0.5" stopColor="#06B6D4" stopOpacity="0.1"></stop>
              <stop offset="1" stopColor="#FFFFFF" stopOpacity="0"></stop>
            </linearGradient>
          </defs>
        </svg>

        {/* Wave 2: Left Mid Organic Wave */}
        <svg className="absolute top-[280px] -left-32 w-[340px] h-[360px] opacity-45" viewBox="0 0 340 360" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M60 90C140 30 250 80 290 160C330 240 280 320 200 350C120 380 30 330 10 250C-10 170 -20 150 60 90Z" fill="url(#grad-mid)"></path>
          <defs>
            <linearGradient id="grad-mid" x1="10" y1="80" x2="300" y2="340" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0D6E6E" stopOpacity="0.12"></stop>
              <stop offset="0.6" stopColor="#14B8A6" stopOpacity="0.08"></stop>
              <stop offset="1" stopColor="#FFFFFF" stopOpacity="0"></stop>
            </linearGradient>
          </defs>
        </svg>

        {/* Wave 3: Bottom Right Gentle Curve */}
        <svg className="absolute -bottom-20 -right-20 w-[360px] h-[360px] opacity-50" viewBox="0 0 360 360" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M120 50C220 20 320 90 350 180C380 270 310 340 220 355C130 370 40 310 20 220C-1 130 20 80 120 50Z" fill="url(#grad-bottom)"></path>
          <defs>
            <linearGradient id="grad-bottom" x1="40" y1="60" x2="330" y2="340" gradientUnits="userSpaceOnUse">
              <stop stopColor="#06B6D4" stopOpacity="0.15"></stop>
              <stop offset="0.7" stopColor="#0D6E6E" stopOpacity="0.06"></stop>
              <stop offset="1" stopColor="#FFFFFF" stopOpacity="0"></stop>
            </linearGradient>
          </defs>
        </svg>

        {/* Soft ambient gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F7FBFB]/30 to-[#F0F8F7]/80"></div>
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col h-full justify-between pt-11 pb-7 px-6">
        {/* TOP SECTION: Status bar clean space + Small Tagline in upper right */}
        <div className="w-full flex items-start justify-between">
          {/* Brand micro badge */}
          <div className="flex items-center space-x-1.5 opacity-75">
            <div className="w-2 h-2 rounded-full bg-[#0D6E6E]"></div>
            <span className="text-[10px] font-semibold tracking-widest uppercase text-[#4A5B73]">Official Patient App</span>
          </div>

          {/* Upper right Tagline */}
          <div className="flex flex-col items-end">
            <p className="text-[11px] font-semibold text-[#0F1E36] leading-tight text-right">
              Better Conversations
            </p>
            <p className="text-[11px] font-medium text-[#4A5B73] leading-tight text-right">
              Healthier Tomorrows
            </p>
            {/* Subtle short teal underline */}
            <div className="w-8 h-[2px] bg-gradient-to-r from-[#14B8A6] to-[#0D6E6E] rounded-full mt-1"></div>
          </div>
        </div>

        {/* CENTER SECTION: CareFlow Brand Emblem + Wordmark + Promise + Loading Bar */}
        <div className="flex flex-col items-center text-center -mt-2">
          {/* CareFlow Emblem */}
          <div className="relative w-20 h-20 flex items-center justify-center mb-4">
            <div className="absolute inset-0 rounded-full bg-[#E6F7F6]/80 blur-md transform scale-110"></div>

            <svg className="relative w-20 h-20 drop-shadow-sm" viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="cf-gradient" x1="12" y1="12" x2="72" y2="76" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0D6E6E"></stop>
                  <stop offset="0.6" stopColor="#0E8A8A"></stop>
                  <stop offset="1" stopColor="#14B8A6"></stop>
                </linearGradient>
                <linearGradient id="cf-cross-grad" x1="34" y1="36" x2="50" y2="52" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#06B6D4"></stop>
                  <stop offset="1" stopColor="#0D6E6E"></stop>
                </linearGradient>
                <filter id="shadow" x="0" y="2" width="84" height="82" filterUnits="userSpaceOnUse">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0D6E6E" floodOpacity="0.14"></feDropShadow>
                </filter>
              </defs>

              <g filter="url(#shadow)">
                {/* Outer Caring Wing */}
                <path d="M42 74C37 69 16 53 14 36C12 23 21 13 32 13C37 13 40.5 15.5 42 18C43.5 15.5 47 13 52 13C63 13 72 23 70 36C68 53 47 69 42 74Z" fill="url(#cf-gradient)"></path>
                
                {/* Soft inner heart cutout */}
                <path d="M42 66C38 61 22 47 21 34C20 24 27 18 35 18C38.5 18 41 20 42 22C43 20 45.5 18 49 18C57 18 64 24 63 34C62 47 46 61 42 66Z" fill="#F7FBFB"></path>

                {/* Integrated Medical Cross */}
                <rect x="38.5" y="27" width="7" height="22" rx="3.5" fill="url(#cf-cross-grad)"></rect>
                <rect x="31" y="34.5" width="22" height="7" rx="3.5" fill="url(#cf-cross-grad)"></rect>
                
                {/* Central pearl light */}
                <circle cx="42" cy="38" r="2.2" fill="#FFFFFF" opacity="0.9"></circle>

                {/* Patient & Caregiver Nodes */}
                <circle cx="33" cy="11.5" r="3.2" fill="#0D6E6E"></circle>
                <circle cx="51" cy="11.5" r="3.2" fill="#14B8A6"></circle>
              </g>
            </svg>
          </div>

          {/* CareFlow Wordmark */}
          <h1 className="text-[34px] font-extrabold tracking-tight leading-none mb-3.5 flex items-center justify-center">
            <span className="text-[#0F1E36] font-extrabold">Care</span>
            <span className="text-gradient-flow font-extrabold ml-[1px]">Flow</span>
          </h1>

          {/* Under wordmark copy */}
          <div className="space-y-1 max-w-[300px]">
            <p className="text-[14.5px] font-bold text-[#0F1E36] leading-snug tracking-tight">
              Tell us what you’re feeling.
            </p>
            <p className="text-[13px] font-medium text-[#4A5B73] leading-relaxed">
              We’ll help your care team understand.
            </p>
          </div>

          {/* LOADING AREA */}
          <button
            onClick={onContinue}
            className="mt-6 flex flex-col items-center w-full max-w-[210px] group cursor-pointer focus:outline-none"
            type="button"
          >
            <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden p-[1px]">
              <div
                className="h-full bg-gradient-to-r from-[#0D6E6E] to-[#06B6D4] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-[11px] font-medium text-[#7E90A6] tracking-wide group-hover:text-[#0D6E6E] transition-colors">
                {progress < 100 ? 'Loading your care journey...' : 'Ready · Tap to start'}
              </span>
              <span className="material-symbols-outlined text-[14px] text-[#0D6E6E] group-hover:translate-x-0.5 transition-transform">
                arrow_forward
              </span>
            </div>
          </button>
        </div>

        {/* LOWER-MIDDLE ILLUSTRATION: Healthcare Clinic & Community */}
        <div className="relative w-full flex flex-col items-center my-1">
          {/* Handwritten phrase */}
          <div className="w-full flex justify-start pl-4 -mb-2 z-10">
            <div className="transform -rotate-3 text-left">
              <p className="font-handwriting text-[#0D6E6E] text-[20px] leading-[1.05] tracking-wide font-semibold opacity-95">
                Healthier<br />
                <span className="pl-2 text-[#14B8A6]">People</span><br />
                <span className="pl-4 text-[#0D6E6E]">Stronger Communities</span>
              </p>
            </div>
          </div>

          {/* Clinic Flat Landscape Illustration */}
          <div className="w-full max-w-[340px] h-[162px] relative flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 340 160" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="hillGrad" x1="170" y1="110" x2="170" y2="160" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#E1F4F2" stopOpacity="0.9"></stop>
                  <stop offset="1" stopColor="#EAF8F6" stopOpacity="0.3"></stop>
                </linearGradient>
                <linearGradient id="buildingGrad" x1="170" y1="40" x2="170" y2="120" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFFFFF"></stop>
                  <stop offset="1" stopColor="#F0F8F8"></stop>
                </linearGradient>
                <linearGradient id="pathGrad" x1="170" y1="105" x2="190" y2="160" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#D7EFEF"></stop>
                  <stop offset="1" stopColor="#E8F6F5" stopOpacity="0.3"></stop>
                </linearGradient>
                <linearGradient id="treeGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop stopColor="#2DD4BF" stopOpacity="0.8"></stop>
                  <stop offset="1" stopColor="#0D6E6E" stopOpacity="0.8"></stop>
                </linearGradient>
                <linearGradient id="treeGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop stopColor="#14B8A6" stopOpacity="0.85"></stop>
                  <stop offset="1" stopColor="#0A5656" stopOpacity="0.85"></stop>
                </linearGradient>
              </defs>

              {/* Distant soft rolling hills */}
              <path d="M0 135C60 115 130 118 190 126C250 134 300 120 340 124V160H0V135Z" fill="#EBF6F5" fillOpacity="0.6"></path>
              <path d="M-10 138C50 122 140 120 220 130C280 138 315 132 350 136V160H-10V138Z" fill="url(#hillGrad)"></path>

              {/* Curved pathway */}
              <path d="M165 112C167 125 158 138 152 145C146 152 140 156 135 160H195C186 154 179 144 178 135C177 125 178 116 177 112H165Z" fill="url(#pathGrad)"></path>

              {/* Clinic building */}
              <g>
                <ellipse cx="170" cy="116" rx="42" ry="4" fill="#0D6E6E" fillOpacity="0.08"></ellipse>
                <rect x="145" y="58" width="50" height="54" rx="6" fill="url(#buildingGrad)" stroke="#C8EAE6" strokeWidth="1.2"></rect>
                <path d="M142 58C142 56 144 54 147 54H193C196 54 198 56 198 58V60H142V58Z" fill="#0D6E6E" fillOpacity="0.9"></path>
                
                <circle cx="170" cy="71" r="7" fill="#E6F7F5"></circle>
                <rect x="168.5" y="66.5" width="3" height="9" rx="1" fill="#0D6E6E"></rect>
                <rect x="165.5" y="69.5" width="9" height="3" rx="1" fill="#0D6E6E"></rect>

                <rect x="151" y="83" width="7" height="8" rx="1.5" fill="#C2ECE7" fillOpacity="0.7"></rect>
                <rect x="161" y="83" width="7" height="8" rx="1.5" fill="#C2ECE7" fillOpacity="0.7"></rect>
                <rect x="172" y="83" width="7" height="8" rx="1.5" fill="#C2ECE7" fillOpacity="0.7"></rect>
                <rect x="182" y="83" width="7" height="8" rx="1.5" fill="#C2ECE7" fillOpacity="0.7"></rect>

                <path d="M165 99H175V112H165V99Z" fill="#0D6E6E" fillOpacity="0.8"></path>

                {/* Left Annex */}
                <rect x="122" y="74" width="24" height="38" rx="4" fill="#F4FAF9" stroke="#CFECE8" strokeWidth="1"></rect>
                <rect x="127" y="81" width="5" height="7" rx="1" fill="#D3F1ED"></rect>
                <rect x="135" y="81" width="5" height="7" rx="1" fill="#D3F1ED"></rect>
                <rect x="127" y="93" width="5" height="7" rx="1" fill="#D3F1ED"></rect>
                <rect x="135" y="93" width="5" height="7" rx="1" fill="#D3F1ED"></rect>

                {/* Right Annex */}
                <rect x="194" y="78" width="22" height="34" rx="4" fill="#F4FAF9" stroke="#CFECE8" strokeWidth="1"></rect>
                <rect x="199" y="86" width="5" height="6" rx="1" fill="#D3F1ED"></rect>
                <rect x="206" y="86" width="5" height="6" rx="1" fill="#D3F1ED"></rect>
                <rect x="199" y="96" width="5" height="6" rx="1" fill="#D3F1ED"></rect>
                <rect x="206" y="96" width="5" height="6" rx="1" fill="#D3F1ED"></rect>
              </g>

              {/* Trees and Foliage */}
              <rect x="106" y="98" width="3" height="15" rx="1.5" fill="#7E9A98"></rect>
              <circle cx="107.5" cy="94" r="11" fill="url(#treeGrad1)"></circle>
              <circle cx="104" cy="90" r="7" fill="#5EEAD4" fillOpacity="0.6"></circle>

              <rect x="88" y="110" width="3" height="14" rx="1.5" fill="#7E9A98"></rect>
              <ellipse cx="89.5" cy="105" rx="9" ry="12" fill="url(#treeGrad2)"></ellipse>
              <path d="M70 128C72 120 80 119 86 123C91 119 99 122 100 128C101 133 72 135 70 128Z" fill="#14B8A6" fillOpacity="0.3"></path>

              <rect x="230" y="98" width="3" height="16" rx="1.5" fill="#7E9A98"></rect>
              <circle cx="231.5" cy="92" r="12" fill="url(#treeGrad2)"></circle>
              <circle cx="235" cy="88" r="7" fill="#2DD4BF" fillOpacity="0.5"></circle>

              <rect x="249" y="106" width="3" height="14" rx="1.5" fill="#7E9A98"></rect>
              <ellipse cx="250.5" cy="102" rx="9" ry="13" fill="url(#treeGrad1)"></ellipse>
              <path d="M225 129C227 122 236 121 242 125C247 121 256 123 257 129C258 134 227 136 225 129Z" fill="#0D6E6E" fillOpacity="0.25"></path>

              {/* Flying doves */}
              <path d="M96 52C99 49 104 50 106 53C107 50 112 49 115 52" stroke="#0D6E6E" strokeOpacity="0.3" strokeWidth="1.2" strokeLinecap="round"></path>
              <path d="M224 45C226 43 230 44 231 46C232 44 236 43 238 45" stroke="#14B8A6" strokeOpacity="0.35" strokeWidth="1" strokeLinecap="round"></path>
            </svg>
          </div>
        </div>

        {/* BOTTOM SECTION: 3 Value Propositions */}
        <div className="w-full pt-3 pb-1 border-t border-[#0D6E6E]/10">
          <div className="grid grid-cols-3 gap-2">
            {/* Benefit 1: Shield */}
            <div className="flex flex-col items-center text-center">
              <div className="w-9 h-9 rounded-xl bg-[#E6F7F6]/80 flex items-center justify-center mb-1.5 border border-[#14B8A6]/20">
                <span className="material-symbols-outlined text-[19px] text-[#0D6E6E]">verified_user</span>
              </div>
              <span className="text-[11px] font-bold text-[#0F1E36] leading-tight">Safe</span>
              <span className="text-[11px] font-semibold text-[#4A5B73] leading-tight">&amp; Secure</span>
            </div>

            {/* Benefit 2: For Every Indian */}
            <div className="flex flex-col items-center text-center">
              <div className="w-9 h-9 rounded-xl bg-[#E6F7F6]/80 flex items-center justify-center mb-1.5 border border-[#14B8A6]/20">
                <span className="material-symbols-outlined text-[19px] text-[#0D6E6E]">groups</span>
              </div>
              <span className="text-[11px] font-bold text-[#0F1E36] leading-tight">For Every</span>
              <span className="text-[11px] font-semibold text-[#4A5B73] leading-tight">Indian</span>
            </div>

            {/* Benefit 3: A Healthier Tomorrow */}
            <div className="flex flex-col items-center text-center">
              <div className="w-9 h-9 rounded-xl bg-[#E6F7F6]/80 flex items-center justify-center mb-1.5 border border-[#14B8A6]/20">
                <span className="material-symbols-outlined text-[19px] text-[#0D6E6E]">favorite</span>
              </div>
              <span className="text-[11px] font-bold text-[#0F1E36] leading-tight">A Healthier</span>
              <span className="text-[11px] font-semibold text-[#4A5B73] leading-tight">Tomorrow</span>
            </div>
          </div>

          <div
            onClick={onContinue}
            className="w-28 h-1 bg-[#4A5B73]/20 hover:bg-[#0D6E6E] transition-colors rounded-full mx-auto mt-4 cursor-pointer"
          ></div>
        </div>
      </div>
    </div>
  );
};
