from enum import StrEnum


class AyurvedaVocabularyStatus(StrEnum):
    PENDING_EXPERT_REVIEW = "PENDING_EXPERT_REVIEW"
    VERIFIED = "VERIFIED"

    def __str__(self) -> str:
        return str(self.value)
