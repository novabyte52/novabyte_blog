import { Meta } from '../meta';
import { Person } from '../person/person';

export type Post = {
  meta: Meta;
  markdown: string;
  author: Person;
};
