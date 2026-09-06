from http import HTTPStatus
from typing import Any
from urllib.parse import quote

import httpx

from ...client import AuthenticatedClient, Client
from ...models.concept_detail import ConceptDetail
from ...models.error_response import ErrorResponse
from ...models.terminology_system import TerminologySystem
from ...types import Response


def _get_kwargs(
    system: TerminologySystem,
    code: str,
) -> dict[str, Any]:
    _kwargs: dict[str, Any] = {
        "method": "get",
        "url": "/concept/{system}/{code}".format(
            system=quote(str(system), safe=""),
            code=quote(str(code), safe=""),
        ),
    }

    return _kwargs


def _parse_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> ConceptDetail | ErrorResponse:
    if response.status_code == 200:
        response_200 = ConceptDetail.from_dict(response.json())

        return response_200

    response_default = ErrorResponse.from_dict(response.json())

    return response_default


def _build_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> Response[ConceptDetail | ErrorResponse]:
    return Response(
        status_code=HTTPStatus(response.status_code),
        content=response.content,
        headers=response.headers,
        parsed=_parse_response(client=client, response=response),
    )


def sync_detailed(
    system: TerminologySystem,
    code: str,
    *,
    client: AuthenticatedClient | Client,
) -> Response[ConceptDetail | ErrorResponse]:
    """Concept detail and synonyms

    Args:
        system (TerminologySystem):
        code (str):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[ConceptDetail | ErrorResponse]
    """

    kwargs = _get_kwargs(
        system=system,
        code=code,
    )

    response = client.get_httpx_client().request(
        **kwargs,
    )

    return _build_response(client=client, response=response)


def sync(
    system: TerminologySystem,
    code: str,
    *,
    client: AuthenticatedClient | Client,
) -> ConceptDetail | ErrorResponse | None:
    """Concept detail and synonyms

    Args:
        system (TerminologySystem):
        code (str):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        ConceptDetail | ErrorResponse
    """

    return sync_detailed(
        system=system,
        code=code,
        client=client,
    ).parsed


async def asyncio_detailed(
    system: TerminologySystem,
    code: str,
    *,
    client: AuthenticatedClient | Client,
) -> Response[ConceptDetail | ErrorResponse]:
    """Concept detail and synonyms

    Args:
        system (TerminologySystem):
        code (str):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[ConceptDetail | ErrorResponse]
    """

    kwargs = _get_kwargs(
        system=system,
        code=code,
    )

    response = await client.get_async_httpx_client().request(**kwargs)

    return _build_response(client=client, response=response)


async def asyncio(
    system: TerminologySystem,
    code: str,
    *,
    client: AuthenticatedClient | Client,
) -> ConceptDetail | ErrorResponse | None:
    """Concept detail and synonyms

    Args:
        system (TerminologySystem):
        code (str):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        ConceptDetail | ErrorResponse
    """

    return (
        await asyncio_detailed(
            system=system,
            code=code,
            client=client,
        )
    ).parsed
