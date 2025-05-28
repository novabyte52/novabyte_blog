import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { PostVersion } from './post';
import { usePostClient } from './post.client';
import { useLogger } from 'src/composables/useLogger';

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const logger = useLogger('post.store');

export const usePostStore = defineStore('posts', () => {
  logger.debug('called usePostStore');
  const pc = usePostClient();
  logger.debug('initialized post client');

  const drafts = ref<PostVersion[]>([]);

  const publishedDrafts = computed(() =>
    drafts.value.filter((d) => d.published)
  );

  const getRandomDraft = () => {
    return publishedDrafts.value[
      randomIntFromInterval(0, publishedDrafts.value.length - 1)
    ];
  };

  const addDraft = (post: PostVersion) => {
    if (!setDraft(post)) drafts.value.push(post);
  };

  const setDraft = (draft: PostVersion) => {
    const index = drafts.value.findIndex((r) => r.draft_id === draft.draft_id);
    if (index < 0) return false;

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
    logger.debug(`getting draft: ${draft_id}`);
    let draft = drafts.value.find((d) => d.draft_id === draft_id);

    logger.debug(`draft found? ${!!draft}`);
    if (!draft) {
      draft = await getDraft(draft_id);
      logger.debug(`draft not cached, fetching successful? ${!!draft}`);
    }

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

  const getDrafts = async () => {
    const fetchedDrafts = await pc.fetchDrafts();

    fetchedDrafts.forEach((d) => addDraft(d));

    return fetchedDrafts;
  };

  const draftPost = async (post: PostVersion) => {
    const newDraft = await pc.draftPost(post);

    addDraft(newDraft);

    return newDraft;
  };

  const getPublished = async () => {
    const publishedDrafts = await pc.fetchPublished();

    publishedDrafts.forEach((d) => addDraft(d));

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
    getRandomDraft,
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
