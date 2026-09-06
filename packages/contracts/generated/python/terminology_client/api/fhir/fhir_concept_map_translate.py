from http import HTTPStatus
from typing import Any
from urllib.parse import quote

import httpx

from ...client import AuthenticatedClient, Client
from ...models.error_response import ErrorResponse
from ...models.fhir_concept_map_translate_response_200 import (
    FhirConceptMapTranslateResponse200,
)
from ...types import UNSET, Response


def _get_kwargs(
    id: str,
    *,
    code: str,
    system: str,
    target: str,
) -> dict[str, Any]:
    params: dict[str, Any] = {}

    params["code"] = code

    params["system"] = system

    params["target"] = target

    params = {k: v for k, v in params.items() if v is not UNSET and v is not None}

    _kwargs: dict[str, Any] = {
        "method": "get",
        "url": "/fhir/ConceptMap/{id}/$translate".format(
            id=quote(str(id), safe=""),
        ),
        "params": params,
    }

    return _kwargs


def _parse_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> ErrorResponse | FhirConceptMapTranslateResponse200:
    if response.status_code == 200:
        response_200 = FhirConceptMapTranslateResponse200.from_dict(response.json())

        return response_200

    response_default = ErrorResponse.from_dict(response.json())

    return response_default


def _build_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> Response[ErrorResponse | FhirConceptMapTranslateResponse200]:
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
    code: str,
    system: str,
    target: str,
) -> Response[ErrorResponse | FhirConceptMapTranslateResponse200]:
    """FHIR ConceptMap $translate operation

    Args:
        id (str):
        code (str):
        system (str):
        target (str):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[ErrorResponse | FhirConceptMapTranslateResponse200]
    """

    kwargs = _get_kwargs(
        id=id,
        code=code,
        system=system,
        target=target,
    )

    response = client.get_httpx_client().request(
        **kwargs,
    )

    return _build_response(client=client, response=response)


def sync(
    id: str,
    *,
    client: AuthenticatedClient | Client,
    code: str,
    system: str,
    target: str,
) -> ErrorResponse | FhirConceptMapTranslateResponse200 | None:
    """FHIR ConceptMap $translate operation

    Args:
        id (str):
        code (str):
        system (str):
        target (str):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        ErrorResponse | FhirConceptMapTranslateResponse200
    """

    return sync_detailed(
        id=id,
        client=client,
        code=code,
        system=system,
        target=target,
    ).parsed


async def asyncio_detailed(
    id: str,
    *,
    client: AuthenticatedClient | Client,
    code: str,
    system: str,
    target: str,
) -> Response[ErrorResponse | FhirConceptMapTranslateResponse200]:
    """FHIR ConceptMap $translate operation

    Args:
        id (str):
        code (str):
        system (str):
        target (str):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[ErrorResponse | FhirConceptMapTranslateResponse200]
    """

    kwargs = _get_kwargs(
        id=id,
        code=code,
        system=system,
        target=target,
    )

    response = await client.get_async_httpx_client().request(**kwargs)

    return _build_response(client=client, response=response)


async def asyncio(
    id: str,
    *,
    client: AuthenticatedClient | Client,
    code: str,
    system: str,
    target: str,
) -> ErrorResponse | FhirConceptMapTranslateResponse200 | None:
    """FHIR ConceptMap $translate operation

    Args:
        id (str):
        code (str):
        system (str):
        target (str):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        ErrorResponse | FhirConceptMapTranslateResponse200
    """

    return (
        await asyncio_detailed(
            id=id,
            client=client,
            code=code,
            system=system,
            target=target,
        )
    ).parsed
