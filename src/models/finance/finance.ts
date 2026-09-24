import { Meta } from '../meta';

/**
 * Money arrives from the API as a decimal *string*, never a number.
 * JavaScript numbers are f64 and would lose cents on large amounts, so keep
 * every amount as a string end to end and only parse it for display.
 */
export type Money = string;

export enum IncomeKind {
  WAGE = 'Wage',
  SELF_EMPLOYMENT_PROFIT = 'SelfEmploymentProfit',
}

export enum FilingStatus {
  SINGLE = 'Single',
  MARRIED_FILING_JOINTLY = 'MarriedFilingJointly',
  MARRIED_FILING_SEPARATELY = 'MarriedFilingSeparately',
  HEAD_OF_HOUSEHOLD = 'HeadOfHousehold',
}

export enum Jurisdiction {
  FEDERAL = 'Federal',
  STATE = 'State',
  MUNICIPAL = 'Municipal',
}

export enum Quarter {
  Q1 = 'Q1',
  Q2 = 'Q2',
  Q3 = 'Q3',
  Q4 = 'Q4',
}

export enum EstimateBasis {
  CURRENT_YEAR_PROJECTION = 'CurrentYearProjection',
  SAFE_HARBOR = 'SafeHarbor',
}

export enum ProjectionMethod {
  ANNUALIZED = 'Annualized',
  YTD_AS_FINAL = 'YtdAsFinal',
}

/** Externally tagged on the wire: `{ Employer: { name } }` or `{ Client: { name } }`. */
export type Payer =
  | { Employer: { name: string } }
  | { Client: { name: string } };

export const payerName = (payer: Payer): string =>
  'Employer' in payer ? payer.Employer.name : payer.Client.name;

export const isEmployer = (payer: Payer): boolean => 'Employer' in payer;

export type Withholding = {
  federal: Money;
  state: Money;
  local: Money;
};

export type IncomeRecord = {
  id: string;
  person: string;
  kind: IncomeKind;
  payer: Payer;
  amount: Money;
  date: string;
  withholding?: Withholding | null;
  category?: string | null;
  note?: string | null;
  meta: Meta;
};

export type UpsertIncomeArgs = {
  kind: IncomeKind;
  payer: Payer;
  amount: Money;
  date: string;
  withholding?: Withholding | null;
  category?: string | null;
  note?: string | null;
};

export type ExpenseRecord = {
  id: string;
  person: string;
  amount: Money;
  date: string;
  category?: string | null;
  deductible: boolean;
  note?: string | null;
  meta: Meta;
};

export type UpsertExpenseArgs = {
  amount: Money;
  date: string;
  category?: string | null;
  deductible: boolean;
  note?: string | null;
};

export type TaxPayment = {
  id: string;
  person: string;
  year: number;
  quarter: Quarter;
  jurisdiction: Jurisdiction;
  amount: Money;
  date: string;
  note?: string | null;
  meta: Meta;
};

export type UpsertPaymentArgs = {
  year: number;
  quarter: Quarter;
  jurisdiction: Jurisdiction;
  amount: Money;
  date: string;
  note?: string | null;
};

export type Deduction = {
  label: string;
  amount: Money;
};

export type TaxProfile = {
  id: string;
  person: string;
  year: number;
  filing_status: FilingStatus;
  state: string;
  city?: string | null;
  prefer_itemized: boolean;
  deductions: Deduction[];
  prior_year_total_tax?: Money | null;
  /** Last year's AGI — what the safe-harbor 110% "high income" multiplier
   * is actually keyed on, kept separate from this year's own AGI. */
  prior_year_agi?: Money | null;
  meta: Meta;
};

export type UpsertTaxProfileArgs = {
  filing_status: FilingStatus;
  state: string;
  city?: string | null;
  prefer_itemized: boolean;
  deductions: Deduction[];
  prior_year_total_tax?: Money | null;
  prior_year_agi?: Money | null;
};

export type YtdTotals = {
  wages: Money;
  se_gross: Money;
  se_deductible_expenses: Money;
  se_net: Money;
  non_deductible_expenses: Money;
};

export type Projection = {
  se_tax: Money;
  federal_income_tax: Money;
  state_income_tax: Money;
  municipal_income_tax: Money;
  total: Money;
};

export type JurisdictionDue = {
  jurisdiction: Jurisdiction;
  projected_annual_tax: Money;
  basis: EstimateBasis;
  basis_annual: Money;
  required_to_date: Money;
  withholding_to_date: Money;
  payments_made: Money;
  amount_due: Money;
};

export type EstimateLine = {
  label: string;
  amount: Money;
  detail?: string | null;
};

export type QuarterlyEstimate = {
  year: number;
  quarter: Quarter;
  due_date: string;
  filing_status: FilingStatus;
  projection_method: ProjectionMethod;
  ytd: YtdTotals;
  projected_annual_income: YtdTotals;
  projected_annual: Projection;
  safe_harbor_annual?: Money | null;
  due_by_jurisdiction: JurisdictionDue[];
  federal_amount_due: Money;
  amount_due_this_quarter: Money;
  lines: EstimateLine[];
};

export type FinanceSummary = {
  year: number;
  ytd: YtdTotals;
  withholding_to_date: Money;
  payments_made: Money;
  income_count: number;
  expense_count: number;
  has_tax_profile: boolean;
  has_tax_rules: boolean;
};

export type RuleYears = {
  configured: number[];
  available_to_seed: number[];
};

/** Format a decimal-string amount as USD without ever going through a float. */
export const formatMoney = (amount: Money | null | undefined): string => {
  if (amount === null || amount === undefined || amount === '') return '$0.00';
  const negative = amount.startsWith('-');
  const [whole, fraction = ''] = amount.replace('-', '').split('.');
  const cents = (fraction + '00').slice(0, 2);
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${negative ? '-' : ''}$${grouped}.${cents}`;
};

/** Which estimated-tax period a date falls in. The periods are not equal
 * calendar quarters: Q2 spans two months and Q4 spans four. */
export const quarterForDate = (date: Date): Quarter => {
  const month = date.getMonth() + 1;
  if (month <= 3) return Quarter.Q1;
  if (month <= 5) return Quarter.Q2;
  if (month <= 8) return Quarter.Q3;
  return Quarter.Q4;
};

export const quarterOrdinal = (quarter: Quarter): number =>
  Number(quarter.slice(1));

/**
 * Add two decimal-string amounts as whole cents, so no fractional float ever
 * enters the arithmetic. Integer cents stay exact in a JS number up to 2^53 —
 * around $90 trillion — far past anything a personal ledger holds.
 */
export const addMoney = (a?: Money | null, b?: Money | null): Money => {
  const toCents = (v?: Money | null) => {
    if (!v) return 0;
    const negative = v.startsWith('-');
    const [whole, fraction = ''] = v.replace('-', '').split('.');
    const cents = Number(whole || '0') * 100 + Number((fraction + '00').slice(0, 2));
    return negative ? -cents : cents;
  };
  const total = toCents(a) + toCents(b);
  const sign = total < 0 ? '-' : '';
  const abs = Math.abs(total);
  return `${sign}${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, '0')}`;
};
