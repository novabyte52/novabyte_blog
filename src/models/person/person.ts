import { Meta } from '../base';

export type PostPerson = {
  username: string;
  email: string;
};

export type Person = {
  meta: Meta;
  username: string;
  email: string;
};
