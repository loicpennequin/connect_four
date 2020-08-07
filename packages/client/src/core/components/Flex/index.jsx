import styled from 'styled-components';

export const Flex = styled.div`
    display: flex;
    justify-content: ${props => props.justify};
    align-items: ${props => props.align};
    flex-direction: ${props => props.direction};
    flex-wrap: ${props => props.wrap};
`;

Flex.defaultProps = {
    justify: 'flex-start',
    align: 'stretch',
    direction: 'row',
    wrap: 'wrap'
};