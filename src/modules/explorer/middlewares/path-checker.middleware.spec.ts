import { PathCheckerMiddleware } from './path-checker.middleware';

describe('PathCheckerMiddleware', () => {
  it('should be defined', () => {
    expect(new PathCheckerMiddleware()).toBeDefined();
  });
});
