from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.document_status_status import DocumentStatusStatus

if TYPE_CHECKING:
    from ..models.extraction import Extraction


T = TypeVar("T", bound="DocumentStatus")


@_attrs_define
class DocumentStatus:
    """
    Attributes:
        status (DocumentStatusStatus):
        extractions (list[Extraction]):
        quality_score (float | None):
    """

    status: DocumentStatusStatus
    extractions: list[Extraction]
    quality_score: float | None
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        status = self.status.value

        extractions = []
        for extractions_item_data in self.extractions:
            extractions_item = extractions_item_data.to_dict()
            extractions.append(extractions_item)

        quality_score: float | None
        quality_score = self.quality_score

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "status": status,
                "extractions": extractions,
                "quality_score": quality_score,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.extraction import Extraction  # noqa: PLC0415

        d = dict(src_dict)
        status = DocumentStatusStatus(d.pop("status"))

        extractions = []
        _extractions = d.pop("extractions")
        for extractions_item_data in _extractions:
            extractions_item = Extraction.from_dict(extractions_item_data)

            extractions.append(extractions_item)

        def _parse_quality_score(data: object) -> float | None:
            if data is None:
                return data
            return cast(float | None, data)

        quality_score = _parse_quality_score(d.pop("quality_score"))

        document_status = cls(
            status=status,
            extractions=extractions,
            quality_score=quality_score,
        )

        document_status.additional_properties = d
        return document_status

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
