import React from 'react';
import { SignUpForm } from '@user/components/SignUpForm';
import { useUsers } from '@user/hooks/useUsers';
import { useToast } from '@core/hooks/useToast';

export default function HomePage() {
  const { createUser } = useUsers();
  const { show } = useToast();

  const handleSubmit = async data => {
    try {
      await createUser(data);
      show('Sign up successful !')
    } catch(err) {
      throw err;
    }
  }
  
  return (
    <SignUpForm onSubmit={handleSubmit} />
  )
}
