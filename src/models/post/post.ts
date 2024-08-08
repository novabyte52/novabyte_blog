import { Thing } from '../meta';
import { Meta } from '../meta';

export type Post = {
  id: Thing;
  meta?: Thing | Meta;
  working_title: string;
};

export type PostVersion = {
  id: Thing;
  draftId: Thing;
  title: string;
  markdown: string;
  author: Thing;
  published: boolean;
  at: Date;
};
