<template>
  <q-page class="n-page">
    <q-card class="editor full-height">
      <textarea class="input" :value="input" @input="update"></textarea>
      <div class="output" v-html="output"></div>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
// an example of using marked to make a markdown editor and renderer
// https://vuejs.org/examples/#markdown
import { marked } from 'marked';
import { debounce } from 'quasar';
import { ref, computed } from 'vue';

const input = ref('# hello');

const output = computed(() => marked(input.value));

const update = debounce((e) => {
  input.value = e.target.value;
}, 100);
</script>

<style scoped lang="scss">
body {
  margin: 0;
}

.editor {
  min-height: inherit;
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
  border: none;
  border-right: 1px solid #ccc;
  resize: none;
  outline: none;
  background-color: #f6f6f6;
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
