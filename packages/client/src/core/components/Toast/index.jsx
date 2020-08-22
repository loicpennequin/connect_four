import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  createContext
} from 'react';
import { Transition, TransitionGroup } from 'react-transition-group';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

import { isString } from '@c4/shared';
import { spacing, fontWeight } from '@styles/mixins';

const toastContainerNode = document.createElement('div');
toastContainerNode.id = 'toast-root';
toastContainerNode.style.position = 'fixed';
toastContainerNode.style.right = '1em';
toastContainerNode.style.top = '4em';
toastContainerNode.style.zIndex = 9999;

export const ToastContext = createContext(null);

const defaultOptions = {
  type: 'success',
  timeout: 4000
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const clear = useCallback(
    toast => setToasts(toasts => toasts.filter(t => t !== toast)),
    []
  );

  const show = useCallback(
    toast => {
      toast = {
        ...defaultOptions,
        ...isString(toast) ? { text: toast } : toast
      }

      setToasts(toasts => toasts.concat(toast));

      setTimeout(() => {
        clear(toast);
      }, toast.timeout);
    },
    [clear]
  );

  const context = useMemo(() => {
    return { toasts, show, clear };
  }, [clear, show, toasts]);

  return (
    <ToastContext.Provider value={context}>
      <ToastPortal toasts={toasts} />
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

  return createPortal(
    <TransitionGroup>
      {toasts.map((toast, i) => (
        <Toast key={i} toast={toast} />
      ))}
    </TransitionGroup>,
    toastContainerNode
  );
}

export const Toast = ({ children, toast, ...props }) => {
  const transitionDuration = 300;
  const { text, ...toastProps } = toast;

  return (
    <Transition appear={true} timeout={transitionDuration} {...props}>
      {state => (
        <Wrapper
          state={state}
          transitionDuration={transitionDuration}
          {...toastProps}
        >
          {text}
        </Wrapper>
      )}
    </Transition>
  );
};

const getTransitionStyles = state => {
  if (state === 'entering')
    return `
    transform: translateX(100%);
    opacity: 0;
    `;

  if (state === 'exiting')
    return `
    transform: translateY(-100%);
    opacity: 0;
    `;

  return `
    transform: none;
    opacity: 1;
  `;
};

const Wrapper = styled.div`
  background-color: ${props => props.theme.color[props.type]};
  color: ${props => props.theme.color[props.type + 'Invert']};
  font-weight: ${fontWeight('bold')};
  padding: ${spacing('md')};
  transition: all ${props => props.transitionDuration}ms;
  ${props => getTransitionStyles(props.state)}
`;
