"""Generic OpenAI-compatible chat-completions client, used for LLM_PROVIDER=local — an
OpenAI-compatible server (vLLM, TGI, ...) serving the same Sarvam-30B/105B open weights the
hosted `sarvam` tier calls. That's the point of docs/15-ai-stack.md's "elegant part": flipping
LLM_PROVIDER changes where the model runs, not which model it is.
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
        raise ProviderUnavailable("LLM_BASE_URL is not set for LLM_PROVIDER=local")

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
        # A local/self-hosted server serving this tier from cold (model not yet resident in
        # memory/VRAM) can take far longer than a warm inference call — timed live against
        # Ollama serving a 3B model on an M-series Mac under real memory pressure 2026-09-07:
        # ~24s to load, vs ~2-3s once warm. 10s here was clipping a real, in-flight cold-load
        # response as a timeout, the same "generous timeout, not a hung service" lesson
        # documented for the OCR local tier's paddle import in docs/06-document-ai.md.
        async with httpx.AsyncClient(timeout=45.0) as client:
            response = await client.post(f"{base_url.rstrip('/')}/chat/completions", json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
    except (httpx.HTTPError, ValueError) as exc:
        raise ProviderUnavailable(f"Local LLM call failed: {exc}") from exc

    try:
        tool_calls = data["choices"][0]["message"]["tool_calls"]
        return json.loads(tool_calls[0]["function"]["arguments"])
    except (KeyError, IndexError, json.JSONDecodeError) as exc:
        raise ProviderUnavailable(f"Local LLM response was not a valid tool call: {exc}") from exc
