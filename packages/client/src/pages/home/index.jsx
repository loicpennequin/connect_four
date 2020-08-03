import React from 'react';
import { SignInForm } from '@auth/components/SignInForm';
import { useAuth } from '@auth/hooks/useAuth';
import { useToast } from '@core/hooks/useToast';

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

  return <SignInForm onSubmit={handleSubmit} />;
}
