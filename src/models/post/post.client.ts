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
  if (process.env.CLIENT) {
    // to avoid complicated logic for now i will just clear and reapply the interceptors
    c.interceptors.request.clear();
    c.interceptors.response.clear();

    c.interceptors.request.use(global_request_interceptor);
    c.interceptors.response.use((res) => res, global_response_interceptor(c));
  }

  /**
   * Get the minimum amount of info for all posts.
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

  const draftPost = async (post: PostVersion) => {
    try {
      const response = await c.post<PostVersion>('drafts', {
        title: post.title,
        markdown: post.markdown,
        id: post.id,
        published: post.published,
        image: post.image,
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
    try {
      const response = await c.get<PostVersion[]>('/published');
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  const fetchRandom = async () => {
    try {
      const response = await c.get<PostVersion>('random');
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
    fetchRandom,
  };
};
