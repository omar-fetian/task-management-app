import { IsNotEmpty, IsString, Length } from 'class-validator';
export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 500)
  description: string;
}
