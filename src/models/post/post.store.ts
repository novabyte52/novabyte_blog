import { defineStore } from 'pinia';
import { computed, reactive } from 'vue';
import { PostVersion } from './post';
import { usePostClient } from './post.client';

export const usePostStore = defineStore('posts', () => {
  const pc = usePostClient();

  const drafts: Map<string, PostVersion> = reactive(new Map());

  const publishedDrafts = computed(() =>
    Array.from(drafts.values()).filter((d) => d.published)
  );

  const addDraft = (post: PostVersion) => {
    if (drafts.get(post.draft_id)) return;

    drafts.set(post.draft_id, post);
  };

  const setDraft = (draft: PostVersion) => {
    drafts.set(draft.draft_id, draft);
  };

  const getDraft = async (draft_id: string) => {
    const draft = drafts.get(draft_id);
    if (draft) return draft;

    const fetchedDraft = await pc.fetchDraft(draft_id);
    drafts.set(draft_id, fetchedDraft);
    return fetchedDraft;
  };

  const getPublishedDraft = async (draft_id: string) => {
    const draft = await getDraft(draft_id);

    if (draft.published) {
      return draft;
    }

    throw Error(`Unable to find published draft for post: ${draft_id}`);
  };

  const postDrafts = (postId: string) =>
    computed(() => Array.from(drafts.values()).filter((d) => d.id === postId));

  const updatePostDrafts = async (postId: string): Promise<PostVersion[]> => {
    const fetchedDrafts = await pc.fetchPostDrafts(postId);

    fetchedDrafts.forEach((d) => drafts.set(d.draft_id, d));

    return Array.from(drafts.values()).filter((d) => d.id === postId);
  };

  // TODO: rename to getAllDrafts
  const getDrafts = async () => {
    const fetchedDrafts = await pc.fetchDrafts();

    fetchedDrafts.forEach((d) => drafts.set(d.draft_id, d));

    return fetchedDrafts;
  };

  // TODO: rename to createDraft
  const draftPost = async (post: PostVersion) => {
    const newDraft = await pc.draftPost(post);

    drafts.set(newDraft.draft_id, newDraft);

    return newDraft;
  };

  // TODO: rename to getPublishedDrafts
  const getPublished = async () => {
    const publishedDrafts = await pc.fetchPublished();

    publishedDrafts.forEach((d) => {
      drafts.set(d.draft_id, d);
    });

    return Array.from(drafts.values()).filter((d) => d.published);
  };

  const publishDraft = async (draft_id: string) => {
    const published = await pc.publishDraft(draft_id);

    if (!published) throw Error(`Issue publishing draft: ${draft_id}`);

    let postId = '';
    drafts.forEach((d) => {
      if (draft_id === d.draft_id) postId = d.id;
    });

    drafts.forEach((d) => {
      if (postId === d.id) d.published = false;
    });

    const draft = await getDraft(draft_id);
    draft.published = true;

    return draft;
  };

  const unpublishDraft = async (draft_id: string) => {
    const unpublished = await pc.unpublishDraft(draft_id);

    if (!unpublished) throw Error(`Issue unpublishing draft: ${draft_id}`);

    const draft = await getDraft(draft_id);
    draft.published = false;

    return draft;
  };

  return {
    drafts,
    publishedDrafts,
    postDrafts,
    addDraft,
    setDraft,
    draftPost,
    getDrafts,
    getPublishedDraft,
    updatePostDrafts,
    getPublished,
    publishDraft,
    unpublishDraft,
  };
});
