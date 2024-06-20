import { defineStore } from 'pinia';
import { Ref, ref } from 'vue';
import { Post } from './post';
import { usePostClient } from './post.client';

const posts: Ref<Map<string, Post>> = ref(new Map());

export const usePostStore = defineStore('post', () => {
  const pc = usePostClient();

  const fetchPosts = async () => {
    const fetchedPosts = await pc.getPosts();

    fetchedPosts.forEach((p) => {
      if (!posts.value.has(p.id?.toString() as string))
        posts.value.set(p.id?.toString() as string, p);
    });

    return fetchedPosts;
  };

  const createPost = async (post: Post) => {
    await pc.postPost(post.title, post.markdown);
  };

  const draftPost = async (post: Post) => {
    // TODO: should probably make this return the post so i can add it to the store
    return await pc.draftPost(post);
  };

  const publishPost = async (post: Post) => {
    return await pc.publishPost(post);
  };

  return {
    fetchPosts,
    createPost,
    draftPost,
    publishPost,
  };
});
