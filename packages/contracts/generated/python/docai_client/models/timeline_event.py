from __future__ import annotations

import datetime
from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.timeline_event_kind import TimelineEventKind

T = TypeVar("T", bound="TimelineEvent")


@_attrs_define
class TimelineEvent:
    """
    Attributes:
        event_id (str):
        occurred_at (datetime.datetime):
        kind (TimelineEventKind):
        summary (str):
        approximate (bool): True when occurred_at is a relative-ordering placeholder, not a date read from the document
            (docs/06-document-ai.md timeline assembly rule 3 — never invent a precise date; an approximate marker is the
            honest alternative). Required, not optional, so no caller can silently omit the honesty signal.
    """

    event_id: str
    occurred_at: datetime.datetime
    kind: TimelineEventKind
    summary: str
    approximate: bool
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        event_id = self.event_id

        occurred_at = self.occurred_at.isoformat()

        kind = self.kind.value

        summary = self.summary

        approximate = self.approximate

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "event_id": event_id,
                "occurred_at": occurred_at,
                "kind": kind,
                "summary": summary,
                "approximate": approximate,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        event_id = d.pop("event_id")

        occurred_at = datetime.datetime.fromisoformat(d.pop("occurred_at"))

        kind = TimelineEventKind(d.pop("kind"))

        summary = d.pop("summary")

        approximate = d.pop("approximate")

        timeline_event = cls(
            event_id=event_id,
            occurred_at=occurred_at,
            kind=kind,
            summary=summary,
            approximate=approximate,
        )

        timeline_event.additional_properties = d
        return timeline_event

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
