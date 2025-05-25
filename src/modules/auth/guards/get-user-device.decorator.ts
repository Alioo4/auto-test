import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const DeviceId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['deviceId'] || request.headers['device-id'];
  },
);