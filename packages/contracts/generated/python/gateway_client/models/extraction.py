from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.extraction_bounding_box_type_0 import ExtractionBoundingBoxType0


T = TypeVar("T", bound="Extraction")


@_attrs_define
class Extraction:
    """
    Attributes:
        field (str):
        value (str):
        confidence (float):
        bounding_box (ExtractionBoundingBoxType0 | None):
    """

    field: str
    value: str
    confidence: float
    bounding_box: ExtractionBoundingBoxType0 | None
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.extraction_bounding_box_type_0 import (
            ExtractionBoundingBoxType0,  # noqa: PLC0415
        )

        field = self.field

        value = self.value

        confidence = self.confidence

        bounding_box: dict[str, Any] | None
        if isinstance(self.bounding_box, ExtractionBoundingBoxType0):
            bounding_box = self.bounding_box.to_dict()
        else:
            bounding_box = self.bounding_box

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "field": field,
                "value": value,
                "confidence": confidence,
                "bounding_box": bounding_box,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.extraction_bounding_box_type_0 import (
            ExtractionBoundingBoxType0,  # noqa: PLC0415
        )

        d = dict(src_dict)
        field = d.pop("field")

        value = d.pop("value")

        confidence = d.pop("confidence")

        def _parse_bounding_box(data: object) -> ExtractionBoundingBoxType0 | None:
            if data is None:
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                bounding_box_type_0 = ExtractionBoundingBoxType0.from_dict(data)

                return bounding_box_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(ExtractionBoundingBoxType0 | None, data)

        bounding_box = _parse_bounding_box(d.pop("bounding_box"))

        extraction = cls(
            field=field,
            value=value,
            confidence=confidence,
            bounding_box=bounding_box,
        )

        extraction.additional_properties = d
        return extraction

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
