from __future__ import annotations

import datetime
from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.analytics_summary_top_complaints_item import (
        AnalyticsSummaryTopComplaintsItem,
    )


T = TypeVar("T", bound="AnalyticsSummary")


@_attrs_define
class AnalyticsSummary:
    """
    Attributes:
        window_start (datetime.datetime):
        window_end (datetime.datetime):
        opd_throughput (int): Visits started within the window.
        top_complaints (list[AnalyticsSummaryTopComplaintsItem]):
        red_flag_rate (float): Visits with at least one red flag, divided by opd_throughput. 0 if opd_throughput is 0.
        average_intake_seconds (float | None): Mean time from session creation to completion, for sessions completed
            within the window. Null if none completed yet — never a fabricated 0.
    """

    window_start: datetime.datetime
    window_end: datetime.datetime
    opd_throughput: int
    top_complaints: list[AnalyticsSummaryTopComplaintsItem]
    red_flag_rate: float
    average_intake_seconds: float | None
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        window_start = self.window_start.isoformat()

        window_end = self.window_end.isoformat()

        opd_throughput = self.opd_throughput

        top_complaints = []
        for top_complaints_item_data in self.top_complaints:
            top_complaints_item = top_complaints_item_data.to_dict()
            top_complaints.append(top_complaints_item)

        red_flag_rate = self.red_flag_rate

        average_intake_seconds: float | None
        average_intake_seconds = self.average_intake_seconds

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "window_start": window_start,
                "window_end": window_end,
                "opd_throughput": opd_throughput,
                "top_complaints": top_complaints,
                "red_flag_rate": red_flag_rate,
                "average_intake_seconds": average_intake_seconds,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.analytics_summary_top_complaints_item import (
            AnalyticsSummaryTopComplaintsItem,  # noqa: PLC0415
        )

        d = dict(src_dict)
        window_start = datetime.datetime.fromisoformat(d.pop("window_start"))

        window_end = datetime.datetime.fromisoformat(d.pop("window_end"))

        opd_throughput = d.pop("opd_throughput")

        top_complaints = []
        _top_complaints = d.pop("top_complaints")
        for top_complaints_item_data in _top_complaints:
            top_complaints_item = AnalyticsSummaryTopComplaintsItem.from_dict(
                top_complaints_item_data
            )

            top_complaints.append(top_complaints_item)

        red_flag_rate = d.pop("red_flag_rate")

        def _parse_average_intake_seconds(data: object) -> float | None:
            if data is None:
                return data
            return cast(float | None, data)

        average_intake_seconds = _parse_average_intake_seconds(
            d.pop("average_intake_seconds")
        )

        analytics_summary = cls(
            window_start=window_start,
            window_end=window_end,
            opd_throughput=opd_throughput,
            top_complaints=top_complaints,
            red_flag_rate=red_flag_rate,
            average_intake_seconds=average_intake_seconds,
        )

        analytics_summary.additional_properties = d
        return analytics_summary

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
