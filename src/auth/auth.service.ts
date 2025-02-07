import { Injectable } from '@nestjs/common';
import { CreateUserDT0, UpdateUserDTO } from './dto';

@Injectable()
export class AuthService {
  create(createUserDTO: CreateUserDT0) {
    return createUserDTO;
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: string) {
    return `This action returns a #${id} auth`;
  }

  update(id: string, updateUserDTO: UpdateUserDTO) {
    return updateUserDTO;
  }

  remove(id: string) {
    return `This action removes a #${id} auth`;
  }
}
