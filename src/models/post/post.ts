import { RecordId } from 'surrealdb.js';
import { Meta } from '../meta';

export type Post = {
  id: RecordId;
  meta?: RecordId | Meta;
  working_title: string;
};

export type PostVersion = {
  id: RecordId;
  draftId: RecordId;
  title: string;
  markdown: string;
  author: RecordId;
  published: boolean;
  at: Date;
};
