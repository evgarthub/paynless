import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { PageHeader } from '../components';
import { ListLayout } from "./ListLayout"

export interface PageLayoutProps {
    children: ReactNode;
    title: string;
    actionNode?: ReactNode;
}

const Wrapper = styled('div')`
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    width: 100%;
    overflow: hidden;
    height: 100%;
`;

const ScrollableContainer = styled('div')`
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    overflow-y: auto;
    height: 100%;
`

export const PageLayout = ({ children, actionNode, title }: PageLayoutProps) => {
    return (
        <Wrapper>
            <ListLayout gap={20}>
                <PageHeader
                    title={title}
                    actionNode={actionNode}
                />
                <ScrollableContainer>
                    {children}
                </ScrollableContainer>
            </ListLayout>
        </Wrapper>
    );
};