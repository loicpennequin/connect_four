import React, { useCallback, useRef, useLayoutEffect, useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useMessages } from '@message/hooks/useMessages';
import { useCurrentUser } from '@user/hooks/useCurrentUser';

import { spacing, mobileOnly } from '@styles/mixins';

import { Flex } from '@core/components/Flex';
import { Button } from '@core/components/Button';
import { TextInput } from '@core/components/TextInput';
import { InfiniteScroll } from '@core/components/InfiniteScroll';

export function MessageList({ gameId = null, ...props }) {
  const {
    messages: { fetchMore, canFetchMore, isFetchingMore, isLoading },
    allMessages,
    createMessage
  } = useMessages(gameId);
  const [isInfiniteScrollEnabled, setIsInfiniteScrollEnabled] = useState(false);
  const { register, handleSubmit } = useForm();
  const { data: currentUser } = useCurrentUser();
  const listRef = useRef();
  
  const submit = async (values, e) => {
    await createMessage({
      ...values,
      authorId: currentUser.id,
      gameId
    });
    e.target.reset();
  };

  const handleIntersect = useCallback(
    direction => {
      if (direction !== 'down') return;
      return fetchMore();
    },
    [fetchMore]
  );
  
  useLayoutEffect(() => {
    if (isLoading) return;
    listRef.current.scrollTop = listRef.current.scrollHeight
    setTimeout(() => setIsInfiniteScrollEnabled(true), 1000);
  }, [isLoading]);

  if (isLoading) return <div>Loading messages...</div>;

  return (
    <Wrapper {...props}>
      {allMessages.length === 0 && <div>No messages.</div>}
      <div ref={listRef}>
        <Flex
          as={InfiniteScroll}
          direction="column-reverse"
          wrap="nowrap"
          enabled={canFetchMore && isInfiniteScrollEnabled}
          onIntersect={handleIntersect}
          isLoading={!!isFetchingMore}
        >
          {allMessages.map(message => (
            <Message key={message.id}>
              <strong>{message.author.username}</strong>: {message.content}
            </Message>
          ))}
        </Flex>
      </div>
      <MessageForm noValidate onSubmit={handleSubmit(submit)}>
        <MessageInput type="text" name="content" ref={register} autocomplete="off"/>
        <MessageFormSubmit type="submit">
          <FontAwesomeIcon icon={faPaperPlane} />
        </MessageFormSubmit>
      </MessageForm>
    </Wrapper>
  );
}

const Message = styled.li`
  padding: ${spacing('xs')};
  margin: ${spacing('xs')} 0;
`;

const MessageForm = styled.form`
  display: flex;
  margin-top: auto;
  padding: ${spacing('sm')} 0;
`;

const MessageInput = styled(TextInput)`
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  flex-grow: 1;
  margin-bottom: 0;
`;

const MessageFormSubmit = styled(Button)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;
  height: 100%;

  & > div {
    overflow-y: auto;
  }

  @media screen and (${mobileOnly}) {
    padding: ${spacing('xs')};
  }
`;
