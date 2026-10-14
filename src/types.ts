export type DinnerCategory =
  | 'Pizza'
  | 'Hambúrguer'
  | 'Sushi / Japonês'
  | 'Comida Caseira / Marmita'
  | 'Massas & Italiano'
  | 'Lanches & Salgados'
  | 'Churrasco & Carnes'
  | 'Açaí & Sobremesa'
  | 'Árabe / Esfiha'
  | 'Outros';

export type PaymentMethod =
  | 'Pix'
  | 'Cartão de Crédito'
  | 'Cartão de Débito'
  | 'Vale Refeição (VR/VA)'
  | 'Dinheiro';

export interface DinnerOrder {
  id: string;
  date: string; // YYYY-MM-DD
  restaurant: string;
  dish: string;
  category: DinnerCategory;
  amount: number; // Value in BRL
  deliveryFee?: number;
  paymentMethod: PaymentMethod;
  peopleCount?: number; // Divisão
  rating?: number; // 1-5 stars
  notes?: string;
  depositor?: string; // Quem pagou/pediu
  createdAt: number;
}

export interface DaySpending {
  date: string;
  dayLabel: string;
  formattedDate: string;
  dayOfWeek: string;
  total: number;
  ordersCount: number;
  isPeak?: boolean;
}

export interface DayOfWeekSpending {
  dayName: string;
  shortName: string;
  total: number;
  count: number;
  percentage: number;
  isPeak: boolean;
}

export interface CategorySpending {
  category: DinnerCategory;
  total: number;
  count: number;
  percentage: number;
  color: string;
}

export interface PeakAnalysis {
  highestOrder: DinnerOrder | null;
  highestDay: { date: string; total: number; dayOfWeek: string } | null;
  peakDayOfWeek: string;
  peakDayTotal: number;
  weekendSharePercentage: number;
  averageWeeklySpending: number;
}

export interface FilterState {
  period: 'all' | 'this_month' | 'this_week' | 'last_month' | 'last_30_days' | 'custom';
  customStartDate?: string;
  customEndDate?: string;
  category: string;
  paymentMethod: string;
  searchQuery: string;
  sortBy: 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';
}
