<template>
  <q-page class="n-page">
    <div class="row justify-center">
      <q-card class="col-7 q-px-xl q-py-lg q-mt-xl">
        <log-in-form />
        <!-- <p class="text-h2">Log In</p>
        <q-form @submit="onSubmit">
          <q-input
            v-model="email"
            label="E-Mail"
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
          <q-card-actions align="center">
            <q-btn type="submit" label="Launch" color="secondary" />
          </q-card-actions>
        </q-form> -->
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import LogInForm from 'src/models/person/components/forms/LogInForm.vue';
// import { usePersonClient } from 'src/models/person';
// import { ref } from 'vue';
// import { isEmail } from 'validator';

// const pc = usePersonClient();

// const email = ref('');
// const password = ref('');

// const onSubmit = async () => {
//   const token = await pc.logIn(email.value, password.value);
//   localStorage.setItem('nbToken', token.token);
// };
</script>
