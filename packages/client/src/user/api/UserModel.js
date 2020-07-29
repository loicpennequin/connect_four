export class User {
  constructor(data) {
    Object.assign(this, data);
  }

  get isCurrentUser(store) {
    return store.getState().users.currentUserId === this.id;
  }
}
