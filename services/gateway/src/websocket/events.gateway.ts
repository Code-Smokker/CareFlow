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

/**
 * Rooms: `session:{id}` and `department:{code}` (docs/03-api-contracts.md). A client joins by
 * connecting with `?session_id=` and/or `?department=` in the handshake query — no separate
 * join handshake message needed for what Day 1 pushes (question.next, slot.filled,
 * redflag.fired, session.resumed).
 */
@Injectable()
@WebSocketGateway({ cors: { origin: "*" } })
export class EventsGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server!: Server;

  handleConnection(client: Socket) {
    const sessionId = firstQueryValue(client.handshake.query.session_id);
    const department = firstQueryValue(client.handshake.query.department);
    if (sessionId) client.join(sessionRoom(sessionId));
    if (department) client.join(departmentRoom(department));
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
