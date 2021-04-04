import { Button, Card, DatePicker, Divider } from 'antd';
import React, { useState } from 'react';
import { ListLayout } from '../../layout';
import {CloseOutlined } from '@ant-design/icons';
import moment, { Moment } from 'moment';
import { useCallback } from 'react';
import { BillCreatorProps } from './BillCreator.props';
import { Bill } from '../../storage/models/Bill';

export const BillCreator = ({ onClose }:BillCreatorProps) => {
    const currentDate = moment();
    const [date, setDate] = useState<Moment>(currentDate);
    const [bills, setBills] = useState<Bill[]>();

    const handleMonth = (date: Moment | null, dateString: string) => {
        if (date) {
            setDate(date);
        }
    };

    const handleCreateBill = useCallback(() => {
        // do something
        onClose();
    }, [onClose]);

    const toggleBill = useCallback((bill) => {

    }, [])


    return (
        <ListLayout gap={20}>
            <Card title={'Создание платежки'} extra={<Button type='text' onClick={onClose} icon={<CloseOutlined />} />}>
                <ListLayout gap={20}>
                    <DatePicker value={date} onChange={handleMonth} picker="month" format='MMMM' placeholder="Месяц оплаты" />
                    <Divider />
                    {/* <RecordsToPay selectedIds={selectedTypesIds} onSelectedIdsChange={setSelectedTypesIds} tillDate={moment().month(month).endOf('month')} /> */}
                    {/* <RecordsToPay onToggle={()} onSelectAll={} onDeselectAll={} selectedRecordsIds={} month={} year={} /> */}
                </ListLayout>
            </Card>
            <ListLayout hAlignment='flex-end'>
                <Button onClick={handleCreateBill} type="primary">Создать</Button>
            </ListLayout>
        </ListLayout>
    )
}