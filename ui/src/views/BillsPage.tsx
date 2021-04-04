import { Button, Card, DatePicker, Divider, Popconfirm, Statistic, Table, Tag } from 'antd';
import React, { useMemo, useState } from 'react';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { ListLayout, PageLayout } from '../layout';
import { Moment } from 'moment';
import { LoadablePlaceholder } from '../components';
import { Bill, useGetBillsMonthGrouped } from '../storage/models/Bill';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { Type } from '../storage/models/Type';
import { BillCreator } from '../components/BillCreator';

export const BillsPage = () => {
    const [isAddingEnabled, setIsAddingEnabled] = useState<boolean>(false);
    const { data: bills, isLoading, isFailed } = useGetBillsMonthGrouped();
    const currentYear = moment().year();
    const [showYear, setShowYear] = useState<number>(currentYear);

    const yearBills: Bill[][] = useMemo(() => {
        let year = [];

        if (bills) {
            for (let i = 0; i < 12; i++) {
                const month = bills[i];
                if (month) {
                    year.push(month.filter(bill => bill.year === showYear));
                }
            }
        }

        return year;
    }, [bills, showYear]);

    const handleYear = (date: Moment | null, dateString: string) => {
        if (date) {
            setShowYear(date.year());
        }
    };
    
    const billColumns: ColumnsType<Bill> = [
        {
            title: 'Вид услуги',
            dataIndex: 'type',
            render: (value?: Type) => value ? <Tag color={value?.color}>{value?.label}</Tag> : null,
        },
        {
            title: 'Показания',
            dataIndex: 'value',
            render: (value: number, bill: Bill) => `${value} ${bill.type?.unit}`
        },
        {
            title: 'Использовано',
            dataIndex: 'amount',
            render: (value: number, bill: Bill) => `+ ${value} ${bill.type?.unit}`
        },
        {
            title: 'Стоимость',
            dataIndex: 'cost',
            render: (value: number) => `${value} грн`
        }
    ]

    return (
        <PageLayout
            title='Платежи'
            actionNode={
                <Button shape="round" type="primary" onClick={() => setIsAddingEnabled(true)} icon={<PlusOutlined />}>Добавить платеж</Button>
            }
        >
            <ListLayout gap={20}>
                {isAddingEnabled && <BillCreator onClose={() => setIsAddingEnabled(false)} />}
                <DatePicker value={moment().year(showYear)} format="YYYY" onChange={handleYear} picker="year" placeholder="Показать год" disabled={isAddingEnabled} />
                <LoadablePlaceholder isEmpty={!yearBills.length} isLoading={isLoading} isFailed={isFailed}>
                    <ListLayout gap={20}>
                        {yearBills.map(monthlyBills => {
                            if (monthlyBills.length) {
                                const summ = monthlyBills?.reduce((acc, curr) => acc + curr.cost, 0);
    
                                return (
                                    <Card
                                        bordered={false}
                                        title={`${moment().month(monthlyBills[0].month).format('MMMM')} ${monthlyBills[0].year}`}
                                        extra={
                                            <Popconfirm title="Подтвердите удаление" okText="Удалить" cancelText="Отменить" placement="left">
                                                <Button type="text" icon={<DeleteOutlined />} />
                                            </Popconfirm>
                                        }
                                    >
                                        <Table
                                            columns={billColumns}
                                            dataSource={monthlyBills}
                                            pagination={false}
                                            footer={
                                                () => <ListLayout hAlignment='flex-end'><Statistic title='Всего' value={summ} suffix='грн' /></ListLayout>
                                            }
                                        />
                                    </Card>
                                );
                            }

                             return null;
                        })}
                    </ListLayout>
                </LoadablePlaceholder>
            </ListLayout>
        </PageLayout>
    );
}