export interface H2HGameResponse {
  id: string;
  title: string;
  date: string;
  year: string;
  Team: {
    id: string;
    name: string;
    logo: string;
  };
  Driver1: {
    id: string;
    firstname: string;
    lastname: string;
    image: string;
    flag: string;
  };
  Driver2: {
    id: string;
    firstname: string;
    lastname: string;
    image: string;
    flag: string;
  };
}
