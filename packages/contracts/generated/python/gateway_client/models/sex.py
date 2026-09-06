from enum import StrEnum


class Sex(StrEnum):
    FEMALE = "female"
    MALE = "male"
    OTHER = "other"
    UNKNOWN = "unknown"

    def __str__(self) -> str:
        return str(self.value)
