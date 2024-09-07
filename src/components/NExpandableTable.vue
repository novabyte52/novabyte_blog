<template>
  <q-card v-if="props.modelValue.length">
    <q-card-section class="row bg-color-primary">
      <slot name="header"></slot>
    </q-card-section>
    <q-expansion-item
      v-for="(row, i) in props.modelValue"
      v-model="viewState.expansion[row.id]"
      :key="row.id"
      dense
      hide-expand-icon
      expand-separator
      class="row data-rows"
      :header-class="{
        'full-width': true,
        'bg-color-primary color-text': viewState.expansion[row.id],
      }"
      @click="props.rowClick(row.id)"
    >
      <template v-slot:header>
        <slot name="row" :index="i" :row="row"></slot>
      </template>

      <q-card>
        <q-card-section class="row bg-color-accent color-dark-page">
          <slot name="sub-header"></slot>
        </q-card-section>
        <div v-if="props.subRows[row.id] && props.subRows[row.id].length > 0">
          <q-card-section
            v-for="subRow in props.subRows[row.id]"
            :key="subRow.draft_id"
            class="row align-center"
          >
            <slot name="sub-row"></slot>
          </q-card-section>
        </div>
        <div v-else>
          <table-skeleton />
        </div>
      </q-card>
    </q-expansion-item>
    <q-card-actions class="bg-color-primary row q-pa-xs">
      <q-space />
      <q-btn dense flat round icon="fas fa-chevron-left"></q-btn>
      <q-select
        dense
        use-chips
        popup-content-class="color-text bg-color-primary"
        class="q-mx-sm"
        v-model="recordSelectAmount"
        :options="[5, 10, 15, 20]"
      >
        <template v-slot:selected-item="scope">
          <q-chip class="q-ma-none">{{ scope.opt }}</q-chip>
        </template>
        <template v-slot:option="scope">
          <q-item
            v-bind="scope.itemProps"
            v-if="!scope.selected"
            clickable
            class="row justify-center q-py-md"
          >
            {{ scope.opt }}
          </q-item>
          <q-item
            v-else
            class="row justify-center q-py-md color-accent bg-color-dark"
          >
            {{ scope.opt }}
          </q-item>
        </template>
      </q-select>
      <q-btn flat dense round icon="fas fa-chevron-right"></q-btn>
    </q-card-actions>
  </q-card>
  <table-skeleton v-else />
</template>

<script
  setup
  lang="ts"
  generic="R extends {id: string}, SR extends {id: string}"
>
import { Ref, ref } from 'vue';

const props = defineProps<{
  modelValue: R[];
  rowClick: (id: string) => void;
  subRows: SR[];
}>();

const recordSelectAmount = ref(5);

const viewState: Ref<{ expansion: Record<string, boolean> }> = ref({
  expansion: {},
});
</script>

<style scoped lang="scss"></style>
