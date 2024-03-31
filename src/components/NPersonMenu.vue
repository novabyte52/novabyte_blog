<template>
  <n-menu
    :model-value="isShown"
    class="n-person-menu"
    @update:model-value="onMenuToggle"
  >
    <div class="row no-wrap q-pa-md">
      <div v-if="!isAuthenticated" class="column">
        <log-in-form :dense="true" @logging-in="onLoggingIn" />
        <p class="text-dark q-mb-none q-mt-md">Don't have an account?</p>
        <router-link to="/signup"> Sign Up </router-link>
      </div>
      <!-- <div v-else class="column">
        <pre class="text-dark">e: {{ currentPerson?.email }}</pre>
      </div>

      <q-separator v-if="isAuthenticated" vertical inset class="q-mx-lg" /> -->

      <div v-if="isAuthenticated" class="column items-center">
        <q-avatar size="72px">
          <q-icon
            size="48px"
            class="person-avatar"
            name="fas fa-user-astronaut"
          ></q-icon>
          <!-- <img src="https://cdn.quasar.dev/img/avatar4.jpg" /> -->
        </q-avatar>

        <div class="text-subtitle1 text-dark q-mt-md q-mb-xs">
          {{ currentPerson?.username }}
        </div>

        <q-btn
          push
          color="primary"
          label="Logout"
          size="sm"
          @click="onLogoutClick"
        />
      </div>
    </div>
  </n-menu>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { QBtn } from 'quasar';
import { usePersonStore } from 'src/models/person';
import LogInForm from 'src/models/person/components/forms/LogInForm.vue';
import { ref } from 'vue';
import NMenu from './NMenu.vue';

const { logOut } = usePersonStore();
const { currentPerson, isAuthenticated } = storeToRefs(usePersonStore());

const isShown = ref(false);

const onMenuToggle = (val: boolean) => {
  isShown.value = val;
};

const onLoggingIn = () => {
  isShown.value = false;
};

const onLogoutClick = () => {
  isShown.value = false;
  logOut();
};
</script>

<style scoped lang="scss">
.n-person-menu {
  min-width: 3em;

  .person-avatar {
    height: 100%;
    width: 100%;
    background-color: $dark;
    color: $secondary;
  }
}
</style>
