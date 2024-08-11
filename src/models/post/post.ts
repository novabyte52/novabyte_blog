import { Meta } from '../meta';

export type Post = {
  id: string;
  meta?: string | Meta;
  working_title: string;
};

export type PostVersion = {
  id: string;
  draftId: string;
  title: string;
  markdown: string;
  author: string;
  published: boolean;
  at: Date;
};
