from enum import StrEnum


class DocumentStatusStatus(StrEnum):
    DONE = "done"
    FAILED = "failed"
    PROCESSING = "processing"
    QUEUED = "queued"

    def __str__(self) -> str:
        return str(self.value)
