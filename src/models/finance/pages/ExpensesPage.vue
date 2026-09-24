<template>
  <q-page class="n-page q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="text-h5">Expenses &mdash; {{ store.year }}</div>
      <q-space />
      <q-btn flat label="Back to finances" :to="{ name: RouteNames.FINANCE }" />
    </div>

    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-subtitle2 q-mb-sm">
          {{ editingId ? 'Edit expense' : 'Record expense' }}
        </div>
        <q-form class="row q-col-gutter-sm items-start" @submit.prevent="save">
          <q-input
            v-model="form.amount"
            dense
            outlined
            label="Amount"
            prefix="$"
            :rules="[required, decimal]"
            class="col-6 col-md-2" />
          <q-input
            v-model="form.date"
            dense
            outlined
            type="date"
            label="Date"
            :rules="[required]"
            class="col-6 col-md-2" />
          <q-input
            v-model="form.category"
            dense
            outlined
            label="Category"
            class="col-12 col-md-3" />
          <q-input
            v-model="form.note"
            dense
            outlined
            label="Note"
            class="col-12 col-md-3" />
          <div class="col-12 col-md-2">
            <q-toggle v-model="form.deductible" label="Deductible" />
          </div>

          <!-- Non-deductible rows stay in the ledger for bookkeeping but are
               excluded from net profit, so they never move the tax figure. -->
          <div v-if="!form.deductible" class="col-12 text-caption text-grey-6">
            Non-deductible expenses are recorded but excluded from the tax
            calculation.
          </div>

          <div class="col-12 q-gutter-sm">
            <q-btn
              type="submit"
              color="primary"
              :loading="saving"
              :label="editingId ? 'Save changes' : 'Add expense'" />
            <q-btn v-if="editingId" flat label="Cancel" @click="resetForm" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <q-table
      flat
      bordered
      :rows="store.expenses"
      :columns="columns"
      row-key="id"
      :loading="store.loading"
      :pagination="{ rowsPerPage: 25 }">
      <template #body-cell-actions="props">
        <q-td :props="props" class="text-right">
          <q-btn flat dense icon="fas fa-pen" size="sm" @click="edit(props.row)" />
          <q-btn
            flat
            dense
            icon="fas fa-trash"
            size="sm"
            color="negative"
            @click="remove(props.row)" />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
  import { QTableColumn, useQuasar } from 'quasar';
  import {
    ExpenseRecord,
    UpsertExpenseArgs,
    formatMoney,
    useFinanceStore,
  } from 'src/models/finance';
  import { RouteNames } from 'src/router/routes';
  import { onMounted, reactive, ref } from 'vue';

  const store = useFinanceStore();
  const $q = useQuasar();

  const saving = ref(false);
  const editingId = ref<string | undefined>();

  const blank = () => ({
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    category: '',
    note: '',
    deductible: true,
  });

  const form = reactive(blank());

  const required = (v: string) => !!v || 'Required';
  const decimal = (v: string) =>
    !v || /^-?\d+(\.\d{1,2})?$/.test(v) || 'Use a number like 1234.56';

  const columns: QTableColumn<ExpenseRecord>[] = [
    { name: 'date', label: 'Date', field: 'date', align: 'left', sortable: true },
    {
      name: 'amount',
      label: 'Amount',
      align: 'right',
      field: 'amount',
      format: (v) => formatMoney(v as string),
    },
    { name: 'category', label: 'Category', align: 'left', field: (r) => r.category ?? '' },
    {
      name: 'deductible',
      label: 'Deductible',
      align: 'left',
      field: (r) => (r.deductible ? 'Yes' : 'No'),
    },
    { name: 'note', label: 'Note', align: 'left', field: (r) => r.note ?? '' },
    { name: 'actions', label: '', align: 'right', field: 'id' },
  ];

  const resetForm = () => {
    Object.assign(form, blank());
    editingId.value = undefined;
  };

  const toArgs = (): UpsertExpenseArgs => ({
    amount: form.amount,
    date: form.date,
    category: form.category || null,
    deductible: form.deductible,
    note: form.note || null,
  });

  const save = async () => {
    saving.value = true;
    try {
      if (editingId.value) {
        await store.editExpense(editingId.value, toArgs());
      } else {
        await store.addExpense(toArgs());
      }
      resetForm();
    } catch (e) {
      $q.notify({ type: 'negative', message: `Could not save expense: ${e}` });
    } finally {
      saving.value = false;
    }
  };

  const edit = (record: ExpenseRecord) => {
    editingId.value = record.id;
    form.amount = record.amount;
    form.date = record.date;
    form.category = record.category ?? '';
    form.note = record.note ?? '';
    form.deductible = record.deductible;
  };

  const remove = async (record: ExpenseRecord) => {
    $q.dialog({
      title: 'Delete expense',
      message: `Remove ${formatMoney(record.amount)}?`,
      cancel: true,
    }).onOk(async () => {
      try {
        await store.removeExpense(record.id);
        if (editingId.value === record.id) resetForm();
      } catch (e) {
        $q.notify({ type: 'negative', message: `Could not delete expense: ${e}` });
      }
    });
  };

  onMounted(async () => {
    try {
      if (!store.summary) await store.loadAll();
    } catch (e) {
      $q.notify({ type: 'negative', message: `Could not load expenses: ${e}` });
    }
  });
</script>

<style scoped lang="scss">
  .n-page {
    max-width: 1200px;
    margin: 0 auto;
  }
</style>
