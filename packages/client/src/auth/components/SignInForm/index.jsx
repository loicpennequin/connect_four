import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers';
import { Link } from '@core/components/Link';
import * as yup from 'yup';

const schema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required()
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
    <form
      noValidate
      onSubmit={handleSubmit(submit)}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <label htmlFor="signin_username">Username</label>
      <input id="signin_username" name="username" ref={register} />
      <ErrorMessage errors={errors} name="username" />

      <label htmlFor="create-user_password">Password</label>
      <input
        id="create-user_password"
        name="password"
        ref={register}
        type="password"
      />
      <ErrorMessage errors={errors} name="password" />

      <button disabled={formState.isSubmitting}>Sign </button>
      <Link to="SignUp">I don't have an account</Link>
      {generalError && <div>{generalError.message}</div>}
    </form>
  );
}
