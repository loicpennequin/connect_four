import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPowerOff, faUser } from '@fortawesome/free-solid-svg-icons';

import { useToast } from '@core/hooks/useToast';
import { useAuth } from '@auth/hooks/useAuth';
import { useCurrentUser } from '@user/hooks/useCurrentUser';

import { spacing, fontSize, color, mobileOnly } from '@styles/mixins';
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
        <HeaderLeft>
          <HeaderLink to="Home">
            <FontAwesomeIcon icon={faHome} />
            <AppName>
              C<span>o</span>nnect F<span>o</span>ur
            </AppName>
          </HeaderLink>
        </HeaderLeft>

        {currentUser.data && (
          <HeaderRight>
            <Username>Hi, {currentUser.data.username}</Username>
            <HeaderLink to="Profile" params={{ id: currentUser.data.id }}>
              <FontAwesomeIcon icon={faUser} />
            </HeaderLink>
            <HeaderLink
              as={Button}
              plain
              color="accent"
              onClick={handleLogoutClick}
            >
              <FontAwesomeIcon icon={faPowerOff} />
            </HeaderLink>
          </HeaderRight>
        )}
      </Container>
    </Header>
  );
}

const HeaderRight = styled(Flex)`
  & > * {
    margin: 0 ${spacing('sm')};
  }
`;

const HeaderLeft = styled(Flex)`
  a {
    text-decoration: none;
  }

  & > * {
    margin: 0 ${spacing('sm')};
  }
`;

const Username = styled.span`
  @media screen and (${mobileOnly}) {
    display: none;
  }
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
  &:hover, &:focus {
    color: ${color('accent')};
  }
`;

const AppName = styled.span`
  margin-left: ${spacing('sm')};
  font-size: ${fontSize('lg')};

  span:nth-of-type(1) {
    color: ${color('redChecker')};
  }

  span:nth-of-type(2) {
    color: ${color('yellowChecker')};
  }
`;
