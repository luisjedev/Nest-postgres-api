import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { handleDBExceptions } from 'src/common/helpers/handle-db-exception.helper';
import to from 'src/common/helpers/try-catch.helper';
import * as bcrypt from 'bcrypt';

import { Repository } from 'typeorm';
import { CreateUserDT0, LoginUserDTO } from './dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDTO: CreateUserDT0) {
    const { password, ...userData } = createUserDTO;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      password: hashedPassword,
      ...userData,
    });

    const [error, data] = await to(this.userRepository.save(user));
    if (error) handleDBExceptions(error);

    delete user.password;
    return data;
    //TODO: Implement JWT token generation logic
  }

  async login(loginUserDTO: LoginUserDTO) {
    const { email, password } = loginUserDTO;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true },
    });

    if (!user || !bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Invalid credentials');

    return 'sesión iniciada';
    //TODO: Implement JWT token generation logic
  }
}
