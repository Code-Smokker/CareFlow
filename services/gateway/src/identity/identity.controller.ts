import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import {
  type IdentifyByQrDto,
  IdentifyByQrSchema,
  type RequestOtpDto,
  RequestOtpSchema,
  type VerifyOtpDto,
  VerifyOtpSchema,
} from "./dto/identity.dto";
import { IdentityService } from "./identity.service";

@Controller("identity")
export class IdentityController {
  constructor(private readonly identity: IdentityService) {}

  @Post("abha/qr")
  @HttpCode(200)
  identifyByQr(@Body(new ZodValidationPipe(IdentifyByQrSchema)) body: IdentifyByQrDto) {
    return this.identity.identifyByQr(body);
  }

  @Post("abha/otp/request")
  @HttpCode(200)
  requestOtp(@Body(new ZodValidationPipe(RequestOtpSchema)) body: RequestOtpDto) {
    return this.identity.requestOtp(body);
  }

  @Post("abha/otp/verify")
  @HttpCode(200)
  verifyOtp(@Body(new ZodValidationPipe(VerifyOtpSchema)) body: VerifyOtpDto) {
    return this.identity.verifyOtp(body);
  }
}
