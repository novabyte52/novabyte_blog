<template>
  <q-page class="n-page edit-post-page">
    <q-card-section>
      <q-input v-model="title" type="text" label="Title" />
    </q-card-section>
    <q-card-section class="editor full-height">
      <textarea class="input" :value="input" @input="update"></textarea>
      <div class="output n-markdown" v-html="output"></div>
    </q-card-section>
    <q-card-actions>
      <q-btn class="n-btn" label="Publish" @click="publish" />
      <q-btn class="n-btn" label="Draft" />
      <q-btn class="n-btn" label="Delete" />
    </q-card-actions>
  </q-page>
</template>

<script setup lang="ts">
// an example of using marked to make a markdown editor and renderer
// https://vuejs.org/examples/#markdown
import { marked } from 'marked';
import { debounce } from 'quasar';
import { usePostClient } from 'src/models/post';
import { ref, computed } from 'vue';

const { postPost } = usePostClient();

const title = ref('');
const input = ref('# hello');
const output = computed(() => marked(input.value));

const update = debounce((e) => {
  input.value = e.target.value;
}, 100);

const publish = async () => {
  await postPost(title.value, input.value);
};
</script>

<style scoped lang="scss">
body {
  margin: 0;
}

.edit-post-page {
  min-height: inherit;
}

.editor {
  min-height: 500px;
  display: flex;
}

.input,
.output {
  min-height: inherit;
  overflow: auto;
  width: 50%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 20px;
}

.input {
  border: 1px solid black;
  background-color: white;
  border-right: none !important;
  resize: none;
  outline: none;
  font-size: 14px;
  font-family: 'Monaco', courier, monospace;
  padding: 20px;
}

.output {
  background-color: $dark;
}

code {
  color: #f66;
}
</style>
