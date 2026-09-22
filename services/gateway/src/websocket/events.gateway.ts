import { Injectable } from "@nestjs/common";
import {
  type OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import {
  departmentRoom,
  sessionRoom,
  type WsEvent,
  type WsEventPayload,
} from "@careflow/contracts";
import type { Server, Socket } from "socket.io";
import { rootLogger } from "../common/logger";

// Same origin list as the HTTP CORS config (src/main.ts) — read directly from process.env
// here because the @WebSocketGateway() decorator's options are fixed at class-decoration time,
// before Nest's DI container (and ConfigService) exists.
const WS_ORIGINS = [
  process.env.PUBLIC_WEB_URL || "http://localhost:3000",
  ...(process.env.CORS_ORIGINS || "").split(",").map((o) => o.trim()).filter(Boolean),
];

/**
 * Rooms: `session:{id}` and `department:{code}` (docs/03-api-contracts.md). A client joins by
 * connecting with `?session_id=` and/or `?department=` in the handshake query — no separate
 * join handshake message needed for what Day 1 pushes (question.next, slot.filled,
 * redflag.fired, session.resumed).
 */
@Injectable()
@WebSocketGateway({ cors: { origin: WS_ORIGINS, credentials: true } })
export class EventsGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server!: Server;

  handleConnection(client: Socket) {
    const sessionId = firstQueryValue(client.handshake.query.session_id);
    const department = firstQueryValue(client.handshake.query.department);
    if (sessionId) client.join(sessionRoom(sessionId));
    // A staff screen can watch several departments at once: `department=general,ayurveda`.
    for (const code of (department ?? "").split(",").map((d) => d.trim()).filter(Boolean)) client.join(departmentRoom(code));
    rootLogger.debug(
      { session_id: sessionId, department, socket_id: client.id },
      "ws connected",
    );
  }

  emitToSession<E extends WsEvent>(
    sessionId: string,
    event: E,
    payload: WsEventPayload<E>,
  ) {
    this.server.to(sessionRoom(sessionId)).emit(event, payload);
  }

  emitToDepartment<E extends WsEvent>(
    departmentCode: string,
    event: E,
    payload: WsEventPayload<E>,
  ) {
    this.server.to(departmentRoom(departmentCode)).emit(event, payload);
  }
}

function firstQueryValue(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  return undefined;
}
