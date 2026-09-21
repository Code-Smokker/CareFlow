from enum import StrEnum


class AyurvedicRowSource(StrEnum):
    BODYMAP = "bodymap"
    CLINICIAN = "clinician"
    COMPUTED = "computed"
    OCR = "ocr"
    PROXY = "proxy"
    TAP = "tap"
    VOICE = "voice"

    def __str__(self) -> str:
        return str(self.value)
