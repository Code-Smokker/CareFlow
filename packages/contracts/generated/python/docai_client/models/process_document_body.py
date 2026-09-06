from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.process_document_body_doc_type_type_1 import (
    ProcessDocumentBodyDocTypeType1,
)
from ..models.process_document_body_doc_type_type_2_type_1 import (
    ProcessDocumentBodyDocTypeType2Type1,
)
from ..models.process_document_body_doc_type_type_3_type_1 import (
    ProcessDocumentBodyDocTypeType3Type1,
)
from ..types import UNSET, Unset

T = TypeVar("T", bound="ProcessDocumentBody")


@_attrs_define
class ProcessDocumentBody:
    """
    Attributes:
        document_id (str):
        image_refs (list[str]):
        doc_type (None | ProcessDocumentBodyDocTypeType1 | ProcessDocumentBodyDocTypeType2Type1 |
            ProcessDocumentBodyDocTypeType3Type1 | Unset): From a prior /classify call, if the caller already has one — used
            to pick the TimelineEvent.kind for this document. Optional: omitted or null falls back to a generic "visit" kind
            rather than blocking processing on it.
    """

    document_id: str
    image_refs: list[str]
    doc_type: (
        None
        | ProcessDocumentBodyDocTypeType1
        | ProcessDocumentBodyDocTypeType2Type1
        | ProcessDocumentBodyDocTypeType3Type1
        | Unset
    ) = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        document_id = self.document_id

        image_refs = self.image_refs

        doc_type: None | str | Unset
        if isinstance(self.doc_type, Unset):
            doc_type = UNSET
        elif isinstance(self.doc_type, ProcessDocumentBodyDocTypeType1):
            doc_type = self.doc_type.value
        elif isinstance(self.doc_type, ProcessDocumentBodyDocTypeType2Type1):
            doc_type = self.doc_type.value
        elif isinstance(self.doc_type, ProcessDocumentBodyDocTypeType3Type1):
            doc_type = self.doc_type.value
        else:
            doc_type = self.doc_type

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "document_id": document_id,
                "image_refs": image_refs,
            }
        )
        if doc_type is not UNSET:
            field_dict["doc_type"] = doc_type

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        document_id = d.pop("document_id")

        image_refs = cast(list[str], d.pop("image_refs"))

        def _parse_doc_type(
            data: object,
        ) -> (
            None
            | ProcessDocumentBodyDocTypeType1
            | ProcessDocumentBodyDocTypeType2Type1
            | ProcessDocumentBodyDocTypeType3Type1
            | Unset
        ):
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, str):
                    raise TypeError()
                doc_type_type_1 = ProcessDocumentBodyDocTypeType1(data)

                return doc_type_type_1
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            try:
                if not isinstance(data, str):
                    raise TypeError()
                doc_type_type_2_type_1 = ProcessDocumentBodyDocTypeType2Type1(data)

                return doc_type_type_2_type_1
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            try:
                if not isinstance(data, str):
                    raise TypeError()
                doc_type_type_3_type_1 = ProcessDocumentBodyDocTypeType3Type1(data)

                return doc_type_type_3_type_1
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(
                None
                | ProcessDocumentBodyDocTypeType1
                | ProcessDocumentBodyDocTypeType2Type1
                | ProcessDocumentBodyDocTypeType3Type1
                | Unset,
                data,
            )

        doc_type = _parse_doc_type(d.pop("doc_type", UNSET))

        process_document_body = cls(
            document_id=document_id,
            image_refs=image_refs,
            doc_type=doc_type,
        )

        process_document_body.additional_properties = d
        return process_document_body

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
