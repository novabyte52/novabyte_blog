import { storeToRefs } from 'pinia';
import { api } from 'src/boot/axios';
import { usePersonStore } from '../person';
import { Post } from './post';
import { AxiosResponse } from 'axios';

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

  const draftPost = async (post: Post) => {
    try {
      const response = await c.post<Post>('/posts/draft', {
        title: post.title,
        markdown: post.markdown,
      });

      if ((response as AxiosResponse).status === 204) {
        return true;
      }

      return false;
    } catch (e) {
      throw e;
    }
  };

  const publishPost = async (post: Post) => {
    try {
      const response = await c.post<Post>('/posts/publish', {
        title: post.title,
        markdown: post.markdown,
      });

      if ((response as AxiosResponse).status === 204) {
        return true;
      }

      return false;
    } catch (e) {
      throw e;
    }
  };

  return {
    postPost,
    getPosts,
    draftPost,
    publishPost,
  };
};
