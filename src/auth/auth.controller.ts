import { LoginDto } from './dto/login-user.dto'
import { Body, Controller, Post, Res } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Request, Response } from 'express'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { accessToken, refreshToken, user } = await this.authService.login(loginDto)

    res.setHeader('Authorization', `Bearer ${accessToken}`)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.json({ accessToken, user })
  }
}
