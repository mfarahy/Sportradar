import Match from '../match';
import { MatchStates } from '../matchStates';
import Team from '../team';

describe('testing Match', () => {
  it('Start should run once', () => {
    const match = new Match(new Team({ id: 1, name: 'team1' }), new Team({ id: 2, name: 'team2' }));

    var firstResult = match.start();
    var secondResult = match.start();

    expect(firstResult.isSuccess).toBe(true);
    expect(secondResult.isSuccess).toBe(false);
    expect(match.status).toBe(MatchStates.Started);
  });
});
