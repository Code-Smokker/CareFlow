from enum import StrEnum


class AyurvedaRecordComputedVayaAgeSourceType2Type1(StrEnum):
    CLINICIAN = "clinician"
    DOB = "dob"

    def __str__(self) -> str:
        return str(self.value)
