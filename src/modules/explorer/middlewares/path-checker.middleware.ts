import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class PathCheckerMiddleware implements NestMiddleware {

  public use(req: any, res: any, next: () => void) {
    next();
  }

}
