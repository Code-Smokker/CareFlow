from enum import StrEnum


class AbdmStatus(StrEnum):
    ACKNOWLEDGED = "acknowledged"
    FAILED = "failed"
    MOCKED = "mocked"
    SUBMITTED = "submitted"

    def __str__(self) -> str:
        return str(self.value)
