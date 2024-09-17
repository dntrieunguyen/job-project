import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtService } from './jwt-strategy/jwt.service'

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, JwtService]
})
export class AuthModule {}
