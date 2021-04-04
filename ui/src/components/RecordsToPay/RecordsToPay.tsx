import React from 'react';
import { RecordsTable } from "../RecordsTable";
import { useGetTypes } from "../../storage/models/Type";
import { ListLayout } from "../../layout";
import Checkbox from "antd/lib/checkbox/Checkbox";
import { Tag } from "antd";
import { useSelection } from '../../utils/useSelection';

export interface RecordsToPayProps {
    month: number;
    year: number;
    selectedRecordsIds: string[];
    onToggle: (selectedRecordId: string) => void;
    onSelectAll: () => void;
    onDeselectAll: () => void;
}

export const RecordsToPay = ({ onToggle, onSelectAll, onDeselectAll, selectedRecordsIds, month, year }: RecordsToPayProps) => {
    const { data: types, isLoading: areTypesLoading } = useGetTypes();
    // const {  } = useSelection(types || [], selectedRecordsIds);
    
    return (
        <ListLayout gap={10}>
            {/* <Checkbox
                    indeterminate={indeterminate}
                    onChange={handleCheckAllChange}
                    checked={checkAll}
                >
                    Выбрать все
            </Checkbox> */}
            {types?.map(type => 
                <PayTable month={month} year={year} type={type} isChecked={selectedRecordsIds.includes(type.id)} onChange={onToggle} />
            )}
        </ListLayout>
    );
};

const PayTable = ({ month, year, type, isChecked, onChange }: any) => {
    const handleChange = () => onChange(type.id);

    return (
        <ListLayout gap={10}>
            <ListLayout direction='row' gap={10}>
                <Checkbox checked={isChecked} onChange={handleChange}>
                    <Tag color={type.color} title={type.uid}>{type.label}</Tag>
                </Checkbox>
            </ListLayout>
            <RecordsTable month={month} year={year} typeId={type.id} />
        </ListLayout>
    )
};