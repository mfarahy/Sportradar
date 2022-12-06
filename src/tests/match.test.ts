import moment from 'moment';
import { CancelationReasons } from '../cancelationReasons';
import Match from '../match';
import { MatchStates } from '../matchStates';
import Team from '../team';

describe('testing Match', () => {
  it('start should run once', () => {
    const match = new Match(new Team({ id: 1, name: 'team1' }), new Team({ id: 2, name: 'team2' }));

    var firstResult = match.start();
    var secondResult = match.start();

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

    var finishBeforeStart = match.finish();

    var startResult = match.start();

    var finish = match.finish();

    var secondFinish = match.finish();

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

    var cancelBeforeStart = match.cancel(CancelationReasons.NaturalDisaster, STORM);

    var startResult = match.start();

    var cancel = match.cancel(CancelationReasons.NaturalDisaster, STORM);

    var secondCancel = match.cancel(CancelationReasons.NaturalDisaster, STORM);

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

    var updateBeforeStart = match.updateScore(1, 1);

    var startResult = match.start();

    var secondUpdate = match.updateScore(2, 3);

    var thirdUpdate = match.updateScore(2, 3);

    var invalid_updates = [
      match.updateScore(-2, 3),
      match.updateScore(2, -3),
      match.updateScore(1, 3),
      match.updateScore(2, 2),
    ];

    match.finish();

    var fourthUpdate = match.updateScore(4, 5);

    var lastUpdate = moment(match.lastUpdate);
    var startTime = moment(match.startTime);

    expect(startResult.isSuccess).toBe(true);
    expect(wasCalled).toBe(true);
    expect(secondUpdate.isSuccess).toBe(true);
    expect(thirdUpdate.isSuccess).toBe(true);
    expect(match.homeTeamScore).toBe(2);
    expect(match.awayTeamScore).toBe(3);
    expect(lastUpdate.diff(startTime)).toBeGreaterThanOrEqual(0);
    expect(updateBeforeStart.isSuccess).toBe(false);
    expect(fourthUpdate.isSuccess).toBe(false);
    expect(invalid_updates).toEqual(
      expect.arrayContaining(expect.objectContaining({ isSuccess: false }))
    );
  });
});
