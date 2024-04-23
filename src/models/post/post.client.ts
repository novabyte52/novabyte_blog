import { storeToRefs } from 'pinia';
import { api } from 'src/boot/axios';
import { usePersonStore } from '../person';
import { Post } from './post';

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

  return {
    postPost,
    getPosts,
  };
};
