import { defineStore } from 'pinia';
// import { Ref, ref } from 'vue';
import { Post, PostVersion } from './post';
import { usePostClient } from './post.client';

// TODO: need to work on the caching of this store...
// const posts: Ref<Map<string, Post>> = ref(new Map());

export const usePostStore = defineStore('post', () => {
  const pc = usePostClient();

  const createPost = async (post: Post) => {
    await pc.postPost(post.title, post.markdown);
  };

  const draftPost = async (post: PostVersion) => {
    // TODO: should probably make this return the post so i can add it to the store
    return await pc.draftPost(post);
  };

  const getDrafts = async () => {
    return await pc.fetchDrafts();
  };

  const getPublished = async () => {
    return await pc.fetchPublished();
  };

  return {
    createPost,
    draftPost,
    getDrafts,
    getPublished,
  };
});
