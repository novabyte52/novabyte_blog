<template>
  <q-page class="n-page q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="text-h5">Income &mdash; {{ store.year }}</div>
      <q-space />
      <q-btn flat label="Back to finances" :to="{ name: RouteNames.FINANCE }" />
    </div>

    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-subtitle2 q-mb-sm">
          {{ editingId ? 'Edit income' : 'Record income' }}
        </div>
        <q-form class="row q-col-gutter-sm items-start" @submit.prevent="save">
          <q-select
            v-model="form.kind"
            :options="kindOptions"
            emit-value
            map-options
            dense
            outlined
            label="Kind"
            class="col-12 col-md-3" />
          <q-input
            v-model="form.payerName"
            dense
            outlined
            :label="isWage ? 'Employer' : 'Client'"
            :rules="[required]"
            class="col-12 col-md-3" />
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
            class="col-12 col-md-2" />

          <!-- Withholding only exists on wages: an LLC distribution has no tax
               taken out at source, which is the whole reason estimates exist. -->
          <template v-if="isWage">
            <q-input
              v-model="form.withholdingFederal"
              dense
              outlined
              label="Federal withheld"
              prefix="$"
              :rules="[decimal]"
              class="col-4 col-md-2" />
            <q-input
              v-model="form.withholdingState"
              dense
              outlined
              label="State withheld"
              prefix="$"
              :rules="[decimal]"
              class="col-4 col-md-2" />
            <q-input
              v-model="form.withholdingLocal"
              dense
              outlined
              label="Local withheld"
              prefix="$"
              :rules="[decimal]"
              class="col-4 col-md-2" />
          </template>

          <q-input
            v-model="form.note"
            dense
            outlined
            label="Note"
            class="col-12 col-md-4" />

          <div class="col-12 q-gutter-sm">
            <q-btn
              type="submit"
              color="primary"
              :loading="saving"
              :label="editingId ? 'Save changes' : 'Add income'" />
            <q-btn v-if="editingId" flat label="Cancel" @click="resetForm" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <q-table
      flat
      bordered
      :rows="store.income"
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
    IncomeKind,
    IncomeRecord,
    UpsertIncomeArgs,
    formatMoney,
    payerName,
    useFinanceStore,
  } from 'src/models/finance';
  import { RouteNames } from 'src/router/routes';
  import { computed, onMounted, reactive, ref } from 'vue';

  const store = useFinanceStore();
  const $q = useQuasar();

  const saving = ref(false);
  const editingId = ref<string | undefined>();

  const blank = () => ({
    kind: IncomeKind.SELF_EMPLOYMENT_PROFIT,
    payerName: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    category: '',
    note: '',
    withholdingFederal: '',
    withholdingState: '',
    withholdingLocal: '',
  });

  const form = reactive(blank());

  const isWage = computed(() => form.kind === IncomeKind.WAGE);

  const kindOptions = [
    { label: 'W-2 wages', value: IncomeKind.WAGE },
    { label: 'LLC / self-employment', value: IncomeKind.SELF_EMPLOYMENT_PROFIT },
  ];

  const required = (v: string) => !!v || 'Required';
  const decimal = (v: string) =>
    !v || /^-?\d+(\.\d{1,2})?$/.test(v) || 'Use a number like 1234.56';

  const columns: QTableColumn<IncomeRecord>[] = [
    { name: 'date', label: 'Date', field: 'date', align: 'left', sortable: true },
    {
      name: 'kind',
      label: 'Kind',
      align: 'left',
      field: (r) => (r.kind === IncomeKind.WAGE ? 'W-2' : 'LLC'),
    },
    { name: 'payer', label: 'Payer', align: 'left', field: (r) => payerName(r.payer) },
    {
      name: 'amount',
      label: 'Amount',
      align: 'right',
      field: 'amount',
      format: (v) => formatMoney(v as string),
    },
    {
      name: 'withheld',
      label: 'Withheld',
      align: 'right',
      field: (r) =>
        r.withholding
          ? formatMoney(r.withholding.federal) + ' fed'
          : '—',
    },
    { name: 'category', label: 'Category', align: 'left', field: (r) => r.category ?? '' },
    { name: 'actions', label: '', align: 'right', field: 'id' },
  ];

  const resetForm = () => {
    Object.assign(form, blank());
    editingId.value = undefined;
  };

  const toArgs = (): UpsertIncomeArgs => ({
    kind: form.kind,
    payer: isWage.value
      ? { Employer: { name: form.payerName } }
      : { Client: { name: form.payerName } },
    amount: form.amount,
    date: form.date,
    withholding: isWage.value
      ? {
          federal: form.withholdingFederal || '0',
          state: form.withholdingState || '0',
          local: form.withholdingLocal || '0',
        }
      : null,
    category: form.category || null,
    note: form.note || null,
  });

  const save = async () => {
    saving.value = true;
    try {
      if (editingId.value) {
        await store.editIncome(editingId.value, toArgs());
      } else {
        await store.addIncome(toArgs());
      }
      resetForm();
    } catch (e) {
      $q.notify({ type: 'negative', message: `Could not save income: ${e}` });
    } finally {
      saving.value = false;
    }
  };

  const edit = (record: IncomeRecord) => {
    editingId.value = record.id;
    form.kind = record.kind;
    form.payerName = payerName(record.payer);
    form.amount = record.amount;
    form.date = record.date;
    form.category = record.category ?? '';
    form.note = record.note ?? '';
    form.withholdingFederal = record.withholding?.federal ?? '';
    form.withholdingState = record.withholding?.state ?? '';
    form.withholdingLocal = record.withholding?.local ?? '';
  };

  const remove = async (record: IncomeRecord) => {
    $q.dialog({
      title: 'Delete income',
      message: `Remove ${formatMoney(record.amount)} from ${payerName(record.payer)}?`,
      cancel: true,
    }).onOk(async () => {
      try {
        await store.removeIncome(record.id);
        if (editingId.value === record.id) resetForm();
      } catch (e) {
        $q.notify({ type: 'negative', message: `Could not delete income: ${e}` });
      }
    });
  };

  onMounted(async () => {
    try {
      if (!store.summary) await store.loadAll();
    } catch (e) {
      $q.notify({ type: 'negative', message: `Could not load income: ${e}` });
    }
  });
</script>

<style scoped lang="scss">
  .n-page {
    max-width: 1200px;
    margin: 0 auto;
  }
</style>
