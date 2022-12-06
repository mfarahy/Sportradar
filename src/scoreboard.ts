import Match from './match';
import { Result, ValueResult } from './result';
import ScoreboardSummary from './scoreboardSummary';
import Team from './team';

export default class Scoreboard {
  public constructor() {
    this._onlineMatches = [];
  }

  private _onlineMatches: Match[];

  public get onlineMatches() {
    return this._onlineMatches;
  }

  public create(homeTeam: Team, awayTeam: Team): ValueResult<Match> {
    if (homeTeam == null) {
      return Result.Fail('Home team is null!');
    }
    if (awayTeam == null) {
      return Result.Fail('Away team is null!');
    }
    if (this._onlineMatches.find((x) => x.isParticipated(homeTeam))) {
      return Result.Fail(`Currently ${homeTeam} is playing!`);
    }
    if (this._onlineMatches.find((x) => x.isParticipated(awayTeam))) {
      return Result.Fail(`Currently ${awayTeam} is playing!`);
    }
    if (homeTeam.Equals(awayTeam)) {
      return Result.Fail(`A team can not play with itself!`);
    }

    var match = new Match(homeTeam, awayTeam);
    var removeTheMatch = () => {
      var index = this._onlineMatches.indexOf(match);
      this._onlineMatches.splice(index, 1);
    };

    match.on('canceled', removeTheMatch);
    match.on('finished', removeTheMatch);

    var startResult = match.start();
    if (!startResult.isSuccess) {
      return startResult;
    }

    var updateResult = match.updateScore(0, 0);
    if (!updateResult.isSuccess) {
      return updateResult;
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
          : x.totalScore - y.totalScore;
      })
    );
  }

  public clearBoard(): void {
    this._onlineMatches.splice(0, this._onlineMatches.length);
  }
}
