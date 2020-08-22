import React from 'react';
import styled from 'styled-components';
import { SignUpForm } from '@user/components/SignUpForm';
import { useUsers } from '@user/hooks/useUsers';
import { useToast } from '@core/hooks/useToast';
import { useHistory } from 'react-router';

import { Surface } from '@core/components/Surface';
import { Flex } from '@core/components/Flex';

export default function SignInPage() {
  const { createUser } = useUsers({ lazy: true });
  const toast = useToast();
  const history = useHistory();

  const handleSubmit = async data => {
    try {
      await createUser(data);
      toast.show('Sign up successful !');
      history.push('/');
    } catch (err) {
      throw err;
    }
  };

  return (
    <Wrapper justify="center" align="center">
      <Surface>
        <SignUpForm onSubmit={handleSubmit} />
      </Surface>
    </Wrapper>
  );
}

const Wrapper = styled(Flex)`
  min-height: 100vh;
`;
