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
      <q-card class="bg-color-primary"> </q-card>
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
import NBanner from 'src/components/NBanner.vue';
import { ref } from 'vue';

type CrudTabs = 'person' | 'post';
const current_tab = ref<CrudTabs>('person');
</script>
