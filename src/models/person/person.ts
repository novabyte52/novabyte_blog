import { Meta, RecordId } from '../meta';

export type PostPerson = {
  username: string;
  email: string;
};

export type Person = {
  id: RecordId;
  username: string;
  email: string;
  is_admin: string;
  meta: Meta;
};
