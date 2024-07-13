import { storeToRefs } from 'pinia';
import { api } from 'src/boot/axios';
import { usePersonStore } from '../person';
import { Post, PostVersion } from './post';
import { AxiosResponse } from 'axios';
import { RecordId } from 'surrealdb.js';

export const usePostClient = () => {
  const c = api;

  const { currentPerson } = storeToRefs(usePersonStore());

  const postPost = async (title: string, markdown: string) => {
    try {
      await c.post('/posts', {
        title,
        markdown,
        author: currentPerson.value?.id,
      });
    } catch (e) {
      throw e;
    }
  };

  const getPosts = async () => {
    try {
      const response = await c.get<Post[]>('/posts');
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  const draftPost = async (post: PostVersion) => {
    try {
      console.log('client: draft post -- ', post);
      const response = await c.post<Post>('/posts/drafts', {
        title: post.title,
        markdown: post.markdown,
        id: post.id,
        published: post.published,
      });

      if ((response as AxiosResponse).status === 204) {
        return true;
      }

      return false;
    } catch (e) {
      throw e;
    }
  };

  const publishDraft = async (draftId: RecordId) => {
    try {
      const response = await c.post<Post>(`/posts/drafts/${draftId}/publish`);

      if ((response as AxiosResponse).status === 204) {
        return true;
      }

      return false;
    } catch (e) {
      throw e;
    }
  };

  const unpublishDraft = async (draftId: RecordId) => {
    try {
      const response = await c.delete<Post>(`/posts/drafts/${draftId}/publish`);

      if ((response as AxiosResponse).status === 204) {
        return true;
      }

      return false;
    } catch (e) {
      throw e;
    }
  };

  const fetchDrafts = async () => {
    try {
      const response = await c.get<PostVersion[]>('/posts/drafts');
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  const fetchPostDrafts = async (postId: string) => {
    try {
      console.log('=== fetch post drafts', postId);
      const response = await c.get<PostVersion[]>(`/posts/${postId}/drafts`);
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  const fetchPublished = async () => {
    try {
      const response = await c.get<PostVersion[]>('/posts/published');
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  return {
    postPost,
    getPosts,
    draftPost,
    publishDraft,
    unpublishDraft,
    fetchDrafts,
    fetchPostDrafts,
    fetchPublished,
  };
};
