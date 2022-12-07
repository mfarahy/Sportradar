import { Match } from './match';
import Team from './team';

export default interface IMatchBuilder {
  createMatch(homeTeam: Team, awayTeam: Team): Match;
}

export class MatchBuilder implements IMatchBuilder {
  createMatch(homeTeam: Team, awayTeam: Team): Match {
    return new Match(homeTeam, awayTeam);
  }
}
