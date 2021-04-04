import { Button } from 'antd';
import React, { useCallback } from 'react';
import { PageLayout } from '../layout';
import { PlusOutlined } from '@ant-design/icons';
import { RecordsTable, useEditRecordModal } from '../components';

export const RecordsPage = () => {
    const { open, modal } = useEditRecordModal();
        
    const handleAddRecord = useCallback(() => {
        open();
    }, [open]);

    return (
        <PageLayout
            title='Записи'
            actionNode={
                <Button shape="round" type="primary" onClick={handleAddRecord} icon={<PlusOutlined />}>Добавить запись</Button>
            }
        >
            <RecordsTable onEdit={open} />
            {modal}
        </PageLayout>
    )
};