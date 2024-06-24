<template>
  <q-page class="n-page edit-post-page">
    <div class="text-h1 text-center n-h1">Edit Drafts</div>
    <q-splitter
      separator-class="static-splitter"
      v-model="ratio"
      :unit="'px'"
      :limits="[ratio, ratio]"
    >
      <template v-slot:before>
        <q-card class="n-card">
          <div class="text-h4 text-center q-pa-sm">Drafts</div>
          <q-list bordered separator>
            <q-item
              v-for="draft in drafts"
              clickable
              :key="draft.id?.toString()"
              @click="editDraft(draft)"
              ><q-item-section>
                <div class="row">
                  {{ draft.title }}
                  <q-space />
                  <q-btn
                    dense
                    round
                    color="negative"
                    size="sm"
                    icon="fas fa-trash"
                    @click.stop
                  ></q-btn></div></q-item-section
            ></q-item>
          </q-list>
        </q-card>
      </template>
      <template v-slot:after>
        <edit-post :model-value="draftedPost" @update:model-value="updatePost">
          <template v-slot:actions>
            <q-btn
              label="publish"
              color="positive"
              :disable="!draftedPost?.title || !draftedPost.markdown"
              @click="onPublishPost"
            ></q-btn>
            <q-space />
            <q-btn
              label="draft"
              color="warning"
              :disable="!draftedPost?.title"
              @click="onDraftPost"
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
import { Ref, computed, onMounted, ref } from 'vue';
import ConfirmationDialog from 'src/dialogs/ConfirmationDialog.vue';
import { clone, isEqual } from 'lodash-es';

const q = useQuasar();
const ratio = ref(250);
let original: PostVersion;
const draftedPost: Ref<PostVersion | undefined> = ref();
const drafts: Ref<PostVersion[] | undefined> = ref();

const { draftPost, getDrafts } = usePostStore();

const isDirty = computed(() => !isEqual(original, draftedPost.value));

onMounted(async () => {
  drafts.value = await getDrafts();
});

const editDraft = (draft: PostVersion) => {
  original = clone(draft);
  draftedPost.value = draft;
};

const updatePost = (newVal: PostVersion) => {
  draftedPost.value = newVal as PostVersion;
};

const onDraftPost = async () => {
  q.dialog({
    component: ConfirmationDialog,
    componentProps: {
      message: 'Save post as draft?',
    },
  }).onOk(async () => {
    if (!draftedPost.value) throw new Error('No post to create draft for!');
    await draftPost(draftedPost.value);
  });
};

const onPublishPost = () => {
  console.log('publishing post');
  q.dialog({
    component: ConfirmationDialog,
    componentProps: {
      message: 'Do you wish to publish the post? You just started it.',
    },
  }).onOk(async () => {
    if (!draftedPost.value) throw new Error('No post to create!');

    // await draftPost(draftedPost.value, isDirty.value);
  });
};

// const onDiscardPost = () => {
//   q.dialog({
//     component: ConfirmationDialog,
//     componentProps: {
//       message: 'Do you wish to discard what youve written?',
//     },
//   }).onOk(async () => {
//     if (!draftedPost.value) throw new Error('No post to create!');
//     draftedPost.value.title = '';
//     draftedPost.value.markdown = '';
//   });
// };
</script>

<style lang="scss">
.edit-post-page {
  .static-splitter {
    .q-splitter__separator-area:hover {
      cursor: default !important;
    }
  }

  .foo {
    color: black;
  }
}
</style>
