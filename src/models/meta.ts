import { ULID } from 'ulidx';

export enum Table {
  PERSON = 'person',
  POST = 'post',
}

export type Thing = {
  tb: string;
  id?: ULID;
};

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
