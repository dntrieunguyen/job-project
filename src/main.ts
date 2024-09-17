import { AppModule } from './app.module'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import * as cookieParser from 'cookie-parser'
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common'
import { AllExceptionsFilter } from './interceptor/all-exceptions.filter'
import { GlobalResponseInterceptor } from './interceptor/global-response.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const configService = app.get(ConfigService)
  const PORT = configService.get('PORT')
  app.useGlobalInterceptors(new GlobalResponseInterceptor())
  app.useGlobalFilters(new AllExceptionsFilter())
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors = []) => {
        return new HttpException(
          {
            message: 'Validation failed',
            errors: validationErrors
          },
          HttpStatus.BAD_REQUEST
        )
      }
    })
  )

  app.use(cookieParser())
  await app.listen(PORT)
}
bootstrap()
