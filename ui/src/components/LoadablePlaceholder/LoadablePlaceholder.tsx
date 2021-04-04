import { ApolloError } from "@apollo/client";
import { Button, Empty, Result, Spin, Typography } from "antd";
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import React, { memo, ReactElement } from "react";
import styled from 'styled-components';

export interface LoadablePlaceholderProps {
    children: ReactElement | null;
    isEmpty: boolean;
    isLoading: boolean;
    isFailed?: boolean;
    emptyText?: string;
    error?: ApolloError;
    onEmptyAction?: (e: React.MouseEvent) => void;
}

const Container = styled('div')`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`;

const SpinWrap = styled('div')`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;

const LoadablePlaceholder = ({ children, isLoading, isFailed, isEmpty, emptyText, error, onEmptyAction }: LoadablePlaceholderProps) => {
    const loadIcon = <LoadingOutlined spin />;
    const { Text } = Typography;

    if (isLoading) {
        return (
            <Container>
                <SpinWrap>
                    <Spin indicator={loadIcon} />
                    <span>Загрузка...</span>
                </SpinWrap>
            </Container>
        );
    }

    if (isFailed) {
        return (
            <Container>
                <Result
                    status="warning"
                    title="Возникла проблема при загрузке данных"
                    subTitle={error?.message}
                    extra={error && <Text code>{error?.extraInfo}</Text>}
                />
            </Container>
        );
    }

    if (isEmpty) {
        return (
            <Container>
                <Empty
                    imageStyle={{
                        height: 60,
                    }}
                    description={emptyText}
                >
                    {onEmptyAction && 
                        <Button type="primary" onClick={onEmptyAction} icon={<PlusOutlined />}>Добавить</Button>
                    }
                </Empty>
            </Container>
        );
    }

    return children;

};

const c = memo(LoadablePlaceholder);
export { c as LoadablePlaceholder };