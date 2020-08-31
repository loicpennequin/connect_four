import { useEffect } from 'react';
import { MessageService } from '@message/api/MessageService';
import { useInfiniteQuery, useMutation, queryCache } from 'react-query';
import { constants } from '@c4/shared';
import { useWebsockets } from '@core/hooks/useWebsockets';

const { EVENTS } = constants;
const ITEMS_PER_PAGE = 30;

export function useMessages(id) {
  const { on } = useWebsockets({ connectOnMount: false });
  // TODO Maybe write in the cache when we get the response ?
  // We would need the server not to push the websocket event to sender the then
  const [createMessage] = useMutation(MessageService.createMessage, {
    throwOnError: true
  });

  const messages = useInfiniteQuery(
    ['messages', id],
    () => {
      const offset = messages.data?.reduce?.(
        (total, current) => total + current.length,
        0
      );

      if (id) return MessageService.getGameMessages(id, { offset });
      return MessageService.getLobbyMessages({ offset });
    },
    {
      retry: false,
      refetchOnWindowFocus: false,
      getFetchMore: (lastPage, allPages) => {
        if (lastPage.length < ITEMS_PER_PAGE) return null;

        return allPages.reduce((total, current) => total + current.length, 0);
      }
    }
  );
  
  useEffect(() => {
    const unsub = on(EVENTS.NEW_GAME_MESSAGE, async dto => {});
    return unsub;
  }, [on, id, messages]);

  useEffect(() => {
    const unsub = on(EVENTS.NEW_LOBBY_MESSAGE, async dto => {
      const currentData = queryCache.getQueryData(['messages', id]);
      currentData[0].unshift(await MessageService.processDTO(dto));
      queryCache.setQueryData(['messages', id], currentData);
    });
    return unsub;
  }, [on, id, messages]);

  return {
    messages,
    createMessage,
    get allMessages() {
      return messages.data?.flat();
    }
  };
}
