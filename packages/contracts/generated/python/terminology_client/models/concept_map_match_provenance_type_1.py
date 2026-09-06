from enum import StrEnum


class ConceptMapMatchProvenanceType1(StrEnum):
    LEXICAL = "lexical"
    MANUAL = "manual"

    def __str__(self) -> str:
        return str(self.value)
