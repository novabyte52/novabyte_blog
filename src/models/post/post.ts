import { Meta } from '../meta';

export type Post = {
  id: string;
  meta?: string | Meta;
  working_title: string;
};

export type PostVersion = {
  id: string;
  draft_id: string;
  title: string;
  markdown: string;
  author: string;
  published: boolean;
  at: Date;
};
