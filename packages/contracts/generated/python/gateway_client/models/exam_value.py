from __future__ import annotations

import datetime
from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.exam_value_disposition import ExamValueDisposition
from ..models.exam_value_source import ExamValueSource

if TYPE_CHECKING:
    from ..models.exam_original import ExamOriginal


T = TypeVar("T", bound="ExamValue")


@_attrs_define
class ExamValue:
    """
    Attributes:
        field_id (str):
        value (Any):
        source (ExamValueSource):
        disposition (ExamValueDisposition): entered = the Vaidya's own finding; confirmed = the Vaidya accepted the
            patient-reported value; overridden = the Vaidya replaced it (the original is kept).
        recorded_by (str):
        recorded_at (datetime.datetime):
        original (ExamOriginal | None): The patient-reported value this one confirms or overrides; never discarded.
    """

    field_id: str
    value: Any
    source: ExamValueSource
    disposition: ExamValueDisposition
    recorded_by: str
    recorded_at: datetime.datetime
    original: ExamOriginal | None
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.exam_original import ExamOriginal  # noqa: PLC0415

        field_id = self.field_id

        value = self.value

        source = self.source.value

        disposition = self.disposition.value

        recorded_by = self.recorded_by

        recorded_at = self.recorded_at.isoformat()

        original: dict[str, Any] | None
        if isinstance(self.original, ExamOriginal):
            original = self.original.to_dict()
        else:
            original = self.original

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "field_id": field_id,
                "value": value,
                "source": source,
                "disposition": disposition,
                "recorded_by": recorded_by,
                "recorded_at": recorded_at,
                "original": original,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.exam_original import ExamOriginal  # noqa: PLC0415

        d = dict(src_dict)
        field_id = d.pop("field_id")

        value = d.pop("value")

        source = ExamValueSource(d.pop("source"))

        disposition = ExamValueDisposition(d.pop("disposition"))

        recorded_by = d.pop("recorded_by")

        recorded_at = datetime.datetime.fromisoformat(d.pop("recorded_at"))

        def _parse_original(data: object) -> ExamOriginal | None:
            if data is None:
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                original_type_0 = ExamOriginal.from_dict(data)

                return original_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(ExamOriginal | None, data)

        original = _parse_original(d.pop("original"))

        exam_value = cls(
            field_id=field_id,
            value=value,
            source=source,
            disposition=disposition,
            recorded_by=recorded_by,
            recorded_at=recorded_at,
            original=original,
        )

        exam_value.additional_properties = d
        return exam_value

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
