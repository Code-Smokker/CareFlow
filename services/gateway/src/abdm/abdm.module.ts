import { Global, Module, type Provider } from "@nestjs/common";
import { ABDM_CLIENT } from "./abdm.tokens";
import { MockAbdmGateway } from "./mock-abdm-gateway";

/** ABDM_MODE picks the adapter; AbdmClient (abdm-client.interface.ts) is the one interface
 * every caller depends on. `sandbox` has no implementation yet — failing loudly at startup
 * beats silently falling back to the mock under a label that claims otherwise. */
const abdmClientProvider: Provider = {
  provide: ABDM_CLIENT,
  useFactory: () => {
    const mode = process.env.ABDM_MODE ?? "mock";
    if (mode === "mock") return new MockAbdmGateway();
    throw new Error(
      `ABDM_MODE=${mode} has no implementation yet — only "mock" exists (docs/08-abdm-fhir.md, ADR 0006).`,
    );
  },
};

@Global()
@Module({
  providers: [abdmClientProvider],
  exports: [ABDM_CLIENT],
})
export class AbdmModule {}
