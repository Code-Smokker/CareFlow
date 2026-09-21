from enum import StrEnum


class ExamOriginalSource(StrEnum):
    BODYMAP = "bodymap"
    OCR = "ocr"
    PROXY = "proxy"
    TAP = "tap"
    VOICE = "voice"

    def __str__(self) -> str:
        return str(self.value)
