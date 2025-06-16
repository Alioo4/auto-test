import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import {
    LoginAuthDto,
    RegisterAuthDto,
    ChangingRoleDto,
    ChangePasswordDto,
    GetAllUsersQuery,
} from './dto';
import { Role } from '@prisma/client';
import { PromoService } from '../promo-code/promo-code.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
        private readonly configService: ConfigService,
        private readonly promoCode: PromoService,
    ) {}

    async register(registerAuthDto: RegisterAuthDto, deviceId: string) {
        const { email, phone, password } = registerAuthDto;

        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [{ email }, { phone }],
            },
        });

        if (existingUser) {
            if (existingUser.phone === phone) {
                throw new BadRequestException({
                    message: 'Phone number already exists',
                    code: 1,
                });
            }
            if (existingUser.email === email) {
                throw new BadRequestException({
                    message: 'Email already exists',
                    code: 2,
                });
            }
        }

        const hashedPass = await this.hashPass(password);

        const device = await this.prisma.device.findUnique({
            where: { deviceId: deviceId },
            select: {
                deviceId: true,
                userId: true,
            },
        });

        if (!device?.userId) {
            const user = await this.prisma.user.create({
                data: {
                    ...registerAuthDto,
                    password: hashedPass,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });

            const token = await this.getToken(user.id, user.role);

            await this.prisma.device.update({
                where: { deviceId: deviceId },
                data: { userId: user.id },
            });

            return {
                message: 'User registered successfully',
                data: { user, token },
            };
        } else {
            throw new BadRequestException({
                message: 'This device account is already registered!!!',
                code: 3,
            });
        }
    }

    async login(loginAuthDto: LoginAuthDto, deviceId: string) {
        const checkPhone = await this.prisma.user.findUnique({
            where: { phone: loginAuthDto.phone },
            select: {
                id: true,
                name: true,
                password: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!checkPhone) {
            throw new NotFoundException('Phone number not found');
        }

        const checkPass = await this.comparePass(loginAuthDto.password, checkPhone.password);

        if (!checkPass) {
            throw new BadRequestException({
                message: 'Phone number or password is incorrect',
                code: 4,
            });
        }

        const findDevice = await this.prisma.device.findUnique({
            where: { deviceId: deviceId },
            select: {
                deviceId: true,
                userId: true,
            },
        });

        if(!findDevice?.userId) {
            await this.prisma.device.update({
                where: {deviceId: deviceId},
                data: {
                    userId: checkPhone.id
                }
            })
        } else if( findDevice.userId !== checkPhone.id ) {
            throw new BadRequestException({
                message: 'This device is already registered with another account',
                code: 5,
            })
        }

        const token = await this.getToken(checkPhone.id, checkPhone.role);

        return { message: 'User logged in successfully', data: { token, user: checkPhone } };
    }

    async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
        const findUser = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                password: true,
            },
        });

        if (!findUser) {
            throw new NotFoundException({
                message: 'User not found',
                code: 6,
            });
        }
        const checkPass = await this.comparePass(changePasswordDto.oldPassword, findUser.password);
        if (!checkPass) {
            throw new BadRequestException({
                message: 'Old password is incorrect',
                code: 7,
            });
        }
        const hashedPass = await this.hashPass(changePasswordDto.newPassword);
        await this.prisma.user.update({
            where: { id: findUser.id },
            data: { password: hashedPass },
        });
        return { message: 'Password changed successfully' };
    }

    async getUserInfo(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                devices: true,
                promoCodes: true,
            }
        });

        if (!user) {
            throw new NotFoundException({
                message: 'User not found',
                code: 6,
            });
        }

        return { message: 'User info retrieved successfully', data: user };
    }

    async changingRole(changingRoleDto: ChangingRoleDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: changingRoleDto.userId },
            select: {
                id: true,
            },
        });

        if (!user) {
            throw new NotFoundException({
                message: 'User not found',
                code: 6,
            });
        }

        const updatedUser = await this.prisma.user.update({
            where: { id: changingRoleDto.userId },
            data: { role: changingRoleDto.newRole as Role },
        });

        return { message: 'User role changed successfully', data: updatedUser };
    }

    async getAllUsers(query: GetAllUsersQuery) {
        const { page = 1, limit = 10 } = query;

        const users = await this.prisma.user.findMany({
            skip: Number((Number(page) - 1) * Number(limit)),
            take: Number(limit),
            where: {
                OR: [
                    { name: { contains: query.search || '', mode: 'insensitive' } },
                    { email: { contains: query.search || '', mode: 'insensitive' } },
                    { phone: { contains: query.search || '', mode: 'insensitive' } },
                ],
            },
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                devices: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        const totalUsers = await this.prisma.user.count();

        return {
            message: 'Users retrieved successfully',
            data: {
                users,
                totalUsers,
                currentPage: page,
                totalPages: Math.ceil(totalUsers / Number(limit)),
            },
        };
    }

    async logout(userId: string, deviceId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
            },
        });

        if (!user) {
            throw new NotFoundException({
                message: 'User not found',
                code: 6,
            });
        }

        const device = await this.prisma.device.findUnique({
            where: { deviceId: deviceId },
        });

        if (!device) {
            throw new NotFoundException({
                message: 'Device not found',
                code: 8,
            });
        }

        await this.prisma.device.update({
            where: { deviceId: deviceId },
            data: { userId: null },
        });

        return { message: 'User logged out successfully' };
    }

    //Helper functions
    private async hashPass(pass: string) {
        return await hash(pass, 12);
    }

    public async verifyToken(token: string) {
        try {
            const decoded = await this.jwt.verifyAsync(token, {
                secret: this.configService.get<string>('JWT_SECRET'),
            });

            return decoded;
        } catch (error) {
            throw new UnauthorizedException({
                message: 'Invalid token',
                code: 9,
            });
        }
    }

    private async comparePass(pass: string, hash: string) {
        return await compare(pass, hash);
    }

    private async getToken(userId: string, role: string) {
        return await this.jwt.signAsync(
            { sub: userId, role: role },
            {
                secret: this.configService.get<string>('JWT_SECRET'),
                expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
            }
        );
    }
}
