from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.ayurveda_vocabulary_status import AyurvedaVocabularyStatus

if TYPE_CHECKING:
    from ..models.ayurveda_vocabulary_prakriti_scoring import (
        AyurvedaVocabularyPrakritiScoring,
    )
    from ..models.ayurveda_vocabulary_prashna import AyurvedaVocabularyPrashna
    from ..models.ayurveda_vocabulary_review import AyurvedaVocabularyReview
    from ..models.exam_step import ExamStep
    from ..models.vocab_label import VocabLabel
    from ..models.vocab_label_with_id import VocabLabelWithId


T = TypeVar("T", bound="AyurvedaVocabulary")


@_attrs_define
class AyurvedaVocabulary:
    """
    Attributes:
        id (str):
        status (AyurvedaVocabularyStatus):
        version (int):
        title (VocabLabel):
        review (AyurvedaVocabularyReview):
        prashna (AyurvedaVocabularyPrashna):
        prakriti_scoring (AyurvedaVocabularyPrakritiScoring):
        steps (list[ExamStep]):
        summary_step (VocabLabelWithId):
    """

    id: str
    status: AyurvedaVocabularyStatus
    version: int
    title: VocabLabel
    review: AyurvedaVocabularyReview
    prashna: AyurvedaVocabularyPrashna
    prakriti_scoring: AyurvedaVocabularyPrakritiScoring
    steps: list[ExamStep]
    summary_step: VocabLabelWithId
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        id = self.id

        status = self.status.value

        version = self.version

        title = self.title.to_dict()

        review = self.review.to_dict()

        prashna = self.prashna.to_dict()

        prakriti_scoring = self.prakriti_scoring.to_dict()

        steps = []
        for steps_item_data in self.steps:
            steps_item = steps_item_data.to_dict()
            steps.append(steps_item)

        summary_step = self.summary_step.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "id": id,
                "status": status,
                "version": version,
                "title": title,
                "review": review,
                "prashna": prashna,
                "prakriti_scoring": prakriti_scoring,
                "steps": steps,
                "summary_step": summary_step,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.ayurveda_vocabulary_prakriti_scoring import (
            AyurvedaVocabularyPrakritiScoring,  # noqa: PLC0415
        )
        from ..models.ayurveda_vocabulary_prashna import (
            AyurvedaVocabularyPrashna,  # noqa: PLC0415
        )
        from ..models.ayurveda_vocabulary_review import (
            AyurvedaVocabularyReview,  # noqa: PLC0415
        )
        from ..models.exam_step import ExamStep  # noqa: PLC0415
        from ..models.vocab_label import VocabLabel  # noqa: PLC0415
        from ..models.vocab_label_with_id import VocabLabelWithId  # noqa: PLC0415

        d = dict(src_dict)
        id = d.pop("id")

        status = AyurvedaVocabularyStatus(d.pop("status"))

        version = d.pop("version")

        title = VocabLabel.from_dict(d.pop("title"))

        review = AyurvedaVocabularyReview.from_dict(d.pop("review"))

        prashna = AyurvedaVocabularyPrashna.from_dict(d.pop("prashna"))

        prakriti_scoring = AyurvedaVocabularyPrakritiScoring.from_dict(
            d.pop("prakriti_scoring")
        )

        steps = []
        _steps = d.pop("steps")
        for steps_item_data in _steps:
            steps_item = ExamStep.from_dict(steps_item_data)

            steps.append(steps_item)

        summary_step = VocabLabelWithId.from_dict(d.pop("summary_step"))

        ayurveda_vocabulary = cls(
            id=id,
            status=status,
            version=version,
            title=title,
            review=review,
            prashna=prashna,
            prakriti_scoring=prakriti_scoring,
            steps=steps,
            summary_step=summary_step,
        )

        ayurveda_vocabulary.additional_properties = d
        return ayurveda_vocabulary

    @property
    def additional_keys(self) -> list[str]:
        return list(self.additional_properties.keys())

    def __getitem__(self, key: str) -> Any:
        return self.additional_properties[key]

    def __setitem__(self, key: str, value: Any) -> None:
        self.additional_properties[key] = value

    def __delitem__(self, key: str) -> None:
        del self.additional_properties[key]

    def __contains__(self, key: str) -> bool:
        return key in self.additional_properties
