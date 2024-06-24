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

export type PostVersion = {
  id: Thing;
  draftId: Thing;
  title: string;
  markdown: string;
  author: Thing;
  published: boolean;
  at: Date;
};

// export type HydratedPost = {
//   author: Person;
//   meta: Meta;
// } & PostProps;
