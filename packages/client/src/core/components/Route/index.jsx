import React from 'react';
import { Route as BrowserRoute, Redirect } from 'react-router-dom';
import { isDefined, isUndefined } from '@c4/shared';
import { constants } from '@c4/shared';
import { useUsers } from '@user/hooks/useUsers';

export function Route(props) {
  const { currentUser } = useUsers();

  if (isDefined(currentUser.data) && props.authLevel === constants.AUTH_LEVELS.PUBLIC_ONLY) {
    return <Redirect to={constants.PATHS.AUTHENTICATED_REDIRECT_PATH} />
  } else if (isUndefined(currentUser.data) && props.authLevel === constants.AUTH_LEVELS.PRIVATE) {
    return <Redirect to={constants.PATHS.UNAUTHORIZED_REDIRECT_PATH} />
  } else {
    return <BrowserRoute {...props} />
  }
} 