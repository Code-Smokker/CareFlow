from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from .. import types
from ..types import UNSET, Unset

T = TypeVar("T", bound="UploadDocumentBody")


@_attrs_define
class UploadDocumentBody:
    """
    Attributes:
        file (str):
        doc_type_hint (None | str | Unset):
    """

    file: str
    doc_type_hint: None | str | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        file = self.file

        doc_type_hint: None | str | Unset
        if isinstance(self.doc_type_hint, Unset):
            doc_type_hint = UNSET
        else:
            doc_type_hint = self.doc_type_hint

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "file": file,
            }
        )
        if doc_type_hint is not UNSET:
            field_dict["doc_type_hint"] = doc_type_hint

        return field_dict

    def to_multipart(self) -> types.RequestFiles:
        files: types.RequestFiles = []

        files.append(("file", (None, str(self.file).encode(), "text/plain")))

        if not isinstance(self.doc_type_hint, Unset):
            if isinstance(self.doc_type_hint, str):
                files.append(
                    (
                        "doc_type_hint",
                        (None, str(self.doc_type_hint).encode(), "text/plain"),
                    )
                )
            else:
                files.append(
                    (
                        "doc_type_hint",
                        (None, str(self.doc_type_hint).encode(), "text/plain"),
                    )
                )

        for prop_name, prop in self.additional_properties.items():
            files.append((prop_name, (None, str(prop).encode(), "text/plain")))

        return files

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        file = d.pop("file")

        def _parse_doc_type_hint(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        doc_type_hint = _parse_doc_type_hint(d.pop("doc_type_hint", UNSET))

        upload_document_body = cls(
            file=file,
            doc_type_hint=doc_type_hint,
        )

        upload_document_body.additional_properties = d
        return upload_document_body

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
