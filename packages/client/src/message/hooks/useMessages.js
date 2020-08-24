import { useEffect } from 'react';
import { MessageService } from '@message/api/MessageService';
import { useQuery, useMutation } from 'react-query';
import { constants } from '@c4/shared';
import { useWebsockets } from '@core/hooks/useWebsockets';

const { EVENTS } = constants;

export function useMessages(id) {
  const { on } = useWebsockets({ connectOnMount: false });
  // TODO Maybe write in the cache when we get the response ? 
  // We would need the server not to push the websocket event to sender then
  const [createMessage] = useMutation(MessageService.createMessage, {
    throwOnError: true
  });

  const messages = useQuery(
    ['messages', id],
    () => {
      if (id) return MessageService.getGameMEssages();
      return MessageService.getLobbyMessages();
    },
    {
      retry: false,
    }
  );

  //TODO refactor this. Websocket event should send new message DTO and we should just write on the query cache
  useEffect(() => {
    const unsub = on(EVENTS.NEW_GAME_MESSAGE, () => {
     if (id) messages.refetch();
    });
    return unsub;
  }, [on, id, messages]);

  useEffect(() => {
    const unsub = on(EVENTS.NEW_LOBBY_MESSAGE, () => {
     if (!id) messages.refetch();
    });
    return unsub;
  }, [on, id, messages]);

  return {
    messages,
    createMessage
  };
}
