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
    <div class="text-h3">id testing</div>
    <div>
      <q-card class="bg-color-primary">
        <q-card-section>
          In certain areas i am now having issues where the surrealdb IDs are
          acting weird. This is an area to mess around with the IDs.
        </q-card-section>
        <div class="text">Display</div>
        <q-card-section v-if="postIds">
          <div v-for="id in postIds" :key="JSON.stringify(id)">
            {{ id }}
          </div>
        </q-card-section>
        <q-card-section v-if="draftIds">
          <div v-for="id in draftIds" :key="JSON.stringify(id)">
            {{ id }}
          </div>
        </q-card-section>
        <q-card-actions>
          <q-btn @click="fetchIds"> Fetch IDs </q-btn>
        </q-card-actions>
      </q-card>
    </div>
    <div class="text-h3">CRUD tester</div>
    <div class="row q-pa-sm justify-evenly items-center">
      <q-card class="n-card full-width">
        <q-tabs v-model="current_tab">
          <q-tab name="person" label="Person"></q-tab>
          <q-tab name="post" label="Post"></q-tab>
        </q-tabs>
        <q-tab-panels animated v-model="current_tab">
          <q-tab-panel name="person">
            <dev-person-card />
          </q-tab-panel>
          <q-tab-panel name="post">
            <dev-post-card />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import DevPostCard from 'src/models/post/components/DevPostCard.vue';
import DevPersonCard from 'src/models/person/components/DevPersonCard.vue';
import { api } from 'src/boot/axios';
import NBanner from 'src/components/NBanner.vue';
import { Ref, ref } from 'vue';
import { usePostStore } from 'src/models/post';
import { Thing } from 'src/models/meta';

const { getPosts, getDrafts } = usePostStore();
const postIds: Ref<Thing[]> = ref([]);
const draftIds: Ref<Thing[]> = ref([]);

const fetchIds = async () => {
  const posts = await getPosts();
  const drafts = await getDrafts();
  postIds.value = posts.map((p) => p.id);
  draftIds.value = drafts.map((d) => d.id);
};

// const foo = ref();
// foo.value = await api.get('/posts/01HJ4T9031ZWV6N8XM17Z9XV9C');
type CrudTabs = 'person' | 'post';
const current_tab = ref<CrudTabs>('person');

const getPersonReturn = ref();
const getPersonsReturn = ref();
const deletePersonsReturn = ref();

const sendGetPostCall = async () => {
  console.log('sending get post call');
  // createPostReturn.value = await api.get('/posts/01HJ4T9031ZWV6N8XM17Z9XV9C');
};
const sendGetPostsCall = async () => {
  console.log('sending get posts call');
  getPersonsReturn.value = await api.get('/posts');
};
const sendDeletePostCall = () => {
  console.log('sending delete post call');
};
</script>
