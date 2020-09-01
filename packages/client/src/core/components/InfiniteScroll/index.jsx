import React, { memo, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useIntersectionObserver } from '@core/hooks/useIntersectionObserver';
import { spacing, color } from '@styles/mixins';

import { Flex } from '@core/components/Flex';

export const InfiniteScroll = memo(({
  children,
  onIntersect,
  isLoading,
  enabled,
  useInternalRoot = false,
  ...props
}) => {
  const [currentIntersection, setCurrentIntersection] = useState(null);
  const loadMoreDownRef = useRef(null);
  const loadMoreUpRef = useRef(null);
  const rootRef = useRef(null);

  useIntersectionObserver({
    root: useInternalRoot && rootRef,
    targets: [loadMoreDownRef, loadMoreUpRef],
    onIntersect: entry => {
      console.log(entry)
      setCurrentIntersection(entry.target.dataset.direction);
      onIntersect(entry.target.dataset.direction);
    },
    enabled
  });
  return (
    <Wrapper {...props} ref={rootRef}>
      {isLoading && (
        <Loader position={currentIntersection} justify="center" align="center">
          <FontAwesomeIcon icon={faSpinner} size="lg" />
        </Loader>
      )}
      <Trigger ref={loadMoreUpRef} data-direction="up">
        .
      </Trigger>
      {children}
      <Trigger ref={loadMoreDownRef} data-direction="down">
        .
      </Trigger>
    </Wrapper>
  );
});

const spin = keyframes`
  from {
    transform: none
  } to {
    transform: rotateZ(1turn);
  }
`;

const Wrapper = styled.ul`
  position: relative;
`;

const Trigger = styled.li`
  font-size: 2px;
  color: transparent;
`;

const Loader = styled(Flex)`
  --size: ${spacing('xl')};
  width: var(--size);
  height: var(--size);
  position: absolute;
  left: 50%;
  transform: translateX(-50);
  ${props => props.position === 'up' && `top: 0`};
  ${props => props.position === 'down' && `bottom: 0`};
  border-radius: 50%;
  background-color: ${color('brand')};
  color: ${color('brandInvert')};
  animation: ${spin} 1.5s linear infinite;
`;
