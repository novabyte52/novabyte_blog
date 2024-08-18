import { defineStore } from 'pinia';
import { PostVersion } from './post';
import { usePostClient } from './post.client';
import { Ref, ref } from 'vue';

export const usePostStore = defineStore('post', () => {
  const pc = usePostClient();

  const drafts = ref({}) as Ref<Record<string, PostVersion>>;

  const addDraft = async (post: PostVersion) => {
    if (drafts.value[post.draft_id]) return;

    drafts.value[post.draft_id] = post;
  };

  const getDraft = async (draft_id: string) => {
    const draft = drafts.value[draft_id];
    if (draft) return draft;

    const fetchedDraft = await pc.fetchDraft(draft_id);
    drafts.value[draft_id] = fetchedDraft;
    return fetchedDraft;
  };

  const getPublishedDraft = async (draft_id: string) => {
    const draft = await getDraft(draft_id);
    console.log('draft found:', draft);

    if (draft.published) {
      return draft;
    }

    throw Error(`Unable to find published draft for post: ${draft_id}`);
  };

  // TODO: rename to getDraftsForPost
  // TODO: make this a computed
  const getPostDrafts = async (postId: string) => {
    const fetchedDrafts = await pc.fetchPostDrafts(postId);

    fetchedDrafts.forEach((d) => (drafts.value[d.draft_id] = d));

    return Object.values(drafts.value).filter((d) => d.id === postId);
  };

  // TODO: rename to getAllDrafts
  const getDrafts = async () => {
    const fetchedDrafts = await pc.fetchDrafts();

    fetchedDrafts.forEach((d) => (drafts.value[d.draft_id] = d));

    return fetchedDrafts;
  };

  // TODO: rename to createDraft
  const draftPost = async (post: PostVersion) => {
    const newDraft = await pc.draftPost(post);

    drafts.value[newDraft.draft_id] = newDraft;

    return newDraft;
  };

  // TODO: rename to getPublishedDrafts
  const getPublished = async () => {
    const publishedDrafts = await pc.fetchPublished();
    console.log('fetched drafts:', publishedDrafts);

    publishedDrafts.forEach((d) => {
      console.log('adding draft:', d.draft_id);
      drafts.value[d.draft_id] = d;
      console.log(drafts.value[d.draft_id]);
    });

    console.log(
      'filtered drafts:',
      Object.values(drafts.value).filter((d) => d.published)
    );
    return Object.values(drafts.value).filter((d) => d.published);
  };

  // TODO: rename to publishDraft
  const publishDraft = async (draft_id: string) => {
    const published = await pc.publishDraft(draft_id);

    if (!published) throw Error(`Issue publishing draft: ${draft_id}`);

    const draft = await getDraft(draft_id);

    draft.published = published;

    return draft;
  };

  // TODO: unpublishDraft
  const unpublishDraft = async (draft_id: string) => {
    const unpublished = await pc.unpublishDraft(draft_id);

    if (!unpublished) throw Error(`Issue unpublishing draft: ${draft_id}`);

    const draft = await getDraft(draft_id);

    draft.published = unpublished;

    return draft;
  };

  return {
    addDraft,
    draftPost,
    getDrafts,
    getPublishedDraft,
    getPostDrafts,
    getPublished,
    publishDraft,
    unpublishDraft,
  };
});
