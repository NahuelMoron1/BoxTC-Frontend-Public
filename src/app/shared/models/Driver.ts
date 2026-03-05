export class Driver {
  id: string;
  firstname: string;
  lastname: string;
  nationality: string;
  image: string;

  constructor(
    id: string,
    firstname: string,
    lastname: string,
    nationality: string,
    image: string
  ) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.nationality = nationality;
    this.image = image;
  }
}
