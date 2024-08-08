<template>
  <q-page class="n-page post-history">
    <div class="text-h1 text-center n-h1">Post History</div>
    <q-card v-if="posts.length">
      <q-card-section class="row bg-color-primary">
        <div class="col">
          Post #
          <q-btn
            v-if="viewState.desc"
            flat
            round
            size="xs"
            icon="fas fa-arrow-down-long"
            @click="toggleSort"
          />
          <q-btn
            v-else
            flat
            round
            size="xs"
            icon="fas fa-arrow-up-long"
            @click="toggleSort"
          />
        </div>
        <div class="col">Working Title</div>
        <div class="col">
          <div class="row">
            <div>Created On</div>
            <q-space />
            <div>
              <q-btn
                flat
                rounded
                size="xs"
                icon="fas fa-square-minus"
                @click="collapseAll"
              />
            </div>
          </div>
        </div>
      </q-card-section>
      <q-expansion-item
        v-model="viewState.expansion[JSON.stringify(post.id)]"
        v-for="(post, i) in posts"
        :key="JSON.stringify(post.id)"
        dense
        hide-expand-icon
        expand-separator
        class="row data-rows"
        :header-class="{
          'full-width': true,
          'bg-color-primary color-text':
            viewState.expansion[JSON.stringify(post.id)],
        }"
        @click="loadDrafts(post.id)"
      >
        <template v-slot:header>
          <div class="row full-width">
            <div v-if="viewState.desc" class="col">
              {{ (posts.length - i).toString().padStart(4, '0') }}
            </div>
            <div v-else class="col">
              {{ (i + 1).toString().padStart(4, '0') }}
            </div>
            <div class="col">{{ post.working_title }}</div>
            <div class="col">
              {{
                dayjs((post.meta as Meta).created_on).format(
                  'MM/DD/YYYY hh:mm:ss a'
                )
              }}
            </div>
          </div>
        </template>

        <q-card>
          <q-card-section class="row bg-color-accent color-dark-page">
            <div class="col">Published</div>
            <div class="col">Draft Title</div>
            <div class="col">Created On</div>
            <div class="col">Author</div>
          </q-card-section>
          <div
            v-if="
              drafts[JSON.stringify(post.id)] &&
              drafts[JSON.stringify(post.id)].length > 0
            "
          >
            <q-card-section
              v-for="draft in drafts[JSON.stringify(post.id)]"
              :key="JSON.stringify(draft.draftId)"
              class="row align-center"
            >
              <div class="col">
                <q-btn
                  v-if="draft.published"
                  round
                  size="xs"
                  icon="fas fa-eye-slash"
                  color="negative"
                  class="q-mr-xs"
                  style="position: relative; top: -2px"
                  @click="togglePublished(draft.draftId, draft.published)"
                />
                <q-btn
                  v-else
                  round
                  size="xs"
                  icon="fas fa-eye"
                  color="positive"
                  class="q-mr-xs"
                  style="position: relative; top: -2px"
                  @click="togglePublished(draft.draftId, draft.published)"
                />
                <span>
                  {{ draft.published }}
                </span>
              </div>
              <div class="col">{{ draft.title }}</div>
              <div class="col">
                {{ dayjs(draft.at).format('MM/DD/YYYY hh:mm:ss a') }}
              </div>
              <div class="col">
                <person-profile-inline :person-id="draft.author" />
              </div>
            </q-card-section>
          </div>
          <div v-else>
            <q-card-section v-for="n in 3" :key="n" class="row">
              <div class="col">
                <q-skeleton width="75px" type="text" />
              </div>
              <div class="col">
                <q-skeleton width="175px" type="text" />
              </div>
              <div class="col">
                <q-skeleton width="250px" type="text" />
              </div>
              <div class="col">
                <q-skeleton width="125px" type="QBadge" />
              </div>
            </q-card-section>
          </div>
        </q-card>
      </q-expansion-item>
      <q-card-actions class="bg-color-primary row q-pa-xs">
        <q-space />
        <q-btn dense flat round icon="fas fa-chevron-left"></q-btn>
        <q-select
          dense
          use-chips
          popup-content-class="color-text bg-color-primary"
          class="q-mx-sm"
          v-model="recordSelectAmount"
          :options="[5, 10, 15, 20]"
        >
          <template v-slot:selected-item="scope">
            <q-chip class="q-ma-none">{{ scope.opt }}</q-chip>
          </template>
          <template v-slot:option="scope">
            <q-item
              v-bind="scope.itemProps"
              v-if="!scope.selected"
              clickable
              class="row justify-center q-py-md"
            >
              {{ scope.opt }}
            </q-item>
            <q-item
              v-else
              class="row justify-center q-py-md color-accent bg-color-dark"
            >
              {{ scope.opt }}
            </q-item>
          </template>
        </q-select>
        <q-btn flat dense round icon="fas fa-chevron-right"></q-btn>
      </q-card-actions>
    </q-card>
    <table-skeleton v-else />
  </q-page>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { TableSkeleton } from 'src/components/skeletons';
import { Meta } from 'src/models/meta';
import { Post, PostVersion, usePostStore } from 'src/models/post';
import { Ref, onMounted, reactive, ref, watch } from 'vue';
import PersonProfileInline from 'src/models/person/components/PersonProfileInline.vue';
import { QSelect } from 'quasar';

const { getPosts, getPostDrafts, publishDraft, unpublishDraft } =
  usePostStore();
const recordSelectAmount = ref(5);
const posts: Ref<Post[]> = ref([]);
const drafts: Record<string, PostVersion[]> = reactive({});

const viewState: Ref<{ desc: boolean; expansion: Record<string, boolean> }> =
  ref({ desc: true, expansion: {} });

watch(posts, () => {
  posts.value.forEach((p) => {
    viewState.value.expansion[JSON.stringify(p.id)] = false;
  });
});

onMounted(async () => {
  posts.value = await getPosts();
});

const toggleSort = () => {
  posts.value.reverse();
  viewState.value.desc = !viewState.value.desc;
};

const loadDrafts = async (postId: string) => {
  if (drafts[JSON.stringify(postId)]) return;
  drafts[JSON.stringify(postId)] = await getPostDrafts(postId);
};

const collapseAll = () => {
  Object.keys(viewState.value.expansion).forEach(
    (k) => (viewState.value.expansion[k] = false)
  );
};

const togglePublished = async (draftId: string, isPublished: boolean) => {
  console.log('toggling published for draft:');
  isPublished ? await unpublishDraft(draftId) : await publishDraft(draftId);
};
</script>

<style lang="scss">
.post-history {
  .data-rows {
    background-color: $grey-3;
    color: $dark-page;

    .q-expansion-item__border--bottom {
      border-bottom: 4px groove $secondary;
    }
  }

  .q-expansion-item__container {
    width: 100%;

    .q-item {
      padding: 8px;
    }
  }

  .q-select {
    .q-field__control::before {
      border: none;
    }

    .q-field__native {
      color: $text-color !important;
    }

    .q-field__append {
      color: $text-color !important;
      border: none;
    }
  }
}
</style>
