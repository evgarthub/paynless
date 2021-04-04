import React, { memo, ReactNode } from 'react';
import styled, { css } from 'styled-components';

export interface ListProps extends GridContainerProps {
    children: ReactNode;
}

interface GridContainerProps {
    gap?: number;
    direction?: "row" | "column";
    hAlignment?: "flex-start" | "center" | "flex-end" | "stretched" | "space-between"| "space-around";
    vAlignment?: "center" | 'flex-start';
}

const GridContainer = styled('div')<GridContainerProps>`
    display: grid;
    max-height: 100%; 
    flex: 1 1 auto;
    justify-items: ${({ hAlignment }) => hAlignment};
    justify-content: ${({ hAlignment }) => hAlignment};
    align-items: ${({ vAlignment }) => vAlignment || 'flex-start'};
    align-content: ${({ vAlignment }) => vAlignment || 'flex-start'};

    ${({ direction, gap }) => direction === 'row'
        ? css`
                grid-auto-flow: column;
                column-gap: ${gap || 0}px;
            `
        : css`
                grid-auto-flow: row;
                row-gap: ${gap || 0}px;
            `
    }
`;

const ListLayout = ({ children, gap, direction, hAlignment, vAlignment }: ListProps) => {
    return (
        <GridContainer gap={gap} direction={direction} hAlignment={hAlignment} vAlignment={vAlignment}>
            {children}
        </GridContainer>
    )
}

const c = memo(ListLayout);
export { c as ListLayout };