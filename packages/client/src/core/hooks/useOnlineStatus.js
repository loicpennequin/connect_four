import { useState, useEffect } from 'react';
import { isDefined, isBoolean } from '@c4/shared';

function getOnlineStatus() {
  return isDefined(window.navigator) &&
    isBoolean(window.navigator.onLine)
    ? window.navigator.onLine
    : true;
}

export function useOnlineStatus() {
  const [onlineStatus, setOnlineStatus] = useState(getOnlineStatus());

  const goOnline = () => setOnlineStatus(true);

  const goOffline = () => setOnlineStatus(false);

  useEffect(() => {
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return onlineStatus;
}
