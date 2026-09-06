/**
 * ABHA v3 client interface — docs/08-abdm-fhir.md. `ABDM_MODE=mock` (the default) is served by
 * MockAbdmGateway; `ABDM_MODE=sandbox` will be served by a real client hitting
 * https://abhasbx.abdm.gov.in/abha/api once sandbox credentials exist. Both implement this
 * exact interface — flipping the env var changes nothing else (ADR 0006).
 */

export interface AbhaDemographics {
  name: string | null;
  gender: "male" | "female" | "other" | "unknown" | null;
  yearOfBirth: number | null;
  abhaAddress: string | null;
}

export interface IdentifyByQrResult {
  patientId: string;
  demographics: AbhaDemographics;
}

export interface RequestOtpResult {
  txnId: string;
}

export interface VerifyOtpResult {
  patientId: string;
  token: string;
}

export type CareContextLinkStatus = "linked (mock)" | "linked" | "failed";

export interface LinkCareContextResult {
  status: CareContextLinkStatus;
  /** Present only for a real (non-mock) link attempt. */
  careContextReference?: string;
}

export interface AbdmClient {
  identifyByQr(qrPayload: string): Promise<IdentifyByQrResult>;
  requestOtp(input: { abhaNumber?: string; mobile?: string }): Promise<RequestOtpResult>;
  verifyOtp(input: { txnId: string; otp: string }): Promise<VerifyOtpResult>;
  linkCareContext(input: { patientId: string; visitId: string; fhirBundleId: string }): Promise<LinkCareContextResult>;
}

export class AbdmError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }
}
