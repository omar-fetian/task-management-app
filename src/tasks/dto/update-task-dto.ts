import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { TaskStatus } from '../task.models';

export class UpdateTaskDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  title?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(3, 500)
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
