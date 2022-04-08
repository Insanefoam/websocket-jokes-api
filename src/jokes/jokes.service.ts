import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class JokesService {
  constructor(private readonly httpService: HttpService) {}

  async getJoke(): Promise<string> {
    const { data: joke } = await lastValueFrom(
      this.httpService.get('/joke/any'),
    );

    if (joke.setup && joke.delivery) {
      return `${joke.setup}... ${joke.delivery}`;
    }

    if (joke.joke) {
      return joke.joke;
    }

    return 'Ooops, no jokes found...';
  }
}
