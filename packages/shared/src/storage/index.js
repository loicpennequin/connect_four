const wrap = fn => (...args) => {
  try {
    return fn(...args);
  } catch (error) {
    console.error(error);
    return null;
  }
};

const _localStorage = typeof window !== 'undefined' && window.localStorage;
const _sessionStorage = typeof window !== 'undefined' && window.sessionStorage;

export const localStorage = {
  getItem: wrap((...args) =>
    _localStorage.getItem(...args)
  ),
  setItem: wrap((...args) =>
    _localStorage.setItem(...args)
  ),
  removeItem: wrap((...args) =>
    _localStorage.removeItem(...args)
  ),
  clear: wrap(() => _localStorage.clear(_localStorage))
};

export const sessionStorage = {
  getItem: wrap((...args) =>
    _sessionStorage.getItem(...args)
  ),
  setItem: wrap((...args) =>
    _sessionStorage.setItem(...args)
  ),
  removeItem: wrap((...args) =>
    _sessionStorage.removeItem(...args)
  ),
  clear: wrap(() => _sessionStorage.clear())
};
