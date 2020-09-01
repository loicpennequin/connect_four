import React from 'react';
import { Transition } from 'react-transition-group';
import styled from 'styled-components';

export function Fade({ isDisplayed, children, ...props }) {
  const transitionDuration = 300;
 
  return (
    <Transition timeout={transitionDuration} {...props}>
      {state => (
        <Wrapper state={state} transitionDuration={transitionDuration}>
          {children}
        </Wrapper>
      )}
    </Transition>
  )
}

const getTransitionStyles = ({ state }) => {
  if (['entering', 'exiting', 'exited'].includes(state)) return `opacity: 0;`;

  return `opacity: 1;`;
};

const Wrapper = styled.div`
  height: 100%;
  transition: all ${props => props.transitionDuration}ms;
  ${props => getTransitionStyles(props)}
`;
