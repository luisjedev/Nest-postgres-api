import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

export function handleDBExceptions(error: any) {
  if (error.code === '23505') {
    throw new BadRequestException(error.detail);
  }
  this.logger.error(error);
  throw new InternalServerErrorException('Unexpected error, check server logs');
}
