import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ABDM_CLIENT } from "../abdm/abdm.tokens";
import { AbdmError, type AbdmClient } from "../abdm/abdm-client.interface";
import { AppException } from "../common/app-exception";
import { FieldCipher } from "../common/crypto";
import type { Env } from "../common/env";
import { rootLogger } from "../common/logger";
import { PrismaService } from "../prisma/prisma.service";
import type { IdentifyByQrDto, RequestOtpDto, VerifyOtpDto } from "./dto/identity.dto";

/**
 * Known gap, not an oversight: these endpoints don't take a session_id (that's the existing
 * OpenAPI shape, docs/03-api-contracts.md), so identity resolved here creates a *new* Patient
 * row rather than updating an in-progress session's placeholder one — ADR 0007 flags exactly
 * this handoff as the thing whoever wires a real identity flow needs to get right. Out of
 * scope for today's ABDM-mock-adapter task; wiring `session_id` through is the next step.
 */
@Injectable()
export class IdentityService {
  private readonly cipher: FieldCipher;

  constructor(
    @Inject(ABDM_CLIENT) private readonly abdm: AbdmClient,
    private readonly prisma: PrismaService,
    config: ConfigService<Env, true>,
  ) {
    this.cipher = new FieldCipher(config.get("FIELD_ENCRYPTION_KEY", { infer: true }));
  }

  async identifyByQr(body: IdentifyByQrDto) {
    const result = await this.callAbdm(() => this.abdm.identifyByQr(body.qr_payload));
    const age = result.demographics.yearOfBirth ? new Date().getFullYear() - result.demographics.yearOfBirth : 0;

    const patient = await this.prisma.patient.create({
      data: {
        abhaNumber: result.demographics.abhaAddress ? this.cipher.encrypt(result.demographics.abhaAddress) : null,
        abhaAddress: result.demographics.abhaAddress,
        name: result.demographics.name ? this.cipher.encrypt(result.demographics.name) : null,
        sex: toSex(result.demographics.gender),
      },
    });
    rootLogger.info({ patient_id: patient.id }, "patient identified via abha qr (mock)");

    return {
      patient_id: patient.id,
      demographics: {
        name: result.demographics.name ?? "",
        age,
        sex: toSex(result.demographics.gender) ?? "unknown",
        phone: null,
        abha_address: result.demographics.abhaAddress,
      },
    };
  }

  async requestOtp(body: RequestOtpDto) {
    const result = await this.callAbdm(() =>
      this.abdm.requestOtp({ abhaNumber: body.abha_number ?? undefined, mobile: body.mobile ?? undefined }),
    );
    return { txn_id: result.txnId };
  }

  async verifyOtp(body: VerifyOtpDto) {
    const result = await this.callAbdm(() => this.abdm.verifyOtp({ txnId: body.txn_id, otp: body.otp }));
    // No demographics come back from verifyOtp in this mock (docs/08-abdm-fhir.md's flow
    // fetches the profile in a separate call, `GET /v3/profile/account` — not implemented
    // here, out of this task's three-endpoint scope) — an anonymous placeholder patient is
    // the honest result of "OTP verified, identity not yet resolved further."
    const patient = await this.prisma.patient.create({ data: {} });
    rootLogger.info({ patient_id: patient.id }, "patient identified via abha otp (mock)");
    return { patient_id: patient.id, token: result.token };
  }

  /** Maps AbdmError's real ABDM error codes (Annexure 2 — see mock-abdm-gateway.ts) onto the
   * gateway's own `{error:{code,message}}` envelope rather than letting them surface as an
   * unhandled 500. */
  private async callAbdm<T>(thunk: () => Promise<T>): Promise<T> {
    try {
      return await thunk();
    } catch (err) {
      if (err instanceof AbdmError) {
        throw new AppException(400, err.code, err.message);
      }
      throw err;
    }
  }
}

function toSex(gender: "male" | "female" | "other" | "unknown" | null): "male" | "female" | "other" | "unknown" | undefined {
  return gender ?? undefined;
}
