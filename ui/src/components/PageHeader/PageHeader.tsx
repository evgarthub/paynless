import React, { memo, ReactNode } from "react";
import styled from "styled-components";
import { ListLayout } from "../../layout";

export interface PageHeaderProps {
    title: string;
    actionNode?: ReactNode;
}

const Header = styled('div')`
  font-size: 36px;
`;

export const PageHeader = memo(({ title, actionNode }: PageHeaderProps) => {
    return (
        <ListLayout gap={20} direction='row' hAlignment='flex-start' vAlignment='center'>
            <Header>{title}</Header>
            {actionNode}
        </ListLayout>
    )
}) 