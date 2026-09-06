from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.next_question_body_state import NextQuestionBodyState


T = TypeVar("T", bound="NextQuestionBody")


@_attrs_define
class NextQuestionBody:
    """
    Attributes:
        module_id (str):
        state (NextQuestionBodyState): Serialized ontology state-machine snapshot.
        language (str):
    """

    module_id: str
    state: NextQuestionBodyState
    language: str
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        module_id = self.module_id

        state = self.state.to_dict()

        language = self.language

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "module_id": module_id,
                "state": state,
                "language": language,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.next_question_body_state import (
            NextQuestionBodyState,  # noqa: PLC0415
        )

        d = dict(src_dict)
        module_id = d.pop("module_id")

        state = NextQuestionBodyState.from_dict(d.pop("state"))

        language = d.pop("language")

        next_question_body = cls(
            module_id=module_id,
            state=state,
            language=language,
        )

        next_question_body.additional_properties = d
        return next_question_body

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
