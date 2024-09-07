import { AxiosResponse } from 'axios';
import { axios, ApiPath } from 'src/boot/axios';
import { Post, PostVersion } from './post';
import {
  global_request_interceptor,
  global_response_interceptor,
} from 'src/clients';

const c = axios.create({
  baseURL: axios.defaults.baseURL + ApiPath.POSTS,
});

export const usePostClient = () => {
  // to avoid complicated logic for now i will just clear and reapply the interceptors
  c.interceptors.request.clear();
  c.interceptors.response.clear();

  c.interceptors.request.use(global_request_interceptor);
  c.interceptors.response.use((res) => res, global_response_interceptor(c));

  /**
   * Get the minimum amount of info for all posts.
   *
   * TODO: Will maybe make a store for posts themselves and
   * make the current post store into a drafts store.
   *
   * @returns minimal information for all posts
   */
  const getPosts = async () => {
    try {
      const response = await c.get<Post[]>('');
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  // TODO: may want to return the PostVersion eventually so i can add it to the store,
  // but for now this should be fine
  const draftPost = async (post: PostVersion) => {
    try {
      const response = await c.post<PostVersion>('drafts', {
        title: post.title,
        markdown: post.markdown,
        id: post.id,
        published: post.published,
      });

      return response.data;
    } catch (e) {
      throw e;
    }
  };

  const publishDraft = async (draftId: string) => {
    try {
      const response = await c.post(`drafts/${draftId}/publish`);

      if ((response as AxiosResponse).status === 204) {
        return true;
      }

      return false;
    } catch (e) {
      throw e;
    }
  };

  const unpublishDraft = async (draftId: string) => {
    try {
      const response = await c.delete(`drafts/${draftId}/publish`);

      if ((response as AxiosResponse).status === 204) {
        return true;
      }

      return false;
    } catch (e) {
      throw e;
    }
  };

  const fetchDraft = async (draftId: string) => {
    try {
      const response = await c.get<PostVersion>(`drafts/${draftId}`);
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  const fetchDrafts = async () => {
    try {
      const response = await c.get<PostVersion[]>('drafts');
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  const fetchPostDrafts = async (postId: string) => {
    try {
      const response = await c.get<PostVersion[]>(`${postId}/drafts`);
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  const fetchPublished = async () => {
    console.log('fetching published posts');
    try {
      const response = await c.get<PostVersion[]>('published');
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  return {
    getPosts,
    draftPost,
    publishDraft,
    unpublishDraft,
    fetchDraft,
    fetchDrafts,
    fetchPostDrafts,
    fetchPublished,
  };
};
