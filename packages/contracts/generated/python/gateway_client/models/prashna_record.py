from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.prakriti_score import PrakritiScore
    from ..models.prashna_record_groups_item import PrashnaRecordGroupsItem


T = TypeVar("T", bound="PrashnaRecord")


@_attrs_define
class PrashnaRecord:
    """
    Attributes:
        groups (list[PrashnaRecordGroupsItem]):
        answered (int):
        total (int):
        prakriti_score (None | PrakritiScore):
    """

    groups: list[PrashnaRecordGroupsItem]
    answered: int
    total: int
    prakriti_score: None | PrakritiScore
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.prakriti_score import PrakritiScore  # noqa: PLC0415

        groups = []
        for groups_item_data in self.groups:
            groups_item = groups_item_data.to_dict()
            groups.append(groups_item)

        answered = self.answered

        total = self.total

        prakriti_score: dict[str, Any] | None
        if isinstance(self.prakriti_score, PrakritiScore):
            prakriti_score = self.prakriti_score.to_dict()
        else:
            prakriti_score = self.prakriti_score

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "groups": groups,
                "answered": answered,
                "total": total,
                "prakriti_score": prakriti_score,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.prakriti_score import PrakritiScore  # noqa: PLC0415
        from ..models.prashna_record_groups_item import (
            PrashnaRecordGroupsItem,  # noqa: PLC0415
        )

        d = dict(src_dict)
        groups = []
        _groups = d.pop("groups")
        for groups_item_data in _groups:
            groups_item = PrashnaRecordGroupsItem.from_dict(groups_item_data)

            groups.append(groups_item)

        answered = d.pop("answered")

        total = d.pop("total")

        def _parse_prakriti_score(data: object) -> None | PrakritiScore:
            if data is None:
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                prakriti_score_type_0 = PrakritiScore.from_dict(data)

                return prakriti_score_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(None | PrakritiScore, data)

        prakriti_score = _parse_prakriti_score(d.pop("prakriti_score"))

        prashna_record = cls(
            groups=groups,
            answered=answered,
            total=total,
            prakriti_score=prakriti_score,
        )

        prashna_record.additional_properties = d
        return prashna_record

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
