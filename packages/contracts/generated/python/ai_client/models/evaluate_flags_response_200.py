from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.red_flag_finding import RedFlagFinding


T = TypeVar("T", bound="EvaluateFlagsResponse200")


@_attrs_define
class EvaluateFlagsResponse200:
    """
    Attributes:
        fired (list[RedFlagFinding]):
    """

    fired: list[RedFlagFinding]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        fired = []
        for fired_item_data in self.fired:
            fired_item = fired_item_data.to_dict()
            fired.append(fired_item)

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "fired": fired,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.red_flag_finding import RedFlagFinding  # noqa: PLC0415

        d = dict(src_dict)
        fired = []
        _fired = d.pop("fired")
        for fired_item_data in _fired:
            fired_item = RedFlagFinding.from_dict(fired_item_data)

            fired.append(fired_item)

        evaluate_flags_response_200 = cls(
            fired=fired,
        )

        evaluate_flags_response_200.additional_properties = d
        return evaluate_flags_response_200

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
