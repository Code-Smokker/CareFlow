from enum import StrEnum


class TerminologySystem(StrEnum):
    ICD11_BIO = "icd11-bio"
    ICD11_TM2 = "icd11-tm2"
    NAMASTE = "namaste"

    def __str__(self) -> str:
        return str(self.value)
