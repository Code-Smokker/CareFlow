from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.ayurvedic_row_disposition_type_1 import AyurvedicRowDispositionType1
from ..models.ayurvedic_row_disposition_type_2_type_1 import (
    AyurvedicRowDispositionType2Type1,
)
from ..models.ayurvedic_row_disposition_type_3_type_1 import (
    AyurvedicRowDispositionType3Type1,
)
from ..models.ayurvedic_row_source import AyurvedicRowSource

if TYPE_CHECKING:
    from ..models.exam_original import ExamOriginal


T = TypeVar("T", bound="AyurvedicRow")


@_attrs_define
class AyurvedicRow:
    """
    Attributes:
        group (None | str): Sub-heading (e.g. "Nadi — Pulse").
        label (str):
        gloss (str):
        value_label (str):
        source (AyurvedicRowSource):
        confidence (float | None):
        disposition (AyurvedicRowDispositionType1 | AyurvedicRowDispositionType2Type1 |
            AyurvedicRowDispositionType3Type1 | None):
        original (ExamOriginal | None):
        recorded_by (None | str):
    """

    group: None | str
    label: str
    gloss: str
    value_label: str
    source: AyurvedicRowSource
    confidence: float | None
    disposition: (
        AyurvedicRowDispositionType1
        | AyurvedicRowDispositionType2Type1
        | AyurvedicRowDispositionType3Type1
        | None
    )
    original: ExamOriginal | None
    recorded_by: None | str
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.exam_original import ExamOriginal  # noqa: PLC0415

        group: None | str
        group = self.group

        label = self.label

        gloss = self.gloss

        value_label = self.value_label

        source = self.source.value

        confidence: float | None
        confidence = self.confidence

        disposition: None | str
        if isinstance(self.disposition, AyurvedicRowDispositionType1):
            disposition = self.disposition.value
        elif isinstance(self.disposition, AyurvedicRowDispositionType2Type1):
            disposition = self.disposition.value
        elif isinstance(self.disposition, AyurvedicRowDispositionType3Type1):
            disposition = self.disposition.value
        else:
            disposition = self.disposition

        original: dict[str, Any] | None
        if isinstance(self.original, ExamOriginal):
            original = self.original.to_dict()
        else:
            original = self.original

        recorded_by: None | str
        recorded_by = self.recorded_by

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "group": group,
                "label": label,
                "gloss": gloss,
                "value_label": value_label,
                "source": source,
                "confidence": confidence,
                "disposition": disposition,
                "original": original,
                "recorded_by": recorded_by,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.exam_original import ExamOriginal  # noqa: PLC0415

        d = dict(src_dict)

        def _parse_group(data: object) -> None | str:
            if data is None:
                return data
            return cast(None | str, data)

        group = _parse_group(d.pop("group"))

        label = d.pop("label")

        gloss = d.pop("gloss")

        value_label = d.pop("value_label")

        source = AyurvedicRowSource(d.pop("source"))

        def _parse_confidence(data: object) -> float | None:
            if data is None:
                return data
            return cast(float | None, data)

        confidence = _parse_confidence(d.pop("confidence"))

        def _parse_disposition(
            data: object,
        ) -> (
            AyurvedicRowDispositionType1
            | AyurvedicRowDispositionType2Type1
            | AyurvedicRowDispositionType3Type1
            | None
        ):
            if data is None:
                return data
            try:
                if not isinstance(data, str):
                    raise TypeError()
                disposition_type_1 = AyurvedicRowDispositionType1(data)

                return disposition_type_1
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            try:
                if not isinstance(data, str):
                    raise TypeError()
                disposition_type_2_type_1 = AyurvedicRowDispositionType2Type1(data)

                return disposition_type_2_type_1
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            try:
                if not isinstance(data, str):
                    raise TypeError()
                disposition_type_3_type_1 = AyurvedicRowDispositionType3Type1(data)

                return disposition_type_3_type_1
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(
                AyurvedicRowDispositionType1
                | AyurvedicRowDispositionType2Type1
                | AyurvedicRowDispositionType3Type1
                | None,
                data,
            )

        disposition = _parse_disposition(d.pop("disposition"))

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

        def _parse_recorded_by(data: object) -> None | str:
            if data is None:
                return data
            return cast(None | str, data)

        recorded_by = _parse_recorded_by(d.pop("recorded_by"))

        ayurvedic_row = cls(
            group=group,
            label=label,
            gloss=gloss,
            value_label=value_label,
            source=source,
            confidence=confidence,
            disposition=disposition,
            original=original,
            recorded_by=recorded_by,
        )

        ayurvedic_row.additional_properties = d
        return ayurvedic_row

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
