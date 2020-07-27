import { useEffect, useRef, useMemo } from 'react';
import webSocketApi from '@root/core/api/webSocketApi';

export function useWebsockets() {
  const listeners = useRef([]);

  useEffect(() => {
    return function cleanup() {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      listeners.current.forEach(listener => webSocketApi.off(...listener));
    };
  }, []);

  return useMemo(() => {
    return {
      connect: webSocketApi.connect.bind(webSocketApi),
      disConnect: webSocketApi.disconnect.bind(webSocketApi),
      emit: webSocketApi.emit.bind(webSocketApi),
      on: (eventName, listener) => {
        listeners.current.push([eventName, listener]);
        return webSocketApi.on(eventName, listener);
      }
    };
  }, []);
}
