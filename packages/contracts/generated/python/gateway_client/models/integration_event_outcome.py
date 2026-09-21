from enum import StrEnum


class IntegrationEventOutcome(StrEnum):
    FAILURE = "failure"
    SUCCESS = "success"

    def __str__(self) -> str:
        return str(self.value)
