from enum import StrEnum


class AyurvedicRowDispositionType3Type1(StrEnum):
    CONFIRMED = "confirmed"
    ENTERED = "entered"
    OVERRIDDEN = "overridden"

    def __str__(self) -> str:
        return str(self.value)
