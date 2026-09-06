from enum import StrEnum


class ConceptMapMatchProvenanceType3Type1(StrEnum):
    LEXICAL = "lexical"
    MANUAL = "manual"

    def __str__(self) -> str:
        return str(self.value)
