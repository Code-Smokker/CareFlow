from http import HTTPStatus
from typing import Any

import httpx

from ...client import AuthenticatedClient, Client
from ...models.ayurveda_vocabulary import AyurvedaVocabulary
from ...models.error_response import ErrorResponse
from ...types import Response


def _get_kwargs() -> dict[str, Any]:
    _kwargs: dict[str, Any] = {
        "method": "get",
        "url": "/v1/ayurveda/vocabulary",
    }

    return _kwargs


def _parse_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> AyurvedaVocabulary | ErrorResponse:
    if response.status_code == 200:
        response_200 = AyurvedaVocabulary.from_dict(response.json())

        return response_200

    response_default = ErrorResponse.from_dict(response.json())

    return response_default


def _build_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> Response[AyurvedaVocabulary | ErrorResponse]:
    return Response(
        status_code=HTTPStatus(response.status_code),
        content=response.content,
        headers=response.headers,
        parsed=_parse_response(client=client, response=response),
    )


def sync_detailed(
    *,
    client: AuthenticatedClient | Client,
) -> Response[AyurvedaVocabulary | ErrorResponse]:
    """The Pariksha vocabulary — every examination field and option

     Serves packages/ontology/modules/ayush/pariksha-vocabulary.yaml. UI and API read options only from
    here; no component hardcodes one. `status` is PENDING_EXPERT_REVIEW until an Ayurveda practitioner
    has verified the file — clients must show that.

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[AyurvedaVocabulary | ErrorResponse]
    """

    kwargs = _get_kwargs()

    response = client.get_httpx_client().request(
        **kwargs,
    )

    return _build_response(client=client, response=response)


def sync(
    *,
    client: AuthenticatedClient | Client,
) -> AyurvedaVocabulary | ErrorResponse | None:
    """The Pariksha vocabulary — every examination field and option

     Serves packages/ontology/modules/ayush/pariksha-vocabulary.yaml. UI and API read options only from
    here; no component hardcodes one. `status` is PENDING_EXPERT_REVIEW until an Ayurveda practitioner
    has verified the file — clients must show that.

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        AyurvedaVocabulary | ErrorResponse
    """

    return sync_detailed(
        client=client,
    ).parsed


async def asyncio_detailed(
    *,
    client: AuthenticatedClient | Client,
) -> Response[AyurvedaVocabulary | ErrorResponse]:
    """The Pariksha vocabulary — every examination field and option

     Serves packages/ontology/modules/ayush/pariksha-vocabulary.yaml. UI and API read options only from
    here; no component hardcodes one. `status` is PENDING_EXPERT_REVIEW until an Ayurveda practitioner
    has verified the file — clients must show that.

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[AyurvedaVocabulary | ErrorResponse]
    """

    kwargs = _get_kwargs()

    response = await client.get_async_httpx_client().request(**kwargs)

    return _build_response(client=client, response=response)


async def asyncio(
    *,
    client: AuthenticatedClient | Client,
) -> AyurvedaVocabulary | ErrorResponse | None:
    """The Pariksha vocabulary — every examination field and option

     Serves packages/ontology/modules/ayush/pariksha-vocabulary.yaml. UI and API read options only from
    here; no component hardcodes one. `status` is PENDING_EXPERT_REVIEW until an Ayurveda practitioner
    has verified the file — clients must show that.

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        AyurvedaVocabulary | ErrorResponse
    """

    return (
        await asyncio_detailed(
            client=client,
        )
    ).parsed
