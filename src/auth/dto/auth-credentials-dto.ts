import { IsNotEmpty, IsString, Length } from 'class-validator';
export class AuthCredentialsDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 64)
  password: string;
}
