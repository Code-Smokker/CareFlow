from http import HTTPStatus
from typing import Any

import httpx

from ...client import AuthenticatedClient, Client
from ...models.classify_document_body import ClassifyDocumentBody
from ...models.classify_document_response_200 import ClassifyDocumentResponse200
from ...models.error_response import ErrorResponse
from ...types import Response


def _get_kwargs(
    *,
    body: ClassifyDocumentBody,
) -> dict[str, Any]:
    headers: dict[str, Any] = {}

    _kwargs: dict[str, Any] = {
        "method": "post",
        "url": "/classify",
    }

    _kwargs["json"] = body.to_dict()

    headers["Content-Type"] = "application/json"

    _kwargs["headers"] = headers
    return _kwargs


def _parse_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> ClassifyDocumentResponse200 | ErrorResponse:
    if response.status_code == 200:
        response_200 = ClassifyDocumentResponse200.from_dict(response.json())

        return response_200

    response_default = ErrorResponse.from_dict(response.json())

    return response_default


def _build_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> Response[ClassifyDocumentResponse200 | ErrorResponse]:
    return Response(
        status_code=HTTPStatus(response.status_code),
        content=response.content,
        headers=response.headers,
        parsed=_parse_response(client=client, response=response),
    )


def sync_detailed(
    *,
    client: AuthenticatedClient | Client,
    body: ClassifyDocumentBody,
) -> Response[ClassifyDocumentResponse200 | ErrorResponse]:
    """Classify a captured image (prescription, lab report, etc.)

    Args:
        body (ClassifyDocumentBody):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[ClassifyDocumentResponse200 | ErrorResponse]
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
    body: ClassifyDocumentBody,
) -> ClassifyDocumentResponse200 | ErrorResponse | None:
    """Classify a captured image (prescription, lab report, etc.)

    Args:
        body (ClassifyDocumentBody):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        ClassifyDocumentResponse200 | ErrorResponse
    """

    return sync_detailed(
        client=client,
        body=body,
    ).parsed


async def asyncio_detailed(
    *,
    client: AuthenticatedClient | Client,
    body: ClassifyDocumentBody,
) -> Response[ClassifyDocumentResponse200 | ErrorResponse]:
    """Classify a captured image (prescription, lab report, etc.)

    Args:
        body (ClassifyDocumentBody):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[ClassifyDocumentResponse200 | ErrorResponse]
    """

    kwargs = _get_kwargs(
        body=body,
    )

    response = await client.get_async_httpx_client().request(**kwargs)

    return _build_response(client=client, response=response)


async def asyncio(
    *,
    client: AuthenticatedClient | Client,
    body: ClassifyDocumentBody,
) -> ClassifyDocumentResponse200 | ErrorResponse | None:
    """Classify a captured image (prescription, lab report, etc.)

    Args:
        body (ClassifyDocumentBody):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        ClassifyDocumentResponse200 | ErrorResponse
    """

    return (
        await asyncio_detailed(
            client=client,
            body=body,
        )
    ).parsed
