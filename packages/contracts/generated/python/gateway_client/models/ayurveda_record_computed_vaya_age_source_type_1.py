from enum import StrEnum


class AyurvedaRecordComputedVayaAgeSourceType1(StrEnum):
    CLINICIAN = "clinician"
    DOB = "dob"

    def __str__(self) -> str:
        return str(self.value)
