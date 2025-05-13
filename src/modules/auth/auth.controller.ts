import { Controller, Post, Body, Headers, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
    HeadersDataDto,
    LoginAuthDto,
    RegisterAuthDto,
    ChangingRoleDto,
    ChangePasswordDto,
    GetAllUsersQuery,
} from './dto';
import { User } from './guards/get-user-id.decorator';
import { Public, Roles } from './guards';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiTags('Auth')
@ApiBearerAuth('access_token')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'User registration' })
    @ApiBody({ type: RegisterAuthDto })
    register(@Body() registerAuthDto: RegisterAuthDto, @Headers() headerData: HeadersDataDto) {
        return this.authService.register(registerAuthDto, 'deviceId');
    }

    @Public()
    @Post('signin')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'User login' })
    @ApiBody({ type: LoginAuthDto })
    login(@Body() loginAuthDto: LoginAuthDto) {
        return this.authService.login(loginAuthDto);
    }

    @Post('change-password')
    @HttpCode(HttpStatus.OK)
    @Roles('USER', 'ADMIN', 'SUPER_ADMIN')
    @ApiOperation({ summary: 'Change current user password' })
    @ApiBody({ type: ChangePasswordDto })
    changePassword(@Body() dto: ChangePasswordDto, @User('sub') userId: string) {
        return this.authService.changePassword(userId, dto);
    }

    @Get('user-info')
    @HttpCode(HttpStatus.OK)
    @Roles('USER', 'ADMIN', 'SUPER_ADMIN')
    @ApiOperation({ summary: 'Get current user info' })
    getUserInfo(@User('sub') userId: string) {
        return this.authService.getUserInfo(userId);
    }

    @Post('changing-role')
    @HttpCode(HttpStatus.OK)
    @Roles('SUPER_ADMIN')
    @ApiOperation({ summary: "Change another user's role (SUPER_ADMIN only)" })
    @ApiBody({ type: ChangingRoleDto })
    changingRole(@Body() dto: ChangingRoleDto) {
        return this.authService.changingRole(dto);
    }

    @Get('get-all-users')
    @HttpCode(HttpStatus.OK)
    @Roles('SUPER_ADMIN', 'ADMIN')
    @ApiOperation({ summary: 'Get all users (admin only)' })
    @ApiQuery({ name: 'search', required: false, type: String })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    getAllUsers(@Query() query: GetAllUsersQuery) {
        return this.authService.getAllUsers(query);
    }
}
