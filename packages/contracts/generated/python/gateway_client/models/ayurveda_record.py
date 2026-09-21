from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.ayurveda_record_completion_item import AyurvedaRecordCompletionItem
    from ..models.ayurveda_record_computed import AyurvedaRecordComputed
    from ..models.ayurveda_record_patient_reference import (
        AyurvedaRecordPatientReference,
    )
    from ..models.exam_value import ExamValue
    from ..models.prashna_record import PrashnaRecord


T = TypeVar("T", bound="AyurvedaRecord")


@_attrs_define
class AyurvedaRecord:
    """
    Attributes:
        visit_id (str):
        signed (bool):
        department (None | str):
        ayush_mode (bool):
        prashna (PrashnaRecord):
        exam (list[ExamValue]):
        patient_reference (AyurvedaRecordPatientReference): Exam field id → what the patient reported that bears on it.
        computed (AyurvedaRecordComputed):
        completion (list[AyurvedaRecordCompletionItem]):
    """

    visit_id: str
    signed: bool
    department: None | str
    ayush_mode: bool
    prashna: PrashnaRecord
    exam: list[ExamValue]
    patient_reference: AyurvedaRecordPatientReference
    computed: AyurvedaRecordComputed
    completion: list[AyurvedaRecordCompletionItem]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        visit_id = self.visit_id

        signed = self.signed

        department: None | str
        department = self.department

        ayush_mode = self.ayush_mode

        prashna = self.prashna.to_dict()

        exam = []
        for exam_item_data in self.exam:
            exam_item = exam_item_data.to_dict()
            exam.append(exam_item)

        patient_reference = self.patient_reference.to_dict()

        computed = self.computed.to_dict()

        completion = []
        for completion_item_data in self.completion:
            completion_item = completion_item_data.to_dict()
            completion.append(completion_item)

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "visit_id": visit_id,
                "signed": signed,
                "department": department,
                "ayush_mode": ayush_mode,
                "prashna": prashna,
                "exam": exam,
                "patient_reference": patient_reference,
                "computed": computed,
                "completion": completion,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.ayurveda_record_completion_item import (
            AyurvedaRecordCompletionItem,  # noqa: PLC0415
        )
        from ..models.ayurveda_record_computed import (
            AyurvedaRecordComputed,  # noqa: PLC0415
        )
        from ..models.ayurveda_record_patient_reference import (
            AyurvedaRecordPatientReference,  # noqa: PLC0415
        )
        from ..models.exam_value import ExamValue  # noqa: PLC0415
        from ..models.prashna_record import PrashnaRecord  # noqa: PLC0415

        d = dict(src_dict)
        visit_id = d.pop("visit_id")

        signed = d.pop("signed")

        def _parse_department(data: object) -> None | str:
            if data is None:
                return data
            return cast(None | str, data)

        department = _parse_department(d.pop("department"))

        ayush_mode = d.pop("ayush_mode")

        prashna = PrashnaRecord.from_dict(d.pop("prashna"))

        exam = []
        _exam = d.pop("exam")
        for exam_item_data in _exam:
            exam_item = ExamValue.from_dict(exam_item_data)

            exam.append(exam_item)

        patient_reference = AyurvedaRecordPatientReference.from_dict(
            d.pop("patient_reference")
        )

        computed = AyurvedaRecordComputed.from_dict(d.pop("computed"))

        completion = []
        _completion = d.pop("completion")
        for completion_item_data in _completion:
            completion_item = AyurvedaRecordCompletionItem.from_dict(
                completion_item_data
            )

            completion.append(completion_item)

        ayurveda_record = cls(
            visit_id=visit_id,
            signed=signed,
            department=department,
            ayush_mode=ayush_mode,
            prashna=prashna,
            exam=exam,
            patient_reference=patient_reference,
            computed=computed,
            completion=completion,
        )

        ayurveda_record.additional_properties = d
        return ayurveda_record

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
