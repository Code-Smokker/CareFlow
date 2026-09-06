from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="AskVisitResponse200")


@_attrs_define
class AskVisitResponse200:
    """
    Attributes:
        answer (str):
        cited_field_paths (list[str]):
    """

    answer: str
    cited_field_paths: list[str]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        answer = self.answer

        cited_field_paths = self.cited_field_paths

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "answer": answer,
                "cited_field_paths": cited_field_paths,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        answer = d.pop("answer")

        cited_field_paths = cast(list[str], d.pop("cited_field_paths"))

        ask_visit_response_200 = cls(
            answer=answer,
            cited_field_paths=cited_field_paths,
        )

        ask_visit_response_200.additional_properties = d
        return ask_visit_response_200

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
