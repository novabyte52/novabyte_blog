<template>
  <q-page class="n-page q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="text-h5">Tax settings &mdash; {{ store.year }}</div>
      <q-space />
      <q-btn flat label="Back to finances" :to="{ name: RouteNames.FINANCE }" />
    </div>

    <!-- Rate tables. These describe the law rather than the person, so they
         are shared: seeding a year loads the server's committed defaults. -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-subtitle2 q-mb-sm">Rate tables</div>
        <div class="text-caption text-grey-6 q-mb-sm">
          Configured years: {{ store.ruleYears?.configured.join(', ') || 'none' }}
        </div>
        <div class="row q-gutter-sm items-center">
          <q-select
            v-model="seedYear"
            :options="seedOptions"
            dense
            outlined
            emit-value
            map-options
            label="Year"
            style="min-width: 120px" />
          <q-btn
            outline
            color="primary"
            label="Load default rates"
            :loading="seeding"
            :disable="seedYear === null"
            @click="confirmSeed" />
        </div>
        <div class="text-caption text-grey-6 q-mt-sm">
          Loading defaults overwrites any rates already saved for that year.
          Verify them against the IRS, Ohio, and your municipality before
          relying on the result.
        </div>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-subtitle2 q-mb-sm">
          Your {{ store.year }} tax profile
        </div>
        <q-form class="row q-col-gutter-sm items-start" @submit.prevent="save">
          <q-select
            v-model="form.filing_status"
            :options="filingOptions"
            emit-value
            map-options
            dense
            outlined
            label="Filing status"
            class="col-12 col-md-4" />
          <q-select
            v-model="form.state"
            :options="stateOptions"
            emit-value
            map-options
            dense
            outlined
            label="State"
            hint="More states arrive as the rate tables cover them"
            :rules="[required]"
            class="col-6 col-md-2" />
          <q-input
            v-model="form.city"
            dense
            outlined
            label="Municipality"
            hint="Slug from the rate table, e.g. toledo-oh"
            class="col-6 col-md-3" />
          <q-input
            v-model="form.prior_year_total_tax"
            dense
            outlined
            label="Prior-year total tax"
            prefix="$"
            hint="Enables the safe-harbor estimate"
            :rules="[decimal]"
            class="col-6 col-md-3" />
          <q-input
            v-model="form.prior_year_agi"
            dense
            outlined
            label="Prior-year AGI"
            prefix="$"
            hint="Determines the 110% high-income safe-harbor rate"
            :rules="[decimal]"
            class="col-6 col-md-3" />

          <div class="col-12">
            <q-toggle
              v-model="form.prefer_itemized"
              label="Always itemize" />
            <div class="text-caption text-grey-6">
              Off by default, which takes whichever of the standard or itemized
              deduction is larger. Turn this on only when itemizing is required
              regardless.
            </div>
          </div>

          <div class="col-12">
            <div class="text-subtitle2 q-mt-md q-mb-xs">Itemized deductions</div>
            <div
              v-for="(deduction, i) in form.deductions"
              :key="i"
              class="row q-col-gutter-sm q-mb-xs items-center">
              <q-input
                v-model="deduction.label"
                dense
                outlined
                label="Label"
                class="col-12 col-md-4" />
              <q-input
                v-model="deduction.amount"
                dense
                outlined
                label="Amount"
                prefix="$"
                :rules="[decimal]"
                class="col-8 col-md-3" />
              <div class="col-4 col-md-2">
                <q-btn
                  flat
                  dense
                  color="negative"
                  icon="fas fa-trash"
                  @click="form.deductions.splice(i, 1)" />
              </div>
            </div>
            <q-btn
              flat
              dense
              icon="fas fa-plus"
              label="Add deduction"
              @click="form.deductions.push({ label: '', amount: '' })" />
          </div>

          <div class="col-12 q-mt-md">
            <q-btn
              type="submit"
              color="primary"
              :loading="saving"
              label="Save tax profile" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
  import { useQuasar } from 'quasar';
  import {
    Deduction,
    FilingStatus,
    UpsertTaxProfileArgs,
    useFinanceStore,
  } from 'src/models/finance';
  import { RouteNames } from 'src/router/routes';
  import { computed, onMounted, reactive, ref, watch } from 'vue';

  const store = useFinanceStore();
  const $q = useQuasar();

  const saving = ref(false);
  const seeding = ref(false);
  const seedYear = ref<number | null>(null);

  const form = reactive({
    filing_status: FilingStatus.SINGLE,
    state: 'OH',
    city: '',
    prefer_itemized: false,
    prior_year_total_tax: '',
    prior_year_agi: '',
    deductions: [] as Deduction[],
  });

  const filingOptions = [
    { label: 'Single', value: FilingStatus.SINGLE },
    { label: 'Married filing jointly', value: FilingStatus.MARRIED_FILING_JOINTLY },
    { label: 'Married filing separately', value: FilingStatus.MARRIED_FILING_SEPARATELY },
    { label: 'Head of household', value: FilingStatus.HEAD_OF_HOUSEHOLD },
  ];

  // The backend's `StateCode` enum only recognizes these codes today — a
  // free-text field let someone type an unsupported one and get a raw 422
  // with no useful message. A select keeps the two in sync; add an entry
  // here only once the backend's rate tables actually cover that state.
  const stateOptions = [{ label: 'Ohio (OH)', value: 'OH' }];

  const seedOptions = computed(() =>
    (store.ruleYears?.available_to_seed ?? [])
      .concat(store.ruleYears?.configured ?? [])
      .sort((a, b) => b - a)
      .map((y) => ({ label: `${y}`, value: y }))
  );

  const required = (v: string) => !!v || 'Required';
  const decimal = (v: string) =>
    !v || /^-?\d+(\.\d{1,2})?$/.test(v) || 'Use a number like 1234.56';

  const hydrate = () => {
    const p = store.profile;
    if (!p) return;
    form.filing_status = p.filing_status;
    form.state = p.state;
    form.city = p.city ?? '';
    form.prefer_itemized = p.prefer_itemized;
    form.prior_year_total_tax = p.prior_year_total_tax ?? '';
    form.prior_year_agi = p.prior_year_agi ?? '';
    form.deductions = p.deductions.map((d) => ({ ...d }));
  };

  watch(() => store.profile, hydrate);

  /** A row with only a label or only an amount is a half-finished entry —
   * silently dropping it on save would look successful while quietly
   * discarding what the user typed. Only a row with both blank (never
   * touched after "Add deduction") is safe to drop. */
  const incompleteDeductionIndex = () =>
    form.deductions.findIndex(
      (d) => Boolean(d.label.trim()) !== Boolean(d.amount.trim())
    );

  const save = async () => {
    const incomplete = incompleteDeductionIndex();
    if (incomplete !== -1) {
      $q.notify({
        type: 'warning',
        message: `Deduction #${incomplete + 1} needs both a label and an amount, or remove it.`,
      });
      return;
    }

    saving.value = true;
    try {
      const args: UpsertTaxProfileArgs = {
        filing_status: form.filing_status,
        state: form.state.toUpperCase(),
        city: form.city || null,
        prefer_itemized: form.prefer_itemized,
        deductions: form.deductions.filter((d) => d.label.trim() && d.amount.trim()),
        prior_year_total_tax: form.prior_year_total_tax || null,
        prior_year_agi: form.prior_year_agi || null,
      };
      await store.saveProfile(args);
      $q.notify({ type: 'positive', message: 'Tax profile saved.' });
    } catch (e) {
      $q.notify({ type: 'negative', message: `Could not save profile: ${e}` });
    } finally {
      saving.value = false;
    }
  };

  const confirmSeed = () => {
    if (seedYear.value === null) return;
    const year = seedYear.value;
    const alreadyConfigured = store.ruleYears?.configured.includes(year);

    const run = async () => {
      seeding.value = true;
      try {
        await store.seedRules(year);
        $q.notify({ type: 'positive', message: `Loaded default rates for ${year}.` });
      } catch (e) {
        $q.notify({ type: 'negative', message: `Could not load rates: ${e}` });
      } finally {
        seeding.value = false;
      }
    };

    if (!alreadyConfigured) {
      void run();
      return;
    }

    $q.dialog({
      title: 'Overwrite rates',
      message: `${year} already has rates configured. Loading the defaults will discard any edits. Continue?`,
      cancel: true,
    }).onOk(run);
  };

  onMounted(async () => {
    try {
      await Promise.all([
        store.summary ? Promise.resolve() : store.loadAll(),
        store.loadRuleYears(),
      ]);
      hydrate();
      seedYear.value = store.year;
    } catch (e) {
      $q.notify({ type: 'negative', message: `Could not load tax settings: ${e}` });
    }
  });
</script>

<style scoped lang="scss">
  .n-page {
    max-width: 1200px;
    margin: 0 auto;
  }
</style>
