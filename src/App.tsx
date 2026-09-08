import React, { useState } from 'react';
import { ScreenId, CareFlowSession } from './types';
import { initialPatientData } from './data/mockData';

// Common
import { Header } from './components/Header';
import { EditModal } from './components/EditModal';
import { DocumentModal } from './components/DocumentModal';

// Project 1 Screens
import { SplashScreen } from './components/screens/SplashScreen';
import { CheckInScreen } from './components/screens/CheckInScreen';
import { LanguageScreen } from './components/screens/LanguageScreen';
import { ConsentScreen } from './components/screens/ConsentScreen';
import { AbhaScanScreen } from './components/screens/AbhaScanScreen';
import { AbhaOtpScreen } from './components/screens/AbhaOtpScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { AttendantScreen } from './components/screens/AttendantScreen';
import { ChiefComplaintScreen } from './components/screens/ChiefComplaintScreen';
import { SymptomsScreen } from './components/screens/SymptomsScreen';
// (Skipping Project 1's CompleteScreen in favor of Project 2's or integrating smoothly)

// Project 2 Screens
import { ScreenCapture } from './components/ScreenCapture';
import { ScreenProcessing } from './components/ScreenProcessing';
import { ScreenReview } from './components/ScreenReview';
import { ScreenSummary } from './components/ScreenSummary';
import { ScreenAlert } from './components/ScreenAlert';
import { ScreenHandoff } from './components/ScreenHandoff';
import { ScreenComplete } from './components/ScreenComplete';

