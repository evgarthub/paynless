import React, { memo, ReactNode } from "react";
import styled from "styled-components";

interface CenterProps {
    children: ReactNode;
}

const Container = styled('div')`
    display: flex;
    justify-content: center;
    align-items: center;
`

const Center = ({children}: CenterProps) => (
    <Container>
        {children}
    </Container>
);

const c = memo(Center);
export { c as Center };