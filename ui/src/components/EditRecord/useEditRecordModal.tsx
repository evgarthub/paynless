import { Modal } from "antd";
import React, { ReactPortal, useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { EditRecord } from "./EditRecord";

export interface EditRecordModalHookResult {
    open: (recordId?: string) => void;
    close: () => void;
    modal?: ReactPortal;
}

export const useEditRecordModal = (): EditRecordModalHookResult => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [recordId, setRecordId] = useState<string>();
    const container = document.getElementById('modals');

    useEffect(() => {
        if (!isVisible) {
            setTimeout(() => {
                setRecordId(undefined);
            }, 500);
        }
    }, [isVisible]);

    const close = useCallback(() => setIsVisible(false), []);
    
    const open = (recordId?: string) => {
        setRecordId(recordId);
        setIsVisible(true);
    };

    const result = useMemo(() => {
        if (container) {
            const modal = createPortal(
                <Modal visible={isVisible} onCancel={close} footer={null}>
                    <EditRecord recordId={recordId} onCancel={close} />
                </Modal>,
                container
            );

            return {
                open,
                close,
                modal,
            };
        }
    
        return {
            open,
            close,
        };
        
    }, [close, container, isVisible, recordId]);
    
   return result;
}