import React from 'react';
import styled from 'styled-components';
import { SignInForm } from '@auth/components/SignInForm';
import { useAuth } from '@auth/hooks/useAuth';
import { useToast } from '@core/hooks/useToast';

import { Flex } from '@core/components/Flex';
import { Surface } from '@core/components/Surface';

export default function HomePage() {
  const { login } = useAuth();
  const toast = useToast();

  const handleSubmit = async data => {
    try {
      await login(data);
      toast.show('Login successful !');
    } catch (err) {
      throw err;
    }
  };

  return (
    <Wrapper justify="center" align="center">
      <Surface>
        <SignInForm onSubmit={handleSubmit} />
      </Surface>
    </Wrapper>
  );
}

const Wrapper = styled(Flex)`
  min-height: 100vh;
`;
