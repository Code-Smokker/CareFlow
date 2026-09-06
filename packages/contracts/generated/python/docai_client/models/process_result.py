from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.extracted_field import ExtractedField
    from ..models.timeline_event import TimelineEvent


T = TypeVar("T", bound="ProcessResult")


@_attrs_define
class ProcessResult:
    """
    Attributes:
        document_id (str):
        extractions (list[ExtractedField]):
        timeline_events (list[TimelineEvent]):
        quality_score (float):
    """

    document_id: str
    extractions: list[ExtractedField]
    timeline_events: list[TimelineEvent]
    quality_score: float
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        document_id = self.document_id

        extractions = []
        for extractions_item_data in self.extractions:
            extractions_item = extractions_item_data.to_dict()
            extractions.append(extractions_item)

        timeline_events = []
        for timeline_events_item_data in self.timeline_events:
            timeline_events_item = timeline_events_item_data.to_dict()
            timeline_events.append(timeline_events_item)

        quality_score = self.quality_score

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "document_id": document_id,
                "extractions": extractions,
                "timeline_events": timeline_events,
                "quality_score": quality_score,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.extracted_field import ExtractedField  # noqa: PLC0415
        from ..models.timeline_event import TimelineEvent  # noqa: PLC0415

        d = dict(src_dict)
        document_id = d.pop("document_id")

        extractions = []
        _extractions = d.pop("extractions")
        for extractions_item_data in _extractions:
            extractions_item = ExtractedField.from_dict(extractions_item_data)

            extractions.append(extractions_item)

        timeline_events = []
        _timeline_events = d.pop("timeline_events")
        for timeline_events_item_data in _timeline_events:
            timeline_events_item = TimelineEvent.from_dict(timeline_events_item_data)

            timeline_events.append(timeline_events_item)

        quality_score = d.pop("quality_score")

        process_result = cls(
            document_id=document_id,
            extractions=extractions,
            timeline_events=timeline_events,
            quality_score=quality_score,
        )

        process_result.additional_properties = d
        return process_result

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
