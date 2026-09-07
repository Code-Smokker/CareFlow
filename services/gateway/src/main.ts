import "reflect-metadata";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { NestFactory } from "@nestjs/core";
import { RequestMethod } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/http-exception.filter";
import { requestLogMiddleware } from "./common/request-log.middleware";
import { PinoNestLogger, rootLogger } from "./common/logger";
import type { Env } from "./common/env";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new PinoNestLogger(),
  });
  const config = app.get(ConfigService<Env, true>);

  app.use(requestLogMiddleware);
  // /health stays unversioned — services/README.md: "Each exposes /health", the plain infra
  // probe path, not a contract endpoint.
  app.setGlobalPrefix("v1", {
    exclude: [{ path: "health", method: RequestMethod.GET }],
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useWebSocketAdapter(new IoAdapter(app));
  // Wildcard origin can't be combined with credentials (browsers reject it outright), and the
  // intake PWA needs credentials for its session cookie — so this is an explicit origin list,
  // not "*". PUBLIC_WEB_URL covers the primary client; CORS_ORIGINS adds any others (a kiosk
  // build, a staging host) as a comma-separated list.
  const publicWebUrl = config.get("PUBLIC_WEB_URL", { infer: true });
  const extraOrigins = config.get("CORS_ORIGINS", { infer: true });
  const origins = [publicWebUrl, ...extraOrigins.split(",").map((o) => o.trim()).filter(Boolean)];
  app.enableCors({ origin: origins, credentials: true });

  const port = config.get("GATEWAY_PORT", { infer: true });
  await app.listen(port);
  rootLogger.info({ port }, "gateway listening");
}

bootstrap();
