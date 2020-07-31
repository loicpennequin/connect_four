import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import { usersReducer } from '@user/userSlice';

const logger = createLogger({
  collapsed: true
});

export const store = configureStore({
  reducer: {
    users: usersReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger)
});
