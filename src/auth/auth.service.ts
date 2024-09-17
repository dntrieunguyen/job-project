import { Injectable, UnauthorizedException } from '@nestjs/common'
import { compareSync } from 'bcrypt'
import { PrismaService } from '~/prisma/prisma.service'
import { JwtService } from './jwt-strategy/jwt.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService
  ) {}

  async login(payload) {
    const user = await this.prisma.user.findUnique({
      where: { email: payload.email }
    })

    if (!user) throw new UnauthorizedException('User not found')

    const checkPassword = compareSync(payload.password, user.password)

    if (!checkPassword) throw new UnauthorizedException('Password is not true')

    const accessToken = this.jwt.generateAccessToken(user.id, user.email)
    const refreshToken = this.jwt.generateRefreshToken(user.id)

    return { accessToken, refreshToken, user }
  }
}
