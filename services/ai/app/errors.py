from typing import Any

from fastapi import Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel


class ErrorDetail(BaseModel):
    code: str
    message: str
    details: dict[str, Any] | None = None


class ErrorResponse(BaseModel):
    error: ErrorDetail


class AppError(Exception):
    """Every error response is `{ error: { code, message, details? } }` — docs/03-api-contracts.md.
    Raise this instead of a bare exception so the machine-readable code survives into the body."""

    def __init__(self, status_code: int, code: str, message: str, details: dict[str, Any] | None = None):
        super().__init__(message)
        self.status_code = status_code
        self.code = code
        self.message = message
        self.details = details


async def app_error_handler(_request: Request, exc: AppError) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(error=ErrorDetail(code=exc.code, message=exc.message, details=exc.details)).model_dump(),
    )


async def unhandled_error_handler(_request: Request, exc: Exception) -> JSONResponse:
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            error=ErrorDetail(code="internal_error", message="Something went wrong. Please try again.")
        ).model_dump(),
    )
