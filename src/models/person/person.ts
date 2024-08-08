import { Meta, Thing } from '../meta';

export type PostPerson = {
  username: string;
  email: string;
};

export type Person = {
  id: Thing;
  username: string;
  email: string;
  is_admin: string;
  meta: Meta;
};
