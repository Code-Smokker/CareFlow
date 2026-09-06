from __future__ import annotations

from typing import Any, Protocol

from app.cascade import ProviderUnavailable

__all__ = ["ProviderUnavailable", "LlmAdapter"]


class LlmAdapter(Protocol):
    async def call_tool(
        self,
        *,
        model: str,
        system_prompt: str,
        user_prompt: str,
        tool_name: str,
        tool_description: str,
        parameters_schema: dict[str, Any],
    ) -> dict[str, Any]:
        """Forces the model to respond via a single named tool call and returns its parsed
        JSON arguments. Raises ProviderUnavailable on any failure to get a valid call back."""
        ...
