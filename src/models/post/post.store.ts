import { defineStore } from 'pinia';
import { Post, PostVersion } from './post';
import { usePostClient } from './post.client';
import { Ref, ref } from 'vue';

export const usePostStore = defineStore('post', () => {
  const pc = usePostClient();

  // TODO: need to work on the caching of this store...
  // const posts: Ref<Map<string, Post>> = ref(new Map());

  // const createPost = async (post: Post) => {
  //   await pc.postPost(post.title, post.markdown);
  // };

  const getPosts = async () => {
    return await pc.getPosts();
  };

  const draftPost = async (post: PostVersion) => {
    // TODO: should probably make this return the post so i can add it to the store
    return await pc.draftPost(post);
  };

  const getDrafts = async () => {
    return await pc.fetchDrafts();
  };

  const getPostDrafts = async (postId: string) => {
    return await pc.fetchPostDrafts(postId);
  };

  const getPublished = async () => {
    return await pc.fetchPublished();
  };

  // POST /posts/drafts/:draft_id/publish
  const publishDraft = async (draftId: string) => {
    console.log('publish draft');
    return await pc.publishDraft(draftId);
  };

  // DELETE /posts/drafts/:draft_id/publish
  const unpublishDraft = async (draftId: string) => {
    console.log('publish draft');
    return await pc.unpublishDraft(draftId);
  };

  return {
    // createPost,
    getPosts,
    draftPost,
    getDrafts,
    getPostDrafts,
    getPublished,
    publishDraft,
    unpublishDraft,
  };
});
