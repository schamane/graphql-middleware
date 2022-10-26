import { Strategy } from 'passport';

const DEFAULT_USER_ID = 'local@sec';
export const MOCK_STRATEGY = 'mock';

export type MockVerifyFunction = (username: string, done: (error: unknown, user?: unknown) => void) => unknown;

export const LocalUser = {
  id: DEFAULT_USER_ID,
  groups: []
};

export class MockStrategy extends Strategy {
  public name?: string;
  private mockVerify: MockVerifyFunction;

  public constructor(verify: MockVerifyFunction, name?: string) {
    super();
    this.name = name || MOCK_STRATEGY;
    this.mockVerify = verify;
  }

  public authenticate(): void {
    this.mockVerify(DEFAULT_USER_ID, this.verified.bind(this));
  }

  private verified(err: unknown, user?: Record<string, unknown>): void {
    if (err) {
      return this.error(err);
    } else if (!user) {
      return this.fail('no user');
    }
    return this.success(user);
  }
}
