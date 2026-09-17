<template>
  <q-page class="n-page q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="text-h5">Estimated payments &mdash; {{ store.year }}</div>
      <q-space />
      <q-btn flat label="Back to finances" :to="{ name: RouteNames.FINANCE }" />
    </div>

    <!-- Payments already sent to a taxing authority. These are what the
         quarterly estimate nets against — recording one here is what makes
         "amount due this quarter" reflect what's actually still owed. -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-subtitle2 q-mb-sm">Record a payment</div>
        <q-form class="row q-col-gutter-sm items-start" @submit.prevent="save">
          <q-select
            v-model="form.jurisdiction"
            :options="jurisdictionOptions"
            emit-value
            map-options
            dense
            outlined
            label="Jurisdiction"
            class="col-6 col-md-2" />
          <q-select
            v-model="form.quarter"
            :options="quarterOptions"
            emit-value
            map-options
            dense
            outlined
            label="For quarter"
            class="col-6 col-md-2" />
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
            label="Date paid"
            :rules="[required]"
            class="col-6 col-md-2" />
          <q-input
            v-model="form.note"
            dense
            outlined
            label="Note"
            class="col-12 col-md-4" />

          <div class="col-12">
            <q-btn type="submit" color="primary" :loading="saving" label="Add payment" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <q-table
      flat
      bordered
      :rows="store.payments"
      :columns="columns"
      row-key="id"
      :loading="store.loading"
      :pagination="{ rowsPerPage: 25 }">
      <template #body-cell-actions="props">
        <q-td :props="props" class="text-right">
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
    Jurisdiction,
    Quarter,
    TaxPayment,
    UpsertPaymentArgs,
    formatMoney,
    quarterForDate,
    useFinanceStore,
  } from 'src/models/finance';
  import { RouteNames } from 'src/router/routes';
  import { onMounted, reactive, ref } from 'vue';

  const store = useFinanceStore();
  const $q = useQuasar();

  const saving = ref(false);

  const blank = () => ({
    jurisdiction: Jurisdiction.FEDERAL,
    quarter: quarterForDate(new Date()),
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    note: '',
  });

  const form = reactive(blank());

  const required = (v: string) => !!v || 'Required';
  const decimal = (v: string) =>
    !v || /^-?\d+(\.\d{1,2})?$/.test(v) || 'Use a number like 1234.56';

  const jurisdictionOptions = [
    { label: 'Federal', value: Jurisdiction.FEDERAL },
    { label: 'State', value: Jurisdiction.STATE },
    { label: 'Municipal', value: Jurisdiction.MUNICIPAL },
  ];

  const quarterOptions = [
    { label: 'Q1 (Jan-Mar)', value: Quarter.Q1 },
    { label: 'Q2 (Apr-May)', value: Quarter.Q2 },
    { label: 'Q3 (Jun-Aug)', value: Quarter.Q3 },
    { label: 'Q4 (Sep-Dec)', value: Quarter.Q4 },
  ];

  const columns: QTableColumn<TaxPayment>[] = [
    { name: 'date', label: 'Date', field: 'date', align: 'left', sortable: true },
    { name: 'quarter', label: 'Quarter', field: 'quarter', align: 'left' },
    { name: 'jurisdiction', label: 'Jurisdiction', field: 'jurisdiction', align: 'left' },
    {
      name: 'amount',
      label: 'Amount',
      align: 'right',
      field: 'amount',
      format: (v) => formatMoney(v as string),
    },
    { name: 'note', label: 'Note', align: 'left', field: (r) => r.note ?? '' },
    { name: 'actions', label: '', align: 'right', field: 'id' },
  ];

  const toArgs = (): UpsertPaymentArgs => ({
    year: store.year,
    quarter: form.quarter,
    jurisdiction: form.jurisdiction,
    amount: form.amount,
    date: form.date,
    note: form.note || null,
  });

  const save = async () => {
    saving.value = true;
    try {
      await store.addPayment(toArgs());
      Object.assign(form, blank());
    } catch (e) {
      $q.notify({ type: 'negative', message: `Could not save payment: ${e}` });
    } finally {
      saving.value = false;
    }
  };

  const remove = async (record: TaxPayment) => {
    $q.dialog({
      title: 'Delete payment',
      message: `Remove the ${formatMoney(record.amount)} ${record.jurisdiction} payment for ${record.quarter}?`,
      cancel: true,
    }).onOk(async () => {
      try {
        await store.removePayment(record.id);
      } catch (e) {
        $q.notify({ type: 'negative', message: `Could not delete payment: ${e}` });
      }
    });
  };

  onMounted(async () => {
    try {
      if (!store.summary) await store.loadAll();
    } catch (e) {
      $q.notify({ type: 'negative', message: `Could not load payments: ${e}` });
    }
  });
</script>

<style scoped lang="scss">
  .n-page {
    max-width: 1200px;
    margin: 0 auto;
  }
</style>
