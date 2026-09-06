from enum import StrEnum


class ConceptMapMatchEquivalenceType2Type1(StrEnum):
    EQUIVALENT = "equivalent"
    INEXACT = "inexact"
    NARROWER = "narrower"
    RELATED = "related"
    WIDER = "wider"

    def __str__(self) -> str:
        return str(self.value)
