import { Injectable } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class JwtService {
  private readonly accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET
  private readonly refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET

  generateAccessToken(userId: string, email: string) {
    return jwt.sign({ userId, email }, this.accessTokenSecret, { expiresIn: '1h' })
  }

  generateRefreshToken(userId: string) {
    return jwt.sign({ userId }, this.refreshTokenSecret, { expiresIn: '7d' })
  }

  verifyAccessToken(token: string) {
    return jwt.verify(token, this.accessTokenSecret)
  }

  verifyRefreshToken(token: string) {
    return jwt.verify(token, this.refreshTokenSecret)
  }
}
