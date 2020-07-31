import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers';
import * as yup from 'yup';

const schema = yup.object().shape({
  username: yup
    .string()
    .required()
    .min(4)
    .max(16),
  email: yup
    .string()
    .required()
    .email(),
  password: yup
    .string()
    .required()
    .min(6),
  passwordConfirm: yup
    .string()
    .required()
    .oneOf([yup.ref('password')])
});

export function SignUpForm({ onSubmit }) {
  const { register, handleSubmit, setError, errors, formState } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    criteriaMode: 'all',
    shouldFocusError: true
  });

  const submit = useCallback(async (values) => {
   try {
     await onSubmit(values);
   } catch(err) {
     err?.additional?.violations.forEach(error => {
       setError(error.field, error);
     });
   }
  }, [onSubmit, setError]);

  return (
    <form
      noValidate
      onSubmit={handleSubmit(submit)}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <label htmlFor="create-user_username">Username</label>
      <input id="create-user_username" name="username" ref={register} />
      <ErrorMessage errors={errors} name="username" />

      <label htmlFor="create-user_email">Email</label>
      <input id="create-user_email" name="email" type="email" ref={register} />
      <ErrorMessage errors={errors} name="email" />

      <label htmlFor="create-user_password">Password</label>
      <input
        id="create-user_password"
        name="password"
        ref={register}
        type="password"
      />
      <ErrorMessage errors={errors} name="password" />

      <label htmlFor="create-user_password-confirm">Confirm Password</label>
      <input
        id="create-user_password-confirm"
        type="password"
        name="passwordConfirm"
        ref={register}
      />
      <ErrorMessage errors={errors} name="passwordConfirm" />

      <button disabled={formState.isSubmitting}>Sign up</button>
    </form>
  );
}
