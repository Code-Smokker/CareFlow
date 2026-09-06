from enum import StrEnum


class AnswerInputMode(StrEnum):
    BODYMAP = "bodymap"
    OCR = "ocr"
    PROXY = "proxy"
    TAP = "tap"
    VOICE = "voice"

    def __str__(self) -> str:
        return str(self.value)
