import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TesteGateway } from './teste/teste.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, TesteGateway],
})
export class AppModule {}
