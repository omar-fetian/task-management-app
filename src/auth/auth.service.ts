import { Injectable, ConflictException } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials-dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async signUp(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = this.usersRepository.create({ username, password });

    try {
      await this.usersRepository.save(user);
      return 'User created successfully';
    } catch (error) {
      //this code needs to be improved later to handle different error codes
      console.log(error);
      throw new ConflictException('Username already exists');
    }
  }
}
