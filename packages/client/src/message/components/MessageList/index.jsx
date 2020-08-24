import React from 'react';
import { useForm } from 'react-hook-form';

import { useMessages } from '@message/hooks/useMessages';
import { useCurrentUser } from '@user/hooks/useCurrentUser';

export function MessageList({ id }) {
  const { messages, createMessage } = useMessages();
  const { register, handleSubmit } = useForm();
  const { data: currentUser } = useCurrentUser();

  const submit = values => createMessage({
    ...values,
    authorId: currentUser.id,
    gameId: id
  });

  if (messages.isLoading) return <div>Loading messages...</div>;

  return (
    <>
      {messages.data.length === 0 && <div>No messages.</div>}
      <ul>
        {messages.data.map(message => (
          <li key={message.id}>
            <strong>{message.author.username}</strong>: {message.content}
          </li>
        ))}
      </ul>
      <form noValidate onSubmit={handleSubmit(submit)}>
        <input type="text" name="content" ref={register} />
      </form>
    </>
  );
}
