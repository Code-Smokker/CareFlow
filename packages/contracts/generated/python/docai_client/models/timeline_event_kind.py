from enum import StrEnum


class TimelineEventKind(StrEnum):
    LAB_REPORT = "lab_report"
    PRESCRIPTION = "prescription"
    SYMPTOM_ONSET = "symptom_onset"
    VISIT = "visit"

    def __str__(self) -> str:
        return str(self.value)
