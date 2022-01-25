import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SalonsModule } from './salons/salons.module';
import { UsersModule } from './users/users.module';
import { LocationsModule } from './locations/locations.module';

@Module({
  imports: [AuthModule, SalonsModule, UsersModule, LocationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
