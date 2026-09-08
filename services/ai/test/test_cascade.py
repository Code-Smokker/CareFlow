import pytest

from app.cascade import AllProvidersUnavailable, ProviderUnavailable, cascade


async def test_cascade_falls_through_to_a_later_tier():
    calls: list[str] = []

    async def tier_a():
        calls.append("a")
        raise ProviderUnavailable("a is down")

    async def tier_b():
        calls.append("b")
        return "b-result"

    result = await cascade([("a", tier_a), ("b", tier_b)], capability="test")
    assert result == "b-result"
    assert calls == ["a", "b"]


async def test_cascade_does_not_try_later_tiers_once_one_succeeds():
    calls: list[str] = []

    async def tier_a():
        calls.append("a")
        return "a-result"

    async def tier_b():
        calls.append("b")
        return "b-result"

    result = await cascade([("a", tier_a), ("b", tier_b)], capability="test")
    assert result == "a-result"
    assert calls == ["a"]


async def test_cascade_raises_with_all_tier_errors_when_every_tier_fails():
    async def tier_a():
        raise ProviderUnavailable("a is down")

    async def tier_b():
        raise ProviderUnavailable("b is down")

    with pytest.raises(AllProvidersUnavailable) as exc_info:
        await cascade([("a", tier_a), ("b", tier_b)], capability="test")

    assert exc_info.value.tier_errors == [("a", "a is down"), ("b", "b is down")]
