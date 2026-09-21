from http import HTTPStatus
from typing import Any

import httpx

from ...client import AuthenticatedClient, Client
from ...models.error_response import ErrorResponse
from ...models.get_audit_log_response_200 import GetAuditLogResponse200
from ...types import UNSET, Response, Unset


def _get_kwargs(
    *,
    limit: int | Unset = 50,
    cursor: str | Unset = UNSET,
    resource: str | Unset = UNSET,
    action: str | Unset = UNSET,
) -> dict[str, Any]:
    params: dict[str, Any] = {}

    params["limit"] = limit

    params["cursor"] = cursor

    params["resource"] = resource

    params["action"] = action

    params = {k: v for k, v in params.items() if v is not UNSET and v is not None}

    _kwargs: dict[str, Any] = {
        "method": "get",
        "url": "/v1/audit-log",
        "params": params,
    }

    return _kwargs


def _parse_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> ErrorResponse | GetAuditLogResponse200:
    if response.status_code == 200:
        response_200 = GetAuditLogResponse200.from_dict(response.json())

        return response_200

    response_default = ErrorResponse.from_dict(response.json())

    return response_default


def _build_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> Response[ErrorResponse | GetAuditLogResponse200]:
    return Response(
        status_code=HTTPStatus(response.status_code),
        content=response.content,
        headers=response.headers,
        parsed=_parse_response(client=client, response=response),
    )


def sync_detailed(
    *,
    client: AuthenticatedClient | Client,
    limit: int | Unset = 50,
    cursor: str | Unset = UNSET,
    resource: str | Unset = UNSET,
    action: str | Unset = UNSET,
) -> Response[ErrorResponse | GetAuditLogResponse200]:
    """Append-only audit log — DPDP compliance evidence

     Every row here was written by application code that never updates or deletes one
    (services/gateway/prisma/schema.prisma's AuditLog model) — enforced by a Postgres trigger, not just
    convention (audit_log_no_update / audit_log_no_delete, prisma/migrations/20260906055251_init).
    `integrity` reports what this endpoint itself just verified by querying pg_trigger, live, on this
    call — not a stored or asserted claim.

    Args:
        limit (int | Unset):  Default: 50.
        cursor (str | Unset):
        resource (str | Unset):
        action (str | Unset):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[ErrorResponse | GetAuditLogResponse200]
    """

    kwargs = _get_kwargs(
        limit=limit,
        cursor=cursor,
        resource=resource,
        action=action,
    )

    response = client.get_httpx_client().request(
        **kwargs,
    )

    return _build_response(client=client, response=response)


def sync(
    *,
    client: AuthenticatedClient | Client,
    limit: int | Unset = 50,
    cursor: str | Unset = UNSET,
    resource: str | Unset = UNSET,
    action: str | Unset = UNSET,
) -> ErrorResponse | GetAuditLogResponse200 | None:
    """Append-only audit log — DPDP compliance evidence

     Every row here was written by application code that never updates or deletes one
    (services/gateway/prisma/schema.prisma's AuditLog model) — enforced by a Postgres trigger, not just
    convention (audit_log_no_update / audit_log_no_delete, prisma/migrations/20260906055251_init).
    `integrity` reports what this endpoint itself just verified by querying pg_trigger, live, on this
    call — not a stored or asserted claim.

    Args:
        limit (int | Unset):  Default: 50.
        cursor (str | Unset):
        resource (str | Unset):
        action (str | Unset):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        ErrorResponse | GetAuditLogResponse200
    """

    return sync_detailed(
        client=client,
        limit=limit,
        cursor=cursor,
        resource=resource,
        action=action,
    ).parsed


async def asyncio_detailed(
    *,
    client: AuthenticatedClient | Client,
    limit: int | Unset = 50,
    cursor: str | Unset = UNSET,
    resource: str | Unset = UNSET,
    action: str | Unset = UNSET,
) -> Response[ErrorResponse | GetAuditLogResponse200]:
    """Append-only audit log — DPDP compliance evidence

     Every row here was written by application code that never updates or deletes one
    (services/gateway/prisma/schema.prisma's AuditLog model) — enforced by a Postgres trigger, not just
    convention (audit_log_no_update / audit_log_no_delete, prisma/migrations/20260906055251_init).
    `integrity` reports what this endpoint itself just verified by querying pg_trigger, live, on this
    call — not a stored or asserted claim.

    Args:
        limit (int | Unset):  Default: 50.
        cursor (str | Unset):
        resource (str | Unset):
        action (str | Unset):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[ErrorResponse | GetAuditLogResponse200]
    """

    kwargs = _get_kwargs(
        limit=limit,
        cursor=cursor,
        resource=resource,
        action=action,
    )

    response = await client.get_async_httpx_client().request(**kwargs)

    return _build_response(client=client, response=response)


async def asyncio(
    *,
    client: AuthenticatedClient | Client,
    limit: int | Unset = 50,
    cursor: str | Unset = UNSET,
    resource: str | Unset = UNSET,
    action: str | Unset = UNSET,
) -> ErrorResponse | GetAuditLogResponse200 | None:
    """Append-only audit log — DPDP compliance evidence

     Every row here was written by application code that never updates or deletes one
    (services/gateway/prisma/schema.prisma's AuditLog model) — enforced by a Postgres trigger, not just
    convention (audit_log_no_update / audit_log_no_delete, prisma/migrations/20260906055251_init).
    `integrity` reports what this endpoint itself just verified by querying pg_trigger, live, on this
    call — not a stored or asserted claim.

    Args:
        limit (int | Unset):  Default: 50.
        cursor (str | Unset):
        resource (str | Unset):
        action (str | Unset):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        ErrorResponse | GetAuditLogResponse200
    """

    return (
        await asyncio_detailed(
            client=client,
            limit=limit,
            cursor=cursor,
            resource=resource,
            action=action,
        )
    ).parsed
