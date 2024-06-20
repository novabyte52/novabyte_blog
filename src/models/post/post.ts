import { Meta, Thing } from '../meta';
import { Person } from '../person/person';

type PostProps = {
  id?: Thing;
  title: string;
  markdown: string;
};

export type Post = {
  author?: Thing;
  meta?: Thing;
} & PostProps;

export type HydratedPost = {
  author: Person;
  meta: Meta;
} & PostProps;
