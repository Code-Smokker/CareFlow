from http import HTTPStatus
from typing import Any
from urllib.parse import quote

import httpx

from ...client import AuthenticatedClient, Client
from ...models.answer_submission import AnswerSubmission
from ...models.error_response import ErrorResponse
from ...models.submit_answer_response_200 import SubmitAnswerResponse200
from ...types import Response


def _get_kwargs(
    id: str,
    *,
    body: AnswerSubmission,
    idempotency_key: str,
) -> dict[str, Any]:
    headers: dict[str, Any] = {}
    headers["Idempotency-Key"] = idempotency_key

    _kwargs: dict[str, Any] = {
        "method": "post",
        "url": "/v1/sessions/{id}/answer".format(
            id=quote(str(id), safe=""),
        ),
    }

    _kwargs["json"] = body.to_dict()

    headers["Content-Type"] = "application/json"

    _kwargs["headers"] = headers
    return _kwargs


def _parse_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> ErrorResponse | SubmitAnswerResponse200:
    if response.status_code == 200:
        response_200 = SubmitAnswerResponse200.from_dict(response.json())

        return response_200

    response_default = ErrorResponse.from_dict(response.json())

    return response_default


def _build_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> Response[ErrorResponse | SubmitAnswerResponse200]:
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
    body: AnswerSubmission,
    idempotency_key: str,
) -> Response[ErrorResponse | SubmitAnswerResponse200]:
    """Submit an answer to the current slot and receive the next question in the same response. Hot path —
    must not require a second round trip (p95 budget 1.2s, docs/03-api-contracts.md).

    Args:
        id (str): Opaque session identifier.
        idempotency_key (str):
        body (AnswerSubmission):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[ErrorResponse | SubmitAnswerResponse200]
    """

    kwargs = _get_kwargs(
        id=id,
        body=body,
        idempotency_key=idempotency_key,
    )

    response = client.get_httpx_client().request(
        **kwargs,
    )

    return _build_response(client=client, response=response)


def sync(
    id: str,
    *,
    client: AuthenticatedClient | Client,
    body: AnswerSubmission,
    idempotency_key: str,
) -> ErrorResponse | SubmitAnswerResponse200 | None:
    """Submit an answer to the current slot and receive the next question in the same response. Hot path —
    must not require a second round trip (p95 budget 1.2s, docs/03-api-contracts.md).

    Args:
        id (str): Opaque session identifier.
        idempotency_key (str):
        body (AnswerSubmission):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        ErrorResponse | SubmitAnswerResponse200
    """

    return sync_detailed(
        id=id,
        client=client,
        body=body,
        idempotency_key=idempotency_key,
    ).parsed


async def asyncio_detailed(
    id: str,
    *,
    client: AuthenticatedClient | Client,
    body: AnswerSubmission,
    idempotency_key: str,
) -> Response[ErrorResponse | SubmitAnswerResponse200]:
    """Submit an answer to the current slot and receive the next question in the same response. Hot path —
    must not require a second round trip (p95 budget 1.2s, docs/03-api-contracts.md).

    Args:
        id (str): Opaque session identifier.
        idempotency_key (str):
        body (AnswerSubmission):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[ErrorResponse | SubmitAnswerResponse200]
    """

    kwargs = _get_kwargs(
        id=id,
        body=body,
        idempotency_key=idempotency_key,
    )

    response = await client.get_async_httpx_client().request(**kwargs)

    return _build_response(client=client, response=response)


async def asyncio(
    id: str,
    *,
    client: AuthenticatedClient | Client,
    body: AnswerSubmission,
    idempotency_key: str,
) -> ErrorResponse | SubmitAnswerResponse200 | None:
    """Submit an answer to the current slot and receive the next question in the same response. Hot path —
    must not require a second round trip (p95 budget 1.2s, docs/03-api-contracts.md).

    Args:
        id (str): Opaque session identifier.
        idempotency_key (str):
        body (AnswerSubmission):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        ErrorResponse | SubmitAnswerResponse200
    """

    return (
        await asyncio_detailed(
            id=id,
            client=client,
            body=body,
            idempotency_key=idempotency_key,
        )
    ).parsed
