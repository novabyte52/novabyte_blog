import { AxiosResponse } from 'axios';
import { api } from 'src/boot/axios';
import { Post, PostVersion } from './post';

export const usePostClient = () => {
  const c = api;

  /**
   * Get the minimum amount of info for all posts.
   *
   * TODO: Will maybe make a store for posts themselves and
   * make the current post store into a drafts store.
   *
   * @returns minimal information for all posts
   */
  const getPosts = async () => {
    try {
      const response = await c.get<Post[]>('/posts');
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  // TODO: may want to return the PostVersion eventually so i can add it to the store,
  // but for now this should be fine
  const draftPost = async (post: PostVersion) => {
    try {
      const response = await c.post<PostVersion>('/posts/drafts', {
        title: post.title,
        markdown: post.markdown,
        id: post.id,
        published: post.published,
      });

      return response.data;
    } catch (e) {
      throw e;
    }
  };

  const publishDraft = async (draftId: string) => {
    try {
      const response = await c.post(`/posts/drafts/${draftId}/publish`);

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
      const response = await c.delete(`/posts/drafts/${draftId}/publish`);

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
      const response = await c.get<PostVersion>(`/posts/drafts/${draftId}`);
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  const fetchDrafts = async () => {
    try {
      const response = await c.get<PostVersion[]>('/posts/drafts');
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  const fetchPostDrafts = async (postId: string) => {
    try {
      const response = await c.get<PostVersion[]>(`/posts/${postId}/drafts`);
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  const fetchPublished = async () => {
    console.log('fetching published posts');
    try {
      const response = await c.get<PostVersion[]>('/posts/published');
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
  };
};
