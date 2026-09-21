from http import HTTPStatus
from typing import Any

import httpx

from ...client import AuthenticatedClient, Client
from ...models.error_response import ErrorResponse
from ...models.get_integration_events_outcome import GetIntegrationEventsOutcome
from ...models.get_integration_events_response_200 import (
    GetIntegrationEventsResponse200,
)
from ...types import UNSET, Response, Unset


def _get_kwargs(
    *,
    limit: int | Unset = 50,
    cursor: str | Unset = UNSET,
    outcome: GetIntegrationEventsOutcome | Unset = UNSET,
    capability: str | Unset = UNSET,
) -> dict[str, Any]:
    params: dict[str, Any] = {}

    params["limit"] = limit

    params["cursor"] = cursor

    json_outcome: str | Unset = UNSET
    if not isinstance(outcome, Unset):
        json_outcome = outcome.value

    params["outcome"] = json_outcome

    params["capability"] = capability

    params = {k: v for k, v in params.items() if v is not UNSET and v is not None}

    _kwargs: dict[str, Any] = {
        "method": "get",
        "url": "/v1/integration-events",
        "params": params,
    }

    return _kwargs


def _parse_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> ErrorResponse | GetIntegrationEventsResponse200:
    if response.status_code == 200:
        response_200 = GetIntegrationEventsResponse200.from_dict(response.json())

        return response_200

    response_default = ErrorResponse.from_dict(response.json())

    return response_default


def _build_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> Response[ErrorResponse | GetIntegrationEventsResponse200]:
    return Response(
        status_code=HTTPStatus(response.status_code),
        content=response.content,
        headers=response.headers,
        parsed=_parse_response(client=client, response=response),
    )


def sync_detailed(
    *,
    client: AuthenticatedClient | Client,
    limit: int | Unset = 50,
    cursor: str | Unset = UNSET,
    outcome: GetIntegrationEventsOutcome | Unset = UNSET,
    capability: str | Unset = UNSET,
) -> Response[ErrorResponse | GetIntegrationEventsResponse200]:
    """Provider cascade events — hosted tier tried, failed, local tier served the request

     One row per tier attempted by services/ai's or services/docai's cascade() helper (docs/15-ai-
    stack.md), success or failure — this is CLAUDE.md rule 9 ("every external dependency has a local
    fallback") as something that happened, not an eval-report claim.

    Args:
        limit (int | Unset):  Default: 50.
        cursor (str | Unset):
        outcome (GetIntegrationEventsOutcome | Unset):
        capability (str | Unset):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[ErrorResponse | GetIntegrationEventsResponse200]
    """

    kwargs = _get_kwargs(
        limit=limit,
        cursor=cursor,
        outcome=outcome,
        capability=capability,
    )

    response = client.get_httpx_client().request(
        **kwargs,
    )

    return _build_response(client=client, response=response)


def sync(
    *,
    client: AuthenticatedClient | Client,
    limit: int | Unset = 50,
    cursor: str | Unset = UNSET,
    outcome: GetIntegrationEventsOutcome | Unset = UNSET,
    capability: str | Unset = UNSET,
) -> ErrorResponse | GetIntegrationEventsResponse200 | None:
    """Provider cascade events — hosted tier tried, failed, local tier served the request

     One row per tier attempted by services/ai's or services/docai's cascade() helper (docs/15-ai-
    stack.md), success or failure — this is CLAUDE.md rule 9 ("every external dependency has a local
    fallback") as something that happened, not an eval-report claim.

    Args:
        limit (int | Unset):  Default: 50.
        cursor (str | Unset):
        outcome (GetIntegrationEventsOutcome | Unset):
        capability (str | Unset):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        ErrorResponse | GetIntegrationEventsResponse200
    """

    return sync_detailed(
        client=client,
        limit=limit,
        cursor=cursor,
        outcome=outcome,
        capability=capability,
    ).parsed


async def asyncio_detailed(
    *,
    client: AuthenticatedClient | Client,
    limit: int | Unset = 50,
    cursor: str | Unset = UNSET,
    outcome: GetIntegrationEventsOutcome | Unset = UNSET,
    capability: str | Unset = UNSET,
) -> Response[ErrorResponse | GetIntegrationEventsResponse200]:
    """Provider cascade events — hosted tier tried, failed, local tier served the request

     One row per tier attempted by services/ai's or services/docai's cascade() helper (docs/15-ai-
    stack.md), success or failure — this is CLAUDE.md rule 9 ("every external dependency has a local
    fallback") as something that happened, not an eval-report claim.

    Args:
        limit (int | Unset):  Default: 50.
        cursor (str | Unset):
        outcome (GetIntegrationEventsOutcome | Unset):
        capability (str | Unset):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[ErrorResponse | GetIntegrationEventsResponse200]
    """

    kwargs = _get_kwargs(
        limit=limit,
        cursor=cursor,
        outcome=outcome,
        capability=capability,
    )

    response = await client.get_async_httpx_client().request(**kwargs)

    return _build_response(client=client, response=response)


async def asyncio(
    *,
    client: AuthenticatedClient | Client,
    limit: int | Unset = 50,
    cursor: str | Unset = UNSET,
    outcome: GetIntegrationEventsOutcome | Unset = UNSET,
    capability: str | Unset = UNSET,
) -> ErrorResponse | GetIntegrationEventsResponse200 | None:
    """Provider cascade events — hosted tier tried, failed, local tier served the request

     One row per tier attempted by services/ai's or services/docai's cascade() helper (docs/15-ai-
    stack.md), success or failure — this is CLAUDE.md rule 9 ("every external dependency has a local
    fallback") as something that happened, not an eval-report claim.

    Args:
        limit (int | Unset):  Default: 50.
        cursor (str | Unset):
        outcome (GetIntegrationEventsOutcome | Unset):
        capability (str | Unset):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        ErrorResponse | GetIntegrationEventsResponse200
    """

    return (
        await asyncio_detailed(
            client=client,
            limit=limit,
            cursor=cursor,
            outcome=outcome,
            capability=capability,
        )
    ).parsed
