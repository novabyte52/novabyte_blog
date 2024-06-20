<template>
  <q-page class="n-page">
    <!-- <div v-html=""></div> -->
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import {useRoute} from 'vue-router';
const r = useRoute();
const {postId} = r.params;

onMounted(() => console.log('postId in route: ', postId));
</script>

<style scoped lang="scss"></style>
