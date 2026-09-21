import { Controller, Get } from "@nestjs/common";
import { SessionsService } from "./sessions.service";

/** GET /v1/departments — what a token slip can be issued for. AYUSH mode comes from visit config. */
@Controller("departments")
export class DepartmentsController {
  constructor(private readonly sessions: SessionsService) {}

  @Get()
  list() {
    return this.sessions.listDepartments();
  }
}
