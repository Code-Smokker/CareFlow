from http import HTTPStatus
from typing import Any
from urllib.parse import quote

import httpx

from ...client import AuthenticatedClient, Client
from ...models.error_response import ErrorResponse
from ...models.sign_visit_body import SignVisitBody
from ...models.sign_visit_response_200 import SignVisitResponse200
from ...types import Response


def _get_kwargs(
    id: str,
    *,
    body: SignVisitBody,
) -> dict[str, Any]:
    headers: dict[str, Any] = {}

    _kwargs: dict[str, Any] = {
        "method": "post",
        "url": "/v1/visits/{id}/sign".format(
            id=quote(str(id), safe=""),
        ),
    }

    _kwargs["json"] = body.to_dict()

    headers["Content-Type"] = "application/json"

    _kwargs["headers"] = headers
    return _kwargs


def _parse_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> ErrorResponse | SignVisitResponse200:
    if response.status_code == 200:
        response_200 = SignVisitResponse200.from_dict(response.json())

        return response_200

    response_default = ErrorResponse.from_dict(response.json())

    return response_default


def _build_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> Response[ErrorResponse | SignVisitResponse200]:
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
    body: SignVisitBody,
) -> Response[ErrorResponse | SignVisitResponse200]:
    """Physician sign-off; assembles the FHIR bundle (Setu)

     No RBAC/auth exists yet (Day 4), so `signed_by` is a plain identifier passed by the caller rather
    than read from a session — additive until real auth lands.

    Args:
        id (str):
        body (SignVisitBody):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[ErrorResponse | SignVisitResponse200]
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
    body: SignVisitBody,
) -> ErrorResponse | SignVisitResponse200 | None:
    """Physician sign-off; assembles the FHIR bundle (Setu)

     No RBAC/auth exists yet (Day 4), so `signed_by` is a plain identifier passed by the caller rather
    than read from a session — additive until real auth lands.

    Args:
        id (str):
        body (SignVisitBody):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        ErrorResponse | SignVisitResponse200
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
    body: SignVisitBody,
) -> Response[ErrorResponse | SignVisitResponse200]:
    """Physician sign-off; assembles the FHIR bundle (Setu)

     No RBAC/auth exists yet (Day 4), so `signed_by` is a plain identifier passed by the caller rather
    than read from a session — additive until real auth lands.

    Args:
        id (str):
        body (SignVisitBody):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[ErrorResponse | SignVisitResponse200]
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
    body: SignVisitBody,
) -> ErrorResponse | SignVisitResponse200 | None:
    """Physician sign-off; assembles the FHIR bundle (Setu)

     No RBAC/auth exists yet (Day 4), so `signed_by` is a plain identifier passed by the caller rather
    than read from a session — additive until real auth lands.

    Args:
        id (str):
        body (SignVisitBody):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        ErrorResponse | SignVisitResponse200
    """

    return (
        await asyncio_detailed(
            id=id,
            client=client,
            body=body,
        )
    ).parsed
