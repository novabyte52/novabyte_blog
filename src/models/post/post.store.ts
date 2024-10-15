import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { PostVersion } from './post';
import { usePostClient } from './post.client';

export const usePostStore = defineStore('posts', () => {
  const pc = usePostClient();

  const drafts = ref<PostVersion[]>([]);

  const publishedDrafts = computed(() =>
    Array.from(drafts.value.values()).filter((d) => d.published)
  );

  const addDraft = (post: PostVersion) => {
    if (!setDraft(post)) drafts.value.push(post);
  };

  const setDraft = (draft: PostVersion) => {
    console.log('setting draft:', draft.draft_id);
    const index = drafts.value.findIndex((r) => r.draft_id === draft.draft_id);
    if (index < 0) {
      console.log('couldnt find draft!');
      return false;
    } else {
      console.log('found draft!', index);
    }

    drafts.value[index] = draft;
    return true;
  };

  const getDraft = async (draft_id: string) => {
    const draft = drafts.value.find((d) => d.draft_id === draft_id);
    if (draft) return draft;

    const fetchedDraft = await pc.fetchDraft(draft_id);
    addDraft(fetchedDraft);
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
    computed(() => drafts.value.filter((d) => d.id === postId));

  const updatePostDrafts = async (postId: string): Promise<PostVersion[]> => {
    const fetchedDrafts = await pc.fetchPostDrafts(postId);

    fetchedDrafts.forEach((d) => addDraft(d));

    return drafts.value.filter((d) => d.id === postId);
  };

  // TODO: rename to getAllDrafts
  const getDrafts = async () => {
    const fetchedDrafts = await pc.fetchDrafts();

    fetchedDrafts.forEach((d) => addDraft(d));

    return fetchedDrafts;
  };

  // TODO: rename to createDraft
  const draftPost = async (post: PostVersion) => {
    const newDraft = await pc.draftPost(post);

    addDraft(newDraft);

    return newDraft;
  };

  // TODO: rename to getPublishedDrafts
  const getPublished = async () => {
    const publishedDraftsd = await pc.fetchPublished();

    console.log('got published drafts:', publishedDraftsd.length);
    publishedDraftsd.forEach((d) => addDraft(d));

    console.log('drafts:', drafts.value);

    return drafts.value.filter((d) => d.published);
  };

  const publishDraft = async (draft_id: string) => {
    const published = await pc.publishDraft(draft_id);

    if (!published) throw Error(`Issue publishing draft: ${draft_id}`);

    let postId = '';
    drafts.value.forEach((d) => {
      if (draft_id === d.draft_id) postId = d.id;
    });

    drafts.value.forEach((d) => {
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
