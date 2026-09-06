from enum import StrEnum


class ConceptMapMatchEquivalenceType1(StrEnum):
    EQUIVALENT = "equivalent"
    INEXACT = "inexact"
    NARROWER = "narrower"
    RELATED = "related"
    WIDER = "wider"

    def __str__(self) -> str:
        return str(self.value)
