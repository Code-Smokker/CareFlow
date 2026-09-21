from enum import StrEnum


class ExamFieldComputedKind(StrEnum):
    BMI = "bmi"
    VAYA_BAND = "vaya_band"

    def __str__(self) -> str:
        return str(self.value)
