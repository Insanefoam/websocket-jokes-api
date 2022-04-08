import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JokesGateway } from './jokes.gateway';
import { JokesService } from './jokes.service';

@Module({
  imports: [HttpModule.register({ baseURL: 'https://v2.jokeapi.dev' })],
  providers: [JokesGateway, JokesService],
})
export class JokesModule {}
