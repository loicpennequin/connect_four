export const constants = {
  EVENTS: {
    CLOSE: 'close',
    CONNECTED: 'connected',

    USER_LOGGED_IN: 'USER_LOGGED_IN',
    USER_LOGGED_OFF: 'USER_LOGGED_OFF',

    USER_INITIATED_CHALLENGE: 'USER_INITIATED_CHALLENGE',
    USER_CANCELLED_CHALLENGE: 'USER_CANCELLED_CHALLENGE',
    USER_ACCEPTED_CHALLENGE: 'USER_ACCEPTED_CHALLENGE',
    USER_REFUSED_CHALLENGE: 'USER_REFUSED_CHALLENGE',

    PLAYER_CONNECTED_TO_GAME: 'PLAYER_CONNECTED_TO_GAME',
    PLAYER_CONNECTED_TO_STALE_GAME: 'PLAYER_CONNECTED_TO_STALE_GAME',
 
    GAME_HAS_BEEN_CREATED: 'GAME_HAS_BEEN_CREATED',
    GAME_ACTION: 'GAME_ACTION',
    GAME_HAS_FINISHED: 'GAME_HAS_FINISHED',

    USER_ENTERED_LOBBY: 'USER_ENTERED_LOBBY',
    USER_LEFT_LOBBY: 'USER_LEFT_LOBBY',

    NEW_LOBBY_MESSAGE: 'NEW_LOBBY_MESSAGE',
    NEW_GAME_MESSAGE: 'NEW_GAME_MESSAGE',
  },
  AUTH_LEVELS: {
    PRIVATE: 'private',
    PUBLIC_ONLY: 'public only',
    PUBLIC: 'public'
  },
  PATHS: {
    AUTHENTICATED_REDIRECT_PATH: '/lobby',
    UNAUTHORIZED_REDIRECT_PATH: '/'
  },
  THEMES: {
    DEFAULT: 'default'
  },
  JWT: {
    MAXAGE: 15 * 60 // 15min
  },
  KEYS: {
    ESCAPE: 27
  }
};
