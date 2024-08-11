import { Meta } from '../meta';

export type PostPerson = {
  username: string;
  email: string;
};

export type Person = {
  id: string;
  username: string;
  email: string;
  is_admin: string;
  meta: Meta;
};
