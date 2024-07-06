import { RecordId } from 'surrealdb.js';
export enum Table {
  PERSON = 'person',
  POST = 'post',
}

export type Meta<T = undefined> = {
  id: RecordId;
  createdBy?: string;
  created_on?: Date;
  modifiedBy?: string;
  modifiedOn?: Date;
  deletedBy?: string;
  deletedOn?: Date;
  data?: T;
};

export const thingToString = (id: RecordId) => `${id.tb}:${id.id.String}`;
