from enum import StrEnum


class ProcessDocumentBodyDocTypeType1(StrEnum):
    DISCHARGE_SUMMARY = "discharge_summary"
    LAB_REPORT = "lab_report"
    OTHER = "other"
    PRESCRIPTION = "prescription"

    def __str__(self) -> str:
        return str(self.value)
