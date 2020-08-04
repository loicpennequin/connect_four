import mergeHeaders from 'merge-headers';
import { AbortableFetch } from '@root/core/api/AbortableFetch';
import { isString, isObject } from '@c4/shared';

export const REQUEST = 'request';
export const RESPONSE = 'response';
export const RESPONSE_ERROR = 'responseError';

export class HttpClient {
  constructor() {
    this.requestTimeout = 10000;
    this.baseUrl = process.env.REACT_APP_API_URL;
    this.listeners = {
      [REQUEST]: [],
      [RESPONSE]: [],
      [RESPONSE_ERROR]: []
    };
  }

  _getOptions({ headers = new Headers(), body, ...options }) {
    return {
      body: isString(body) ? body : JSON.stringify(body),
      headers: mergeHeaders({ 'Content-Type': 'application/json' }, headers),
      credentials: 'include',
      ...options
    };
  }

  _createRequestHandler(url, { query, ...options }) {
    return async (resolve, reject, { signal }) => {
      const [requestUrl, requestOptions] = await this._emit(
        REQUEST,
        this._prepareUrl(url, query),
        this._getOptions({ ...options, signal })
      );

      const request = new Request(requestUrl, requestOptions);
      try {
        const response = await fetch(request);
        response.request = request;
        if (!response.ok) throw await response.json();
        resolve(await this._emit(RESPONSE, response));
      } catch (err) {
        err.request = request;
        reject(await this._emit(RESPONSE_ERROR, err));
      }
    };
  }

  async _performRequest(url, options) {
    const handler = this._createRequestHandler(url, options);
    return new AbortableFetch(handler, this.requestTimeout);
  }

  _prepareUrl(url, query = {}) {
    url = new URL(url, this.baseUrl);
    const params = Object.entries(query).map(([key, value]) => [
      key,
      isObject(value) ? JSON.stringify(value) : value
    ]);

    url.search = new URLSearchParams(params);

    return url;
  }

  async _emit(eventName, ...args) {
    for (let listener of this.listeners[eventName] || []) {
      args = await listener(...args);
    }
    return args;
  }

  on(eventName, cb) {
    this.listeners[eventName].push(cb);

    return () => this.off(eventName, cb);
  }

  off(eventName, cb) {
    this.listeners[eventName] = this.listeners[eventName].filter(
      listener => listener !== cb
    );
  }

  get(url, options = {}) {
    return this._performRequest(url, {
      ...options,
      method: 'GET'
    });
  }

  post(url, options = {}) {
    return this._performRequest(url, {
      ...options,
      method: 'POST'
    });
  }

  put(url, options = {}) {
    return this._performRequest(url, {
      ...options,
      method: 'PUT'
    });
  }

  delete(url, options = {}) {
    return this._performRequest(url, {
      ...options,
      method: 'DELETE'
    });
  }

  patch(url, options = {}) {
    return this._performRequest(url, {
      ...options,
      method: 'PATCH'
    });
  }
}

export const httpClient = new HttpClient();

httpClient.on(RESPONSE, response => {
  if (response.status !== 204) {
    return response.json();
  }
  return {};
});
