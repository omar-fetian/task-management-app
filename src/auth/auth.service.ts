import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials-dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
  private readonly pepper = process.env.PEPPER ?? '';
  private readonly saltRounds = parseInt(process.env.SALT_ROUNDS as string, 10);

  private async hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(
      password + this.pepper,
      this.saltRounds,
    );
    return hashedPassword;
  }

  private async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password + this.pepper, hashedPassword);
  }

  public async signUp(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;
    const hashedPassword = await this.hashPassword(password);
    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
    });

    try {
      await this.usersRepository.save(user);
      return 'User created successfully';
    } catch {
      throw new ConflictException('Username already exists');
    }
  }

  public async signIn(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.usersRepository.findOneBy({ username });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return 'Sign in successful';
  }
}
