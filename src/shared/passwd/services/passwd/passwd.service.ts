import bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswdService {

  public async generateHash(password: string) {
    return bcrypt.hash(password, 10);
  }

  public async validatePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

}
