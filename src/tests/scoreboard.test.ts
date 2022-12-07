import { CancelationReasons } from '../cancelationReasons';
import { MatchBuilder } from '../matchBuilder';
import { Result } from '../result';
import Scoreboard from '../scoreboard';
import Team from '../team';

describe('checking scoreboard class', () => {
  const team1 = new Team({ id: 1, name: 'team1' }),
    team2 = new Team({ id: 2, name: 'team2' }),
    team3 = new Team({ id: 3, name: 'team3' });

  it('should create method', () => {
    const scoreboard = new Scoreboard(new MatchBuilder());

    const sameTeam = scoreboard.create(team1, team1);
    const successCreation = scoreboard.create(team1, team2);
    const firstRepetitive = scoreboard.create(team1, team2);
    const secondRepetitive = scoreboard.create(team2, team1);
    const homeRepetitive = scoreboard.create(team1, team3);
    const awayRepetitive = scoreboard.create(team3, team2);

    expect(sameTeam.isSuccess).toBe(false);
    expect(successCreation.isSuccess).toBe(true);
    expect(firstRepetitive.isSuccess).toBe(false);
    expect(secondRepetitive.isSuccess).toBe(false);
    expect(homeRepetitive.isSuccess).toBe(false);
    expect(awayRepetitive.isSuccess).toBe(false);
  });

  it('should finish match', () => {
    const scoreboard = new Scoreboard(new MatchBuilder());

    const creationResult = scoreboard.create(team1, team2);
    const match = creationResult.value!;
    const isMatchOnBoard = scoreboard.onlineMatches.indexOf(match) >= 0;
    match.finish();
    const isMatchRemainOnBoardAfterFinishing = scoreboard.onlineMatches.indexOf(match) >= 0;

    expect(creationResult.isSuccess).toBe(true);
    expect(isMatchOnBoard).toBe(true);
    expect(isMatchRemainOnBoardAfterFinishing).toBe(false);
  });

  it('should cancel match', () => {
    const scoreboard = new Scoreboard(new MatchBuilder());

    const creationResult = scoreboard.create(team1, team2);
    const match = creationResult.value!;
    const isMatchOnBoard = scoreboard.onlineMatches.indexOf(match) >= 0;
    match.cancel(CancelationReasons.NaturalDisaster, 'SOME REASON');
    const isMatchRemainOnBoardAfterFinishing = scoreboard.onlineMatches.indexOf(match) >= 0;

    expect(creationResult.isSuccess).toBe(true);
    expect(isMatchOnBoard).toBe(true);
    expect(isMatchRemainOnBoardAfterFinishing).toBe(false);
  });

  it('should return correct summary', () => {
    const scoreboard = new Scoreboard(new MatchBuilder());

    var MexicoCanada = scoreboard.create(
      new Team({ id: 1, name: 'Mexico' }),
      new Team({ id: 2, name: 'Canada' })
    );
    MexicoCanada.value!.updateScore(0, 5);
    var SpainBrazil = scoreboard.create(
      new Team({ id: 3, name: 'Spain' }),
      new Team({ id: 4, name: 'Brazil' })
    );
    SpainBrazil.value!.updateScore(10, 2);
    var GermanyFrance = scoreboard.create(
      new Team({ id: 5, name: 'Germany' }),
      new Team({ id: 6, name: 'France' })
    );
    GermanyFrance.value!.updateScore(2, 2);
    var UruguayItaly = scoreboard.create(
      new Team({ id: 7, name: 'Uruguay' }),
      new Team({ id: 8, name: 'Italy' })
    );
    UruguayItaly.value!.updateScore(6, 6);
    var ArgentinaAustralia = scoreboard.create(
      new Team({ id: 9, name: 'Argentina' }),
      new Team({ id: 10, name: 'Australia' })
    );
    ArgentinaAustralia.value!.updateScore(3, 1);
    var summary = scoreboard.getSummary();
    var summaryArray = summary.matches;

    expect(MexicoCanada.isSuccess).toBe(true);
    expect(SpainBrazil.isSuccess).toBe(true);
    expect(GermanyFrance.isSuccess).toBe(true);
    expect(UruguayItaly.isSuccess).toBe(true);
    expect(ArgentinaAustralia.isSuccess).toBe(true);
    expect(summaryArray[0]).toBe(UruguayItaly.value);
    expect(summaryArray[1]).toBe(SpainBrazil.value);
    expect(summaryArray[2]).toBe(MexicoCanada.value);
    expect(summaryArray[3]).toBe(ArgentinaAustralia.value);
    expect(summaryArray[4]).toBe(GermanyFrance.value);
  });

  it('should return correct message if cannot create match', () => {
    const scoreboard = new Scoreboard({
      createMatch: jest.fn().mockReturnValue({
        start: jest.fn().mockReturnValue(Result.Fail('ERROR-MESSAGE')),
        on: jest.fn(),
      }),
    });
    scoreboard;

    var createResult = scoreboard.create(team1, team2);

    expect(createResult).toEqual(
      expect.objectContaining({
        isSuccess: false,
        message: 'ERROR-MESSAGE',
      })
    );
  });

  it('should return correct message if cannot create update score', () => {
    const scoreboard = new Scoreboard({
      createMatch: jest.fn().mockReturnValue({
        start: jest.fn().mockReturnValue({ isSuccess: true }),
        updateScore: jest.fn().mockReturnValue(Result.Fail('ERROR-MESSAGE')),
        on: jest.fn(),
      }),
    });
    scoreboard;

    var createResult = scoreboard.create(team1, team2);

    expect(createResult).toEqual(
      expect.objectContaining({
        isSuccess: false,
        message: 'ERROR-MESSAGE',
      })
    );
  });

  it('should clear board', () => {
    const scoreboard = new Scoreboard(new MatchBuilder());

    var mexicoCanada = scoreboard.create(
      new Team({ id: 1, name: 'Mexico' }),
      new Team({ id: 2, name: 'Canada' })
    );

    var spainBrazil = scoreboard.create(
      new Team({ id: 3, name: 'Spain' }),
      new Team({ id: 4, name: 'Brazil' })
    );

    scoreboard.clearBoard();

    expect(mexicoCanada.isSuccess).toBe(true);
    expect(spainBrazil.isSuccess).toBe(true);
    expect(scoreboard.onlineMatches).toHaveLength(0);
  });
});
