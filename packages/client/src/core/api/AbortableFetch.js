export class AbortableFetch extends Promise {
  constructor(executor, timeoutDelay) {
    const controller = new AbortController();
    // Defining the timeout here is ugly but I don't really see a simpler way to have access to the correct "this" inside the wrapped promise used in super
    const timeout = timeoutDelay
      ? setTimeout(() => {
          this.abort();
        }, timeoutDelay)
      : null;

    super((originalResolve, reject) => {
      const resolve = (...args) => {
        if (timeout) clearTimeout(timeout);
        return originalResolve(...args);
      };
      return executor(resolve, reject, controller);
    });

    this.controller = controller;
  }

  abort() {
    this.controller.abort();
  }
}
