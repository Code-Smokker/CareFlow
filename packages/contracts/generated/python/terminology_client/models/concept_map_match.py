from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.concept_map_match_equivalence_type_1 import (
    ConceptMapMatchEquivalenceType1,
)
from ..models.concept_map_match_equivalence_type_2_type_1 import (
    ConceptMapMatchEquivalenceType2Type1,
)
from ..models.concept_map_match_equivalence_type_3_type_1 import (
    ConceptMapMatchEquivalenceType3Type1,
)
from ..models.terminology_system import TerminologySystem
from ..types import UNSET, Unset

T = TypeVar("T", bound="ConceptMapMatch")


@_attrs_define
class ConceptMapMatch:
    """
    Attributes:
        matched (bool):
        equivalence (ConceptMapMatchEquivalenceType1 | ConceptMapMatchEquivalenceType2Type1 |
            ConceptMapMatchEquivalenceType3Type1 | None):
        target_system (TerminologySystem | Unset):
        target_code (None | str | Unset):
        target_display (None | str | Unset):
    """

    matched: bool
    equivalence: (
        ConceptMapMatchEquivalenceType1
        | ConceptMapMatchEquivalenceType2Type1
        | ConceptMapMatchEquivalenceType3Type1
        | None
    )
    target_system: TerminologySystem | Unset = UNSET
    target_code: None | str | Unset = UNSET
    target_display: None | str | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        matched = self.matched

        equivalence: None | str
        if isinstance(self.equivalence, ConceptMapMatchEquivalenceType1):
            equivalence = self.equivalence.value
        elif isinstance(self.equivalence, ConceptMapMatchEquivalenceType2Type1):
            equivalence = self.equivalence.value
        elif isinstance(self.equivalence, ConceptMapMatchEquivalenceType3Type1):
            equivalence = self.equivalence.value
        else:
            equivalence = self.equivalence

        target_system: str | Unset = UNSET
        if not isinstance(self.target_system, Unset):
            target_system = self.target_system.value

        target_code: None | str | Unset
        if isinstance(self.target_code, Unset):
            target_code = UNSET
        else:
            target_code = self.target_code

        target_display: None | str | Unset
        if isinstance(self.target_display, Unset):
            target_display = UNSET
        else:
            target_display = self.target_display

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "matched": matched,
                "equivalence": equivalence,
            }
        )
        if target_system is not UNSET:
            field_dict["target_system"] = target_system
        if target_code is not UNSET:
            field_dict["target_code"] = target_code
        if target_display is not UNSET:
            field_dict["target_display"] = target_display

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        matched = d.pop("matched")

        def _parse_equivalence(
            data: object,
        ) -> (
            ConceptMapMatchEquivalenceType1
            | ConceptMapMatchEquivalenceType2Type1
            | ConceptMapMatchEquivalenceType3Type1
            | None
        ):
            if data is None:
                return data
            try:
                if not isinstance(data, str):
                    raise TypeError()
                equivalence_type_1 = ConceptMapMatchEquivalenceType1(data)

                return equivalence_type_1
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            try:
                if not isinstance(data, str):
                    raise TypeError()
                equivalence_type_2_type_1 = ConceptMapMatchEquivalenceType2Type1(data)

                return equivalence_type_2_type_1
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            try:
                if not isinstance(data, str):
                    raise TypeError()
                equivalence_type_3_type_1 = ConceptMapMatchEquivalenceType3Type1(data)

                return equivalence_type_3_type_1
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(
                ConceptMapMatchEquivalenceType1
                | ConceptMapMatchEquivalenceType2Type1
                | ConceptMapMatchEquivalenceType3Type1
                | None,
                data,
            )

        equivalence = _parse_equivalence(d.pop("equivalence"))

        _target_system = d.pop("target_system", UNSET)
        target_system: TerminologySystem | Unset
        if isinstance(_target_system, Unset):
            target_system = UNSET
        else:
            target_system = TerminologySystem(_target_system)

        def _parse_target_code(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        target_code = _parse_target_code(d.pop("target_code", UNSET))

        def _parse_target_display(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        target_display = _parse_target_display(d.pop("target_display", UNSET))

        concept_map_match = cls(
            matched=matched,
            equivalence=equivalence,
            target_system=target_system,
            target_code=target_code,
            target_display=target_display,
        )

        concept_map_match.additional_properties = d
        return concept_map_match

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
