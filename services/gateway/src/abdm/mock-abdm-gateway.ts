import { randomBytes, randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";
import { rootLogger } from "../common/logger";
import {
  type AbdmClient,
  AbdmError,
  type AbhaDemographics,
  type IdentifyByQrResult,
  type LinkCareContextResult,
  type RequestOtpResult,
  type VerifyOtpResult,
} from "./abdm-client.interface";

/**
 * ABDM_MODE=mock (the default — ADR 0006). Mirrors the real ABHA v3 request/response shapes
 * behind AbdmClient so ABDM_MODE=sandbox later changes only which class gets instantiated, not
 * any calling code (services/gateway/src/sessions, src/visits).
 *
 * Every shape below is marked DOCUMENTED (verified against docs/08-abdm-fhir.md or the sources
 * cited there) or ASSUMED (this repo's best guess, not yet checked against a live sandbox
 * response) — see docs/08-abdm-fhir.md's own "DOCUMENTED vs ASSUMED" section, which this file
 * must stay in sync with. When sandbox credentials arrive: diff every ASSUMED shape here
 * against what the sandbox actually returns, fix this file, update that doc.
 */
@Injectable()
export class MockAbdmGateway implements AbdmClient {
  /** DOCUMENTED (docs/08-abdm-fhir.md): every ABDM request carries REQUEST-ID (fresh UUID),
   * TIMESTAMP (ISO 8601), and X-CM-ID ("sbx" in sandbox). A real (non-mock) client would send
   * these as HTTP headers; the mock never makes a network call, so it only logs them — that
   * log line is what "mirrors the request shape" means when there's no wire to put it on. */
  private commonHeaders(): Record<string, string> {
    return {
      "REQUEST-ID": randomUUID(),
      TIMESTAMP: new Date().toISOString(),
      "X-CM-ID": "sbx",
    };
  }

  /** ASSUMED: real ABHA v3 calls RSA-encrypt every sensitive field (Aadhaar, mobile, OTP)
   * using the public certificate fetched from `GET /v3/profile/public/certificate`
   * (DOCUMENTED — docs/08-abdm-fhir.md). Mock mode has no certificate to fetch and nowhere to
   * send the encrypted value, so this is a clearly-labelled no-op stub, not real RSA — it
   * exists so the *call site* looks like it will still be correct once a real client replaces
   * this one; it does not simulate the actual encryption. Replace when wiring ABDM_MODE=sandbox.
   */
  private encryptForAbdm(plaintext: string): string {
    return `MOCK_UNENCRYPTED(${plaintext})`;
  }

  async identifyByQr(qrPayload: string): Promise<IdentifyByQrResult> {
    const headers = this.commonHeaders();
    if (!qrPayload || qrPayload.trim().length === 0) {
      // DOCUMENTED code, ASSUMED applicability — HIS-2016 is documented for an invalid
      // Aadhaar/Virtual ID; QR payload validation isn't separately enumerated in the sources
      // this repo has checked, so re-using it here for "unreadable QR" is our best guess, not
      // a verified mapping.
      throw new AbdmError("HIS-2016", "Aadhaar Number/Virtual ID is invalid.");
    }
    rootLogger.debug({ headers, qr_payload_length: qrPayload.length }, "abdm mock: identifyByQr");

    // ASSUMED: a live sandbox response's exact demographic field names/shape haven't been
    // checked against a real response yet — this is CareFlow's own AbhaDemographics shape
    // (abdm-client.interface.ts), populated with a fixed synthetic fixture, not a decode of
    // `qrPayload` (the mock doesn't parse real ABHA QR payloads).
    const demographics: AbhaDemographics = {
      name: "Demo Patient",
      gender: "unknown",
      yearOfBirth: 1990,
      abhaAddress: "demo@abdm",
    };
    return { patientId: randomUUID(), demographics };
  }

  async requestOtp(input: { abhaNumber?: string; mobile?: string }): Promise<RequestOtpResult> {
    if (!input.abhaNumber && !input.mobile) {
      throw new AbdmError("HIS-2001", "Invalid Aadhaar number entered. Please enter a valid Aadhaar number.");
    }
    const headers = this.commonHeaders();
    const encryptedLoginId = this.encryptForAbdm(input.abhaNumber ?? input.mobile!);
    rootLogger.debug({ headers, encrypted_login_id: encryptedLoginId }, "abdm mock: requestOtp");

    // ASSUMED: real txnId format/length not verified against a live response.
    return { txnId: randomUUID() };
  }

  async verifyOtp(input: { txnId: string; otp: string }): Promise<VerifyOtpResult> {
    const headers = this.commonHeaders();
    const encryptedOtp = this.encryptForAbdm(input.otp);
    rootLogger.debug({ headers, encrypted_otp: encryptedOtp }, "abdm mock: verifyOtp");

    // DOCUMENTED codes (Annexure 2 error codes, cited in docs/08-abdm-fhir.md's DOCUMENTED vs
    // ASSUMED section) — real, specific ABDM error codes, not invented ones.
    if (!input.txnId) {
      throw new AbdmError("HIS-1026", "Transaction not found for UUID.");
    }
    if (input.otp !== "000000") {
      throw new AbdmError("HIS-2022", "Invalid OTP value.");
    }
    return { patientId: randomUUID(), token: randomBytes(24).toString("base64url") };
  }

  /** docs/08-abdm-fhir.md: "Under ABDM_MODE=mock this is logged and displayed rather than
   * transmitted — and the UI says so, rather than showing a fake success." The literal string
   * "linked (mock)" is what the UI must show verbatim; it must never read as a real link. */
  async linkCareContext(input: { patientId: string; visitId: string; fhirBundleId: string }): Promise<LinkCareContextResult> {
    const headers = this.commonHeaders();
    rootLogger.info(
      { headers, patient_id: input.patientId, visit_id: input.visitId, fhir_bundle_id: input.fhirBundleId },
      "abdm mock: care context linked (mock) — not transmitted to any ABDM gateway",
    );
    return { status: "linked (mock)" };
  }
}
