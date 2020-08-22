import { useEffect, useRef, useMemo } from 'react';
import { webSocketApi } from '@root/core/api/webSocketApi';
import { useCurrentUser } from '@user/hooks/useCurrentUser';
let _bindings = 0;

export function useWebsockets({ connectOnMount = true } = {}) {
  const connectOnMountRef = useRef(connectOnMount);
  const listeners = useRef([]);
  const { data: currentUser } = useCurrentUser(false);

  useEffect(() => {
    return function cleanup() {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      listeners.current.forEach(listener => webSocketApi.off(...listener));
    };
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    _bindings++;
    if (connectOnMountRef.current) {
      webSocketApi.connect();
    }

    return () => {
      _bindings--;
      if (_bindings <= 0) {
        webSocketApi.disconnect();
      }
    };
  }, [currentUser]);

  return useMemo(() => {
    return {
      emit: webSocketApi.emit.bind(webSocketApi),
      on: (eventName, listener) => {
        listeners.current.push([eventName, listener]);
        return webSocketApi.on(eventName, listener);
      },
      connect: webSocketApi.connect,
      disconnect: webSocketApi.disconnect
    };
  }, []);
}
