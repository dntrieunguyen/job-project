import { BadRequestException, ConflictException, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { PrismaService } from '~/prisma/prisma.service'
import { genSaltSync, hashSync } from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const salt = genSaltSync(10)
    const hashedPassword = await hashSync(createUserDto.password, salt)

    const checkUserUnique = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email
      }
    })

    if (checkUserUnique) {
      throw new ConflictException('Email is exist')
    }
    if (createUserDto.phone && createUserDto.phone.length > 0) {
      const checkPhoneNumber = await this.prisma.user.findFirst({
        where: { phone: createUserDto.phone }
      })

      if (checkPhoneNumber) throw new ConflictException('Phone has been used')
    }

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword
      }
    })

    return user
  }

  findAll() {
    return `This action returns all users`
  }

  findOne(id: number) {
    return `This action returns a #${id} user`
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`
  }

  async deleteUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id
      }
    })

    if (!user) throw new BadRequestException('User not found')

    // Xóa người dùng
    await this.prisma.user.delete({
      where: { id }
    })

    return { message: `User with ID #${id} has been removed successfully.` }
  }
}
