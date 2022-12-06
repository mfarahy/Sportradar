export class Result {
  constructor(public readonly isSuccess: boolean, public readonly message: string) {}

  public static Success(): SuccessResult {
    return new SuccessResult();
  }

  public static SuccessValue<T>(value: T): SuccessValueResult<T> {
    return new SuccessValueResult(value);
  }

  public static Fail(error: string): ErrorResult {
    return new ErrorResult(error);
  }
}

export class SuccessResult extends Result {
  constructor() {
    super(true, '');
  }
}

export class SuccessValueResult<T> extends SuccessResult {
  constructor(public readonly value: T) {
    super();
  }
}

export class ErrorResult extends Result {
  constructor(error: string) {
    super(false, error);
  }
}

export type ValueResult<T> = SuccessValueResult<T> | ErrorResult;
