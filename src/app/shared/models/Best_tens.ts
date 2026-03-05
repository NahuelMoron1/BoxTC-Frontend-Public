import { Top10Results } from './Top10_Results';

export class Best_tens {
  id: string;
  title: string;
  results: Top10Results[];

  constructor(id: string, title: string, results: Top10Results[]) {
    this.id = id;
    this.title = title;
    this.results = results;
  }
}
