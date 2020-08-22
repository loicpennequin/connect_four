import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { getFocusableChildren } from '@c4/shared';
import { color, spacing, zindex, mobileOnly } from '@styles/mixins';
import { keys } from '@utils';

import { Flex } from '@core/components/Flex';
import { Button } from '@core/components/Button';

const modalRootElement = document.createElement('div');
modalRootElement.id = 'modal-root';

export function Modal({ children, isOpen, onClose }) {
  const appElement = useRef(document.getElementById('root'));
  const modalContentElement = useRef(null);
  
  const handleKeyUp = useCallback(
    e => {
      if (e.code === keys.ESCAPE) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!document.contains(modalRootElement)) {
      document.body.prepend(modalRootElement);
    }
    const app = appElement.current;
    return () => {
      app.removeAttribute('inert');
      app.removeAttribute('aria-hidden');
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyUp]);

  useEffect(() => {
    if (isOpen) {
      const focusable = getFocusableChildren(modalContentElement.current);
      focusable[0]?.focus?.();
      appElement.current.setAttribute('aria-hidden', true);
      appElement.current.setAttribute('inert', true);
      window.addEventListener('keyup', handleKeyUp);
    } else {
      appElement.current.removeAttribute('inert');
      appElement.current.removeAttribute('aria-hidden');
      window.removeEventListener('keyup', handleKeyUp);
    }
  }, [isOpen, handleKeyUp]);

  if (!isOpen) return null;

  return createPortal(
    <ModalContainer onClick={onClose} justify="center" align="center">
      <CloseButton onClick={onClose} plain>X</CloseButton>
      <ContentWrapper
        ref={modalContentElement}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </ContentWrapper>
    </ModalContainer>,
    modalRootElement
  );
}

const ModalContainer = styled(Flex)`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${zindex('modal')};
`;

const ContentWrapper = styled.div`
  max-width: 75%;
  background: ${color('surface')};
  padding: ${spacing('md')};
  @media (${mobileOnly}) {
    max-width: 100%;
  }
`;

const CloseButton = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
  margin: ${spacing('md')};
  cursor: pointer;
`;
