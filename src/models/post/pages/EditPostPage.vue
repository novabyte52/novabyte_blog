<template>
  <q-page class="n-page edit-post-page">
    <!-- <edit-post v-model="" /> -->
  </q-page>
</template>

<script setup lang="ts">
import { usePostClient } from 'src/models/post';
import { EditPost } from 'src/models/post';

const { /*getPost,*/ postPost } = usePostClient();

const publish = async () => {
  // await postPost(title.value, input.value);
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
