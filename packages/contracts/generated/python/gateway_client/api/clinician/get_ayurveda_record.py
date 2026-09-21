from http import HTTPStatus
from typing import Any
from urllib.parse import quote

import httpx

from ...client import AuthenticatedClient, Client
from ...models.ayurveda_record import AyurvedaRecord
from ...models.error_response import ErrorResponse
from ...types import Response


def _get_kwargs(
    id: str,
) -> dict[str, Any]:
    _kwargs: dict[str, Any] = {
        "method": "get",
        "url": "/v1/visits/{id}/ayurveda".format(
            id=quote(str(id), safe=""),
        ),
    }

    return _kwargs


def _parse_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> AyurvedaRecord | ErrorResponse:
    if response.status_code == 200:
        response_200 = AyurvedaRecord.from_dict(response.json())

        return response_200

    response_default = ErrorResponse.from_dict(response.json())

    return response_default


def _build_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> Response[AyurvedaRecord | ErrorResponse]:
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
) -> Response[AyurvedaRecord | ErrorResponse]:
    """Ayurvedic case record — Prashna answers and every examination field

     Prashna is composed live from the patient's intake answers (with provenance and confidence) and is
    read-only. Everything the Vaidya recorded is returned beside the patient-reported reference values.
    CareFlow never computes or suggests Vikriti, Samprapti or a diagnosis — `computed` carries only BMI
    and the Vaya band, both pure arithmetic over fields the Vaidya entered.

    Args:
        id (str):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[AyurvedaRecord | ErrorResponse]
    """

    kwargs = _get_kwargs(
        id=id,
    )

    response = client.get_httpx_client().request(
        **kwargs,
    )

    return _build_response(client=client, response=response)


def sync(
    id: str,
    *,
    client: AuthenticatedClient | Client,
) -> AyurvedaRecord | ErrorResponse | None:
    """Ayurvedic case record — Prashna answers and every examination field

     Prashna is composed live from the patient's intake answers (with provenance and confidence) and is
    read-only. Everything the Vaidya recorded is returned beside the patient-reported reference values.
    CareFlow never computes or suggests Vikriti, Samprapti or a diagnosis — `computed` carries only BMI
    and the Vaya band, both pure arithmetic over fields the Vaidya entered.

    Args:
        id (str):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        AyurvedaRecord | ErrorResponse
    """

    return sync_detailed(
        id=id,
        client=client,
    ).parsed


async def asyncio_detailed(
    id: str,
    *,
    client: AuthenticatedClient | Client,
) -> Response[AyurvedaRecord | ErrorResponse]:
    """Ayurvedic case record — Prashna answers and every examination field

     Prashna is composed live from the patient's intake answers (with provenance and confidence) and is
    read-only. Everything the Vaidya recorded is returned beside the patient-reported reference values.
    CareFlow never computes or suggests Vikriti, Samprapti or a diagnosis — `computed` carries only BMI
    and the Vaya band, both pure arithmetic over fields the Vaidya entered.

    Args:
        id (str):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[AyurvedaRecord | ErrorResponse]
    """

    kwargs = _get_kwargs(
        id=id,
    )

    response = await client.get_async_httpx_client().request(**kwargs)

    return _build_response(client=client, response=response)


async def asyncio(
    id: str,
    *,
    client: AuthenticatedClient | Client,
) -> AyurvedaRecord | ErrorResponse | None:
    """Ayurvedic case record — Prashna answers and every examination field

     Prashna is composed live from the patient's intake answers (with provenance and confidence) and is
    read-only. Everything the Vaidya recorded is returned beside the patient-reported reference values.
    CareFlow never computes or suggests Vikriti, Samprapti or a diagnosis — `computed` carries only BMI
    and the Vaya band, both pure arithmetic over fields the Vaidya entered.

    Args:
        id (str):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        AyurvedaRecord | ErrorResponse
    """

    return (
        await asyncio_detailed(
            id=id,
            client=client,
        )
    ).parsed
