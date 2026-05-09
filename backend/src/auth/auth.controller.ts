import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { Roles } from './decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: { id: number; email: string; role: string }) {
    return user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('GESTOR')
  @Get('gestor-only')
  gestorOnly() {
    return { message: 'Acesso permitido para gestor' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('FUNCIONARIO')
  @Get('funcionario-only')
  funcionarioOnly() {
    return { message: 'Acesso permitido para funcionário' };
  }
}
