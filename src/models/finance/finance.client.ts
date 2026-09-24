import { AxiosInstance, AxiosStatic } from 'axios';
import { ApiPath } from 'src/boot/axios';
import {
  global_request_interceptor,
  global_response_interceptor,
} from 'src/clients';
import { useLogger } from 'src/composables/useLogger';
import { useOnce } from 'src/composables/once';
import { API } from 'src/symbols';
import { inject } from 'vue';
import {
  ExpenseRecord,
  FinanceSummary,
  IncomeRecord,
  ProjectionMethod,
  QuarterlyEstimate,
  RuleYears,
  TaxPayment,
  TaxProfile,
  UpsertExpenseArgs,
  UpsertIncomeArgs,
  UpsertPaymentArgs,
  UpsertTaxProfileArgs,
  quarterOrdinal,
  Quarter,
} from './finance';

const logger = useLogger('finance.client');

const buildInstance = (axios: AxiosStatic, path: ApiPath): AxiosInstance => {
  const instance = axios.create({
    baseURL: axios.defaults.baseURL + path,
  });

  if (process.env.CLIENT) {
    instance.interceptors.request.use(global_request_interceptor);
    instance.interceptors.response.use(
      (res) => res,
      global_response_interceptor(instance)
    );
  }

  return instance;
};

export const useFinanceClient = () => {
  logger.debug('called useFinanceClient');

  const api = useOnce<AxiosInstance>(() =>
    buildInstance(inject(API) as AxiosStatic, ApiPath.FINANCE)
  );

  const taxApi = useOnce<AxiosInstance>(() =>
    buildInstance(inject(API) as AxiosStatic, ApiPath.TAX)
  );

  // ---- income ----

  const fetchIncome = async (year: number) => {
    const response = await api.get<IncomeRecord[]>('income', {
      params: { year },
    });
    return response.data;
  };

  const createIncome = async (args: UpsertIncomeArgs) => {
    const response = await api.post<IncomeRecord>('income', args);
    return response.data;
  };

  const updateIncome = async (recordId: string, args: UpsertIncomeArgs) => {
    const response = await api.put<IncomeRecord>(`income/${recordId}`, args);
    return response.data;
  };

  const deleteIncome = async (recordId: string) => {
    await api.delete(`income/${recordId}`);
    return true;
  };

  // ---- expenses ----

  const fetchExpenses = async (year: number) => {
    const response = await api.get<ExpenseRecord[]>('expenses', {
      params: { year },
    });
    return response.data;
  };

  const createExpense = async (args: UpsertExpenseArgs) => {
    const response = await api.post<ExpenseRecord>('expenses', args);
    return response.data;
  };

  const updateExpense = async (recordId: string, args: UpsertExpenseArgs) => {
    const response = await api.put<ExpenseRecord>(`expenses/${recordId}`, args);
    return response.data;
  };

  const deleteExpense = async (recordId: string) => {
    await api.delete(`expenses/${recordId}`);
    return true;
  };

  // ---- payments ----

  const fetchPayments = async (year: number) => {
    const response = await api.get<TaxPayment[]>('payments', {
      params: { year },
    });
    return response.data;
  };

  const createPayment = async (args: UpsertPaymentArgs) => {
    const response = await api.post<TaxPayment>('payments', args);
    return response.data;
  };

  const deletePayment = async (recordId: string) => {
    await api.delete(`payments/${recordId}`);
    return true;
  };

  // ---- profile, rules, estimate ----

  const fetchSummary = async (year: number) => {
    const response = await api.get<FinanceSummary>('summary', {
      params: { year },
    });
    return response.data;
  };

  const fetchTaxProfile = async (year: number) => {
    const response = await api.get<TaxProfile | null>(`tax-profile/${year}`);
    return response.data;
  };

  const saveTaxProfile = async (year: number, args: UpsertTaxProfileArgs) => {
    const response = await api.put<TaxProfile>(`tax-profile/${year}`, args);
    return response.data;
  };

  const fetchEstimate = async (
    year: number,
    quarter: Quarter,
    method: ProjectionMethod
  ) => {
    const response = await api.get<QuarterlyEstimate>('estimate', {
      params: {
        year,
        quarter: quarterOrdinal(quarter),
        method: method === ProjectionMethod.ANNUALIZED ? 'annualized' : 'ytd',
      },
    });
    return response.data;
  };

  const fetchRuleYears = async () => {
    const response = await taxApi.get<RuleYears>('rules');
    return response.data;
  };

  const fetchTaxRules = async (year: number) => {
    const response = await taxApi.get(`rules/${year}`);
    return response.data;
  };

  const saveTaxRules = async (year: number, rules: unknown) => {
    const response = await taxApi.put(`rules/${year}`, rules);
    return response.data;
  };

  /** Loads the server's committed defaults for a year, overwriting any
   * rates already configured for it. */
  const seedTaxRules = async (year: number) => {
    const response = await taxApi.post(`rules/${year}/seed`);
    return response.data;
  };

  return {
    fetchIncome,
    createIncome,
    updateIncome,
    deleteIncome,
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    fetchPayments,
    createPayment,
    deletePayment,
    fetchSummary,
    fetchTaxProfile,
    saveTaxProfile,
    fetchEstimate,
    fetchRuleYears,
    fetchTaxRules,
    saveTaxRules,
    seedTaxRules,
  };
};
