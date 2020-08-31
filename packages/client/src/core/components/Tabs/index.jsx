import React, { useState, useMemo } from 'react';

import { Flex } from '@core/components/Flex';

export function Tabs({ children }) {
  React.Children.forEach(children, child => {
    if (child.type.displayName !== 'TabItem') {
      throw new Error(
        'Only Tab.Item is allowed as a children of the Tabs component'
      );
    }
  });

  const tabLabels = useMemo(
    () => children.map(child => child.props.label),
    [children]
  );
  const [activeTabLabel, setActiveTabLabel] = useState(tabLabels[0]);
  const activeTab = children.find(
    child => child.props.label === activeTabLabel
  );

  const handleTabClick = label => setActiveTabLabel(label);
  return (
    <>
      <Flex as="ul" justify="space-around">
        {tabLabels.map(label => (
          <li key={label}>
            <button onClick={() => handleTabClick(label)}>{label}</button>
          </li>
        ))}
      </Flex>
      {activeTab}
    </>
  );
}

Tabs.Item = ({ children }) => children;
Tabs.Item.displayName = 'TabItem';
