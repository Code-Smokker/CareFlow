from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.input_mode import InputMode
from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.summary_field_bounding_box_type_0 import SummaryFieldBoundingBoxType0


T = TypeVar("T", bound="SummaryField")


@_attrs_define
class SummaryField:
    """
    Attributes:
        field_path (str):
        value (Any):
        source (InputMode): How the patient supplied this answer. Maps to answer.source (CLAUDE.md rule 4).
        confidence (float):
        audio_offset_ms (int | None | Unset):
        bounding_box (None | SummaryFieldBoundingBoxType0 | Unset):
        physician_edited (bool | Unset):  Default: False.
    """

    field_path: str
    value: Any
    source: InputMode
    confidence: float
    audio_offset_ms: int | None | Unset = UNSET
    bounding_box: None | SummaryFieldBoundingBoxType0 | Unset = UNSET
    physician_edited: bool | Unset = False
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.summary_field_bounding_box_type_0 import (
            SummaryFieldBoundingBoxType0,  # noqa: PLC0415
        )

        field_path = self.field_path

        value = self.value

        source = self.source.value

        confidence = self.confidence

        audio_offset_ms: int | None | Unset
        if isinstance(self.audio_offset_ms, Unset):
            audio_offset_ms = UNSET
        else:
            audio_offset_ms = self.audio_offset_ms

        bounding_box: dict[str, Any] | None | Unset
        if isinstance(self.bounding_box, Unset):
            bounding_box = UNSET
        elif isinstance(self.bounding_box, SummaryFieldBoundingBoxType0):
            bounding_box = self.bounding_box.to_dict()
        else:
            bounding_box = self.bounding_box

        physician_edited = self.physician_edited

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "field_path": field_path,
                "value": value,
                "source": source,
                "confidence": confidence,
            }
        )
        if audio_offset_ms is not UNSET:
            field_dict["audio_offset_ms"] = audio_offset_ms
        if bounding_box is not UNSET:
            field_dict["bounding_box"] = bounding_box
        if physician_edited is not UNSET:
            field_dict["physician_edited"] = physician_edited

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.summary_field_bounding_box_type_0 import (
            SummaryFieldBoundingBoxType0,  # noqa: PLC0415
        )

        d = dict(src_dict)
        field_path = d.pop("field_path")

        value = d.pop("value")

        source = InputMode(d.pop("source"))

        confidence = d.pop("confidence")

        def _parse_audio_offset_ms(data: object) -> int | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(int | None | Unset, data)

        audio_offset_ms = _parse_audio_offset_ms(d.pop("audio_offset_ms", UNSET))

        def _parse_bounding_box(
            data: object,
        ) -> None | SummaryFieldBoundingBoxType0 | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                bounding_box_type_0 = SummaryFieldBoundingBoxType0.from_dict(data)

                return bounding_box_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(None | SummaryFieldBoundingBoxType0 | Unset, data)

        bounding_box = _parse_bounding_box(d.pop("bounding_box", UNSET))

        physician_edited = d.pop("physician_edited", UNSET)

        summary_field = cls(
            field_path=field_path,
            value=value,
            source=source,
            confidence=confidence,
            audio_offset_ms=audio_offset_ms,
            bounding_box=bounding_box,
            physician_edited=physician_edited,
        )

        summary_field.additional_properties = d
        return summary_field

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
