from enum import StrEnum


class IntegrationEventService(StrEnum):
    AI = "ai"
    DOCAI = "docai"

    def __str__(self) -> str:
        return str(self.value)
