from enum import StrEnum


class ExamValueDisposition(StrEnum):
    CONFIRMED = "confirmed"
    ENTERED = "entered"
    OVERRIDDEN = "overridden"

    def __str__(self) -> str:
        return str(self.value)
