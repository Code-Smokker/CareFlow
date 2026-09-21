from __future__ import annotations

import datetime
from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.integration_event_outcome import IntegrationEventOutcome
from ..models.integration_event_service import IntegrationEventService
from ..types import UNSET, Unset

T = TypeVar("T", bound="IntegrationEvent")


@_attrs_define
class IntegrationEvent:
    """
    Attributes:
        id (str):
        service (IntegrationEventService):
        capability (str): e.g. "llm.fill_slot", "asr.transcribe", "docai.ocr"
        provider (str): e.g. "sarvam", "local", "hosted"
        outcome (IntegrationEventOutcome):
        latency_ms (int):
        at (datetime.datetime):
        error (None | str | Unset):
    """

    id: str
    service: IntegrationEventService
    capability: str
    provider: str
    outcome: IntegrationEventOutcome
    latency_ms: int
    at: datetime.datetime
    error: None | str | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        id = self.id

        service = self.service.value

        capability = self.capability

        provider = self.provider

        outcome = self.outcome.value

        latency_ms = self.latency_ms

        at = self.at.isoformat()

        error: None | str | Unset
        if isinstance(self.error, Unset):
            error = UNSET
        else:
            error = self.error

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "id": id,
                "service": service,
                "capability": capability,
                "provider": provider,
                "outcome": outcome,
                "latency_ms": latency_ms,
                "at": at,
            }
        )
        if error is not UNSET:
            field_dict["error"] = error

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        id = d.pop("id")

        service = IntegrationEventService(d.pop("service"))

        capability = d.pop("capability")

        provider = d.pop("provider")

        outcome = IntegrationEventOutcome(d.pop("outcome"))

        latency_ms = d.pop("latency_ms")

        at = datetime.datetime.fromisoformat(d.pop("at"))

        def _parse_error(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        error = _parse_error(d.pop("error", UNSET))

        integration_event = cls(
            id=id,
            service=service,
            capability=capability,
            provider=provider,
            outcome=outcome,
            latency_ms=latency_ms,
            at=at,
            error=error,
        )

        integration_event.additional_properties = d
        return integration_event

    @property
    def additional_keys(self) -> list[str]:
        return list(self.additional_properties.keys())

    def __getitem__(self, key: str) -> Any:
        return self.additional_properties[key]

    def __setitem__(self, key: str, value: Any) -> None:
        self.additional_properties[key] = value

    def __delitem__(self, key: str) -> None:
        del self.additional_properties[key]

    def __contains__(self, key: str) -> bool:
        return key in self.additional_properties
