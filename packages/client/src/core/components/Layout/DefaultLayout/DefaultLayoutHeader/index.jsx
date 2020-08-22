import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPowerOff } from '@fortawesome/free-solid-svg-icons';

import { useToast } from '@core/hooks/useToast';
import { useAuth } from '@auth/hooks/useAuth';
import { useCurrentUser } from '@user/hooks/useCurrentUser';

import { spacing, fontSize, color } from '@styles/mixins';
import { Link } from '@core/components/Link';
import { Button } from '@core/components/Button';
import { Container } from '@core/components/Container';
import { Flex } from '@core/components/Flex';

export function DefaultLayoutHeader() {
  const { logout } = useAuth();
  const toast = useToast();

  const currentUser = useCurrentUser();
  const handleLogoutClick = async () => {
    try {
      await logout();
      toast.show('You are now logged out.');
    } catch (err) {
      throw err;
    }
  };
  return (
    <Header>
      <Container as={Flex} align="center" justify="space-between">
        <Flex>
          <HeaderLink to="Home">
            <FontAwesomeIcon icon={faHome} />
          </HeaderLink>
        </Flex>

        {currentUser.data && (
          <Flex>
            <Username>Hi, {currentUser.data.username}</Username>
            <HeaderLink
              as={Button}
              plain
              color="accent"
              onClick={handleLogoutClick}
            >
              <FontAwesomeIcon icon={faPowerOff} />
            </HeaderLink>
          </Flex>
        )}
      </Container>
    </Header>
  );
}

const Username = styled.span`
  margin-right: ${spacing('md')};
`;

const Header = styled.header`
  color: ${color('brandInvert')};
  background-color: ${color('brand')};
  padding: ${spacing('md')};
`;

const HeaderLink = styled(Link)`
  font-size: ${fontSize('lg')};
  color: inherit;
  padding: 0;
  &:hover {
    color: ${color('accent')};
  }
`;
