from enum import StrEnum


class QueueTokenPriority(StrEnum):
    PRIORITY = "priority"
    ROUTINE = "routine"
    URGENT = "urgent"

    def __str__(self) -> str:
        return str(self.value)
