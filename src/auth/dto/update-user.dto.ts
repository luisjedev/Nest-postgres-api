import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDT0 } from './create-user.dto';

export class UpdateUserDTO extends PartialType(CreateUserDT0) {}
