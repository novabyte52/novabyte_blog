<template>
  <q-page class="n-page">
    <div class="row justify-center">
      <q-card class="col-7 q-px-xl q-py-lg q-mt-xl">
        <p class="text-h2">Sign Up</p>
        <q-form>
          <q-input v-model="userName" label="Username" type="text" />
          <q-input v-model="email" label="Email" type="text" />
          <q-input v-model="password" label="Password" type="text" />
          <q-input
            v-model="passwordConfirmation"
            label="Confirm Password"
            type="text"
          />
          <q-card-actions align="around" class="q-px-lg q-pt-lg">
            <q-btn label="Launch" color="secondary" />
            <q-btn label="Abort" outline text-color="accent" class="abort" />
          </q-card-actions>
        </q-form>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const userName = ref('');
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');
</script>

<style scoped lang="scss">
.abort {
  transition: 0.75s;
  &:hover {
    transition: 1.5s;
    color: $dark !important;
  }
}
</style>
