import { Button, DatePicker, Form, InputNumber , Select } from 'antd';
import moment from 'moment';
import React, { memo, useCallback } from 'react';
import { ListLayout } from '../../layout';
import { EditRecordInput, Record } from '../../storage/models/Record';
import { useGetTypes } from '../../storage/models/Type';

interface EditRecordProps {
    record: Record;
    onSave: (record: EditRecordInput, id?: string) => void;
    onCancel: () => void;
}

interface FormData {
    value?: number;
    date?: string;
    typeId?: string;
}

const EditRecordForm = ({ record, onSave, onCancel }: EditRecordProps) => {
    const { data: typesData } = useGetTypes();
    
    const handleFinish = useCallback(({ value, date, typeId }: FormData) => {
        if (value && date && typeId) {

            onSave({
                value,
                date: moment(date).format('YYYY-MM-DD'),
                type: typeId,
            }, record.id);
        }
    }, [onSave, record.id]);
    
    return (
        <Form
            onFinish={handleFinish}
            initialValues={{
                'value': record.value,
                'date': moment(record.date),
                'typeId': record.type?.id,
            }}
        >
            <Form.Item
                label="Показание счетчика"
                name="value"
                rules={[{ required: true, message: 'Введите показание счетчика' }]}
            >
                <InputNumber />
            </Form.Item>
            <Form.Item
                label="Дата снятия"
                name="date"
                rules={[{ required: true, message: 'Выберите дату снятия показаний' }]}
            >
                <DatePicker />
            </Form.Item>
            <Form.Item
                label="Вид услуги"
                name="typeId"
                rules={[{ required: true, message: 'Выберите дату снятия показаний' }]}
            >
                <Select>
                    {typesData?.map(type => (
                        <Select.Option key={type.id} value={type.id}>{type.label}</Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item>
                <ListLayout gap={10} direction='row' hAlignment="flex-end">
                    <Button type="primary" htmlType="submit">Сохранить</Button>
                    <Button onClick={onCancel}>Отменить</Button>
                </ListLayout>
            </Form.Item>
        </Form>
    )
};

const c = memo(EditRecordForm);
export { c as EditRecordForm };