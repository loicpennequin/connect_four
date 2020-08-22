import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { useGameApi } from '@game/hooks/useGameApi';
import { useCurrentUser } from '@user/hooks/useCurrentUser';

import { fontSize, color } from '@styles/mixins';

import { Modal } from '@core/components/Modal';
import { Link } from '@core/components/Link';

export function GameOverModal({ isOpen }) {
  const { state } = useGameApi();
  const { data: currentUser } = useCurrentUser();
  const history = useHistory();

  const handleClose = () => history.push('/lobby');
  const isWonByCurrentUser = state.winner === currentUser.id;

  const message = useMemo(
    () =>
      isWonByCurrentUser
        ? 'Congratulations, you won !'
        : 'Too bad, seems like you lost !',
    [isWonByCurrentUser]
  );

  return (
    <Modal isOpen={state.winner} onClose={handleClose}>
      <Message isWin={isWonByCurrentUser}>{message}</Message>
      <Link to="Lobby">Back to lobby</Link>
    </Modal>
  );
}

const Message = styled.div`
  font-size: ${fontSize('lg')};
  color: ${props => color(props.isWin ? 'success' : 'danger')};
`;
