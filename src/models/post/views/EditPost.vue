<template>
  <q-card v-if="proxyPost" class="n-editor n-card">
    <q-card-section>
      <q-input
        ref="titleInput"
        class="text-h4"
        :model-value="proxyPost.title"
        type="text"
        label="Title"
        :shadow-text="!proxyPost.title ? 'Title' : ''"
        lazy-rules="ondemand"
        :rules="[
          (v) => {
            return !!v || 'Title is required to publish';
          },
        ]"
        @blur="titleInput?.validate()"
        @update:model-value="updateTitle"
      />
    </q-card-section>
    <q-card-section class="editor row">
      <!-- TODO: make shadow text cycle through random prompts? -->
      <!-- TODO: may switch to this https://www.npmjs.com/package/md-editor-v3 over a generic input. -->
      <q-input
        filled
        counter
        type="textarea"
        class="input col"
        input-class="poop"
        label="Content"
        :shadow-text="
          !proxyPost.markdown ? 'Laying the road one brick at a time...' : ''
        "
        :model-value="proxyPost.markdown"
        @update:model-value="updateMarkdown"
      />
      <render-markdown
        class="col output"
        :markdown="(marked(modelValue?.markdown ? modelValue.markdown : '') as string)"
      />
    </q-card-section>
    <q-card-section>
      <div class="text-h6">Image</div>
      <q-input
        :model-value="proxyPost.image"
        type="text"
        @update:model-value="updateImage"
      ></q-input>
      <div class="text-h6">Author</div>
      <person-profile-inline
        :person="currentPerson"
        :person-id="((modelValue as PostVersion)?.author)"
      />
    </q-card-section>
    <q-card-actions>
      <slot name="actions"></slot>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { marked } from 'marked';
import { storeToRefs } from 'pinia';
import { QInput, debounce } from 'quasar';
import PersonProfileInline from 'src/models/person/components/PersonProfileInline.vue';
import { PostVersion, RenderMarkdown } from 'src/models/post';
import { useNovaStore } from 'src/stores/nova.store';
import { Ref, ref, watch } from 'vue';

const emit = defineEmits<{
  (e: 'update:model-value', post: PostVersion): string;
}>();
const props = defineProps<{ modelValue?: PostVersion }>();

const { currentPerson } = storeToRefs(useNovaStore());

const titleInput = ref<QInput | undefined>();
const proxyPost: Ref<PostVersion | undefined> = ref();

watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) return;
    proxyPost.value = props.modelValue;
  },
  { immediate: true }
);

const updateTitle = debounce((value: string | number | null) => {
  if (!proxyPost.value) return;

  proxyPost.value.title = value as string;
  emit('update:model-value', proxyPost.value);
}, 100);

const updateMarkdown = debounce((value: string | number | null) => {
  if (!proxyPost.value) return;

  proxyPost.value.markdown = value as string;
  emit('update:model-value', proxyPost.value);
}, 100);

const updateImage = debounce((value: string | number | null) => {
  if (!proxyPost.value) return;

  proxyPost.value.image = value as string;
  emit('update:model-value', proxyPost.value);
}, 100);
</script>

<style lang="scss">
$minEditorHeight: 500px;

.n-editor {
  .editor {
    min-height: $minEditorHeight;
  }

  .input,
  .output {
    min-height: inherit;
    overflow: auto;
  }

  .input {
    resize: none;
    outline: none;
    font-size: 14px;
    font-family: 'Monaco', courier, monospace;
  }

  .output {
    background-color: $dark;
  }

  .poop {
    min-height: $minEditorHeight !important;
  }
}
</style>
