from http import HTTPStatus
from typing import Any

import httpx

from ...client import AuthenticatedClient, Client
from ...models.error_response import ErrorResponse
from ...models.search_dictionary_response_200 import SearchDictionaryResponse200
from ...models.search_dictionary_system import SearchDictionarySystem
from ...types import UNSET, Response, Unset


def _get_kwargs(
    *,
    q: str,
    system: SearchDictionarySystem | Unset = UNSET,
    limit: int | Unset = 10,
) -> dict[str, Any]:
    params: dict[str, Any] = {}

    params["q"] = q

    json_system: str | Unset = UNSET
    if not isinstance(system, Unset):
        json_system = system.value

    params["system"] = json_system

    params["limit"] = limit

    params = {k: v for k, v in params.items() if v is not UNSET and v is not None}

    _kwargs: dict[str, Any] = {
        "method": "get",
        "url": "/dictionary/search",
        "params": params,
    }

    return _kwargs


def _parse_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> ErrorResponse | SearchDictionaryResponse200:
    if response.status_code == 200:
        response_200 = SearchDictionaryResponse200.from_dict(response.json())

        return response_200

    response_default = ErrorResponse.from_dict(response.json())

    return response_default


def _build_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> Response[ErrorResponse | SearchDictionaryResponse200]:
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
    system: SearchDictionarySystem | Unset = UNSET,
    limit: int | Unset = 10,
) -> Response[ErrorResponse | SearchDictionaryResponse200]:
    """Fuzzy-match a term against the seeded dictionaries (allopathic brands, AYUSH classical formulations,
    Ayurvedic plants)

     pg_trgm similarity search over dictionary_entry. Backs the confirm-one-of-N shortlist CLAUDE.md rule
    5 requires for handwritten OCR output.

    Args:
        q (str):
        system (SearchDictionarySystem | Unset):
        limit (int | Unset):  Default: 10.

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[ErrorResponse | SearchDictionaryResponse200]
    """

    kwargs = _get_kwargs(
        q=q,
        system=system,
        limit=limit,
    )

    response = client.get_httpx_client().request(
        **kwargs,
    )

    return _build_response(client=client, response=response)


def sync(
    *,
    client: AuthenticatedClient | Client,
    q: str,
    system: SearchDictionarySystem | Unset = UNSET,
    limit: int | Unset = 10,
) -> ErrorResponse | SearchDictionaryResponse200 | None:
    """Fuzzy-match a term against the seeded dictionaries (allopathic brands, AYUSH classical formulations,
    Ayurvedic plants)

     pg_trgm similarity search over dictionary_entry. Backs the confirm-one-of-N shortlist CLAUDE.md rule
    5 requires for handwritten OCR output.

    Args:
        q (str):
        system (SearchDictionarySystem | Unset):
        limit (int | Unset):  Default: 10.

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        ErrorResponse | SearchDictionaryResponse200
    """

    return sync_detailed(
        client=client,
        q=q,
        system=system,
        limit=limit,
    ).parsed


async def asyncio_detailed(
    *,
    client: AuthenticatedClient | Client,
    q: str,
    system: SearchDictionarySystem | Unset = UNSET,
    limit: int | Unset = 10,
) -> Response[ErrorResponse | SearchDictionaryResponse200]:
    """Fuzzy-match a term against the seeded dictionaries (allopathic brands, AYUSH classical formulations,
    Ayurvedic plants)

     pg_trgm similarity search over dictionary_entry. Backs the confirm-one-of-N shortlist CLAUDE.md rule
    5 requires for handwritten OCR output.

    Args:
        q (str):
        system (SearchDictionarySystem | Unset):
        limit (int | Unset):  Default: 10.

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[ErrorResponse | SearchDictionaryResponse200]
    """

    kwargs = _get_kwargs(
        q=q,
        system=system,
        limit=limit,
    )

    response = await client.get_async_httpx_client().request(**kwargs)

    return _build_response(client=client, response=response)


async def asyncio(
    *,
    client: AuthenticatedClient | Client,
    q: str,
    system: SearchDictionarySystem | Unset = UNSET,
    limit: int | Unset = 10,
) -> ErrorResponse | SearchDictionaryResponse200 | None:
    """Fuzzy-match a term against the seeded dictionaries (allopathic brands, AYUSH classical formulations,
    Ayurvedic plants)

     pg_trgm similarity search over dictionary_entry. Backs the confirm-one-of-N shortlist CLAUDE.md rule
    5 requires for handwritten OCR output.

    Args:
        q (str):
        system (SearchDictionarySystem | Unset):
        limit (int | Unset):  Default: 10.

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        ErrorResponse | SearchDictionaryResponse200
    """

    return (
        await asyncio_detailed(
            client=client,
            q=q,
            system=system,
            limit=limit,
        )
    ).parsed
