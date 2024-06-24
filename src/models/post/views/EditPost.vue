<template>
  <q-card v-if="proxyPost" class="n-editor n-card">
    <q-card-section>
      <q-input
        ref="titleInput"
        class="text-h4"
        v-model="proxyPost.title"
        type="text"
        label="Title"
        :shadow-text="!proxyPost.title ? 'Title' : ''"
        lazy-rules="ondemand"
        :rules="[
          (v) => {
            console.log('=== validating title', v);
            return !!v || 'Title is required to publish';
          },
        ]"
        @blur="titleInput?.validate()"
      />
    </q-card-section>
    <q-card-section class="editor row">
      <!-- TODO: make shadow text cycle through random prompts? -->
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
        @update:model-value="update"
      />
      <render-markdown
        class="col output"
        :markdown="(marked(modelValue?.markdown ? modelValue.markdown : '') as string)"
      />
    </q-card-section>
    <q-card-section>
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
import { usePersonStore } from 'src/models/person';
import PersonProfileInline from 'src/models/person/components/PersonProfileInline.vue';
import { PostVersion, RenderMarkdown } from 'src/models/post';
import { Ref, ref, watch } from 'vue';

const emit = defineEmits<{
  (e: 'update:model-value', post: PostVersion): string;
}>();

const props = defineProps<{ modelValue?: PostVersion }>();

/**
 * TODO:
 * oddities with the store not loading until after i try to get the
 * information for the author. need to maybe fix it or make sure the
 * store is loaded before i try getting the currentPerson
 */
const { currentPerson } = storeToRefs(usePersonStore());

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

const update = debounce((value: string | number | null) => {
  if (!proxyPost.value) return;
  console.log('updating post...', proxyPost.value.author);
  proxyPost.value.markdown = value as string;
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
