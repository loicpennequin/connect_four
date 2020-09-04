import React from 'react';
import styled, { keyframes } from 'styled-components';
import { spacing } from '@styles/mixins';

const shimmer = props => keyframes`
  0% {
    background-position: -800px 0;
  }
  
  100% {
    background-position: 0 0; 
  }
`;

const delay = keyframes`
  0% {
    transform: scale(0);
  }
  
  100% {
    transform: scale(1);
  }
`;

export const SkeletonBlock = styled.div.attrs(props => ({
  width: props.width || '100%',
  height: props.height || '1em'
}))`
  flex-shrink: 0;
  width: ${props => props.width};
  height: ${props => props.height};
  background-image: linear-gradient(
    to right,
    #eee 0%,
    #fff 20%,
    #eee 40%,
    #eee 100%
  );
  background-repeat: repeat-x;
  background-size: 800px 100%;
  animation: ${shimmer} 1s linear infinite forwards, ${delay} 0.1s steps(1);
`;

export const SkeletonCircle = styled(SkeletonBlock)`
  border-radius: 50%;
`;

export const SkeletonList = ({...props}) => (
  <SkeletonListWrapper>
    <SkeletonBlock {...props} />
    <SkeletonBlock {...props} />
    <SkeletonBlock {...props} />
  </SkeletonListWrapper>
)

const SkeletonListWrapper = styled.div`
  & > * {
    margin-bottom: ${spacing('md')};
  }

  & > div:nth-of-type(2) {
    opacity: 0.6;
  }
  
  & > div:nth-of-type(3) {
    opacity: 0.3;

  }
`