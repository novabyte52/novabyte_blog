<template>
  <q-badge
    v-if="verifiedPerson"
    class="n-card n-inline bg-color-primary color-text q-pa-xs"
  >
    <astronaut-helmet class="q-mr-xs" :color="Colors.SECONDARY" :size="16" />
    {{ verifiedPerson.username }}
  </q-badge>
  <q-skeleton v-else type="QBadge" />
</template>

<script setup lang="ts">
import { AstronautHelmet } from 'src/components';
import { Colors } from 'src/css';
import { Person, usePersonStore } from 'src/models/person';
import { ref, watch } from 'vue';

const props = defineProps<{ person?: Person; personId?: string }>();

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
      verifiedPerson.value = await personStore.getPerson(newId as string);
    }
  },
  {
    immediate: true,
  }
);
</script>

<style scoped lang="scss">
.n-inline {
  border-width: 3px;
}
</style>
