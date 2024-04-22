import { storeToRefs } from 'pinia';
import { api } from 'src/boot/axios';
import { usePersonStore } from '../person';

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

  return {
    postPost,
  };
};