const INITIAL_CAREFLOW_SESSION: CareFlowSession = {
  // P1 defaults
  language: 'hi',
  languageName: 'हिन्दी',
  consents: {
    essentialHealth: true,
    voiceCare: true,
    pastRecords: false,
  },
  abhaId: '91-4920-8472-1029',
  abhaVerified: true,
  fullName: 'Priya Sharma',
  dob: '14 / 08 / 1994',
  mobile: '98765 43210',
  gender: 'female',
  attendantMode: 'myself',
  chiefComplaint: 'Chest pain and mild dizziness since yesterday evening',
  symptoms: ['fever', 'cough'],
  tokenNumber: 'A-104',
  
  // P2 defaults merged from mockData
  reasonForVisitEn: initialPatientData.reasonForVisitEn,
  reasonForVisitHi: initialPatientData.reasonForVisitHi,
  symptomsEn: initialPatientData.symptomsEn,
  symptomsHi: initialPatientData.symptomsHi,
  durationEn: initialPatientData.durationEn,
  durationHi: initialPatientData.durationHi,
  painSeverity: initialPatientData.painSeverity,
  hasRedFlag: initialPatientData.hasRedFlag,
  redFlagReasonEn: initialPatientData.redFlagReasonEn,
  redFlagReasonHi: initialPatientData.redFlagReasonHi,
  document: initialPatientData.document,
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('splash');
  const [session, setSession] = useState<CareFlowSession>(INITIAL_CAREFLOW_SESSION);
  const [showNavPill, setShowNavPill] = useState(false);

  // Modals state
  const [editField, setEditField] = useState<string | null>(null);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);

  const handleLanguageChange = (langLabel: string) => {
    // Both screens might pass 'en', 'hi', or 'English', 'हिन्दी'
    let code = 'en';
    let name = 'English';
    if (langLabel === 'hi' || langLabel === 'हिन्दी') {
      code = 'hi';
      name = 'हिन्दी';
    }
    
    setSession((prev) => ({
      ...prev,
      language: code,
      languageName: name,
    }));
  };

  const handleToggleLanguage = () => {
    handleLanguageChange(session.language === 'en' ? 'hi' : 'en');
  };

  const handleRestart = () => {
    setSession(INITIAL_CAREFLOW_SESSION);
    setCurrentScreen('splash');
  };

  const handleBack = () => {
    switch (currentScreen) {
      case 'language': setCurrentScreen('checkin'); break;
      case 'consent': setCurrentScreen('language'); break;
      case 'abha-scan': setCurrentScreen('consent'); break;
      case 'abha-otp': setCurrentScreen('abha-scan'); break;
      case 'profile': setCurrentScreen('abha-otp'); break;
      case 'attendant': setCurrentScreen('profile'); break;
      case 'chief-complaint': setCurrentScreen('attendant'); break;
      case 'symptoms': setCurrentScreen('chief-complaint'); break;
      case 'capture': setCurrentScreen('symptoms'); break;
      case 'processing': setCurrentScreen('capture'); break;
      case 'review': setCurrentScreen('processing'); break;
      case 'summary': setCurrentScreen('review'); break;
      case 'alert': setCurrentScreen('summary'); break;
      case 'handoff': setCurrentScreen(session.hasRedFlag ? 'alert' : 'summary'); break;
      case 'complete': setCurrentScreen('handoff'); break;
      default: break;
    }
  };

  const screensList: { id: ScreenId; label: string; step: string }[] = [
    { id: 'splash', label: 'Splash Welcome', step: 'Start' },
    { id: 'checkin', label: 'Kiosk Scan / Token', step: 'Arrival' },
    { id: 'language', label: 'Language Select', step: 'Step 1' },
    { id: 'consent', label: 'Privacy & Consent', step: 'Step 2' },
    { id: 'abha-scan', label: 'ABHA QR Scanner', step: 'Step 3A' },
    { id: 'abha-otp', label: 'Verify ABHA OTP', step: 'Step 3B' },
    { id: 'profile', label: 'Profile Information', step: 'Step 3C' },
    { id: 'attendant', label: 'Attendant Mode', step: 'Step 4' },
    { id: 'chief-complaint', label: 'Chief Complaint', step: 'Step 5A' },
    { id: 'symptoms', label: 'Symptoms Triage', step: 'Step 5B' },
    { id: 'capture', label: 'Document Capture', step: 'Step 6A' },
    { id: 'processing', label: 'Document Processing', step: 'Step 6B' },
    { id: 'review', label: 'Document Review', step: 'Step 6C' },
    { id: 'summary', label: 'Pre-Consultation Summary', step: 'Step 7' },
    { id: 'alert', label: 'Clinical Alert', step: 'Step 8A' },
    { id: 'handoff', label: 'Care Handoff', step: 'Step 8B' },
    { id: 'complete', label: 'Session Complete', step: 'Step 9' },
  ];

  return (
    <div className="min-h-screen bg-[#111827] flex flex-col items-center justify-start sm:py-6 p-0 sm:px-4 antialiased selection:bg-[#ccfbf1] selection:text-[#0d6e6e]">
      <div className="w-full max-w-[430px] min-h-[844px] bg-[#faf8ff] text-[#131b2e] shadow-2xl relative overflow-hidden sm:rounded-[36px] border border-slate-700/30 flex flex-col">
        
        {/* Global Header (hidden on splash) */}
        {currentScreen !== 'splash' && (
          <Header
            currentScreen={currentScreen}
            currentLanguage={session.languageName}
            language={session.language}
            onLanguageChange={handleLanguageChange}
            onToggleLanguage={handleToggleLanguage}
            onBack={handleBack}
            showBack={currentScreen !== 'checkin'}
            patientName={session.fullName}
          />
        )}

        <main className="flex-1 w-full flex flex-col relative">
          {/* ---- PROJECT 1 SCREENS ---- */}
          {currentScreen === 'splash' && (
            <SplashScreen onContinue={() => setCurrentScreen('checkin')} />
          )}

          {currentScreen === 'checkin' && (
            <CheckInScreen
              currentLanguage={session.languageName}
              onLanguageChange={handleLanguageChange}
              onContinue={() => setCurrentScreen('language')}
              onTokenSelected={(token) => {
                setSession((prev) => ({ ...prev, tokenNumber: token }));
                setCurrentScreen('language');
              }}
            />
          )}

          {currentScreen === 'language' && (
            <LanguageScreen
              currentLanguage={session.languageName}
              onLanguageChange={handleLanguageChange}
              onContinue={() => setCurrentScreen('consent')}
              onBack={() => setCurrentScreen('checkin')}
              onSwitchAttendant={() => setCurrentScreen('attendant')}
            />
          )}

          {currentScreen === 'consent' && (
            <ConsentScreen
              currentLanguage={session.languageName}
              onLanguageChange={handleLanguageChange}
              onContinue={(consents) => {
                setSession((prev) => ({ ...prev, consents }));
                setCurrentScreen('abha-scan');
              }}
              onBack={() => setCurrentScreen('language')}
            />
          )}

          {currentScreen === 'abha-scan' && (
            <AbhaScanScreen
              currentLanguage={session.languageName}
              onLanguageChange={handleLanguageChange}
              onContinue={(abha) => {
                setSession((prev) => ({
                  ...prev,
                  abhaId: abha.abhaId,
                  fullName: abha.name,
                  abhaVerified: true,
                }));
                setCurrentScreen('profile');
              }}
              onEnterManualNumber={() => setCurrentScreen('abha-otp')}
              onBack={() => setCurrentScreen('consent')}
            />
          )}

          {currentScreen === 'abha-otp' && (
            <AbhaOtpScreen
              currentLanguage={session.languageName}
              onLanguageChange={handleLanguageChange}
              onContinue={() => setCurrentScreen('profile')}
              onBackToScan={() => setCurrentScreen('abha-scan')}
              onBack={() => setCurrentScreen('abha-scan')}
            />
          )}

          {currentScreen === 'profile' && (
            <ProfileScreen
              currentLanguage={session.languageName}
              onLanguageChange={handleLanguageChange}
              onContinue={(profile) => {
                setSession((prev) => ({
                  ...prev,
                  fullName: profile.fullName,
                  dob: profile.dob,
                  mobile: profile.mobile,
                  gender: profile.gender,
                }));
                setCurrentScreen('attendant');
              }}
              onConnectAbha={() => setCurrentScreen('abha-scan')}
              onBack={() => setCurrentScreen('abha-otp')}
            />
          )}

          {currentScreen === 'attendant' && (
            <AttendantScreen
              currentLanguage={session.languageName}
              onLanguageChange={handleLanguageChange}
              onContinue={(modeData) => {
                setSession((prev) => ({
                  ...prev,
                  attendantMode: modeData.mode,
                  attendantName: modeData.attendantName,
                  attendantRole: modeData.role,
                }));
                setCurrentScreen('chief-complaint');
              }}
              onBack={() => setCurrentScreen('profile')}
            />
          )}

          {currentScreen === 'chief-complaint' && (
            <div className="flex-1 relative">
              <ChiefComplaintScreen
                currentLanguage={session.languageName}
                onLanguageChange={handleLanguageChange}
                onContinue={(complaint) => {
                  setSession((prev) => ({ ...prev, chiefComplaint: complaint }));
                  setCurrentScreen('symptoms');
                }}
                onBack={() => setCurrentScreen('attendant')}
              />
            </div>
          )}

          {currentScreen === 'symptoms' && (
            <div className="flex-1 relative">
              <SymptomsScreen
                currentLanguage={session.languageName}
                onLanguageChange={handleLanguageChange}
                onContinue={(symptoms) => {
                  setSession((prev) => ({ ...prev, symptoms }));
                  setCurrentScreen('capture'); // LINK TO PROJECT 2
                }}
                onBack={() => setCurrentScreen('chief-complaint')}
              />
            </div>
          )}

          {/* ---- PROJECT 2 SCREENS ---- */}
          {currentScreen === 'capture' && (
            <div className="p-4 flex-1">
              <ScreenCapture
                patientData={session}
                language={session.language as any}
                onUpdateDocument={(docUpdates) =>
                  setSession((prev) => ({
                    ...prev,
                    document: { ...prev.document!, ...docUpdates },
                  }))
                }
                onCapture={() => setCurrentScreen('processing')}
                onCaptureComplete={(fileInfo) => {
                  if (fileInfo) {
                    setSession((prev) => ({
                      ...prev,
                      document: {
                        ...prev.document!,
                        fileName: fileInfo.name,
                        fileSize: fileInfo.size,
                        capturedAt: 'Captured just now',
                      },
                    }));
                  }
                  setCurrentScreen('processing');
                }}
                onSkipToProcess={() => setCurrentScreen('processing')}
              />
            </div>
          )}

          {currentScreen === 'processing' && (
            <div className="p-4 flex-1">
              <ScreenProcessing
                patientData={session}
                language={session.language as any}
                onContinue={() => setCurrentScreen('review')}
                onRetake={() => setCurrentScreen('capture')}
                onViewPreview={() => setIsDocModalOpen(true)}
              />
            </div>
          )}

          {currentScreen === 'review' && (
            <div className="p-4 flex-1">
              <ScreenReview
                patientData={session}
                language={session.language as any}
                onContinue={() => setCurrentScreen('summary')}
                onRetake={() => setCurrentScreen('capture')}
                onViewOriginal={() => setIsDocModalOpen(true)}
                onEditField={(field) => setEditField(field)}
              />
            </div>
          )}

          {currentScreen === 'summary' && (
            <div className="p-4 flex-1">
              <ScreenSummary
                patientData={session}
                language={session.language as any}
                onContinue={() => {
                  if (session.hasRedFlag) setCurrentScreen('alert');
                  else setCurrentScreen('handoff');
                }}
                onViewDoc={() => setIsDocModalOpen(true)}
                onEditSection={(sec) => setEditField(sec)}
              />
            </div>
          )}

          {currentScreen === 'alert' && (
            <div className="p-4 flex-1">
              <ScreenAlert
                patientData={session}
                language={session.language as any}
                onContinue={() => setCurrentScreen('handoff')}
              />
            </div>
          )}

          {currentScreen === 'handoff' && (
            <div className="p-4 flex-1">
              <ScreenHandoff
                patientData={session}
                language={session.language as any}
                onShare={() => setCurrentScreen('complete')}
                onReviewBack={() => setCurrentScreen('summary')}
              />
            </div>
          )}

          {currentScreen === 'complete' && (
            <div className="p-4 flex-1">
              <ScreenComplete
                patientData={session}
                language={session.language as any}
                onFinish={() => alert('Care triage submitted successfully! ABDM session archived.')}
                onRestart={handleRestart}
              />
            </div>
          )}
        </main>

        {/* Floating Quick Screen Navigator */}
        <div className="fixed bottom-3 right-3 z-50">
          <button
            onClick={() => setShowNavPill(!showNavPill)}
            className="px-3.5 py-2 rounded-full bg-[#005454] hover:bg-[#0d6e6e] text-white shadow-xl text-[12px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-teal-400/40"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">view_carousel</span>
            <span>Screens ({screensList.findIndex((s) => s.id === currentScreen) + 1}/{screensList.length})</span>
          </button>

          {showNavPill && (
            <div className="absolute bottom-12 right-0 w-72 bg-white rounded-2xl p-2.5 shadow-2xl border border-slate-200 text-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-slate-100 px-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#005454]">
                  CareFlow Screen Index
                </span>
                <button
                  onClick={() => setShowNavPill(false)}
                  className="w-5 h-5 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-1 pr-1">
                {screensList.map((screen, idx) => (
                  <button
                    key={screen.id}
                    onClick={() => {
                      setCurrentScreen(screen.id);
                      setShowNavPill(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-[11.5px] flex items-center justify-between transition-colors cursor-pointer ${
                      currentScreen === screen.id
                        ? 'bg-[#005454] text-white font-bold'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[10px] opacity-70 w-4 font-mono">{idx + 1}.</span>
                      <span className="truncate">{screen.label}</span>
                    </div>
                    <span className="text-[9.5px] px-1.5 py-0.5 rounded-full uppercase font-bold shrink-0 bg-slate-100 text-slate-500">
                      {screen.step}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        <EditModal
          isOpen={Boolean(editField)}
          field={editField}
          patientData={session}
          onClose={() => setEditField(null)}
          onSave={(updatedData) => setSession((prev) => ({ ...prev, ...updatedData }))}
        />

        <DocumentModal
          isOpen={isDocModalOpen}
          document={session.document!}
          onClose={() => setIsDocModalOpen(false)}
        />
      </div>
    </div>
  );
}
