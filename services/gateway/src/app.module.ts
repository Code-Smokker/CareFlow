import { resolve } from "node:path";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { validateEnv } from "./common/env";
import { AbdmModule } from "./abdm/abdm.module";
import { AiModule } from "./ai/ai.module";
import { StorageModule } from "./common/storage.module";
import { DocAiModule } from "./docai/docai.module";
import { DocumentsModule } from "./documents/documents.module";
import { HealthModule } from "./health/health.module";
import { IdentityModule } from "./identity/identity.module";
import { OntologyModule } from "./ontology/ontology.module";
import { PrismaModule } from "./prisma/prisma.module";
import { RedFlagsModule } from "./redflags/redflags.module";
import { SessionsModule } from "./sessions/sessions.module";
import { TerminologyModule } from "./terminology/terminology.module";
import { VisitsModule } from "./visits/visits.module";
import { WebsocketModule } from "./websocket/websocket.module";

@Module({
  imports: [
    // Single .env at the repo root (see .env.example) — every service reads from there, not
    // a per-service copy, regardless of which directory this process is launched from.
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: resolve(__dirname, "../../../.env"),
      validate: validateEnv,
    }),
    PrismaModule,
    StorageModule,
    OntologyModule,
    AiModule,
    DocAiModule,
    TerminologyModule,
    AbdmModule,
    WebsocketModule,
    HealthModule,
    SessionsModule,
    VisitsModule,
    RedFlagsModule,
    IdentityModule,
    DocumentsModule,
  ],
})
export class AppModule {}
