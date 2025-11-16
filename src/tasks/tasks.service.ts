import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
  private tasks = ['Task 1', 'Task 2', 'Task 3'];

  getAllTasks() {
    return this.tasks;
  }
}
