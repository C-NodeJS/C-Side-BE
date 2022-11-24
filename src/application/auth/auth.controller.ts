import { AuthService } from './auth.service';
import { RegisterRequestDTO } from './dto/register.dto';
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import {
  ApiResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginRequestDTO } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  @ApiResponse({ status: 1000, description: 'Success!' })
  @ApiResponse({ status: 9001, description: 'Failed' })
  async register(@Body() payload: RegisterRequestDTO): Promise<any> {
    return await this.authService.register(payload);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOkResponse({ description: 'Login success' })
  @ApiUnauthorizedResponse({ description: 'Login fail' })
  async login(@Body() loginRequestDto: LoginRequestDTO): Promise<any> {
    return await this.authService.login(loginRequestDto);
  }
}
