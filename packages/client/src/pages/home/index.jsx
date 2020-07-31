import React from 'react';
import { SignUpForm } from '@user/components/SignUpForm';
import { useUsers } from '@user/hooks/useUsers';

export default function HomePage() {
  const { createUser } = useUsers();
  return <SignUpForm onSubmit={createUser} />
}
