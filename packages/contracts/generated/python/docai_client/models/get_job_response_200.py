from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.get_job_response_200_status import GetJobResponse200Status
from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.process_result import ProcessResult


T = TypeVar("T", bound="GetJobResponse200")


@_attrs_define
class GetJobResponse200:
    """
    Attributes:
        status (GetJobResponse200Status):
        result (None | ProcessResult | Unset):
    """

    status: GetJobResponse200Status
    result: None | ProcessResult | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.process_result import ProcessResult  # noqa: PLC0415

        status = self.status.value

        result: dict[str, Any] | None | Unset
        if isinstance(self.result, Unset):
            result = UNSET
        elif isinstance(self.result, ProcessResult):
            result = self.result.to_dict()
        else:
            result = self.result

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "status": status,
            }
        )
        if result is not UNSET:
            field_dict["result"] = result

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.process_result import ProcessResult  # noqa: PLC0415

        d = dict(src_dict)
        status = GetJobResponse200Status(d.pop("status"))

        def _parse_result(data: object) -> None | ProcessResult | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                result_type_0 = ProcessResult.from_dict(data)

                return result_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(None | ProcessResult | Unset, data)

        result = _parse_result(d.pop("result", UNSET))

        get_job_response_200 = cls(
            status=status,
            result=result,
        )

        get_job_response_200.additional_properties = d
        return get_job_response_200

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
