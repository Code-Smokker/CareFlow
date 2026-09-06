from enum import StrEnum


class SessionStatus(StrEnum):
    COMPLETED = "completed"
    CREATED = "created"
    IN_PROGRESS = "in_progress"
    WITHDRAWN = "withdrawn"

    def __str__(self) -> str:
        return str(self.value)
