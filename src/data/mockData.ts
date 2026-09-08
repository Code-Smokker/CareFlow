import { CareFlowSession } from '../types';

export const initialPatientData: CareFlowSession = {
  language: 'hi',
  languageName: 'हिन्दी',
  consents: {
    essentialHealth: true,
    voiceCare: true,
    pastRecords: false,
  },
  abhaId: '91-4920-8472-1029',
  abhaVerified: true,
  dob: '14 / 08 / 1994',
  mobile: '98765 43210',
  gender: 'female',
  attendantMode: 'myself',
  chiefComplaint: 'Chest pain and mild dizziness since yesterday evening',
  symptoms: ['fever', 'cough'],
  tokenNumber: 'A-104',
  fullName: 'Anil Kumar',
  reasonForVisitEn: 'Fever and continuous cough for 3 days',
  reasonForVisitHi: 'छाती में दर्द और खाँसी',
  symptomsEn: ['Fever', 'Cough', 'Runny nose'],
  symptomsHi: ['बुखार', 'खाँसी', 'बहती नाक'],
  durationEn: '2 days',
  durationHi: '2 दिन से लक्षण हैं',
  painSeverity: 6,
  hasRedFlag: true,
  redFlagReasonEn: 'Severe chest discomfort started recently with high severity',
  redFlagReasonHi: 'हाल ही में शुरू हुई छाती में तेज असुविधा',
  document: {
    fileName: 'Prescription_scan_01.jpg',
    fileSize: '1.8 MB',
    capturedAt: 'Captured just now',
    category: 'prescription',
    doctorName: 'Dr. Sharma',
    doctorSpecialty: 'Cardiologist',
    clinicName: 'Apollo Clinic',
    consultationDate: '12 Aug 2026',
    documentType: 'Prescription (प्रिस्क्रिप्शन)',
    subType: 'OPD Consultation slip',
    medicines: ['Telmisartan 40mg', 'Atorvastatin 10mg', 'Aspirin 75mg'],
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80'
  }
};

export const CAREFLOW_LOGO_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxCwVONGSmBC49D24uK_x6dUuQZAxKD6OSttQZSYwtEZLJgv5nv9yUi9y_-s-Lxv7rEUyfPfQS08HnVltfDN4VK_PwtXCrarTMkd_7mZHzne_FK4honf_dGYJuRBVkmWUUxp_NxExj9oU6Ue877MXsK4Fin5ou1g2gfFBG4sywyAzfPFZDMCLEpC7IkbYmLYHFAMdd6QdN9O4kqSsXQabX4PEipelJ4MbtOJL0lRmtLQdoQKqjOkJBiqhZahWr-T9TK7M';
