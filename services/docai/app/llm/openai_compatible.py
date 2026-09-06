"""Generic OpenAI-compatible tool-forced structured output client — the LLM-remainder pass in
docs/15-ai-stack.md's extraction pipeline ("GLiNER for the structured pass -> LLM structured
output for the messy remainder"). Ported from services/ai/app/llm/openai_compatible.py rather
than shared across services, since docai is a separately deployable service with its own
config/venv (docs/01-architecture.md) and the two call sites' needs (fill a slot vs. extract
remainder entities) are different enough that a shared package would need its own versioning
story we don't have time to build this sprint.
"""

from __future__ import annotations

import json

import httpx

from app.config import settings
from app.llm.base import ProviderUnavailable


async def call_tool(
    *,
    model: str,
    system_prompt: str,
    user_prompt: str,
    tool_name: str,
    tool_description: str,
    parameters_schema: dict,
) -> dict:
    base_url = settings.llm_base_url
    if not base_url:
        raise ProviderUnavailable("LLM_BASE_URL is not set")

    headers = {"Content-Type": "application/json"}
    if settings.llm_api_key:
        headers["Authorization"] = f"Bearer {settings.llm_api_key}"

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "tools": [
            {
                "type": "function",
                "function": {
                    "name": tool_name,
                    "description": tool_description,
                    "parameters": parameters_schema,
                },
            }
        ],
        "tool_choice": {"type": "function", "function": {"name": tool_name}},
        "temperature": 0.0,
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(f"{base_url.rstrip('/')}/chat/completions", json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
    except (httpx.HTTPError, ValueError) as exc:
        raise ProviderUnavailable(f"LLM call failed: {exc}") from exc

    try:
        tool_calls = data["choices"][0]["message"]["tool_calls"]
        return json.loads(tool_calls[0]["function"]["arguments"])
    except (KeyError, IndexError, json.JSONDecodeError) as exc:
        raise ProviderUnavailable(f"LLM response was not a valid tool call: {exc}") from exc
