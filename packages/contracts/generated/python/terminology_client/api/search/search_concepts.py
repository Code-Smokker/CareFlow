from http import HTTPStatus
from typing import Any

import httpx

from ...client import AuthenticatedClient, Client
from ...models.concept_summary import ConceptSummary
from ...models.error_response import ErrorResponse
from ...models.terminology_system import TerminologySystem
from ...types import UNSET, Response


def _get_kwargs(
    *,
    q: str,
    system: TerminologySystem,
) -> dict[str, Any]:
    params: dict[str, Any] = {}

    params["q"] = q

    json_system = system.value
    params["system"] = json_system

    params = {k: v for k, v in params.items() if v is not UNSET and v is not None}

    _kwargs: dict[str, Any] = {
        "method": "get",
        "url": "/search",
        "params": params,
    }

    return _kwargs


def _parse_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> ErrorResponse | list[ConceptSummary]:
    if response.status_code == 200:
        response_200 = []
        _response_200 = response.json()
        for response_200_item_data in _response_200:
            response_200_item = ConceptSummary.from_dict(response_200_item_data)

            response_200.append(response_200_item)

        return response_200

    response_default = ErrorResponse.from_dict(response.json())

    return response_default


def _build_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> Response[ErrorResponse | list[ConceptSummary]]:
    return Response(
        status_code=HTTPStatus(response.status_code),
        content=response.content,
        headers=response.headers,
        parsed=_parse_response(client=client, response=response),
    )


def sync_detailed(
    *,
    client: AuthenticatedClient | Client,
    q: str,
    system: TerminologySystem,
) -> Response[ErrorResponse | list[ConceptSummary]]:
    """Ranked concept search (trigram + vector) across a terminology system

    Args:
        q (str):
        system (TerminologySystem):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[ErrorResponse | list[ConceptSummary]]
    """

    kwargs = _get_kwargs(
        q=q,
        system=system,
    )

    response = client.get_httpx_client().request(
        **kwargs,
    )

    return _build_response(client=client, response=response)


def sync(
    *,
    client: AuthenticatedClient | Client,
    q: str,
    system: TerminologySystem,
) -> ErrorResponse | list[ConceptSummary] | None:
    """Ranked concept search (trigram + vector) across a terminology system

    Args:
        q (str):
        system (TerminologySystem):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        ErrorResponse | list[ConceptSummary]
    """

    return sync_detailed(
        client=client,
        q=q,
        system=system,
    ).parsed


async def asyncio_detailed(
    *,
    client: AuthenticatedClient | Client,
    q: str,
    system: TerminologySystem,
) -> Response[ErrorResponse | list[ConceptSummary]]:
    """Ranked concept search (trigram + vector) across a terminology system

    Args:
        q (str):
        system (TerminologySystem):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[ErrorResponse | list[ConceptSummary]]
    """

    kwargs = _get_kwargs(
        q=q,
        system=system,
    )

    response = await client.get_async_httpx_client().request(**kwargs)

    return _build_response(client=client, response=response)


async def asyncio(
    *,
    client: AuthenticatedClient | Client,
    q: str,
    system: TerminologySystem,
) -> ErrorResponse | list[ConceptSummary] | None:
    """Ranked concept search (trigram + vector) across a terminology system

    Args:
        q (str):
        system (TerminologySystem):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        ErrorResponse | list[ConceptSummary]
    """

    return (
        await asyncio_detailed(
            client=client,
            q=q,
            system=system,
        )
    ).parsed
