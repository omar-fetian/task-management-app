import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { TaskStatus } from '../task.models';

export class GetTasksFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  @Length(3, 100)
  search?: string;
}
