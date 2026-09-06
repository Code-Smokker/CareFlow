from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.terminology_system import TerminologySystem
from ..types import UNSET, Unset

T = TypeVar("T", bound="ConceptDetail")


@_attrs_define
class ConceptDetail:
    """
    Attributes:
        system (TerminologySystem):
        code (str):
        display (str):
        synonyms (list[str]):
        definition (None | str | Unset):
    """

    system: TerminologySystem
    code: str
    display: str
    synonyms: list[str]
    definition: None | str | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        system = self.system.value

        code = self.code

        display = self.display

        synonyms = self.synonyms

        definition: None | str | Unset
        if isinstance(self.definition, Unset):
            definition = UNSET
        else:
            definition = self.definition

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "system": system,
                "code": code,
                "display": display,
                "synonyms": synonyms,
            }
        )
        if definition is not UNSET:
            field_dict["definition"] = definition

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        system = TerminologySystem(d.pop("system"))

        code = d.pop("code")

        display = d.pop("display")

        synonyms = cast(list[str], d.pop("synonyms"))

        def _parse_definition(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        definition = _parse_definition(d.pop("definition", UNSET))

        concept_detail = cls(
            system=system,
            code=code,
            display=display,
            synonyms=synonyms,
            definition=definition,
        )

        concept_detail.additional_properties = d
        return concept_detail

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
