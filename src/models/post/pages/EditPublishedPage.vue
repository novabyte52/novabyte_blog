<template>
  <q-page class="n-page edit-post-page">
    <div class="text-h1 text-center">Edit Published Drafts</div>

    <q-splitter
      class="q-ma-lg"
      separator-class="static-splitter"
      v-model="ratio"
      :unit="'px'"
      :limits="[ratio, ratio]"
    >
      <template v-slot:before>
        <q-card class="n-card q-mr-lg">
          <q-list bordered separator>
            <div class="text-h4 text-center q-pa-sm">Published</div>
            <q-item
              v-for="draft in drafts"
              clickable
              :key="draft.id?.toString()"
              :class="{ selected: draftedPost?.draft_id === draft.draft_id }"
              @click="editDraft(draft)"
              ><q-item-section> {{ draft.title }}</q-item-section></q-item
            >
          </q-list>
        </q-card>
      </template>
      <template v-slot:after>
        <div v-if="!draftedPost">No drafts currently exist</div>
        <edit-post v-model="draftedPost">
          <template v-slot:actions>
            <q-btn
              label="publish"
              color="positive"
              :disable="
                !isDirty || !draftedPost?.title || !draftedPost.markdown
              "
              @click="onPublishPost"
            ></q-btn>
            <q-space />
            <q-btn
              label="un-publish"
              color="negative"
              @click="onUnpublishPost"
            ></q-btn>
          </template>
        </edit-post>
      </template>
    </q-splitter>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { PostVersion, usePostStore } from 'src/models/post';
import { EditPost } from 'src/models/post';
import { Ref, onMounted, ref } from 'vue';
import ConfirmationDialog from 'src/dialogs/ConfirmationDialog.vue';
import { useIsDirty } from 'src/composables';
import { useRoute } from 'vue-router';

const q = useQuasar();
const route = useRoute();
const { getPublished, unpublishDraft, draftPost } = usePostStore();

const ratio = ref(250);
let draftedPost: Ref<PostVersion | undefined> = ref();
const drafts: Ref<PostVersion[] | undefined> = ref();

const { changeObj, isDirty } = useIsDirty(draftedPost);

onMounted(async () => {
  drafts.value = await getPublished();
  if (drafts.value.length > 0) {
    if (route.query.draft_id) {
      draftedPost.value =
        drafts.value[
          drafts.value.findIndex((p) => p.draft_id === route.query.draft_id)
        ];
    } else {
      draftedPost.value = drafts.value[0];
    }
  }
});

const editDraft = (draft: PostVersion) => {
  draftedPost.value = draft;
  changeObj(draftedPost);
};

/**
 * if changes have been made create a new draft and publish it
 */
const onPublishPost = () => {
  q.dialog({
    component: ConfirmationDialog,
    componentProps: {
      message: 'Do you wish to publish this new draft?',
    },
  }).onOk(async () => {
    if (!draftedPost.value) throw new Error('No post to create!');

    if (!isDirty.value) throw new Error('Draft is unchanged! Aborting.');

    draftedPost.value.published = true;
    draftPost(draftedPost.value);
  });
};

/**
 * un-publish this draft
 */
const onUnpublishPost = () => {
  console.log('publishing post');
  q.dialog({
    component: ConfirmationDialog,
    componentProps: {
      message: 'Do you wish to un-publish this draft?',
    },
  }).onOk(async () => {
    if (!draftedPost.value) throw new Error('No post to create!');
    await unpublishDraft(draftedPost.value.draft_id);
  });
};
</script>

<style lang="scss">
.edit-post-page {
  .static-splitter {
    .q-splitter__separator-area:hover {
      cursor: default !important;
    }
  }

  .selected {
    background-color: $accent;
  }

  .foo {
    color: black;
  }
}
</style>
