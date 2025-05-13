import { CanActivate, ExecutionContext, Injectable, BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { HeadersDataDto } from 'src/modules/auth/dto';

@Injectable()
export class DeviceHeadersGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const headers = request.headers;

        const deviceDto = plainToInstance(HeadersDataDto, headers);
        const errors = validateSync(deviceDto);

        if (errors.length > 0) {
            throw new BadRequestException(errors);
        }

        request.userDevice = deviceDto;
        return true;
    }
}
