import moment from 'moment';
import { CancelationReasons } from '../cancelationReasons';
import { Match } from '../match';
import { MatchStates } from '../matchStates';
import { Result } from '../result';
import Team from '../team';

describe('testing Match', () => {
  it('start should run once', () => {
    const match = new Match(new Team({ id: 1, name: 'team1' }), new Team({ id: 2, name: 'team2' }));

    const firstResult = match.start();
    const secondResult = match.start();

    expect(firstResult.isSuccess).toBe(true);
    expect(secondResult.isSuccess).toBe(false);
    expect(match.status).toBe(MatchStates.Started);
  });

  it('finish should run once', () => {
    const match = new Match(new Team({ id: 1, name: 'team1' }), new Team({ id: 2, name: 'team2' }));

    var wasCalled = false;

    match.on('finished', () => {
      wasCalled = true;
    });

    const finishBeforeStart = match.finish();

    const startResult = match.start();

    const finish = match.finish();

    const secondFinish = match.finish();

    expect(startResult.isSuccess).toBe(true);
    expect(wasCalled).toBe(true);
    expect(finish.isSuccess).toBe(true);
    expect(secondFinish.isSuccess).toBe(false);
    expect(finishBeforeStart.isSuccess).toBe(false);
  });

  it('cancel should run once', () => {
    const match = new Match(new Team({ id: 1, name: 'team1' }), new Team({ id: 2, name: 'team2' }));

    const STORM: string = 'STORM';
    var wasCalled = false;

    match.on('canceled', () => {
      wasCalled = true;
    });

    const cancelBeforeStart = match.cancel(CancelationReasons.NaturalDisaster, STORM);

    const startResult = match.start();

    const cancel = match.cancel(CancelationReasons.NaturalDisaster, STORM);

    const secondCancel = match.cancel(CancelationReasons.NaturalDisaster, STORM);

    expect(startResult.isSuccess).toBe(true);
    expect(wasCalled).toBe(true);
    expect(cancel.isSuccess).toBe(true);
    expect(cancel.value?.note).toBe(STORM);
    expect(cancel.value?.cancelationReason).toBe(CancelationReasons.NaturalDisaster);
    expect(secondCancel.isSuccess).toBe(false);
    expect(cancelBeforeStart.isSuccess).toBe(false);
  });

  it('update should work fine', () => {
    const match = new Match(new Team({ id: 1, name: 'team1' }), new Team({ id: 2, name: 'team2' }));
    var wasCalled = false;
    match.on('scoreUpdated', () => {
      wasCalled = true;
    });

    const updateBeforeStart = match.updateScore(1, 1);

    const startResult = match.start();

    const secondUpdate = match.updateScore(2, 3);

    const thirdUpdate = match.updateScore(2, 3);

    const invalid_updates: Result[] = [
      match.updateScore(-2, 3),
      match.updateScore(2, -3),
      match.updateScore(1, 3),
      match.updateScore(2, 2),
    ];

    match.finish();

    const fourthUpdate = match.updateScore(4, 5);

    expect(startResult.isSuccess).toBe(true);
    expect(wasCalled).toBe(true);
    expect(secondUpdate.isSuccess).toBe(true);
    expect(thirdUpdate.isSuccess).toBe(true);
    expect(match.homeTeamScore).toBe(2);
    expect(match.awayTeamScore).toBe(3);
    expect(updateBeforeStart.isSuccess).toBe(false);
    expect(fourthUpdate.isSuccess).toBe(false);
    expect(invalid_updates).toEqual(
      expect.arrayContaining([expect.objectContaining({ isSuccess: false })])
    );
  });

  it('should save finish time', async () => {
    const match = new Match(new Team({ id: 1, name: 'team1' }), new Team({ id: 2, name: 'team2' }));

    const startResult = match.start();

    await sleep(1000);

    match.finish();

    const endTime = moment(match.endTime);
    const startTime = moment(match.startTime);

    expect(startResult.isSuccess).toBe(true);
    expect(endTime.diff(startTime)).toBeGreaterThanOrEqual(1000);
  });

  function sleep(ms: number): Promise<void> {
    return new Promise<void>(
      (resolve: (value: void | PromiseLike<void>) => void, reject: (reason?: any) => void) => {
        setTimeout(() => {
          resolve();
        }, ms);
      }
    );
  }
});
