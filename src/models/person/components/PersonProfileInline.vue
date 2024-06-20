<template>
  <q-card class="n-card n-inline bg-color-secondary">
    <q-card-section v-if="verifiedPerson">
      {{ verifiedPerson.username }}
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { Thing } from 'src/models/meta';
import { Person, usePersonStore } from 'src/models/person';
import { ref, watch } from 'vue';

const props = defineProps<{ person?: Person; personId?: Thing }>();

const personStore = usePersonStore();

const verifiedPerson = ref<Person | undefined>();

watch(
  () => [props.person, props.personId],
  async ([newPerson, newId]) => {
    if (newPerson) {
      verifiedPerson.value = newPerson as Person;
      return;
    }

    if (newId) {
      verifiedPerson.value = await personStore.fetchPerson(newId as Thing);
    }
  },
  {
    immediate: true,
  }
);
</script>

<style scoped lang="scss"></style>
