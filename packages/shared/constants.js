export const constants = {
  EVENTS: {
    USER_LOGGED_IN: 'USER_LOGGED_IN',
    USER_LOGGED_OFF: 'USER_LOGGED_OFF',

    USER_INIATED_CHALLENGE: 'USER_INITIATED_CHALLENGE',
    USER_ACCEPTED_CHALLENGE: 'USER_ACCEPTED_CHALLENGE',
    USER_REFUSED_CHALLENGE: 'USER_REFUSED_CHALLENGE',
    
    USER_ENTERED_LOBBY: 'USER_ENTERED_LOBBY',
    USER_LEFT_LOBBY: 'USER_LEFT_LOBBY',
    SELF_ENTERED_LOBBY: 'SELF_ENTERED_LOBBY'
  },
  AUTH_LEVELS: {
    PRIVATE: 'private',
    PUBLIC_ONLY: 'public only',
    PUBLIC: 'public'
  },
  PATHS: {
    AUTHENTICATED_REDIRECT_PATH: '/lobby',
    UNAUTHORIZED_REDIRECT_PATH: '/',
  },
  THEMES: {
    DEFAULT: 'default'
  },
  JWT: {
    MAXAGE: 15 * 60 // 15min
  }
};
