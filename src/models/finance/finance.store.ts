import { defineStore } from 'pinia';
import { useLogger } from 'src/composables/useLogger';
import { computed, ref } from 'vue';
import {
  ExpenseRecord,
  FinanceSummary,
  IncomeRecord,
  ProjectionMethod,
  Quarter,
  QuarterlyEstimate,
  RuleYears,
  TaxPayment,
  TaxProfile,
  UpsertExpenseArgs,
  UpsertIncomeArgs,
  UpsertPaymentArgs,
  UpsertTaxProfileArgs,
  quarterForDate,
} from './finance';
import { useFinanceClient } from './finance.client';

const logger = useLogger('finance.store');

export const useFinanceStore = defineStore('finance', () => {
  const fc = useFinanceClient();

  const year = ref(new Date().getFullYear());
  const quarter = ref<Quarter>(quarterForDate(new Date()));
  const method = ref<ProjectionMethod>(ProjectionMethod.ANNUALIZED);

  const income = ref<IncomeRecord[]>([]);
  const expenses = ref<ExpenseRecord[]>([]);
  const payments = ref<TaxPayment[]>([]);
  const summary = ref<FinanceSummary>();
  const profile = ref<TaxProfile | null>(null);
  const ruleYears = ref<RuleYears>();
  const estimate = ref<QuarterlyEstimate>();

  const loading = ref(false);
  const estimating = ref(false);
  /** Set when the year still needs a profile or rate table — the dashboard
   * shows a setup prompt rather than an error for this case. */
  const setupNeeded = ref<string | undefined>();

  const isSetUp = computed(
    () => !!summary.value?.has_tax_profile && !!summary.value?.has_tax_rules
  );

  /** The API answers a missing profile or rate table with 409, which is a
   * prompt to finish setup rather than a failure worth surfacing as an error. */
  const isSetupConflict = (e: unknown): string | undefined => {
    const response = (e as { response?: { status?: number; data?: { message?: string } } })
      .response;
    if (response?.status !== 409) return undefined;
    return response.data?.message ?? 'Finish setting up this tax year.';
  };

  // Bumped on every loadAll() call so a response that lands after a newer
  // call has already started gets discarded instead of overwriting fresher
  // data — otherwise switching years quickly can let an older year's
  // response arrive last and silently replace the year the user is now
  // looking at.
  let loadSeq = 0;

  const loadAll = async () => {
    const seq = ++loadSeq;
    loading.value = true;
    try {
      const [i, e, p, s, pr] = await Promise.all([
        fc.fetchIncome(year.value),
        fc.fetchExpenses(year.value),
        fc.fetchPayments(year.value),
        fc.fetchSummary(year.value),
        fc.fetchTaxProfile(year.value),
      ]);
      if (seq !== loadSeq) return; // superseded by a later loadAll() call
      income.value = i;
      expenses.value = e;
      payments.value = p;
      summary.value = s;
      profile.value = pr;
    } finally {
      if (seq === loadSeq) loading.value = false;
    }
  };

  const loadRuleYears = async () => {
    ruleYears.value = await fc.fetchRuleYears();
  };

  const calculateEstimate = async () => {
    estimating.value = true;
    setupNeeded.value = undefined;
    try {
      estimate.value = await fc.fetchEstimate(
        year.value,
        quarter.value,
        method.value
      );
    } catch (e) {
      const needed = isSetupConflict(e);
      if (!needed) throw e;

      logger.debug(`estimate blocked pending setup: ${needed}`);
      setupNeeded.value = needed;
      estimate.value = undefined;
    } finally {
      estimating.value = false;
    }
  };

  /** Every mutation refreshes the rollup and, when one is already on screen,
   * the estimate — a stale figure here is worse than a slow one. */
  const refreshDerived = async () => {
    summary.value = await fc.fetchSummary(year.value);
    if (estimate.value || setupNeeded.value) await calculateEstimate();
  };

  const addIncome = async (args: UpsertIncomeArgs) => {
    const record = await fc.createIncome(args);
    income.value = [record, ...income.value];
    await refreshDerived();
    return record;
  };

  const editIncome = async (recordId: string, args: UpsertIncomeArgs) => {
    const record = await fc.updateIncome(recordId, args);
    income.value = income.value.map((r) => (r.id === recordId ? record : r));
    await refreshDerived();
    return record;
  };

  const removeIncome = async (recordId: string) => {
    await fc.deleteIncome(recordId);
    income.value = income.value.filter((r) => r.id !== recordId);
    await refreshDerived();
  };

  const addExpense = async (args: UpsertExpenseArgs) => {
    const record = await fc.createExpense(args);
    expenses.value = [record, ...expenses.value];
    await refreshDerived();
    return record;
  };

  const editExpense = async (recordId: string, args: UpsertExpenseArgs) => {
    const record = await fc.updateExpense(recordId, args);
    expenses.value = expenses.value.map((r) =>
      r.id === recordId ? record : r
    );
    await refreshDerived();
    return record;
  };

  const removeExpense = async (recordId: string) => {
    await fc.deleteExpense(recordId);
    expenses.value = expenses.value.filter((r) => r.id !== recordId);
    await refreshDerived();
  };

  const addPayment = async (args: UpsertPaymentArgs) => {
    const record = await fc.createPayment(args);
    payments.value = [record, ...payments.value];
    await refreshDerived();
    return record;
  };

  const removePayment = async (recordId: string) => {
    await fc.deletePayment(recordId);
    payments.value = payments.value.filter((r) => r.id !== recordId);
    await refreshDerived();
  };

  const saveProfile = async (args: UpsertTaxProfileArgs) => {
    profile.value = await fc.saveTaxProfile(year.value, args);
    await refreshDerived();
    return profile.value;
  };

  const seedRules = async (seedYear: number) => {
    await fc.seedTaxRules(seedYear);
    await loadRuleYears();
    await refreshDerived();
  };

  const setYear = async (next: number) => {
    year.value = next;
    estimate.value = undefined;
    setupNeeded.value = undefined;
    await loadAll();
  };

  return {
    year,
    quarter,
    method,
    income,
    expenses,
    payments,
    summary,
    profile,
    ruleYears,
    estimate,
    loading,
    estimating,
    setupNeeded,
    isSetUp,
    loadAll,
    loadRuleYears,
    calculateEstimate,
    addIncome,
    editIncome,
    removeIncome,
    addExpense,
    editExpense,
    removeExpense,
    addPayment,
    removePayment,
    saveProfile,
    seedRules,
    setYear,
  };
});
