import { Connection_Type } from './enums/connection-type';

export class Connections {
  id: string;
  date: string;
  type: Connection_Type;
  amount_groups: number;

  constructor(
    id: string,
    date: string,
    type: Connection_Type,
    amount_groups: number
  ) {
    this.id = id;
    this.date = date;
    this.type = type;
    this.amount_groups = amount_groups;
  }
}
