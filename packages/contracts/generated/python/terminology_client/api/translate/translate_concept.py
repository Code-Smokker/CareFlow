from http import HTTPStatus
from typing import Any

import httpx

from ...client import AuthenticatedClient, Client
from ...models.concept_map_match import ConceptMapMatch
from ...models.error_response import ErrorResponse
from ...models.translate_concept_body import TranslateConceptBody
from ...types import Response


def _get_kwargs(
    *,
    body: TranslateConceptBody,
) -> dict[str, Any]:
    headers: dict[str, Any] = {}

    _kwargs: dict[str, Any] = {
        "method": "post",
        "url": "/translate",
    }

    _kwargs["json"] = body.to_dict()

    headers["Content-Type"] = "application/json"

    _kwargs["headers"] = headers
    return _kwargs


def _parse_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> ConceptMapMatch | ErrorResponse:
    if response.status_code == 200:
        response_200 = ConceptMapMatch.from_dict(response.json())

        return response_200

    response_default = ErrorResponse.from_dict(response.json())

    return response_default


def _build_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> Response[ConceptMapMatch | ErrorResponse]:
    return Response(
        status_code=HTTPStatus(response.status_code),
        content=response.content,
        headers=response.headers,
        parsed=_parse_response(client=client, response=response),
    )


def sync_detailed(
    *,
    client: AuthenticatedClient | Client,
    body: TranslateConceptBody,
) -> Response[ConceptMapMatch | ErrorResponse]:
    """Translate a code between terminology systems (ConceptMap match)

    Args:
        body (TranslateConceptBody):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[ConceptMapMatch | ErrorResponse]
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
    body: TranslateConceptBody,
) -> ConceptMapMatch | ErrorResponse | None:
    """Translate a code between terminology systems (ConceptMap match)

    Args:
        body (TranslateConceptBody):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        ConceptMapMatch | ErrorResponse
    """

    return sync_detailed(
        client=client,
        body=body,
    ).parsed


async def asyncio_detailed(
    *,
    client: AuthenticatedClient | Client,
    body: TranslateConceptBody,
) -> Response[ConceptMapMatch | ErrorResponse]:
    """Translate a code between terminology systems (ConceptMap match)

    Args:
        body (TranslateConceptBody):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[ConceptMapMatch | ErrorResponse]
    """

    kwargs = _get_kwargs(
        body=body,
    )

    response = await client.get_async_httpx_client().request(**kwargs)

    return _build_response(client=client, response=response)


async def asyncio(
    *,
    client: AuthenticatedClient | Client,
    body: TranslateConceptBody,
) -> ConceptMapMatch | ErrorResponse | None:
    """Translate a code between terminology systems (ConceptMap match)

    Args:
        body (TranslateConceptBody):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        ConceptMapMatch | ErrorResponse
    """

    return (
        await asyncio_detailed(
            client=client,
            body=body,
        )
    ).parsed
