<template>
  <q-card v-if="props.modelValue.length" class="n-expandable-table">
    <q-card-section class="row bg-color-primary">
      <slot name="header"></slot>
    </q-card-section>
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

      <q-card>
        <q-card-section class="row bg-color-accent color-dark-page">
          <slot name="sub-header"></slot>
        </q-card-section>

        <div
          v-if="
            props.subRows.get(row[props.rowsKeyPropName]) && props.subRows.get(row[props.rowsKeyPropName])?.length as number > 0
          "
        >
          <q-card-section
            v-for="subRow in props.subRows.get(row[props.rowsKeyPropName])"
            :key="subRow[props.subRowsKeyPropName]"
            class="row align-center"
          >
            <slot name="sub-row" :sub-row="subRow"></slot>
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
  generic="R extends {[Property in keyof R]: any}, SR, M extends Map<string, {[Property in keyof SR]: any}[]>"
>
import { Ref, ref } from 'vue';
import { TableSkeleton } from 'src/components/skeletons';

const props = defineProps<{
  modelValue: R[];
  rowsKeyPropName: keyof R;
  subRows: M;
  subRowsKeyPropName: keyof SR;
  rowClick: (key: string) => void;
}>();

const recordSelectAmount = ref(5);

const viewState: Ref<{ expansion: Record<string, boolean> }> = ref({
  expansion: {},
});
</script>

<style lang="scss">
.n-expandable-table {
  .data-rows {
    background-color: $grey-3;
    color: $dark-page;

    .q-expansion-item__border--bottom {
      border-bottom: 4px groove $secondary;
    }
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
}
</style>
