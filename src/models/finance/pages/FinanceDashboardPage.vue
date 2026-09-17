<template>
  <q-page class="n-page q-pa-md">
    <div class="row items-center q-gutter-md q-mb-md">
      <div class="text-h5">Finances</div>
      <q-space />
      <q-select
        v-model="selectedYear"
        :options="yearOptions"
        dense
        outlined
        emit-value
        map-options
        label="Tax year"
        style="min-width: 120px"
        @update:model-value="onYearChange" />
      <q-select
        v-model="store.quarter"
        :options="quarterOptions"
        dense
        outlined
        emit-value
        map-options
        label="Quarter"
        style="min-width: 120px" />
      <q-select
        v-model="store.method"
        :options="methodOptions"
        dense
        outlined
        emit-value
        map-options
        label="Projection"
        style="min-width: 190px" />
    </div>

    <!-- Setup prompt. A year with no profile or no rate table is an expected
         state, not an error, so it gets a call to action rather than a toast. -->
    <q-banner v-if="store.setupNeeded" class="bg-warning text-dark q-mb-md" rounded>
      {{ store.setupNeeded }}
      <template #action>
        <q-btn flat label="Tax settings" :to="{ name: RouteNames.FINANCE_SETTINGS }" />
      </template>
    </q-banner>

    <div class="row q-col-gutter-md q-mb-md">
      <div v-for="tile in tiles" :key="tile.label" class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="n-tile">
          <q-card-section>
            <div class="text-caption text-grey-6">{{ tile.label }}</div>
            <div class="text-h6">{{ tile.value }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card flat bordered class="q-mb-md">
      <q-card-section class="row items-center q-gutter-md">
        <q-btn
          color="primary"
          icon="fas fa-calculator"
          :loading="store.estimating"
          label="Calculate quarterly estimate"
          @click="onCalculate" />
        <div v-if="estimate" class="text-caption text-grey-6">
          Period due {{ estimate.due_date }} &middot; {{ estimate.filing_status }}
        </div>
      </q-card-section>

      <template v-if="estimate">
        <q-separator />
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-card flat bordered class="n-headline">
                <q-card-section>
                  <div class="text-caption text-grey-6">Federal (1040-ES)</div>
                  <div class="text-h4">{{ formatMoney(estimate.federal_amount_due) }}</div>
                  <div class="text-caption text-grey-6">
                    basis: {{ basisLabel(federalDue?.basis) }}
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div
              v-for="due in otherJurisdictions"
              :key="due.jurisdiction"
              class="col-12 col-md-4">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-caption text-grey-6">{{ due.jurisdiction }}</div>
                  <div class="text-h5">{{ formatMoney(due.amount_due) }}</div>
                  <div class="text-caption text-grey-6">
                    {{ formatMoney(due.withholding_to_date) }} withheld &middot;
                    {{ formatMoney(due.payments_made) }} paid
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <div class="text-subtitle2 q-mt-lg q-mb-sm">
            How this was calculated
          </div>
          <!-- The full worked breakdown. The point of showing every step is
               that the number can be checked rather than trusted. -->
          <div class="n-scroll-x">
            <q-markup-table flat dense bordered>
              <thead>
                <tr>
                  <th class="text-left">Step</th>
                  <th class="text-right">Amount</th>
                  <th class="text-left">Detail</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(line, i) in estimate.lines" :key="i">
                  <td class="text-left">{{ line.label }}</td>
                  <td class="text-right">{{ formatMoney(line.amount) }}</td>
                  <td class="text-left text-grey-6">{{ line.detail }}</td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
        </q-card-section>
      </template>
    </q-card>

    <div class="row q-gutter-sm">
      <q-btn outline label="Income" :to="{ name: RouteNames.FINANCE_INCOME }" />
      <q-btn outline label="Expenses" :to="{ name: RouteNames.FINANCE_EXPENSES }" />
      <q-btn outline label="Payments" :to="{ name: RouteNames.FINANCE_PAYMENTS }" />
      <q-btn outline label="Tax settings" :to="{ name: RouteNames.FINANCE_SETTINGS }" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
  import { useQuasar } from 'quasar';
  import {
    EstimateBasis,
    ProjectionMethod,
    Quarter,
    addMoney,
    formatMoney,
    useFinanceStore,
  } from 'src/models/finance';
  import { RouteNames } from 'src/router/routes';
  import { computed, onMounted, ref } from 'vue';

  const store = useFinanceStore();
  const $q = useQuasar();

  const selectedYear = ref(store.year);

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear + 1 - i).map(
    (y) => ({ label: `${y}`, value: y })
  );

  const quarterOptions = [
    { label: 'Q1 (Jan-Mar)', value: Quarter.Q1 },
    { label: 'Q2 (Apr-May)', value: Quarter.Q2 },
    { label: 'Q3 (Jun-Aug)', value: Quarter.Q3 },
    { label: 'Q4 (Sep-Dec)', value: Quarter.Q4 },
  ];

  const methodOptions = [
    { label: 'Annualize year-to-date', value: ProjectionMethod.ANNUALIZED },
    { label: 'Year-to-date is final', value: ProjectionMethod.YTD_AS_FINAL },
  ];

  const estimate = computed(() => store.estimate);

  const federalDue = computed(() =>
    estimate.value?.due_by_jurisdiction.find((d) => d.jurisdiction === 'Federal')
  );

  const otherJurisdictions = computed(
    () =>
      estimate.value?.due_by_jurisdiction.filter(
        (d) => d.jurisdiction !== 'Federal'
      ) ?? []
  );

  const basisLabel = (basis?: EstimateBasis) =>
    basis === EstimateBasis.SAFE_HARBOR
      ? 'prior-year safe harbor'
      : 'this year’s projection';

  const tiles = computed(() => {
    const s = store.summary;
    return [
      { label: 'W-2 wages', value: formatMoney(s?.ytd.wages) },
      { label: 'LLC gross', value: formatMoney(s?.ytd.se_gross) },
      { label: 'Net LLC profit', value: formatMoney(s?.ytd.se_net) },
      { label: 'Withheld + paid', value: formatMoney(addMoney(s?.withholding_to_date, s?.payments_made)) },
    ];
  });

  const onCalculate = async () => {
    try {
      await store.calculateEstimate();
    } catch (e) {
      $q.notify({ type: 'negative', message: `Could not calculate the estimate: ${e}` });
    }
  };

  const onYearChange = async (value: number) => {
    try {
      await store.setYear(value);
    } catch (e) {
      $q.notify({ type: 'negative', message: `Could not load ${value}: ${e}` });
    }
  };

  onMounted(async () => {
    try {
      await Promise.all([store.loadAll(), store.loadRuleYears()]);
    } catch (e) {
      $q.notify({ type: 'negative', message: `Could not load finances: ${e}` });
    }
  });
</script>

<style scoped lang="scss">
  .n-page {
    max-width: 1200px;
    margin: 0 auto;
  }

  .n-headline {
    border-color: $primary;
  }

  // Wide breakdown tables scroll inside their own container rather than
  // pushing the page sideways.
  .n-scroll-x {
    overflow-x: auto;
  }
</style>
