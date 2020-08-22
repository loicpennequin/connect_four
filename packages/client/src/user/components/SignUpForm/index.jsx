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
  username: yup
    .string()
    .required('Please provide a username.')
    .min(4, 'Your username must be at least 4 characters long.')
    .max(16, 'Your username must bt at most 16 characters long.'),
  email: yup
    .string()
    .required('Please provide an email.')
    .email('This email is not valid.'),
  password: yup
    .string('Please provide a password.')
    .required()
    .min(6, 'Your password must be at least 6 characters long.'),
  passwordConfirm: yup
    .string()
    .required('Please confrm your password.')
    .oneOf([yup.ref('password')], 'Your passwords are not the same.')
});

export function SignUpForm({ onSubmit }) {
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
        type="mail"
        name="email"
        error={errors.username}
        label="E-mail"
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
      <FormControl
        type="password"
        name="passwordConfirm"
        error={errors.passwordConfirm}
        label="Password"
        component={TextInput}
        ref={register}
      />

      <Flex justify="center">
        <FormError>{generalError?.[0]?.message}</FormError>
      </Flex>

      <ActionBar justify="space-around" align="center">
        <Link to="Home">I already have an account</Link>
        <Button cta disabled={formState.isSubmitting}>
          Sign Up
        </Button>
      </ActionBar>
    </form>
  );
}


const ActionBar = styled(Flex)`
  & > * {
    margin: ${spacing('sm')};
  }
`;