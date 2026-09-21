from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.exam_field_type import ExamFieldType
from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.exam_field_bands_item import ExamFieldBandsItem
    from ..models.exam_field_computed import ExamFieldComputed
    from ..models.exam_field_patient_reference_item import ExamFieldPatientReferenceItem
    from ..models.vocab_option import VocabOption


T = TypeVar("T", bound="ExamField")


@_attrs_define
class ExamField:
    """
    Attributes:
        id (str): Dotted, prefixed with its step id — e.g. ashtavidha.mala.nature.
        label (str):
        gloss (str):
        type_ (ExamFieldType):
        required (bool | Unset):
        options (list[VocabOption] | Unset):
        min_ (float | Unset):
        max_ (float | Unset):
        unit (str | Unset):
        patient_reference (list[ExamFieldPatientReferenceItem] | Unset):
        computed (ExamFieldComputed | Unset):
        source (str | Unset): Classical source note for a computed field's cut-offs.
        bands (list[ExamFieldBandsItem] | Unset):
        namaste_code (None | str | Unset): Verified NAMASTE code, if one exists. null → PLACEHOLDER in the FHIR bundle.
    """

    id: str
    label: str
    gloss: str
    type_: ExamFieldType
    required: bool | Unset = UNSET
    options: list[VocabOption] | Unset = UNSET
    min_: float | Unset = UNSET
    max_: float | Unset = UNSET
    unit: str | Unset = UNSET
    patient_reference: list[ExamFieldPatientReferenceItem] | Unset = UNSET
    computed: ExamFieldComputed | Unset = UNSET
    source: str | Unset = UNSET
    bands: list[ExamFieldBandsItem] | Unset = UNSET
    namaste_code: None | str | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        id = self.id

        label = self.label

        gloss = self.gloss

        type_ = self.type_.value

        required = self.required

        options: list[dict[str, Any]] | Unset = UNSET
        if not isinstance(self.options, Unset):
            options = []
            for options_item_data in self.options:
                options_item = options_item_data.to_dict()
                options.append(options_item)

        min_ = self.min_

        max_ = self.max_

        unit = self.unit

        patient_reference: list[dict[str, Any]] | Unset = UNSET
        if not isinstance(self.patient_reference, Unset):
            patient_reference = []
            for patient_reference_item_data in self.patient_reference:
                patient_reference_item = patient_reference_item_data.to_dict()
                patient_reference.append(patient_reference_item)

        computed: dict[str, Any] | Unset = UNSET
        if not isinstance(self.computed, Unset):
            computed = self.computed.to_dict()

        source = self.source

        bands: list[dict[str, Any]] | Unset = UNSET
        if not isinstance(self.bands, Unset):
            bands = []
            for bands_item_data in self.bands:
                bands_item = bands_item_data.to_dict()
                bands.append(bands_item)

        namaste_code: None | str | Unset
        if isinstance(self.namaste_code, Unset):
            namaste_code = UNSET
        else:
            namaste_code = self.namaste_code

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "id": id,
                "label": label,
                "gloss": gloss,
                "type": type_,
            }
        )
        if required is not UNSET:
            field_dict["required"] = required
        if options is not UNSET:
            field_dict["options"] = options
        if min_ is not UNSET:
            field_dict["min"] = min_
        if max_ is not UNSET:
            field_dict["max"] = max_
        if unit is not UNSET:
            field_dict["unit"] = unit
        if patient_reference is not UNSET:
            field_dict["patient_reference"] = patient_reference
        if computed is not UNSET:
            field_dict["computed"] = computed
        if source is not UNSET:
            field_dict["source"] = source
        if bands is not UNSET:
            field_dict["bands"] = bands
        if namaste_code is not UNSET:
            field_dict["namaste_code"] = namaste_code

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.exam_field_bands_item import ExamFieldBandsItem  # noqa: PLC0415
        from ..models.exam_field_computed import ExamFieldComputed  # noqa: PLC0415
        from ..models.exam_field_patient_reference_item import (
            ExamFieldPatientReferenceItem,  # noqa: PLC0415
        )
        from ..models.vocab_option import VocabOption  # noqa: PLC0415

        d = dict(src_dict)
        id = d.pop("id")

        label = d.pop("label")

        gloss = d.pop("gloss")

        type_ = ExamFieldType(d.pop("type"))

        required = d.pop("required", UNSET)

        _options = d.pop("options", UNSET)
        options: list[VocabOption] | Unset = UNSET
        if _options is not UNSET:
            options = []
            for options_item_data in _options:
                options_item = VocabOption.from_dict(options_item_data)

                options.append(options_item)

        min_ = d.pop("min", UNSET)

        max_ = d.pop("max", UNSET)

        unit = d.pop("unit", UNSET)

        _patient_reference = d.pop("patient_reference", UNSET)
        patient_reference: list[ExamFieldPatientReferenceItem] | Unset = UNSET
        if _patient_reference is not UNSET:
            patient_reference = []
            for patient_reference_item_data in _patient_reference:
                patient_reference_item = ExamFieldPatientReferenceItem.from_dict(
                    patient_reference_item_data
                )

                patient_reference.append(patient_reference_item)

        _computed = d.pop("computed", UNSET)
        computed: ExamFieldComputed | Unset
        if isinstance(_computed, Unset):
            computed = UNSET
        else:
            computed = ExamFieldComputed.from_dict(_computed)

        source = d.pop("source", UNSET)

        _bands = d.pop("bands", UNSET)
        bands: list[ExamFieldBandsItem] | Unset = UNSET
        if _bands is not UNSET:
            bands = []
            for bands_item_data in _bands:
                bands_item = ExamFieldBandsItem.from_dict(bands_item_data)

                bands.append(bands_item)

        def _parse_namaste_code(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        namaste_code = _parse_namaste_code(d.pop("namaste_code", UNSET))

        exam_field = cls(
            id=id,
            label=label,
            gloss=gloss,
            type_=type_,
            required=required,
            options=options,
            min_=min_,
            max_=max_,
            unit=unit,
            patient_reference=patient_reference,
            computed=computed,
            source=source,
            bands=bands,
            namaste_code=namaste_code,
        )

        exam_field.additional_properties = d
        return exam_field

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
