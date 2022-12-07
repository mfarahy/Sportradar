import Team from './team';
import { EventEmitter } from 'events';
import { MatchStates } from './matchStates';
import { Result, ValueResult } from './result';
import { CanceledMatchResult, CompletedMatchResult } from './matchResult';
import moment from 'moment';
import { CancelationReasons } from './cancelationReasons';

export class Match extends EventEmitter {
  public constructor(public readonly homeTeam: Team, public readonly awayTeam: Team) {
    super();

    this._status = MatchStates.None;
    this._homeTeamScore = 0;
    this._awayTeamScore = 0;
  }

  private _status: MatchStates;
  private _startTime?: Date;
  private _endTime?: Date;
  private _lastUpdate?: Date;
  private _homeTeamScore: number;
  private _awayTeamScore: number;

  public start(): Result {
    if (this._status != MatchStates.None) {
      return Result.Fail('Invalid _status. Create another match to start.');
    }

    this._startTime = new Date();
    this._status = MatchStates.Started;

    return Result.Success();
  }

  public finish(): ValueResult<CompletedMatchResult> {
    if (this._status != MatchStates.Started) {
      return Result.FailValue('A not started match is not able to get end!');
    }

    this._endTime = new Date();
    const duration = moment.duration(moment(this._endTime).diff(moment(this._startTime)));

    var result = new CompletedMatchResult(
      this.homeTeam,
      this.awayTeam,
      this._homeTeamScore,
      this._awayTeamScore,
      duration.asMilliseconds()
    );

    this._status = MatchStates.Ended;

    this.emit('finished', result);

    return Result.SuccessValue(result);
  }

  public cancel(reason: CancelationReasons, note: string): ValueResult<CanceledMatchResult> {
    if (this._status != MatchStates.Started) {
      return Result.FailValue('A not started match is not able to get canceled!');
    }

    var result = new CanceledMatchResult(this.homeTeam, this.awayTeam, reason, note);

    this._endTime = new Date();
    this._status = MatchStates.Canceled;

    this.emit('canceled', result);

    return Result.SuccessValue(result);
  }

  public updateScore(_homeTeamScore: number, _awayTeamScore: number): Result {
    if (
      _homeTeamScore < 0 ||
      _homeTeamScore < this._homeTeamScore ||
      _awayTeamScore < 0 ||
      _awayTeamScore < this._awayTeamScore
    ) {
      return Result.Fail(
        'Score invalid value! Score could not be negative or less than the previous value!'
      );
    }
    if (this._status != MatchStates.Started) {
      return Result.Fail('Score could get updated just after starting a match.');
    }

    this._homeTeamScore = _homeTeamScore;
    this._awayTeamScore = _awayTeamScore;

    this._lastUpdate = new Date();

    this.emit('scoreUpdated', _homeTeamScore, _awayTeamScore);

    return Result.Success();
  }

  public isParticipated(team: Team): boolean {
    return this.homeTeam.Equals(team) || this.awayTeam.Equals(team);
  }

  public get totalScore(): number {
    return this._homeTeamScore + this._awayTeamScore;
  }

  public get status(): MatchStates {
    return this._status;
  }
  public get startTime(): Date | undefined {
    return this._startTime;
  }
  public get endTime(): Date | undefined {
    return this._endTime;
  }
  public get lastUpdate(): Date | undefined {
    return this._lastUpdate;
  }
  public get homeTeamScore(): number {
    return this._homeTeamScore;
  }
  public get awayTeamScore(): number {
    return this._awayTeamScore;
  }
}
