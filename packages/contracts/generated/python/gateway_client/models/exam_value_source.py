from enum import StrEnum


class ExamValueSource(StrEnum):
    CLINICIAN = "clinician"

    def __str__(self) -> str:
        return str(self.value)
