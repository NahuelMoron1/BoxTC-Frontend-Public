export class Team {
  id: string;
  name: string;
  common_name: string;
  championships: number;
  base: string;
  logo: string;
  popularity: number;

  constructor(
    id: string,
    name: string,
    common_name: string,
    championships: number,
    base: string,
    logo: string,
    popularity: number
  ) {
    this.id = id;
    this.name = name;
    this.common_name = common_name;
    this.championships = championships;
    this.base = base;
    this.logo = logo;
    this.popularity = popularity;
  }
}
