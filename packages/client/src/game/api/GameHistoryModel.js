import formatDistanceToNow from 'date-fns/formatDistanceToNow';

export class GameHistory {
  constructor(data) {
    Object.assign(this, data);
    this.games.forEach(game => {
      game.opponent = game.user1.id === this.ownerId ? game.user2 : game.user1
      game.isWin = game.winner.id === this.ownerId;
      game.getTimeAgo = () => {
        return formatDistanceToNow(new Date(game.createdAt), { addSuffix: true }).replace('about', '');
      }
    })
  }

  get winRate() {
    if (this.games.length <= 0) return 0;
    
    const gamesWon = this.games.filter(g => g.winner.id === this.ownerId);
    return gamesWon.length / this.games.length;
  }
}