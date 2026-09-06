from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.consent_scope import ConsentScope
from ..models.session_status import SessionStatus
from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.progress import Progress


T = TypeVar("T", bound="Session")


@_attrs_define
class Session:
    """
    Attributes:
        session_id (str): Opaque session identifier.
        status (SessionStatus):
        language (None | str):
        progress (Progress):
        consent_scopes (list[ConsentScope]):
        patient_id (None | str | Unset):
    """

    session_id: str
    status: SessionStatus
    language: None | str
    progress: Progress
    consent_scopes: list[ConsentScope]
    patient_id: None | str | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        session_id = self.session_id

        status = self.status.value

        language: None | str
        language = self.language

        progress = self.progress.to_dict()

        consent_scopes = []
        for consent_scopes_item_data in self.consent_scopes:
            consent_scopes_item = consent_scopes_item_data.value
            consent_scopes.append(consent_scopes_item)

        patient_id: None | str | Unset
        if isinstance(self.patient_id, Unset):
            patient_id = UNSET
        else:
            patient_id = self.patient_id

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "session_id": session_id,
                "status": status,
                "language": language,
                "progress": progress,
                "consent_scopes": consent_scopes,
            }
        )
        if patient_id is not UNSET:
            field_dict["patient_id"] = patient_id

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.progress import Progress  # noqa: PLC0415

        d = dict(src_dict)
        session_id = d.pop("session_id")

        status = SessionStatus(d.pop("status"))

        def _parse_language(data: object) -> None | str:
            if data is None:
                return data
            return cast(None | str, data)

        language = _parse_language(d.pop("language"))

        progress = Progress.from_dict(d.pop("progress"))

        consent_scopes = []
        _consent_scopes = d.pop("consent_scopes")
        for consent_scopes_item_data in _consent_scopes:
            consent_scopes_item = ConsentScope(consent_scopes_item_data)

            consent_scopes.append(consent_scopes_item)

        def _parse_patient_id(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        patient_id = _parse_patient_id(d.pop("patient_id", UNSET))

        session = cls(
            session_id=session_id,
            status=status,
            language=language,
            progress=progress,
            consent_scopes=consent_scopes,
            patient_id=patient_id,
        )

        session.additional_properties = d
        return session

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
