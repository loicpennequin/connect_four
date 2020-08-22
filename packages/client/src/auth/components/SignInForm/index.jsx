import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import * as yup from 'yup';

import { spacing } from '@styles/mixins';
import { Link } from '@core/components/Link';
import { TextInput } from '@core/components/TextInput';
import { FormControl } from '@core/components/FormControl';
import { FormError } from '@core/components/FormError';
import { Button } from '@core/components/Button';
import { Flex } from '@core/components/Flex';

const schema = yup.object().shape({
  username: yup.string().required('Please provide your username.'),
  password: yup.string().required('Please provide your password.')
});

export function SignInForm({ onSubmit }) {
  const [generalError, setGeneralError] = useState(null);
  const { register, handleSubmit, setError, errors, formState } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    criteriaMode: 'all',
    shouldFocusError: true
  });

  const submit = useCallback(
    async values => {
      try {
        await onSubmit(values);
      } catch (err) {
        setGeneralError(err);

        err?.additional?.violations.forEach(error => {
          setError(error.field, error);
        });
      }
    },
    [onSubmit, setError]
  );

  return (
    <form noValidate onSubmit={handleSubmit(submit)}>
      <FormControl
        name="username"
        error={errors.username}
        label="Username"
        component={TextInput}
        ref={register}
      />
      <FormControl
        type="password"
        name="password"
        error={errors.password}
        label="Password"
        component={TextInput}
        ref={register}
      />

      <Flex justify="center">
        <FormError>{generalError?.[0]?.message}</FormError>
      </Flex>
      
      <ActionBar justify="space-around" align="center">
        <Link to="SignUp">I don't have an account</Link>
        <Button cta disabled={formState.isSubmitting}>
          Sign In
        </Button>
      </ActionBar>    
    </form>
  );
}

const ActionBar = styled(Flex)`
  & > * {
    margin: ${spacing('sm')}
  }
`