import { useEffect, useRef, useMemo } from 'react';
import { webSocketApi } from '@root/core/api/webSocketApi';

let _bindings = 0;

export function useWebsockets() {
  const listeners = useRef([]);

  useEffect(() => {
    return function cleanup() {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      listeners.current.forEach(listener => webSocketApi.off(...listener));
    };
  }, []);

  useEffect(() => {
    _bindings ++;
    webSocketApi.connect();

    return () => {
      _bindings --;
      if (_bindings <= 0) {
        webSocketApi.disconnect();
      }
    }
  }, []);

  return useMemo(() => {
    return {
      emit: webSocketApi.emit.bind(webSocketApi),
      on: (eventName, listener) => {
        listeners.current.push([eventName, listener]);
        return webSocketApi.on(eventName, listener);
      }
    };
  }, []);
}
