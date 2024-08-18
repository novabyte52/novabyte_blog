import { ULID } from 'ulidx';

export enum Table {
  PERSON = 'person',
  POST = 'post',
}

export type Meta<T = undefined> = {
  id: string;
  created_by?: ULID;
  created_on?: Date;
  modified_by?: ULID;
  modified_on?: Date;
  deleted_by?: ULID;
  deleted_on?: Date;
  data?: T;
};
