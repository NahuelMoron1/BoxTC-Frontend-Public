export class Track {
  id: string;
  location: string;
  track_name: string;
  gmt_offset: string;
  length: number;
  country: string;
  image: string;
  popularity: number;

  constructor(
    id: string,
    location: string,
    track_name: string,
    gmt_offset: string,
    length: number,
    country: string,
    image: string,
    popularity: number
  ) {
    this.id = id;
    this.location = location;
    this.track_name = track_name;
    this.gmt_offset = gmt_offset;
    this.length = length;
    this.country = country;
    this.image = image;
    this.popularity = popularity;
  }
}
