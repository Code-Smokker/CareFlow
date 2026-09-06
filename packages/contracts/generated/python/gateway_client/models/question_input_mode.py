from enum import StrEnum


class QuestionInputMode(StrEnum):
    BODYMAP = "bodymap"
    CHIPS = "chips"
    DURATION = "duration"
    FACESCALE = "facescale"
    MULTI = "multi"
    VOICE = "voice"

    def __str__(self) -> str:
        return str(self.value)
