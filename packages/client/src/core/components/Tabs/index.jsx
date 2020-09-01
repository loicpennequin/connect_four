import React, { useState, useMemo } from 'react';
import { noop } from '@c4/shared';
import styled from 'styled-components';
import { TransitionGroup } from 'react-transition-group';

import { spacing, color } from '@styles/mixins';

import { Flex } from '@core/components/Flex';
import { Fade } from '@core/components/Fade';

export function Tabs({ children, initialActiveTab, onTabChange = noop }) {
  const tabLabels = useMemo(() => children.map(child => child.props.label), [
    children
  ]);

  const [activeTabLabel, setActiveTabLabel] = useState(
    tabLabels[initialActiveTab]
  );

  const mappedChildren = useMemo(() => React.Children.map(children, child => {
    const additionalProps = { isActive: child.props.label === activeTabLabel};
    return React.cloneElement(child, additionalProps);
  }), [activeTabLabel, children])

  const handleTabClick = label => {
    setActiveTabLabel(label);
    onTabChange(label);
  };

  return (
    <>
      <Flex as="ul" justify="space-around" role="tabList">
        {tabLabels.map(label => (
          <Tab key={label} isActive={label === activeTabLabel}>
            <button role="tab" onClick={() => handleTabClick(label)}>
              {label}
            </button>
          </Tab>
        ))}
      </Flex>
      <TransitionGroup component={null}>
        {mappedChildren}
      </TransitionGroup>
    </>
  );
}

Tabs.Item = ({ children, isActive, ...props }) => isActive ? <Fade {...props}>{children}</Fade> : null;
Tabs.Item.displayName = 'TabItem';

const Tab = styled.li`
  color: ${color('brand')};
  margin: ${spacing('xs')};
  flex-grow: 1;
  button {
    padding: ${spacing('sm')};
    width: 100%;
    border: none;
    color: inherit;
    background: none;
    opacity: ${props => (props.isActive ? 1 : 0.6)};
    border-bottom: solid 2px ${color('brand')};
    &:focus {
      outline: none;
      border-color: ${color('accent')};
    }
  }
`;