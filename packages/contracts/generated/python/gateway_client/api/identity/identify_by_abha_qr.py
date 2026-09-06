from http import HTTPStatus
from typing import Any

import httpx

from ...client import AuthenticatedClient, Client
from ...models.error_response import ErrorResponse
from ...models.identify_by_abha_qr_body import IdentifyByAbhaQrBody
from ...models.identify_by_abha_qr_response_200 import IdentifyByAbhaQrResponse200
from ...types import Response


def _get_kwargs(
    *,
    body: IdentifyByAbhaQrBody,
) -> dict[str, Any]:
    headers: dict[str, Any] = {}

    _kwargs: dict[str, Any] = {
        "method": "post",
        "url": "/v1/identity/abha/qr",
    }

    _kwargs["json"] = body.to_dict()

    headers["Content-Type"] = "application/json"

    _kwargs["headers"] = headers
    return _kwargs


def _parse_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> ErrorResponse | IdentifyByAbhaQrResponse200:
    if response.status_code == 200:
        response_200 = IdentifyByAbhaQrResponse200.from_dict(response.json())

        return response_200

    response_default = ErrorResponse.from_dict(response.json())

    return response_default


def _build_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> Response[ErrorResponse | IdentifyByAbhaQrResponse200]:
    return Response(
        status_code=HTTPStatus(response.status_code),
        content=response.content,
        headers=response.headers,
        parsed=_parse_response(client=client, response=response),
    )


def sync_detailed(
    *,
    client: AuthenticatedClient | Client,
    body: IdentifyByAbhaQrBody,
) -> Response[ErrorResponse | IdentifyByAbhaQrResponse200]:
    """Resolve patient identity from a scanned ABHA QR payload

     Served by the mock gateway when ABDM_MODE=mock; identical response shape.

    Args:
        body (IdentifyByAbhaQrBody):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[ErrorResponse | IdentifyByAbhaQrResponse200]
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
    body: IdentifyByAbhaQrBody,
) -> ErrorResponse | IdentifyByAbhaQrResponse200 | None:
    """Resolve patient identity from a scanned ABHA QR payload

     Served by the mock gateway when ABDM_MODE=mock; identical response shape.

    Args:
        body (IdentifyByAbhaQrBody):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        ErrorResponse | IdentifyByAbhaQrResponse200
    """

    return sync_detailed(
        client=client,
        body=body,
    ).parsed


async def asyncio_detailed(
    *,
    client: AuthenticatedClient | Client,
    body: IdentifyByAbhaQrBody,
) -> Response[ErrorResponse | IdentifyByAbhaQrResponse200]:
    """Resolve patient identity from a scanned ABHA QR payload

     Served by the mock gateway when ABDM_MODE=mock; identical response shape.

    Args:
        body (IdentifyByAbhaQrBody):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[ErrorResponse | IdentifyByAbhaQrResponse200]
    """

    kwargs = _get_kwargs(
        body=body,
    )

    response = await client.get_async_httpx_client().request(**kwargs)

    return _build_response(client=client, response=response)


async def asyncio(
    *,
    client: AuthenticatedClient | Client,
    body: IdentifyByAbhaQrBody,
) -> ErrorResponse | IdentifyByAbhaQrResponse200 | None:
    """Resolve patient identity from a scanned ABHA QR payload

     Served by the mock gateway when ABDM_MODE=mock; identical response shape.

    Args:
        body (IdentifyByAbhaQrBody):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        ErrorResponse | IdentifyByAbhaQrResponse200
    """

    return (
        await asyncio_detailed(
            client=client,
            body=body,
        )
    ).parsed
