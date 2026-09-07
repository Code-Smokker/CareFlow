"""Unit tests against a mocked httpx client — never a live call. Fixture shapes here match the
real WHO ICD-11 API, verified live 2026-09-07 (see app/icd11/client.py's module docstring):
MMS search with chapterFilter=26 for TM2, titles suffixed "(TM2)"/"(TM1)" to tell the two
traditional-medicine modules apart within that one chapter."""

from __future__ import annotations

import httpx
import pytest

from app.cascade import AllProvidersUnavailable
from app.icd11 import client as icd11_client


@pytest.fixture(autouse=True)
def _reset_token_cache():
    icd11_client._token = None
    icd11_client._token_expiry = 0.0
    yield
    icd11_client._token = None
    icd11_client._token_expiry = 0.0


async def test_search_raises_provider_unavailable_without_credentials(monkeypatch):
    monkeypatch.setattr(icd11_client.settings, "icd_client_id", "")
    monkeypatch.setattr(icd11_client.settings, "icd_client_secret", "")

    with pytest.raises(AllProvidersUnavailable) as exc_info:
        await icd11_client.search("amavata", "icd11-tm2")
    assert "ICD_CLIENT_ID" in str(exc_info.value)


async def test_search_live_parses_destination_entities_and_strips_found_markup(monkeypatch):
    monkeypatch.setattr(icd11_client.settings, "icd_client_id", "test-id")
    monkeypatch.setattr(icd11_client.settings, "icd_client_secret", "test-secret")

    async def fake_post(self, url, data=None, **kwargs):
        return httpx.Response(200, json={"access_token": "test-token", "expires_in": 3600}, request=httpx.Request("POST", url))

    async def fake_get(self, url, params=None, headers=None, **kwargs):
        assert headers["Authorization"] == "Bearer test-token"
        assert params["chapterFilter"] == "26"
        body = {
            "destinationEntities": [
                # A same-chapter TM1 result mixed in, exactly as the real API returns them —
                # the title suffix is what the client filters on, not chapterFilter alone.
                {"id": "http://id.who.int/icd/entity/99999", "theCode": "SD93", "title": "Alternating <em class='found'>fever</em> disorder (TM1)"},
                {"id": "http://id.who.int/icd/entity/12345", "theCode": "TM2-1", "title": "<em class='found'>Amavata</em> pattern (TM2)"},
            ]
        }
        return httpx.Response(200, json=body, request=httpx.Request("GET", url))

    monkeypatch.setattr(httpx.AsyncClient, "post", fake_post)
    monkeypatch.setattr(httpx.AsyncClient, "get", fake_get)

    results = await icd11_client.search("amavata", "icd11-tm2")
    assert results == [{"code": "TM2-1", "display": "Amavata pattern (TM2)", "uri": "http://id.who.int/icd/entity/12345"}]


async def test_falls_back_to_cached_snapshot_when_live_call_fails(monkeypatch, pool):
    monkeypatch.setattr(icd11_client.settings, "icd_client_id", "")
    monkeypatch.setattr(icd11_client.settings, "icd_client_secret", "")

    await pool.execute(
        "INSERT INTO concept (system, code, display) VALUES ('test-icd11', 'CACHED-1', 'Amavata pattern')"
    )
    results = await icd11_client.search("amavata", "test-icd11")
    assert results == [{"code": "CACHED-1", "display": "Amavata pattern", "uri": None}]


async def test_raises_when_neither_live_nor_cache_has_anything(monkeypatch, pool):
    monkeypatch.setattr(icd11_client.settings, "icd_client_id", "")
    monkeypatch.setattr(icd11_client.settings, "icd_client_secret", "")

    with pytest.raises(AllProvidersUnavailable):
        await icd11_client.search("nothing-cached-for-this", "test-icd11")
