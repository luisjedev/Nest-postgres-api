import { Injectable } from '@nestjs/common';
import { CreateUserDT0 } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import to from 'src/common/helpers/try-catch.helper';
import { handleDBExceptions } from 'src/common/helpers/handle-db-exception.helper';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDTO: CreateUserDT0) {
    const user = this.userRepository.create(createUserDTO);

    const [error, data] = await to(this.userRepository.save(user));

    if (error) {
      handleDBExceptions(error);
    }

    return data;
  }
}
