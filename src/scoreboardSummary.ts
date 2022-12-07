import { Match } from './match';

export default class ScoreboardSummary {
  public constructor(public readonly matches: ReadonlyArray<Match>) {
    this._snapshotTime = new Date();
  }

  private _snapshotTime: Date;

  public get snapshotTime(): Date {
    return this._snapshotTime;
  }

  public toString(): string {
    var result: string[] = [];

    this.matches.forEach((x) => result.push(x.toString()));

    return result.join('');
  }
}
