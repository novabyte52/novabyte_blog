import { AxiosInstance, AxiosResponse, AxiosStatic } from 'axios';
import { ApiPath } from 'src/boot/axios';
import { Post, PostVersion } from './post';
import {
  global_request_interceptor,
  global_response_interceptor,
} from 'src/clients';
import { API } from 'src/symbols';
import { inject } from 'vue';
import { useOnce } from 'src/composables/once';

export const usePostClient = () => {
  const api = useOnce<AxiosInstance>(() => {
    const axios = inject(API) as AxiosStatic;
    const instance = axios.create({
      baseURL: axios.defaults.baseURL + ApiPath.POSTS,
    });

    if (process.env.CLIENT) {
      instance.interceptors.request.use(global_request_interceptor);
      instance.interceptors.response.use(
        (res) => res,
        global_response_interceptor(instance)
      );
    }

    return instance;
  });

  /**
   * Get the minimum amount of info for all posts.
   *
   * @returns minimal information for all posts
   */
  const getPosts = async () => {
    try {
      const response = await api.get<Post[]>('');
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  const draftPost = async (post: PostVersion) => {
    try {
      const response = await api.post<PostVersion>('drafts', {
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
      const response = await api.post(`drafts/${draftId}/publish`);

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
      const response = await api.delete(`drafts/${draftId}/publish`);

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
      const response = await api.get<PostVersion>(`drafts/${draftId}`);
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  const fetchDrafts = async () => {
    try {
      const response = await api.get<PostVersion[]>('drafts');
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  const fetchPostDrafts = async (postId: string) => {
    try {
      const response = await api.get<PostVersion[]>(`${postId}/drafts`);
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  const fetchPublished = async () => {
    try {
      const response = await api.get<PostVersion[]>('published');
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  const fetchRandom = async () => {
    try {
      const response = await api.get<PostVersion>('random');
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
