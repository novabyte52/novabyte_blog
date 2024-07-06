import { defineStore } from 'pinia';
// import { Ref, ref } from 'vue';
import { Post, PostVersion } from './post';
import { usePostClient } from './post.client';
import { RecordId } from 'surrealdb.js';

// TODO: need to work on the caching of this store...
// const posts: Ref<Map<string, Post>> = ref(new Map());

export const usePostStore = defineStore('post', () => {
  const pc = usePostClient();

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

  const getPostDrafts = async (postId: RecordId) => {
    // HACK: im having to do some really weird stuff to get this id to stringify properly
    // not sure if it's because its in a ref or what?
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const coercedId = new RecordId(postId.tb, postId.id.String).toString();
    console.log('=== get post drafts', coercedId);

    return await pc.fetchPostDrafts(coercedId);
  };

  const getPublished = async () => {
    return await pc.fetchPublished();
  };

  return {
    // createPost,
    getPosts,
    draftPost,
    getDrafts,
    getPostDrafts,
    getPublished,
  };
});
