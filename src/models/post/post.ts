import { Thing } from '../meta';

export type Post = {
  id: Thing;
  title: string;
  markdown: string;
  author: Thing;
  meta: Thing;
};
