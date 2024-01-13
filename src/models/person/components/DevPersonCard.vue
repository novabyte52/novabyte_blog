<template>
  <q-splitter v-model="splitterModel">
    <template v-slot:before>
      <q-tabs v-model="innerTab" vertical class="text-teal">
        <q-tab name="createPerson" label="Create" />
        <q-tab name="getPerson" label="Get :id" />
        <q-tab name="getPersons" label="Get All" />
        <q-tab name="deletePersons" label="Delete" />
      </q-tabs>
    </template>

    <template v-slot:after>
      <q-tab-panels
        v-model="innerTab"
        animated
        transition-prev="slide-down"
        transition-next="slide-up"
      >
        <q-tab-panel name="createPerson">
          <div class="text-h4 q-mb-md">Create</div>
          <create-person-form
            @on-response="(val) => (createPersonResponse = val)"
          />
          <q-separator />
        </q-tab-panel>

        <q-tab-panel name="getPerson">
          <div class="text-h4 q-mb-md">Get :ID</div>
          <get-person-form />
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </q-splitter>
  <q-card flat bordered>
    <q-card-section>
      <pre style="white-space: pre-wrap; color: black">{{
        createPersonResponse
      }}</pre>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CreatePersonForm from './forms/CreatePersonForm.vue';
import GetPersonForm from './forms/GetPersonForm.vue';

const splitterModel = ref(20);
const innerTab = ref('createPerson');
const createPersonResponse = ref<any>();
</script>
