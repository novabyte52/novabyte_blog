<template>
  <q-page class="n-page">
    <div class="row justify-center">
      <q-card class="col-7 q-px-xl q-py-lg q-mt-xl">
        <p class="text-h2">Sign Up</p>
        <q-form @submit="onSubmit" @reset="onReset">
          <q-input
            v-model="userName"
            label="Username"
            type="text"
            :rules="[() => userName.length > 0 || 'Username is required!']"
          />
          <q-input
            v-model="email"
            label="Email"
            type="text"
            :rules="[
              () => email.length > 0 || 'Email is required!',
              () => isEmail(email) || 'Not a valid email!',
            ]"
          />
          <q-input
            v-model="password"
            label="Password"
            type="password"
            :rules="[() => password.length > 0 || 'Password is required!']"
          />
          <q-input
            :model-value="passwordConfirmation"
            label="Confirm Password"
            type="password"
            @update:model-value="confirmPasswordMatch"
            :rules="[
              () =>
                passwordConfirmation === password || 'Passwords do not match!',
            ]"
          />
          <q-card-actions align="around" class="q-px-lg q-pt-lg">
            <q-btn
              type="submit"
              label="Launch"
              color="secondary"
              :disable="
                passwordConfirmation !== password || password.length === 0
              "
            />
            <q-btn
              type="reset"
              label="Abort"
              outline
              text-color="accent"
              class="abort"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { usePersonClient } from 'src/models/person';
import { ref } from 'vue';
import { isEmail } from 'validator';

const userName = ref('');
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');

const pc = usePersonClient();

const confirmPasswordMatch = (val: string | number | null) => {
  if (val === null) return;
  passwordConfirmation.value = val.toString();
};

const onSubmit = async () => {
  console.log('is email:', isEmail(email.value));
  // const foo = await pc.signUp(userName.value, email.value, password.value);

  // console.log('onSubmit data:', foo);
};

const onReset = () => {
  console.error('not implemented');
};
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
