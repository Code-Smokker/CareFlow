import React, { useState } from 'react';
import { Header } from '../Header';

interface ChiefComplaintScreenProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  onContinue: (complaint: string) => void;
  onBack: () => void;
}

export const ChiefComplaintScreen: React.FC<ChiefComplaintScreenProps> = ({
  currentLanguage,
  onLanguageChange,
  onContinue,
  onBack,
}) => {
  const [currentState, setCurrentState] = useState<'idle' | 'listening' | 'processing' | 'detected' | 'typing'>('detected');
  const [complaintText, setComplaintText] = useState('I’ve been having chest pain and mild dizziness since yesterday evening.');
  const [typedInput, setTypedInput] = useState('');
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);

  const handleMicClick = () => {
    if (currentState === 'idle' || currentState === 'detected') {
      setCurrentState('listening');
      setTimeout(() => {
        setCurrentState('processing');
        setTimeout(() => {
          setComplaintText('I have had high fever and persistent coughing for the past two days.');
          setCurrentState('detected');
        }, 1200);
      }, 2200);
    } else if (currentState === 'listening') {
      setCurrentState('processing');
      setTimeout(() => {
        setCurrentState('detected');
      }, 1000);
    }
  };

  const handleToggleTyping = () => {
    setTypedInput(complaintText);
    setCurrentState('typing');
  };

  const handleSaveTyping = () => {
    if (typedInput.trim()) {
      setComplaintText(typedInput.trim());
      setCurrentState('detected');
    }
  };

  const speakQuestion = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeakingQuestion(true);
      const text = currentLanguage === 'हिन्दी' 
        ? 'आज आप अस्पताल में क्या तकलीफ़ लेकर आए हैं? Tell us in your own words.'
        : 'What brought you here today? Tell us in your own words.';
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.92;
      utterance.onend = () => setIsSpeakingQuestion(false);
      utterance.onerror = () => setIsSpeakingQuestion(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-[#faf8ff] text-[#0F1E36] pb-6">
      {/* Ambient background curves */}
      <div className="careflow-bg-curves"></div>
      <div className="careflow-bg-curves-bottom"></div>

      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={onLanguageChange}
        showBack={true}
        onBack={onBack}
      />

      <main className="relative z-10 flex flex-col flex-1 w-full px-4 pt-1 max-w-[430px] mx-auto">
        {/* Step Progress Tracker */}
        <div className="bg-white/80 rounded-2xl p-3 border border-slate-200/60 shadow-2xs mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0D6E6E] bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                Step 1 of 5
              </span>
              <span className="text-[11px] font-bold text-[#0F1E36]">Health Questions</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400">20% Completed</span>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            <div className="h-1.5 rounded-full bg-[#0D6E6E]"></div>
            <div className="h-1.5 rounded-full bg-slate-200/80"></div>
            <div className="h-1.5 rounded-full bg-slate-200/80"></div>
            <div className="h-1.5 rounded-full bg-slate-200/80"></div>
            <div className="h-1.5 rounded-full bg-slate-200/80"></div>
          </div>

          <div className="flex items-center justify-between text-[9px] font-semibold text-slate-400 mt-1.5 px-0.5">
            <span className="text-[#0D6E6E] font-bold">Getting Started ✓</span>
            <span className="text-[#0D6E6E] font-bold">• Symptoms</span>
            <span>Duration</span>
            <span>Review</span>
            <span>Complete</span>
          </div>
        </div>

        {/* Clinician Listening Illustration Badge */}
        <div className="w-full flex justify-center mb-2">
          <div className="w-18 h-18 rounded-2xl bg-gradient-to-tr from-teal-100/70 via-teal-50/60 to-white flex items-center justify-center p-2 shadow-2xs border border-teal-100/80 relative">
            <svg className="w-14 h-14" fill="none" viewBox="0 0 80 80">
              <circle cx="40" cy="40" fill="#E6F5F5" fillOpacity="0.7" r="32"></circle>
              <circle cx="31" cy="29" fill="#0D6E6E" r="10"></circle>
              <path d="M19 55C19 46.1634 24.3726 39 31 39C37.6274 39 43 46.1634 43 55V57H19V55Z" fill="#14B8A6"></path>
              <path d="M26 44C26 47.5 28.5 50 31 50C33.5 50 36 47.5 36 44" stroke="#FAF8FF" strokeLinecap="round" strokeWidth="2"></path>
              <circle cx="31" cy="52" fill="#FAF8FF" r="2"></circle>
              <path d="M49 28C52 32 52 38 49 42" stroke="#0D6E6E" strokeLinecap="round" strokeWidth="2.5"></path>
              <path d="M55 24C60 30 60 40 55 46" stroke="#14B8A6" strokeDasharray="1 3" strokeLinecap="round" strokeWidth="2"></path>
              <circle cx="56" cy="18" fill="#FAF8FF" r="6.5" stroke="#0D6E6E" strokeWidth="1.5"></circle>
              <path d="M56 20.5l-2.2-2.2c-.8-.8-.8-2 0-2.8s2-.8 2.8 0l.2.2.2-.2c.8-.8 2-.8 2.8 0s.8 2 0 2.8L56 20.5z" fill="#0D6E6E"></path>
            </svg>
            <span className="absolute -bottom-1.5 px-2 py-0.5 rounded-full bg-white text-[9px] font-bold tracking-wider text-[#0D6E6E] border border-teal-200/80 shadow-2xs uppercase">
              Step 1 of Health
            </span>
          </div>
        </div>

        {/* Title & Conversational Intro */}
        <div className="text-center px-2 mb-3">
          <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-[#0D6E6E] mb-0.5">
            LET’S GET STARTED
          </span>
          <h1 className="text-[22px] leading-tight font-extrabold text-[#0F1E36] tracking-tight mb-1">
            What brought you<br />here today?
          </h1>
          <p className="text-[12.5px] font-semibold text-[#0D6E6E] mb-1">
            आज आप अस्पताल में क्या तकलीफ़ लेकर आए हैं?
          </p>
          <p className="text-[11.5px] text-slate-500 max-w-[290px] mx-auto leading-relaxed">
            Tell us in your own words. There’s no right or wrong answer.
          </p>
        </div>

        {/* Interactive Voice Container */}
        <div className="w-full bg-white/95 rounded-3xl p-4 border border-teal-100/90 shadow-xs flex flex-col items-center relative transition-all duration-300 mb-3">
          {/* Microphone & Ripples */}
          <div className="relative flex items-center justify-center my-1.5">
            {currentState === 'listening' ? (
              <>
                <div className="absolute w-28 h-28 rounded-full bg-teal-100/80 animate-mic-ripple pointer-events-none"></div>
                <div className="absolute w-24 h-24 rounded-full bg-teal-50 pointer-events-none"></div>
              </>
            ) : (
              <div className="absolute w-24 h-24 rounded-full bg-teal-50/60 pointer-events-none"></div>
            )}

            <button
              onClick={handleMicClick}
              aria-label="Tap and speak"
              type="button"
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer text-white ${
                currentState === 'listening'
                  ? 'bg-teal-600 ring-4 ring-teal-200 animate-pulse'
                  : 'bg-[#0D6E6E] hover:bg-[#0b5c5c]'
              }`}
            >
              <span className="material-symbols-outlined text-[32px]">mic</span>
            </button>
          </div>

          {/* Voice Status Text */}
          <div className="text-center mt-2">
            <h2 className="text-[15px] font-bold text-[#0F1E36]">
              {currentState === 'idle' && 'Tap and speak'}
              {currentState === 'listening' && 'Listening...'}
              {currentState === 'processing' && 'Understanding you...'}
              {currentState === 'detected' && 'Answer captured'}
              {currentState === 'typing' && 'Type your symptoms'}
            </h2>
            <p className="text-[11.5px] text-slate-500 mt-0.5">
              {currentState === 'idle' && 'You can speak naturally in your preferred language.'}
              {currentState === 'listening' && 'Go ahead, CareFlow is listening to you.'}
              {currentState === 'processing' && 'Analyzing speech with medical vocabulary...'}
              {currentState === 'detected' && 'Please review your statement below.'}
              {currentState === 'typing' && 'Enter your primary complaint manually.'}
            </p>
          </div>

          {/* Waveform Animation (when listening) */}
          {currentState === 'listening' && (
            <div className="flex items-center justify-center space-x-1.5 h-8 mt-2">
              <div className="wave-bar wave-bar-1"></div>
              <div className="wave-bar wave-bar-2"></div>
              <div className="wave-bar wave-bar-3"></div>
              <div className="wave-bar wave-bar-4"></div>
              <div className="wave-bar wave-bar-5"></div>
            </div>
          )}

          {/* Recognized Complaint Card */}
          {currentState === 'detected' && (
            <div className="w-full mt-3 bg-gradient-to-br from-[#F0F9F9] to-teal-50/50 rounded-2xl p-3 border border-teal-200/80 text-left animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-1">
                <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-[#0D6E6E]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] mr-1.5 animate-pulse"></span>
                  Recognized Complaint
                </span>
                <button
                  onClick={handleMicClick}
                  className="text-[11px] font-semibold text-[#0D6E6E] hover:underline flex items-center gap-0.5 cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[13px]">refresh</span>
                  <span>Re-speak</span>
                </button>
              </div>

              <p className="text-[13.5px] font-semibold text-[#0F1E36] leading-snug">
                “{complaintText}”
              </p>

              <div className="mt-2.5 pt-2 border-t border-teal-100 flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-500">Is this accurate?</span>
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={handleToggleTyping}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                    type="button"
                  >
                    Change
                  </button>
                  <button
                    onClick={() => onContinue(complaintText)}
                    className="px-3 py-1 rounded-lg bg-[#0D6E6E] text-[11px] font-semibold text-white shadow-2xs hover:bg-[#0b5c5c] flex items-center gap-0.5 cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[13px]">check</span>
                    <span>Yes, continue</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Typing fallback textarea */}
          {currentState === 'typing' && (
            <div className="w-full mt-3 animate-in fade-in duration-150">
              <label className="block text-xs font-semibold text-[#0F1E36] mb-1" htmlFor="typed-complaint">
                Describe your concern or symptoms:
              </label>
              <textarea
                id="typed-complaint"
                rows={3}
                value={typedInput}
                onChange={(e) => setTypedInput(e.target.value)}
                placeholder="e.g. I have had a high fever and persistent headache for two days..."
                className="w-full text-xs text-[#0F1E36] bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-[#0D6E6E] focus:bg-white transition-colors"
              />
              <div className="flex justify-end mt-2 space-x-2">
                <button
                  onClick={() => setCurrentState('detected')}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100 cursor-pointer"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTyping}
                  className="px-3 py-1 rounded-lg bg-[#0D6E6E] text-xs font-semibold text-white cursor-pointer"
                  type="button"
                >
                  Save response
                </button>
              </div>
            </div>
          )}

          {/* Example prompt */}
          {currentState !== 'typing' && (
            <div className="mt-3 pt-2.5 border-t border-slate-100 w-full text-center">
              <p className="text-[11px] text-slate-400">
                For example: <span className="italic text-slate-600 font-medium">“I have had a fever and cough for two days.”</span>
              </p>
            </div>
          )}

          {/* Prefer to type button */}
          {currentState !== 'typing' && (
            <button
              onClick={handleToggleTyping}
              className="mt-2 inline-flex items-center text-xs font-semibold text-[#0D6E6E] hover:text-teal-700 transition-colors py-1 px-2 rounded-lg active:bg-teal-50 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[15px] mr-1 text-[#0D6E6E]">keyboard</span>
              <span>Prefer to type instead?</span>
            </button>
          )}
        </div>

        {/* Read aloud row */}
        <div className="w-full px-1 flex items-center justify-between text-[11px] text-slate-500 mb-2">
          <div className="flex items-center space-x-1.5">
            <div className="w-5 h-5 rounded-full bg-teal-50 flex items-center justify-center text-[#0D6E6E]">
              <span className="material-symbols-outlined text-[14px]">volume_up</span>
            </div>
            <span>CareFlow can read questions aloud</span>
          </div>
          <button
            onClick={speakQuestion}
            className={`font-semibold text-[#0D6E6E] hover:underline cursor-pointer flex items-center gap-0.5 ${
              isSpeakingQuestion ? 'animate-pulse' : ''
            }`}
            type="button"
          >
            <span>{isSpeakingQuestion ? 'Reading...' : 'Listen'}</span>
          </button>
        </div>

        {/* Fallback note */}
        <div className="text-center mb-3">
          <span className="text-[11px] text-slate-400">
            Having trouble with microphone?{' '}
            <button
              onClick={handleToggleTyping}
              className="text-[#0D6E6E] font-medium underline cursor-pointer"
            >
              Use audio fallback
            </button>
          </span>
        </div>

        {/* Sticky Continue CTA */}
        <div className="mt-auto pt-2 flex flex-col items-center">
          <button
            onClick={() => onContinue(complaintText)}
            className="w-full py-3.5 px-6 rounded-full bg-[#0D6E6E] text-white font-bold text-sm shadow-md hover:bg-[#0b5c5c] active:scale-[0.99] transition-all flex items-center justify-center space-x-2 cursor-pointer"
            type="button"
          >
            <span>Continue to Duration &amp; Severity</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>

          <div className="flex items-center space-x-1 mt-2 text-[10.5px] text-slate-500 font-medium">
            <span className="material-symbols-outlined text-[13px] text-[#0D6E6E]">verified_user</span>
            <span>Your answers are private, encrypted &amp; secure · ABDM Compliant</span>
          </div>
        </div>
      </main>
    </div>
  );
};
