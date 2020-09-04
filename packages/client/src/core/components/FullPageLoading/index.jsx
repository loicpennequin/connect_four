import React from 'react';
import styled, { keyframes } from 'styled-components';

import { color, spacing } from '@styles/mixins';

export function FullPageLoading() {
  return (
    <Wrapper>
      <div></div>
      <div></div>
    </Wrapper>
  );
}

const bounce = keyframes`
  0%   { transform: scale(1,1)      translateY(0); }
  10%  { transform: scale(1.1,.9)   translateY(0); }
  30%  { transform: scale(.9,1.1)   translateY(-125px); }
  50%  { transform: scale(1.05,.95) translateY(0); }
  57%  { transform: scale(1,1)      translateY(-8px); }
  64%  { transform: scale(1,1)      translateY(0); }
  100% { transform: scale(1,1)      translateY(0); }
`;

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  z-index: -1;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  /* background-color: ${color('surface')}; */
  background: radial-gradient(circle at center, ${color('surface')} 50%, ${color('background')});
  display: flex;
  justify-content: center;
  align-items: center;

  div:nth-of-type(1) {
    background-color: ${color('redChecker')};
  }

  div:nth-of-type(2) {
    background-color: ${color('yellowChecker')};
    animation-delay: 0.3s;
  }

  div {
    --size: ${spacing('xxl')};
    width: var(--size);
    height: var(--size);
    margin: ${spacing('xl')};
    border-radius: 50%;
    animation: ${bounce} 2s infinite;
    animation-timing-function: cubic-bezier(0.28, 0.84, 0.42, 1);
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background: none;
      border-radius: 50%;
      background: transparent;
      bottom: 0;
      left: 0;
    }
  }
`;
