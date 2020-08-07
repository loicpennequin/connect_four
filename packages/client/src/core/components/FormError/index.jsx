import React from 'react';
import styled from 'styled-components';
import { isDefined } from '@c4/shared';
import { color, spacing } from '@styles/mixins';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { Transition } from 'react-transition-group';

export function FormError({ children }) {
  return (
    <Transition in={isDefined(children)} timeout={0}>
      {state => (
        <Wrapper state={state}>
          {children && <FontAwesomeIcon icon={faExclamationCircle} />}
          <Text>{children}</Text>
        </Wrapper>
      )}
    </Transition>
  );
}

const Wrapper = styled.p`
  color: ${color('danger')};
  margin: 0;
  transition: all 500ms;
  padding: ${spacing('sm')};
  transition: all 300ms;
  opacity: ${props =>
    props.state === 'entering' || props.state === 'exited' ? 0 : 1};
`;

const Text = styled.span`
  margin-left: ${spacing('xs')};
`;
