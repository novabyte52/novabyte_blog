import { ULID } from 'ulidx';

export enum Table {
  PERSON = 'person',
  POST = 'post',
}

export type Meta<T = undefined> = {
  id: string;
  createdBy?: ULID;
  created_on?: Date;
  modifiedBy?: ULID;
  modifiedOn?: Date;
  deletedBy?: ULID;
  deletedOn?: Date;
  data?: T;
};
