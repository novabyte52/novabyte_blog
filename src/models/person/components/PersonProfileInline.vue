<template>
  <q-badge
    v-if="verifiedPerson"
    class="n-card n-inline bg-color-secondary color-primary"
  >
    <q-icon name="fas fa-user-astronaut" class="q-pr-xs" />
    {{ verifiedPerson.username }}
  </q-badge>
  <q-skeleton v-else type="QBadge" />
</template>

<script setup lang="ts">
import { thingToString } from 'src/models/meta';
import { Person, usePersonStore } from 'src/models/person';
import { Thing } from '../meta';
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
      console.log('person profile inline watch:', newId);
      verifiedPerson.value = await personStore.fetchPerson(newId as Thing);
    }
  },
  {
    immediate: true,
  }
);
</script>

<style scoped lang="scss"></style>
