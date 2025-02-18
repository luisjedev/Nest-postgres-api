import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const RawHeaders = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    const headers = req.rawHeaders;

    if (!headers) {
      throw new InternalServerErrorException('Headers not found (request)');
    }

    return headers;
  },
);
