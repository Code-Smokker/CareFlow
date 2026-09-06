from http import HTTPStatus
from typing import Any
from urllib.parse import quote

import httpx

from ...client import AuthenticatedClient, Client
from ...models.acknowledge_red_flag_body import AcknowledgeRedFlagBody
from ...models.error_response import ErrorResponse
from ...models.red_flag import RedFlag
from ...types import Response


def _get_kwargs(
    id: str,
    *,
    body: AcknowledgeRedFlagBody,
) -> dict[str, Any]:
    headers: dict[str, Any] = {}

    _kwargs: dict[str, Any] = {
        "method": "post",
        "url": "/v1/redflags/{id}/acknowledge".format(
            id=quote(str(id), safe=""),
        ),
    }

    _kwargs["json"] = body.to_dict()

    headers["Content-Type"] = "application/json"

    _kwargs["headers"] = headers
    return _kwargs


def _parse_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> ErrorResponse | RedFlag:
    if response.status_code == 200:
        response_200 = RedFlag.from_dict(response.json())

        return response_200

    response_default = ErrorResponse.from_dict(response.json())

    return response_default


def _build_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> Response[ErrorResponse | RedFlag]:
    return Response(
        status_code=HTTPStatus(response.status_code),
        content=response.content,
        headers=response.headers,
        parsed=_parse_response(client=client, response=response),
    )


def sync_detailed(
    id: str,
    *,
    client: AuthenticatedClient | Client,
    body: AcknowledgeRedFlagBody,
) -> Response[ErrorResponse | RedFlag]:
    """One-tap acknowledge, logged with who and when

     No RBAC/auth exists yet (Day 4), so actor_id/actor_role are plain identifiers passed by the caller —
    same pattern as POST /v1/visits/{id}/sign's signed_by. Acknowledging also writes an audit_log row
    (genuinely append-only, DB-trigger-enforced).

    Args:
        id (str):
        body (AcknowledgeRedFlagBody):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[ErrorResponse | RedFlag]
    """

    kwargs = _get_kwargs(
        id=id,
        body=body,
    )

    response = client.get_httpx_client().request(
        **kwargs,
    )

    return _build_response(client=client, response=response)


def sync(
    id: str,
    *,
    client: AuthenticatedClient | Client,
    body: AcknowledgeRedFlagBody,
) -> ErrorResponse | RedFlag | None:
    """One-tap acknowledge, logged with who and when

     No RBAC/auth exists yet (Day 4), so actor_id/actor_role are plain identifiers passed by the caller —
    same pattern as POST /v1/visits/{id}/sign's signed_by. Acknowledging also writes an audit_log row
    (genuinely append-only, DB-trigger-enforced).

    Args:
        id (str):
        body (AcknowledgeRedFlagBody):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        ErrorResponse | RedFlag
    """

    return sync_detailed(
        id=id,
        client=client,
        body=body,
    ).parsed


async def asyncio_detailed(
    id: str,
    *,
    client: AuthenticatedClient | Client,
    body: AcknowledgeRedFlagBody,
) -> Response[ErrorResponse | RedFlag]:
    """One-tap acknowledge, logged with who and when

     No RBAC/auth exists yet (Day 4), so actor_id/actor_role are plain identifiers passed by the caller —
    same pattern as POST /v1/visits/{id}/sign's signed_by. Acknowledging also writes an audit_log row
    (genuinely append-only, DB-trigger-enforced).

    Args:
        id (str):
        body (AcknowledgeRedFlagBody):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[ErrorResponse | RedFlag]
    """

    kwargs = _get_kwargs(
        id=id,
        body=body,
    )

    response = await client.get_async_httpx_client().request(**kwargs)

    return _build_response(client=client, response=response)


async def asyncio(
    id: str,
    *,
    client: AuthenticatedClient | Client,
    body: AcknowledgeRedFlagBody,
) -> ErrorResponse | RedFlag | None:
    """One-tap acknowledge, logged with who and when

     No RBAC/auth exists yet (Day 4), so actor_id/actor_role are plain identifiers passed by the caller —
    same pattern as POST /v1/visits/{id}/sign's signed_by. Acknowledging also writes an audit_log row
    (genuinely append-only, DB-trigger-enforced).

    Args:
        id (str):
        body (AcknowledgeRedFlagBody):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        ErrorResponse | RedFlag
    """

    return (
        await asyncio_detailed(
            id=id,
            client=client,
            body=body,
        )
    ).parsed
