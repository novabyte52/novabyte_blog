<template>
  <q-page class="n-page post-history">
    <div class="text-h1 text-center n-h1">Post History</div>
    <!--
      MARK: sub-rows-key-prop-name is for some reason force setting the generic
      to only think SR has the draft_id prop
    -->
    <n-expandable-table
      v-if="posts.length"
      :model-value="posts"
      :sub-rows="drafts"
      :rows-key-prop-name="'id'"
      :sub-rows-key-prop-name="'draft_id'"
      :row-click="(key) => loadDrafts(key)"
    >
      <template v-slot:header>
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
      </template>

      <template v-slot:row="rowProps">
        <div class="row full-width">
          <div v-if="viewState.desc" class="col">
            {{ (posts.length - rowProps.index).toString().padStart(4, '0') }}
          </div>
          <div v-else class="col">
            {{ (rowProps.index + 1).toString().padStart(4, '0') }}
          </div>
          <div class="col">{{ rowProps.row.working_title }}</div>
          <div class="col">
            {{
              dayjs((rowProps.row.meta as Meta).created_on).format(
                'MM/DD/YYYY hh:mm:ss a'
              )
            }}
          </div>
        </div>
      </template>

      <template v-slot:sub-header>
        <div class="col">Published</div>
        <div class="col">Draft Title</div>
        <div class="col">Created On</div>
        <div class="col">Author</div>
      </template>

      <!-- MARK: this works, but is due to component generics not covering this case i think -->
      <template v-slot:sub-row="srp: { subRow: PostVersion }">
        <div class="col">
          <q-btn
            v-if="srp.subRow.published"
            round
            size="xs"
            icon="fas fa-eye-slash"
            color="negative"
            class="q-mr-xs"
            style="position: relative; top: -2px"
            @click="togglePublished(srp.subRow)"
          />
          <q-btn
            v-else
            round
            size="xs"
            icon="fas fa-eye"
            color="positive"
            class="q-mr-xs"
            style="position: relative; top: -2px"
            @click="togglePublished(srp.subRow)"
          />
          <span>
            {{ srp.subRow.published }}
          </span>
        </div>
        <div class="col">{{ srp.subRow.title }}</div>
        <div class="col">
          {{ dayjs(srp.subRow.at).format('MM/DD/YYYY hh:mm:ss a') }}
        </div>
        <div class="col">
          <person-profile-inline :person-id="srp.subRow.author" />
        </div>
      </template>
    </n-expandable-table>
  </q-page>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import NExpandableTable from 'src/components/NExpandableTable.vue';
import { Meta } from 'src/models/meta';
import PersonProfileInline from 'src/models/person/components/PersonProfileInline.vue';
import {
  Post,
  PostVersion,
  usePostClient,
  usePostStore,
} from 'src/models/post';
import { Ref, onMounted, ref, watch } from 'vue';

const { getPosts } = usePostClient();
const { updatePostDrafts, publishDraft, unpublishDraft, postDrafts, setDraft } =
  usePostStore();
const posts: Ref<Post[]> = ref([]);
const drafts: Ref<Map<string, PostVersion[]>> = ref(new Map());

const viewState: Ref<{ desc: boolean; expansion: Record<string, boolean> }> =
  ref({ desc: true, expansion: {} });

watch(posts, () => {
  posts.value.forEach((p) => {
    viewState.value.expansion[p.id] = false;
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
  if (drafts.value.get(postId)) return;

  await updatePostDrafts(postId);

  const draftsComputed = postDrafts(postId);

  drafts.value.set(postId, draftsComputed.value);
};

const collapseAll = () => {
  Object.keys(viewState.value.expansion).forEach(
    (k) => (viewState.value.expansion[k] = false)
  );
};

const togglePublished = async (draft: PostVersion) => {
  const updatedDraft = draft.published
    ? await unpublishDraft(draft.draft_id)
    : await publishDraft(draft.draft_id);

  console.log('updated draft after toggle: ', updatedDraft);

  setDraft(updatedDraft);
};
</script>
