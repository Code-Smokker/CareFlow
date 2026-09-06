from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.question_option import QuestionOption


T = TypeVar("T", bound="NextQuestionResponse200")


@_attrs_define
class NextQuestionResponse200:
    """
    Attributes:
        text (str):
        tts_url (None | str):
        options (list[QuestionOption]):
    """

    text: str
    tts_url: None | str
    options: list[QuestionOption]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        text = self.text

        tts_url: None | str
        tts_url = self.tts_url

        options = []
        for options_item_data in self.options:
            options_item = options_item_data.to_dict()
            options.append(options_item)

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "text": text,
                "tts_url": tts_url,
                "options": options,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.question_option import QuestionOption  # noqa: PLC0415

        d = dict(src_dict)
        text = d.pop("text")

        def _parse_tts_url(data: object) -> None | str:
            if data is None:
                return data
            return cast(None | str, data)

        tts_url = _parse_tts_url(d.pop("tts_url"))

        options = []
        _options = d.pop("options")
        for options_item_data in _options:
            options_item = QuestionOption.from_dict(options_item_data)

            options.append(options_item)

        next_question_response_200 = cls(
            text=text,
            tts_url=tts_url,
            options=options,
        )

        next_question_response_200.additional_properties = d
        return next_question_response_200

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
