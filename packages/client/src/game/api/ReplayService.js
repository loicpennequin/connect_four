import { httpClient } from '@root/core/api/httpClient';

export class ReplayService {
  static getStateFromNewAction({ state, column }) {
    return httpClient.put('/games/replays', { body: { state, column } });
  }
}
