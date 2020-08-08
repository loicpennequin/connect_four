import React from 'react';
import { Route as BrowserRoute, Redirect } from 'react-router-dom';
import { isDefined, isUndefined } from '@c4/shared';
import { constants } from '@c4/shared';
import { useCurrentUser } from '@user/hooks/useCurrentUser';

const MemoizedRoute = React.memo(BrowserRoute);

export function Route({ authLevel, ...props }) {
  const currentUser = useCurrentUser();
  
  if (isDefined(currentUser.data) && authLevel === constants.AUTH_LEVELS.PUBLIC_ONLY) {
    return <Redirect to={constants.PATHS.AUTHENTICATED_REDIRECT_PATH} />
  } else if (isUndefined(currentUser.data) && authLevel === constants.AUTH_LEVELS.PRIVATE) {
    return <Redirect to={constants.PATHS.UNAUTHORIZED_REDIRECT_PATH} />
  } else {
    return <MemoizedRoute {...props} />
  }
} 