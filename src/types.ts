export type ScreenId =
  | 'splash'
  | 'checkin'
  | 'language'
  | 'consent'
  | 'abha-scan'
  | 'abha-otp'
  | 'profile'
  | 'attendant'
  | 'chief-complaint'
  | 'symptoms'
  | 'capture'
  | 'processing'
  | 'review'
  | 'summary'
  | 'alert'
  | 'handoff'
  | 'complete';

export type Language = 'en' | 'hi';
export type DocumentCategory = 'prescription' | 'lab_report' | 'other_doc';

export interface ExtractedDocumentData {
  fileName: string;
  fileSize: string;
  capturedAt: string;
  category: DocumentCategory;
  doctorName: string;
  doctorSpecialty: string;
  clinicName: string;
  consultationDate: string;
  documentType: string;
  subType: string;
  medicines: string[];
  imageUrl?: string;
}

export interface CareFlowSession {
  language: string;
  languageName: string;
  consents: {
    essentialHealth: boolean;
    voiceCare: boolean;
    pastRecords: boolean;
  };
  abhaId?: string;
  abhaVerified?: boolean;
  fullName: string;
  dob: string;
  mobile: string;
  gender: 'female' | 'male' | 'other' | 'unspecified';
  attendantMode: 'myself' | 'helper';
  attendantName?: string;
  attendantRole?: 'family' | 'caregiver' | 'asha';
  chiefComplaint: string;
  symptoms: string[];
  tokenNumber: string;

  reasonForVisitEn?: string;
  reasonForVisitHi?: string;
  symptomsEn?: string[];
  symptomsHi?: string[];
  durationEn?: string;
  durationHi?: string;
  painSeverity?: number;
  
  hasRedFlag?: boolean;
  redFlagReasonEn?: string;
  redFlagReasonHi?: string;
  
  document?: ExtractedDocumentData;
}
