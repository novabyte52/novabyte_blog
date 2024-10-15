<template>
  <q-card
    v-if="props.modelValue && props.modelValue.length"
    class="n-expandable-table"
  >
    <q-card-section class="row table-header">
      <slot name="header"></slot>
    </q-card-section>
    <div class="rows-container">
      <q-expansion-item
        v-for="(row, i) in props.modelValue"
        v-model="viewState.expansion[row[props.rowsKeyPropName]]"
        :key="row[props.rowsKeyPropName]"
        dense
        hide-expand-icon
        expand-separator
        class="row data-rows"
        :header-class="{
          'full-width': true,
          'bg-color-primary color-text':
            viewState.expansion[row[props.rowsKeyPropName]],
        }"
        @click="props.rowClick(row[props.rowsKeyPropName])"
      >
        <template v-slot:header>
          <slot name="row" :index="i" :row="row"></slot>
        </template>

        <div class="row-container">
          <q-card flat>
            <q-card-section class="row sub-header">
              <slot name="sub-header"></slot>
            </q-card-section>

            <div
              v-if="
            props.subRows.get(row[props.rowsKeyPropName]) && props.subRows.get(row[props.rowsKeyPropName])?.length as number > 0
          "
            >
              <q-card-section
                v-for="subRow in props.subRows.get(row[props.rowsKeyPropName])"
                :key="subRow[props.subRowsKeyPropName].toString()"
                class="row sub-row-container"
              >
                <slot name="sub-row" :sub-row="subRow"></slot>
              </q-card-section>
            </div>
            <div v-else>
              <table-skeleton />
            </div>
          </q-card>
        </div>
      </q-expansion-item>
    </div>

    <q-card-actions class="row q-pa-xs table-footer">
      <q-space />
      <!-- TODO: get pagination working -->
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
          <q-item v-else class="row justify-center q-py-md">
            {{ scope.opt }}
          </q-item>
        </template>
      </q-select>
      <q-btn flat dense round icon="fas fa-chevron-right"></q-btn>
    </q-card-actions>
  </q-card>
  <table-skeleton v-else />
</template>

<script setup lang="ts">
// generic="R extends {[Property in keyof R]: any}, SR, M extends Map<string, {[Property in keyof SR]: any}[]>"
import { Ref, ref } from 'vue';
import { TableSkeleton } from 'src/components/skeletons';
import { Post, PostVersion } from 'src/models/post';

const props = defineProps<{
  modelValue: Post[];
  rowsKeyPropName: keyof Omit<Post, 'meta'>;
  subRows: Map<string, PostVersion[]>;
  subRowsKeyPropName: keyof PostVersion;
  rowClick: (key: string) => void;
}>();

const recordSelectAmount = ref(5);

const viewState: Ref<{ expansion: Record<string, boolean> }> = ref({
  expansion: {},
});

// TODO: need to implement this but i need to figure out how to get the button in here
// const collapseAll = () => {
//   Object.keys(viewState.value.expansion).forEach(
//     (k) => (viewState.value.expansion[k] = false)
//   );
// };
</script>

<style lang="scss">
.n-expandable-table {
  box-shadow: none;

  .table-header {
    align-items: center;
    padding: 8px 28px 8px 28px;
    background-color: $primary;
    border: 4px outset $red;
    border-top: 4px outset $red !important;
    border-bottom: 3px dotted $red;
  }

  .rows-container {
    border-left: 4px outset $red;
    border-right: 4px outset $red;
    padding: 16px;
    background-color: $dark;
  }

  .data-rows {
    &:first-child {
      border-top: 4px inset $primary-light;
    }

    &:last-child {
      border-bottom: 4px inset $primary-light;
    }
    border-left: 4px inset $primary-light;
    border-right: 4px inset $primary-light;

    background-color: $primary;
    color: $text-color;

    .q-expansion-item__border--bottom {
      border-bottom: 4px groove $red;
    }
  }

  .row-container {
    background-color: $primary;
    color: $dark;

    .sub-header {
      border-radius: 0;
      background-color: $primary-light;
      color: $dark;
    }
  }

  .sub-row-container {
    align-items: center;
    background-color: $text-color;
    box-shadow: none;
    border: 0;
  }

  .q-expansion-item__container {
    width: 100%;

    .q-item {
      padding: 8px;
    }
  }

  .q-select {
    .q-field__control::before {
      border: none;
    }

    .q-field__native {
      color: $text-color !important;
    }

    .q-field__append {
      color: $text-color !important;
      border: none;
    }
  }

  .table-footer {
    background-color: $primary;
    border: 4px outset $red;
    border-bottom: 4px outset $red !important;
    border-top: 3px dotted $red;
  }
}
</style>
