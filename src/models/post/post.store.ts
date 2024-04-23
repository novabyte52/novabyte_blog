import { defineStore } from 'pinia';
import { Ref, ref } from 'vue';
import { Post } from './post';
import { usePostClient } from './post.client';

export const NB_TOKEN_KEY = 'nbToken';

const posts: Ref<Map<string, Post>> = ref(new Map());

export const usePostStore = defineStore('post', () => {
  const pc = usePostClient();

  async function fetchPosts() {
    const fetchedPosts = await pc.getPosts();

    fetchedPosts.forEach((p) => {
      if (!posts.value.has(p.id.toString()))
        posts.value.set(p.id.toString(), p);
    });

    return fetchedPosts;
  }

  return {
    fetchPosts,
  };
});
