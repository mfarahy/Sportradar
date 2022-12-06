export class Result {
  constructor(public readonly isSuccess: boolean, public readonly message: string) {}

  public static Success(): SuccessResult {
    return new SuccessResult();
  }

  public static SuccessValue<T>(value: T): SuccessValueResult<T> {
    return new SuccessValueResult(value);
  }

  public static FailValue<T>(error: string): ErrorValueResult<T> {
    return new ErrorValueResult(error);
  }

  public static Fail(error: string): ErrorResult {
    return new ErrorResult(error);
  }
}

export abstract class ValueResult<T> extends Result {
  constructor(
    public readonly value: T | undefined,
    public readonly isSuccess: boolean,
    public readonly message: string
  ) {
    super(isSuccess, message);
  }
}

export class SuccessResult extends Result {
  constructor() {
    super(true, '');
  }
}

export class SuccessValueResult<T> extends ValueResult<T> {
  constructor(value: T) {
    super(value, true, '');
  }
}

export class ErrorResult extends Result {
  constructor(error: string) {
    super(false, error);
  }
}

export class ErrorValueResult<T> extends ValueResult<T> {
  constructor(error: string) {
    super(undefined, false, error);
  }
}
