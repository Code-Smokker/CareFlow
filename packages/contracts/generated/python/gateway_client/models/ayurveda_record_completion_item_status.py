from enum import StrEnum


class AyurvedaRecordCompletionItemStatus(StrEnum):
    COMPLETE = "complete"
    IN_PROGRESS = "in_progress"
    NOT_STARTED = "not_started"

    def __str__(self) -> str:
        return str(self.value)
