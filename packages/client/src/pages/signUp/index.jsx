import React from 'react';
import { SignUpForm } from '@user/components/SignUpForm';
import { useUsers } from '@user/hooks/useUsers';
import { useToast } from '@core/hooks/useToast';
import { useHistory } from 'react-router';

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

  return <SignUpForm onSubmit={handleSubmit} />;
}
