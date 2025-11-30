import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task-dto';
import { UpdateTaskDto } from './dto/update-task-dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  public async getTasks(filterDto?: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto || {};
    const query = this.tasksRepository.createQueryBuilder('task');
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }
    query.orderBy('task.createdAt', 'DESC');
    return await query.getMany();
  }

  public async getTaskById(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  public async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.tasksRepository.create({
      title,
      description,
    });
    await this.tasksRepository.save(task);
    return task;
  }

  public async deleteTask(id: string): Promise<string> {
    const result = await this.tasksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return `Task with id ${id} has been deleted`;
  }

  public async updateTask(
    id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.tasksRepository.preload({
      id,
      ...updateTaskDto,
    });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    await this.tasksRepository.save(task);
    return task;
  }
}
