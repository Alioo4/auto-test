import { CanActivate, ExecutionContext, Injectable, BadRequestException } from '@nestjs/common';
import { Os } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { HeadersDataDto } from 'src/modules/auth/dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class DeviceHeadersGuard implements CanActivate {
    constructor(private readonly prisma: PrismaService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const headers = request.headers;
    
        const deviceDto = plainToInstance(HeadersDataDto, headers);
        const errors = validateSync(deviceDto);
    
        if (errors.length > 0) {
            throw new BadRequestException(errors);
        }
    
        await this.saveDeviceInDb(deviceDto);
        request.userDevice = deviceDto;
        return true;
    }
    

    private async saveDeviceInDb(data: HeadersDataDto): Promise<void> {
        const {
            deviceId,
            deviceName,
            os,
            osVersion,
            deviceToken,
            manufacturer,
            model,
            appBuild,
            appName,
            appVersion,
            appVersionCode,
            appVersionName,
        } = data;

        await this.prisma.device.upsert({
            where: { deviceId },
            update: {},
            create: {
                os: os.toLowerCase() === 'ios' ? Os.IOS : Os.ANDROID,
                deviceId: deviceId,
                deviceName: deviceName,
                osVersion: osVersion,
                deviceToken: deviceToken,
                manufacturer: manufacturer,
                model: model,
                appBuild: appBuild,
                appName: appName,
                appVersion: appVersion,
                appVersionCode: appVersionCode,
                appVersionName: appVersionName,
            },
        });
    }
}
