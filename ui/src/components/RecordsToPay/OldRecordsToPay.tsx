import { Checkbox } from "antd";
import { Moment } from "moment";
import React, { memo, useCallback, useMemo } from "react";
import { ListLayout } from "../../layout";
import { useGetTypes } from "../../storage/models/Type";
import { LoadablePlaceholder } from "../LoadablePlaceholder";
import { TypeRecord } from "./OldTypeRecord";

export interface RecordsToPayProps {
    tillDate: Moment;
    selectedIds: string[];
    onSelectedIdsChange: (ids: string[]) => void;
}

export const RecordsToPay = memo(({tillDate, selectedIds, onSelectedIdsChange}: RecordsToPayProps) => {
    const { data: types, isLoading: areTypesLoading } = useGetTypes();

    const typesIds = useMemo(() => types?.map(type => type.id) || [], [types]);

    const checkAll = types?.length === selectedIds?.length;
    const indeterminate = useMemo(() => {
        if (types) {
            return !checkAll && selectedIds.length !== 0;
        }

        return false;
    }, [checkAll, types, selectedIds.length]);
    
    const handleCheckAllChange = () => {
        if (types) {
            onSelectedIdsChange(
                !checkAll
                    ? typesIds
                    : []
            );
        }
    }

    const handleCheck = useCallback((id: string) => {
        const newSelection = [...selectedIds];
        const index = selectedIds.indexOf(id);

        if (index >= 0) {
            newSelection.splice(index, 1);
        } else {
            newSelection.push(id);
        }

        onSelectedIdsChange(newSelection);
    }, [onSelectedIdsChange, selectedIds])

    return (
        <ListLayout gap={15} hAlignment='stretched'>
            <Checkbox
                    indeterminate={indeterminate}
                    onChange={handleCheckAllChange}
                    checked={checkAll}
                >
                    Выбрать все
            </Checkbox>
            <LoadablePlaceholder isLoading={areTypesLoading} isEmpty={!types?.length}>
                <ListLayout direction='row' gap={10} >
                    {types?.map(type => (
                        <TypeRecord key={type.id} type={type} isChecked={selectedIds.includes(type.id)} onChange={handleCheck} tillDate={tillDate} />
                    ))}
                </ListLayout>
            </LoadablePlaceholder>
        </ListLayout>
    )
});