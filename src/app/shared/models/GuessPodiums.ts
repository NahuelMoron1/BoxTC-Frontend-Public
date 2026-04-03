export class GuessPodiums {
  id: string;
  title: string;
  date: string;
  first_place_driver_id: string;
  second_place_driver_id: string;
  third_place_driver_id: string;
  first_place_car_id: string;
  second_place_car_id: string;
  third_place_car_id: string;

  // Optional related entities (populated when fetching from backend)
  FirstDriver?: {
    id: string;
    firstname: string;
    lastname: string;
    image: string;
  };
  SecondDriver?: {
    id: string;
    firstname: string;
    lastname: string;
    image: string;
  };
  ThirdDriver?: {
    id: string;
    firstname: string;
    lastname: string;
    image: string;
  };
  FirstCar?: { id: string; name: string; image: string };
  SecondCar?: { id: string; name: string; image: string };
  ThirdCar?: { id: string; name: string; image: string };

  constructor(
    id: string,
    title: string,
    date: string,
    first_place_driver_id: string,
    second_place_driver_id: string,
    third_place_driver_id: string,
    first_place_car_id: string,
    second_place_car_id: string,
    third_place_car_id: string,
  ) {
    this.id = id;
    this.title = title;
    this.date = date;
    this.first_place_driver_id = first_place_driver_id;
    this.second_place_driver_id = second_place_driver_id;
    this.third_place_driver_id = third_place_driver_id;
    this.first_place_car_id = first_place_car_id;
    this.second_place_car_id = second_place_car_id;
    this.third_place_car_id = third_place_car_id;
  }
}

export interface StartGuess {
  id: string;
  title: string;
  date: string;
  firstDriverImage: string;
  secondDriverImage: string;
  thirdDriverImage: string;
  firstCarImage: string;
  secondCarImage: string;
  thirdCarImage: string;
}

export interface Surrendered {
  gamedata: GuessPodiums;
}
