import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@auth/auth.module';
import { AuthMiddleware } from '@auth/auth.middleware';
import { PrismaService } from './prisma.service';
import { UsersModule } from '@users/users.module';
import { CreateAccountMiddleware } from '@users/users.register.middleware';
import { SalonsModule } from './salons/salons.module';
import { LocationsModule } from './locations/locations.module';


@Module({
  imports: [
    AuthModule,
    UsersModule,
    SalonsModule,
    LocationsModule
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService,
    PrismaService
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(AuthMiddleware)
      .forRoutes("api/v1/auth/login")
      .apply(CreateAccountMiddleware)
      .forRoutes("api/v1/users/create")
      .apply(CreateAccountMiddleware)
      .forRoutes("api/v1/salons/createspecialist")
  }
}
