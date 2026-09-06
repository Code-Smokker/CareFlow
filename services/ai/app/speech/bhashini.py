"""Bhashini ULCA — the government stack, free, and worth real points with a ministry panel
(docs/15-ai-stack.md). Two calls: pipeline *config* (returns the callback URL, auth header name
and service IDs for the requested task), then pipeline *compute* against that callback URL.

⚠️ Implemented against the publicly documented ULCA request/response shape
(bhashini.gitbook.io/bhashini-apis); unlike the `sarvam` adapter (verified against the
`sarvamai` SDK's own source), this hasn't been exercised against a live Bhashini account.
Verify field names against a real response before relying on this tier for the demo — same
discipline docs/15-ai-stack.md asks for prices and licences.
"""

from __future__ import annotations

import base64

import httpx

from app.cascade import ProviderUnavailable
from app.config import settings
from app.speech.base import SynthesisResult, TranscriptResult

_ASR_TASK = "asr"
_TTS_TASK = "tts"


async def _pipeline_config(task_type: str, source_language: str) -> dict:
    if not (settings.bhashini_user_id and settings.bhashini_ulca_api_key and settings.bhashini_pipeline_id):
        raise ProviderUnavailable("BHASHINI_USER_ID / BHASHINI_ULCA_API_KEY / BHASHINI_PIPELINE_ID not set")

    body = {
        "pipelineTasks": [{"taskType": task_type, "config": {"language": {"sourceLanguage": source_language}}}],
        "pipelineRequestConfig": {"pipelineId": settings.bhashini_pipeline_id},
    }
    headers = {"userID": settings.bhashini_user_id, "ulcaApiKey": settings.bhashini_ulca_api_key}
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(settings.bhashini_config_url, json=body, headers=headers)
            response.raise_for_status()
            return response.json()
    except (httpx.HTTPError, ValueError) as exc:
        raise ProviderUnavailable(f"Bhashini pipeline config call failed: {exc}") from exc


def _compute_endpoint_and_headers(config_response: dict) -> tuple[str, dict, str]:
    try:
        endpoint = config_response["pipelineInferenceAPIEndPoint"]
        callback_url = endpoint["callbackUrl"]
        auth = endpoint["inferenceApiKey"]
        service_id = config_response["pipelineResponseConfig"][0]["config"][0]["serviceId"]
    except (KeyError, IndexError) as exc:
        raise ProviderUnavailable(f"Unexpected Bhashini pipeline config response shape: {exc}") from exc
    return callback_url, {auth["name"]: auth["value"]}, service_id


async def transcribe(audio_bytes: bytes, language: str) -> TranscriptResult:
    config_response = await _pipeline_config(_ASR_TASK, language)
    callback_url, headers, service_id = _compute_endpoint_and_headers(config_response)

    body = {
        "pipelineTasks": [
            {
                "taskType": _ASR_TASK,
                "config": {
                    "language": {"sourceLanguage": language},
                    "serviceId": service_id,
                    "audioFormat": "wav",
                    "samplingRate": settings.sarvam_sample_rate,
                },
            }
        ],
        "inputData": {"audio": [{"audioContent": base64.b64encode(audio_bytes).decode("ascii")}]},
    }
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(callback_url, json=body, headers=headers)
            response.raise_for_status()
            data = response.json()
        text = data["pipelineResponse"][0]["output"][0]["source"]
    except (httpx.HTTPError, ValueError, KeyError, IndexError) as exc:
        raise ProviderUnavailable(f"Bhashini ASR compute call failed: {exc}") from exc

    return TranscriptResult(text=text, confidence=1.0, segments=[])


async def synthesise(text: str, language: str, voice: str | None) -> SynthesisResult:
    config_response = await _pipeline_config(_TTS_TASK, language)
    callback_url, headers, service_id = _compute_endpoint_and_headers(config_response)

    body = {
        "pipelineTasks": [
            {
                "taskType": _TTS_TASK,
                "config": {
                    "language": {"sourceLanguage": language},
                    "serviceId": service_id,
                    **({"gender": voice} if voice else {}),
                },
            }
        ],
        "inputData": {"input": [{"source": text}]},
    }
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(callback_url, json=body, headers=headers)
            response.raise_for_status()
            data = response.json()
        audio_content = data["pipelineResponse"][0]["audio"][0]["audioContent"]
    except (httpx.HTTPError, ValueError, KeyError, IndexError) as exc:
        raise ProviderUnavailable(f"Bhashini TTS compute call failed: {exc}") from exc

    return SynthesisResult(audio_bytes=base64.b64decode(audio_content), content_type="audio/wav")
