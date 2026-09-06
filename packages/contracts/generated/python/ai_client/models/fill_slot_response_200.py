from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.slot_value_type_4 import SlotValueType4


T = TypeVar("T", bound="FillSlotResponse200")


@_attrs_define
class FillSlotResponse200:
    """
    Attributes:
        value (bool | float | list[str] | None | SlotValueType4 | str): Typed per the slot schema declared in
            packages/ontology.
        confidence (float):
        needs_clarification (bool):
    """

    value: bool | float | list[str] | None | SlotValueType4 | str
    confidence: float
    needs_clarification: bool
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.slot_value_type_4 import SlotValueType4  # noqa: PLC0415

        value: bool | dict[str, Any] | float | list[str] | None | str
        if isinstance(self.value, list):
            value = self.value

        elif isinstance(self.value, SlotValueType4):
            value = self.value.to_dict()
        else:
            value = self.value

        confidence = self.confidence

        needs_clarification = self.needs_clarification

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "value": value,
                "confidence": confidence,
                "needs_clarification": needs_clarification,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.slot_value_type_4 import SlotValueType4  # noqa: PLC0415

        d = dict(src_dict)

        def _parse_value(
            data: object,
        ) -> bool | float | list[str] | None | SlotValueType4 | str:
            if data is None:
                return data
            try:
                if not isinstance(data, list):
                    raise TypeError()
                componentsschemas_slot_value_type_3 = cast(list[str], data)

                return componentsschemas_slot_value_type_3
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                componentsschemas_slot_value_type_4 = SlotValueType4.from_dict(data)

                return componentsschemas_slot_value_type_4
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(bool | float | list[str] | None | SlotValueType4 | str, data)

        value = _parse_value(d.pop("value"))

        confidence = d.pop("confidence")

        needs_clarification = d.pop("needs_clarification")

        fill_slot_response_200 = cls(
            value=value,
            confidence=confidence,
            needs_clarification=needs_clarification,
        )

        fill_slot_response_200.additional_properties = d
        return fill_slot_response_200

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
