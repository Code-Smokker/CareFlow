from enum import StrEnum


class SearchDictionarySystem(StrEnum):
    ALLOPATHIC = "allopathic"
    AYUSH_FORMULATION = "ayush_formulation"
    AYUSH_PLANT = "ayush_plant"

    def __str__(self) -> str:
        return str(self.value)
