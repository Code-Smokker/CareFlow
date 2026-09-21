from enum import StrEnum


class ExamFieldType(StrEnum):
    COMPUTED = "computed"
    ENUM = "enum"
    ENUM_MULTI = "enum_multi"
    NAMASTE_CODES = "namaste_codes"
    NUMBER = "number"
    TEXT = "text"

    def __str__(self) -> str:
        return str(self.value)
