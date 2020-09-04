import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

import { color, spacing } from '@styles/mixins';
import { Flex } from '@core/components/Flex';

export function ReplayTree({ tree, onClick, currentNode }) {
  const wrapperRef = useRef(null);

  const checkStepIsDuplicate = (node, pathIndex) => {
    return tree.paths.some((path, i) => {
      return i < pathIndex && path.steps.includes(node);
    });
  };

  const getColor = (state, index) => {
    if (index === 0) return 'brand';

    return state.currentPlayer === state.playerIds[0]
      ? 'yellowChecker'
      : 'redChecker';
  };

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || !currentNode) return;

    const element = wrapper.querySelector(`[data-node="${currentNode.uuid}"]`);

    element?.scrollIntoView({ behavior: 'smooth' });
  }, [currentNode]);

  const isCurrentNode = node => node === currentNode;
  return (
    <Wrapper ref={wrapperRef}>
      {tree.paths.map((path, pathIndex) => (
        <Path wrap="nowrap" key={path.uuid}>
          <>
            {path.steps.map((node, stepIndex) => (
              <React.Fragment key={node.uuid}>
                <Node
                  data-node={node.uuid}
                  isCurrentNode={isCurrentNode(node)}
                  isVisible={!checkStepIsDuplicate(node, pathIndex)}
                  color={getColor(node.value, stepIndex)}
                  onClick={() => onClick(node)}
                />
              </React.Fragment>
            ))}
          </>
        </Path>
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  height: 100%;
  overflow: auto;
`;
const Path = styled(Flex)``;

const Node = styled.div`
  flex-shrink: 0;
  width: 3em;
  height: 3em;
  border-radius: 50%;
  background-color: ${props => color(props.color)};
  margin: ${spacing('sm')} ${spacing('md')};
  border: solid 2px transparent;
  border-color: ${props => props.isCurrentNode && color('brand')};
  ${props => !props.isVisible && 'opacity: 0;'}
`;

