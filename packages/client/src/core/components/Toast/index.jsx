import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  createContext
} from 'react';
import styled from 'styled-components';
import { createPortal } from 'react-dom';
import { spacing, color } from '@styles/mixins';

const toastContainerNode = document.createElement('div');
toastContainerNode.id = 'toast-root';
toastContainerNode.style.position = 'fixed';
toastContainerNode.style.right = '1em';
toastContainerNode.style.top = '4em';
toastContainerNode.style.zIndex = 9999;

export const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const clear = useCallback(
    toast => setToasts(toasts => toasts.filter(t => t !== toast)),
    []
  );

  const show = useCallback(
    toast => {
      setToasts(toasts => toasts.concat(toast));
      setTimeout(() => {
        clear(toast);
      }, 4000);
    },
    [clear]
  );

  const toastComponents = useMemo(
    () =>
      toasts.map((toast, i) => {
        const inner =
          typeof toast === 'string' ? <Toast>{toast}</Toast> : toast;

        return (
          <div key={i} onClick={() => clear(toast)}>
            {inner}
          </div>
        );
      }),
    [clear, toasts]
  );

  const context = useMemo(() => {
    return { toasts, show, clear };
  }, [clear, show, toasts]);

  return (
    <ToastContext.Provider value={context}>
      <ToastPortal toasts={toastComponents} />
      {children}
    </ToastContext.Provider>
  );
}

function ToastPortal({ toasts }) {
  useEffect(() => {
    if (!document.contains(toastContainerNode)) {
      document.body.prepend(toastContainerNode);
    }
  }, []);

  return createPortal(toasts, toastContainerNode);
}

export default function Toast({ children, ...props }) {
  return <Wrapper {...props}>{children}</Wrapper>;
}

const Wrapper = styled.div`
  background-color: ${color('success')};
  color: ${color('successInvert')};
  padding: ${spacing('md')};
`;
