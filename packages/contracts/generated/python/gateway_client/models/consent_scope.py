from enum import StrEnum


class ConsentScope(StrEnum):
    ABHA_LOOKUP = "abha_lookup"
    AUDIO_RECORDING = "audio_recording"
    DOCUMENTS = "documents"
    HISTORY = "history"
    RESEARCH_DEIDENTIFIED = "research_deidentified"

    def __str__(self) -> str:
        return str(self.value)
