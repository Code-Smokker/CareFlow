from http import HTTPStatus
from typing import Any

import httpx

from ...client import AuthenticatedClient, Client
from ...models.create_session_body import CreateSessionBody
from ...models.create_session_response_201 import CreateSessionResponse201
from ...models.error_response import ErrorResponse
from ...types import UNSET, Response, Unset


def _get_kwargs(
    *,
    body: CreateSessionBody | Unset = UNSET,
) -> dict[str, Any]:
    headers: dict[str, Any] = {}

    _kwargs: dict[str, Any] = {
        "method": "post",
        "url": "/v1/sessions",
    }

    if not isinstance(body, Unset):
        _kwargs["json"] = body.to_dict()

    headers["Content-Type"] = "application/json"

    _kwargs["headers"] = headers
    return _kwargs


def _parse_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> CreateSessionResponse201 | ErrorResponse:
    if response.status_code == 201:
        response_201 = CreateSessionResponse201.from_dict(response.json())

        return response_201

    response_default = ErrorResponse.from_dict(response.json())

    return response_default


def _build_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> Response[CreateSessionResponse201 | ErrorResponse]:
    return Response(
        status_code=HTTPStatus(response.status_code),
        content=response.content,
        headers=response.headers,
        parsed=_parse_response(client=client, response=response),
    )


def sync_detailed(
    *,
    client: AuthenticatedClient | Client,
    body: CreateSessionBody | Unset = UNSET,
) -> Response[CreateSessionResponse201 | ErrorResponse]:
    """Start a new intake session

     `department` is set by staff (the check-in URL / QR a desk or kiosk is configured with), never
    chosen by the patient. AYUSH mode is a property of the department, read from the gateway's visit
    config (`AYUSH_DEPARTMENTS`): an AYUSH department runs the complaint module and then the Prashna
    modules under packages/ontology/modules/ayush/.

    Args:
        body (CreateSessionBody | Unset):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[CreateSessionResponse201 | ErrorResponse]
    """

    kwargs = _get_kwargs(
        body=body,
    )

    response = client.get_httpx_client().request(
        **kwargs,
    )

    return _build_response(client=client, response=response)


def sync(
    *,
    client: AuthenticatedClient | Client,
    body: CreateSessionBody | Unset = UNSET,
) -> CreateSessionResponse201 | ErrorResponse | None:
    """Start a new intake session

     `department` is set by staff (the check-in URL / QR a desk or kiosk is configured with), never
    chosen by the patient. AYUSH mode is a property of the department, read from the gateway's visit
    config (`AYUSH_DEPARTMENTS`): an AYUSH department runs the complaint module and then the Prashna
    modules under packages/ontology/modules/ayush/.

    Args:
        body (CreateSessionBody | Unset):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        CreateSessionResponse201 | ErrorResponse
    """

    return sync_detailed(
        client=client,
        body=body,
    ).parsed


async def asyncio_detailed(
    *,
    client: AuthenticatedClient | Client,
    body: CreateSessionBody | Unset = UNSET,
) -> Response[CreateSessionResponse201 | ErrorResponse]:
    """Start a new intake session

     `department` is set by staff (the check-in URL / QR a desk or kiosk is configured with), never
    chosen by the patient. AYUSH mode is a property of the department, read from the gateway's visit
    config (`AYUSH_DEPARTMENTS`): an AYUSH department runs the complaint module and then the Prashna
    modules under packages/ontology/modules/ayush/.

    Args:
        body (CreateSessionBody | Unset):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[CreateSessionResponse201 | ErrorResponse]
    """

    kwargs = _get_kwargs(
        body=body,
    )

    response = await client.get_async_httpx_client().request(**kwargs)

    return _build_response(client=client, response=response)


async def asyncio(
    *,
    client: AuthenticatedClient | Client,
    body: CreateSessionBody | Unset = UNSET,
) -> CreateSessionResponse201 | ErrorResponse | None:
    """Start a new intake session

     `department` is set by staff (the check-in URL / QR a desk or kiosk is configured with), never
    chosen by the patient. AYUSH mode is a property of the department, read from the gateway's visit
    config (`AYUSH_DEPARTMENTS`): an AYUSH department runs the complaint module and then the Prashna
    modules under packages/ontology/modules/ayush/.

    Args:
        body (CreateSessionBody | Unset):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        CreateSessionResponse201 | ErrorResponse
    """

    return (
        await asyncio_detailed(
            client=client,
            body=body,
        )
    ).parsed
