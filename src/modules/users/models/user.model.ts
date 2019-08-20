import { Model } from '@hungtcs-box/nest-nedb';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UserModel extends Model {

  @IsString()
  @IsNotEmpty()
  username?: string;

  @Exclude({ toPlainOnly: true })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password?: string;

  @Exclude({ toPlainOnly: true })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  passwordHash?: string;

  constructor(partial: Partial<UserModel>) {
    super();
    Object.assign(this, partial);
  }

}
