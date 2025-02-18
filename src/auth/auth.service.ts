import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { handleDBExceptions } from 'src/common/helpers/handle-db-exception.helper';
import to from 'src/common/helpers/try-catch.helper';
import * as bcrypt from 'bcrypt';

import { Repository } from 'typeorm';
import { CreateUserDT0, LoginUserDTO } from './dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { decrypt, encrypt } from './lib/encrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDTO: CreateUserDT0) {
    const { password, ...userData } = createUserDTO;

    const hashedPassword = encrypt(password);

    const user = this.userRepository.create({
      password: hashedPassword,
      ...userData,
    });

    const [error, data] = await to(this.userRepository.save(user));
    if (error) handleDBExceptions(error);

    delete user.password;
    return {
      ...user,
      token: this.getJwtToken({
        id: user.id,
      }),
    };
  }

  async login(loginUserDTO: LoginUserDTO) {
    const { email, password } = loginUserDTO;

    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        email: true,
        password: true,
        id: true,
        fullName: true,
        roles: true,
      },
    });

    if (!user || !decrypt(password, user.password))
      throw new UnauthorizedException('Invalid credentials');

    return {
      ...user,
      token: this.getJwtToken({
        id: user.id,
      }),
    };
  }

  async checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({
        id: user.id,
      }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
