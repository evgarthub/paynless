import React, { memo, useCallback } from "react"
import { EditRecordInput, useCreateRecord, useUpdateRecord } from "../../storage/models/Record";
import { RecordDataLoader } from "../RecordDataLoader"
import { EditRecordForm } from "./EditRecordForm"

export interface EditRecordProps {
    recordId?: string;
    onCancel: () => void;
}

const EditRecord = ({ recordId, onCancel }: EditRecordProps) => {
    const [ updateRecord ] = useUpdateRecord();
    const [ createRecord ] = useCreateRecord();
    
    const handleSave = useCallback((record: EditRecordInput, id?: string) => {      
        if (id) {
            updateRecord(id, record);
        } else {
            createRecord(record);
        }
        onCancel();
    }, [createRecord, onCancel, updateRecord]);
    
    return (
            <RecordDataLoader id={recordId}>
                {record => 
                    <EditRecordForm record={record} onSave={handleSave} onCancel={onCancel} />
                }
            </RecordDataLoader>
    )
};

const C = memo(EditRecord);
export { C as EditRecord };