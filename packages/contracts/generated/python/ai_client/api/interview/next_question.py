from http import HTTPStatus
from typing import Any

import httpx

from ...client import AuthenticatedClient, Client
from ...models.error_response import ErrorResponse
from ...models.next_question_body import NextQuestionBody
from ...models.next_question_response_200 import NextQuestionResponse200
from ...types import Response


def _get_kwargs(
    *,
    body: NextQuestionBody,
) -> dict[str, Any]:
    headers: dict[str, Any] = {}

    _kwargs: dict[str, Any] = {
        "method": "post",
        "url": "/next-question",
    }

    _kwargs["json"] = body.to_dict()

    headers["Content-Type"] = "application/json"

    _kwargs["headers"] = headers
    return _kwargs


def _parse_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> ErrorResponse | NextQuestionResponse200:
    if response.status_code == 200:
        response_200 = NextQuestionResponse200.from_dict(response.json())

        return response_200

    response_default = ErrorResponse.from_dict(response.json())

    return response_default


def _build_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> Response[ErrorResponse | NextQuestionResponse200]:
    return Response(
        status_code=HTTPStatus(response.status_code),
        content=response.content,
        headers=response.headers,
        parsed=_parse_response(client=client, response=response),
    )


def sync_detailed(
    *,
    client: AuthenticatedClient | Client,
    body: NextQuestionBody,
) -> Response[ErrorResponse | NextQuestionResponse200]:
    """Phrase the next question for the current interview state

     CLAUDE.md rule 1 — question order comes from the ontology state machine; this endpoint only phrases
    it in the patient's language.

    Args:
        body (NextQuestionBody):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[ErrorResponse | NextQuestionResponse200]
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
    body: NextQuestionBody,
) -> ErrorResponse | NextQuestionResponse200 | None:
    """Phrase the next question for the current interview state

     CLAUDE.md rule 1 — question order comes from the ontology state machine; this endpoint only phrases
    it in the patient's language.

    Args:
        body (NextQuestionBody):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        ErrorResponse | NextQuestionResponse200
    """

    return sync_detailed(
        client=client,
        body=body,
    ).parsed


async def asyncio_detailed(
    *,
    client: AuthenticatedClient | Client,
    body: NextQuestionBody,
) -> Response[ErrorResponse | NextQuestionResponse200]:
    """Phrase the next question for the current interview state

     CLAUDE.md rule 1 — question order comes from the ontology state machine; this endpoint only phrases
    it in the patient's language.

    Args:
        body (NextQuestionBody):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[ErrorResponse | NextQuestionResponse200]
    """

    kwargs = _get_kwargs(
        body=body,
    )

    response = await client.get_async_httpx_client().request(**kwargs)

    return _build_response(client=client, response=response)


async def asyncio(
    *,
    client: AuthenticatedClient | Client,
    body: NextQuestionBody,
) -> ErrorResponse | NextQuestionResponse200 | None:
    """Phrase the next question for the current interview state

     CLAUDE.md rule 1 — question order comes from the ontology state machine; this endpoint only phrases
    it in the patient's language.

    Args:
        body (NextQuestionBody):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        ErrorResponse | NextQuestionResponse200
    """

    return (
        await asyncio_detailed(
            client=client,
            body=body,
        )
    ).parsed
