import { Match } from './match';
import IMatchBuilder from './matchBuilder';
import { Result, ValueResult } from './result';
import ScoreboardSummary from './scoreboardSummary';
import Team from './team';

export default class Scoreboard {
  public constructor(private readonly matchBuilder: IMatchBuilder) {
    this._onlineMatches = [];
  }

  private _onlineMatches: Match[];

  public get onlineMatches() {
    return this._onlineMatches;
  }

  public create(homeTeam: Team, awayTeam: Team): ValueResult<Match> {
    if (homeTeam == null) {
      return Result.FailValue('Home team is null!');
    }
    if (awayTeam == null) {
      return Result.FailValue('Away team is null!');
    }
    if (this._onlineMatches.find((x) => x.isParticipated(homeTeam))) {
      return Result.FailValue(`Currently ${homeTeam} is playing!`);
    }
    if (this._onlineMatches.find((x) => x.isParticipated(awayTeam))) {
      return Result.FailValue(`Currently ${awayTeam} is playing!`);
    }
    if (homeTeam.Equals(awayTeam)) {
      return Result.FailValue(`A team can not play with itself!`);
    }

    var match = this.matchBuilder.createMatch(homeTeam, awayTeam);
    var removeTheMatch = () => {
      var index = this._onlineMatches.indexOf(match);
      this._onlineMatches.splice(index, 1);
    };

    match.on('canceled', removeTheMatch);
    match.on('finished', removeTheMatch);

    var startResult = match.start();
    if (!startResult.isSuccess) {
      return Result.FailValue(startResult.message);
    }

    var updateResult = match.updateScore(0, 0);
    if (!updateResult.isSuccess) {
      return Result.FailValue(updateResult.message);
    }

    this._onlineMatches.push(match);

    return Result.SuccessValue(match);
  }

  public getSummary(): ScoreboardSummary {
    return new ScoreboardSummary(
      this._onlineMatches.sort((x, y) => {
        if (x == null) return -1;

        if (y == null) return 1;

        return x.totalScore == y.totalScore
          ? y.startTime != undefined && x.startTime != undefined && x.startTime < y.startTime
            ? 1
            : -1
          : y.totalScore - x.totalScore;
      })
    );
  }

  public clearBoard(): void {
    this._onlineMatches.splice(0, this._onlineMatches.length);
  }
}
