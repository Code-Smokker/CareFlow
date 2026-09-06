"""Sarvam chat completions via the official `sarvamai` SDK, using tool-calling to force
structured output — see docs/15-ai-stack.md. The client is a real OpenAI-style function-calling
API: a single tool, `tool_choice` forcing that exact tool, arguments come back as a JSON string
in `message.tool_calls[0].function.arguments`.
"""

from __future__ import annotations

import json
from typing import Any

from app.config import settings
from app.llm.base import ProviderUnavailable


async def call_tool(
    *,
    model: str,
    system_prompt: str,
    user_prompt: str,
    tool_name: str,
    tool_description: str,
    parameters_schema: dict[str, Any],
) -> dict[str, Any]:
    if not settings.sarvam_api_key:
        raise ProviderUnavailable("SARVAM_API_KEY is not set")

    try:
        from sarvamai import AsyncSarvamAI
    except ImportError as exc:  # pragma: no cover - dependency always listed, defensive only
        raise ProviderUnavailable(f"sarvamai SDK not installed: {exc}") from exc

    client = AsyncSarvamAI(api_subscription_key=settings.sarvam_api_key)
    try:
        response = await client.chat.completions(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            tools=[
                {
                    "type": "function",
                    "function": {
                        "name": tool_name,
                        "description": tool_description,
                        "parameters": parameters_schema,
                    },
                }
            ],
            tool_choice={"type": "function", "function": {"name": tool_name}},
            temperature=0.0,
        )
    except Exception as exc:  # noqa: BLE001 - any transport/API failure means "try the next tier"
        raise ProviderUnavailable(f"Sarvam chat completion failed: {exc}") from exc

    if not response.choices:
        raise ProviderUnavailable("Sarvam returned no choices")
    tool_calls = response.choices[0].message.tool_calls
    if not tool_calls:
        raise ProviderUnavailable("Sarvam did not return a tool call")
    try:
        return json.loads(tool_calls[0].function.arguments)
    except json.JSONDecodeError as exc:
        raise ProviderUnavailable(f"Sarvam tool call arguments were not valid JSON: {exc}") from exc
