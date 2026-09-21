from enum import StrEnum


class GetIntegrationEventsOutcome(StrEnum):
    FAILURE = "failure"
    SUCCESS = "success"

    def __str__(self) -> str:
        return str(self.value)
