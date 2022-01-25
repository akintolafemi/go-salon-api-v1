import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [
    JwtModule.register({ 
      secret: `${process.env.JWT_SECRET}`, 
      signOptions: { expiresIn: '24hrs' } 
    }),
  ],
  controllers: [
    AuthController
  ],
  providers: [
    AuthService,
    PrismaService
  ],
  exports: [
    AuthService
  ]
})
export class AuthModule {}
