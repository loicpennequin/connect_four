import { addDecorator } from '@storybook/react';
import React from 'react';
import styled from 'styled-components';
import ThemeProvider from '@styles/ThemeProvider';
import GlobalStyles from '@root/GlobalStyles';

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;

addDecorator(storyFn => {
    return (
        <ThemeProvider>
            <Wrapper>
                <GlobalStyles />
                {storyFn()}
            </Wrapper>
        </ThemeProvider>
    );
});
