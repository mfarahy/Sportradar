import { CancelationReasons } from './cancelationReasons';
import Team from './team';

export abstract class MatchResult {
  public constructor(public readonly homeTeam: Team, public readonly awayTeam: Team) {}
}

export class CanceledMatchResult extends MatchResult {
  constructor(
    homeTeam: Team,
    awayTeam: Team,
    public readonly cancelationReason: CancelationReasons,
    public readonly note: string
  ) {
    super(homeTeam, awayTeam);
  }
}

export class CompletedMatchResult extends MatchResult {
  constructor(
    homeTeam: Team,
    awayTeam: Team,
    public readonly homeTeamScore: number,
    public readonly awayTeamScore: number,
    public readonly durationSeconds: number
  ) {
    super(homeTeam, awayTeam);
  }
}
