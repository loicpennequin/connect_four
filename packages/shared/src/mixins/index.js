import { isUndefined } from '../assertions';

export const eventsMixin = () => ({
  listeners: {},

  on(eventName, cb) {
    if (isUndefined(this.listeners[eventName])) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(cb);

    return () => this.off(eventName, cb);
  },

  once(eventName, cb) {
    if (isUndefined(this.listeners[eventName])) {
      this.listeners[eventName] = [];
    }
    const actualCb = (...args) => {
      this.off(eventName, actualCb);
      return cb(...args);
    };
    this.listeners[eventName].push(actualCb);

    return () => this.off(eventName, actualCb);
  },

  off(eventName, cb) {
    this.listeners[eventName] = this.listeners[eventName].filter(x => x !== cb);
  },

  fireEvent(eventName, ...params) {
    if (isUndefined(this.listeners[eventName])) return params;
    this.listeners[eventName].forEach( handler => handler(...params))
  }
});
