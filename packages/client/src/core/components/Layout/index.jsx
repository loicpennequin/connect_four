import React, { useState, useMemo, createContext } from 'react';
import { DefaultLayout } from './DefaultLayout';

export const layoutContext = createContext(null);

export function Layout({ children }) {
  const [CurrentLayout, setCurrentLayout] = useState(() => DefaultLayout);
  const context = useMemo(() => layout => setCurrentLayout(() => layout), []);

  return (
    <layoutContext.Provider value={context}>
      <CurrentLayout>{children}</CurrentLayout>
    </layoutContext.Provider>
  );
}
