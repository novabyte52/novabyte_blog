<template>
  <q-card class="n-card">
    <q-card-section>
      <p class="text-h4">Create Post</p>
    </q-card-section>
    <q-card-section>
      <q-input
        autogrow
        v-model="postData"
        type="textarea"
        class="q-pt-none"
        input-class="n-input"
      />
    </q-card-section>
    <q-card-actions align="center">
      <q-btn class="n-btn" @click="sendCreatePostCall">create post</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';
import { ref } from 'vue';
import { Post } from '../post';
import { Table } from '../../meta';
import { Person } from '../../person/person';

const postData = ref('');
const createPostReturn = ref();

const sendCreatePostCall = async () => {
  console.log('sending create post call');
  createPostReturn.value = await api.post('/posts', {
    meta: {
      id: {
        tb: Table.POST,
      },
    },
    markdown: postData.value,
    author: {
      meta: {
        id: {
          tb: Table.PERSON,
        },
      },
      email: 'novabyte@novabyte.blog',
      username: 'novabyte',
    } as Person,
  } as Post);
};
</script>
