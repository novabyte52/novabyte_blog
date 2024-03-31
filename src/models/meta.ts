import { ULID } from 'ulidx';

export enum Table {
  PERSON = 'person',
  POST = 'post',
}

export class Thing {
  tb!: string;
  id!: ULID;

  constructor(thingString: string) {
    const [tb, id] = thingString.split(':');
    this.tb = tb;
    this.id = id;
  }

  toString = () => {
    return `${this.tb}:${this.id}`;
  };
}

export type Meta<T = undefined> = {
  id: Thing;
  createdBy?: ULID;
  createdOn?: Date;
  modifiedBy?: ULID;
  modifiedOn?: Date;
  deletedBy?: ULID;
  deletedOn?: Date;
  data?: T;
};
