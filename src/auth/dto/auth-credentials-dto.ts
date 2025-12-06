import { IsEnum, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { UserRole } from '../auth.models';

export class AuthCredentialsDto {
  @IsNotEmpty()
  @IsString()
  @Length(4, 20)
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 128)
  @Matches(/((^=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    // At least one digit OR one special character
    // At least one uppercase letter AND one lowercase letter
    message:
      'Password must be at least 8 characters long and contain at least one letter and one number',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(UserRole)
  role: UserRole;
}
