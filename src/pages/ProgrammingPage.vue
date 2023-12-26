<template>
  <q-page class="n-page">
    <n-banner title="PROGRAMMING">
      <p>
        This is one domain in which I would be so bold as to claim to excel at.
        As such, it also is the one I probably spend the most time within. A
        mixture of fascinations with
        <b
          >futuristic possibilities, robots, space, video games, ai, etc. and a
          particular fascination with how visuals get put on the screen</b
        >
        led me down a path in computer science. I graduated with an Associates
        of Business?: Information Technology degree and a Bachelor's of Science:
        Computer Science from Northern Kentucky University. Professionally, so
        far, I've been a software engineer doing full-stack web app dev. This,
        however, is where I get to spend as much time as I want doing whatever I
        want.
      </p>
      <br />
      <br />
      <b>TL;DR;</b>&nbsp;You see that bold bit up there? That's what I do here.
    </n-banner>
    <q-separator class="n-separator" />
    <div class="text-h3">CRUD tester</div>
    <div class="row q-pa-sm justify-evenly items-center">
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
      <q-card>
        <q-btn class="n-btn" @click="sendGetPostCall">get post</q-btn>
      </q-card>
      <q-card>
        <q-btn class="n-btn" @click="sendGetPostsCall">get posts</q-btn>
      </q-card>
      <q-card>
        <q-btn class="n-btn" @click="sendDeletePostCall">delete post</q-btn>
      </q-card>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import { api } from 'src/boot/axios';
import NBanner from 'src/components/NBanner.vue';
import { ref } from 'vue';

// const foo = ref();
// foo.value = await api.get('/posts/01HJ4T9031ZWV6N8XM17Z9XV9C');

const createPostReturn = ref();
const postData = ref('');
const getPostReturn = ref();
const getPostsReturn = ref();
const deletePostReturn = ref();

const sendCreatePostCall = async () => {
  console.log('sending create post call');
  createPostReturn.value = await api.post('/posts');
};
const sendGetPostCall = async () => {
  console.log('sending get post call');
  createPostReturn.value = await api.get('/posts/01HJ4T9031ZWV6N8XM17Z9XV9C');
};
const sendGetPostsCall = async () => {
  console.log('sending get posts call');
  getPostsReturn.value = await api.get('/posts');
};
const sendDeletePostCall = () => {
  console.log('sending delete post call');
};
</script>
