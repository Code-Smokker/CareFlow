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
  app.enableCors({ origin: "*" });

  const port = config.get("GATEWAY_PORT", { infer: true });
  await app.listen(port);
  rootLogger.info({ port }, "gateway listening");
}

bootstrap();
