from http import HTTPStatus
from typing import Any

import httpx

from ...client import AuthenticatedClient, Client
from ...models.error_response import ErrorResponse
from ...models.process_document_body import ProcessDocumentBody
from ...models.process_document_response_202 import ProcessDocumentResponse202
from ...types import Response


def _get_kwargs(
    *,
    body: ProcessDocumentBody,
) -> dict[str, Any]:
    headers: dict[str, Any] = {}

    _kwargs: dict[str, Any] = {
        "method": "post",
        "url": "/process",
    }

    _kwargs["json"] = body.to_dict()

    headers["Content-Type"] = "application/json"

    _kwargs["headers"] = headers
    return _kwargs


def _parse_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> ErrorResponse | ProcessDocumentResponse202:
    if response.status_code == 202:
        response_202 = ProcessDocumentResponse202.from_dict(response.json())

        return response_202

    response_default = ErrorResponse.from_dict(response.json())

    return response_default


def _build_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> Response[ErrorResponse | ProcessDocumentResponse202]:
    return Response(
        status_code=HTTPStatus(response.status_code),
        content=response.content,
        headers=response.headers,
        parsed=_parse_response(client=client, response=response),
    )


def sync_detailed(
    *,
    client: AuthenticatedClient | Client,
    body: ProcessDocumentBody,
) -> Response[ErrorResponse | ProcessDocumentResponse202]:
    """Queue a document for OCR, extraction and timeline placement

     Long-running (Celery); result delivered via the document.processed WS event.

    Args:
        body (ProcessDocumentBody):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[ErrorResponse | ProcessDocumentResponse202]
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
    body: ProcessDocumentBody,
) -> ErrorResponse | ProcessDocumentResponse202 | None:
    """Queue a document for OCR, extraction and timeline placement

     Long-running (Celery); result delivered via the document.processed WS event.

    Args:
        body (ProcessDocumentBody):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        ErrorResponse | ProcessDocumentResponse202
    """

    return sync_detailed(
        client=client,
        body=body,
    ).parsed


async def asyncio_detailed(
    *,
    client: AuthenticatedClient | Client,
    body: ProcessDocumentBody,
) -> Response[ErrorResponse | ProcessDocumentResponse202]:
    """Queue a document for OCR, extraction and timeline placement

     Long-running (Celery); result delivered via the document.processed WS event.

    Args:
        body (ProcessDocumentBody):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[ErrorResponse | ProcessDocumentResponse202]
    """

    kwargs = _get_kwargs(
        body=body,
    )

    response = await client.get_async_httpx_client().request(**kwargs)

    return _build_response(client=client, response=response)


async def asyncio(
    *,
    client: AuthenticatedClient | Client,
    body: ProcessDocumentBody,
) -> ErrorResponse | ProcessDocumentResponse202 | None:
    """Queue a document for OCR, extraction and timeline placement

     Long-running (Celery); result delivered via the document.processed WS event.

    Args:
        body (ProcessDocumentBody):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        ErrorResponse | ProcessDocumentResponse202
    """

    return (
        await asyncio_detailed(
            client=client,
            body=body,
        )
    ).parsed
