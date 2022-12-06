export default class Team {
  public name: string;
  public id: number;

  constructor(init: Partial<Team> | undefined) {
    this.name = init?.name ?? '';
    this.id = init?.id ?? 0;
  }

  public Equals(other: Team): boolean {
    if (other == null) return false;
    return this.id == other.id;
  }
}
