import { resolve } from "node:path";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { validateEnv } from "./common/env";
import { HealthModule } from "./health/health.module";
import { OntologyModule } from "./ontology/ontology.module";
import { PrismaModule } from "./prisma/prisma.module";
import { SessionsModule } from "./sessions/sessions.module";
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
    OntologyModule,
    WebsocketModule,
    HealthModule,
    SessionsModule,
  ],
})
export class AppModule {}
