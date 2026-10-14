import { DinnerCategory } from '../types';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDateBR = (dateString: string): string => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

export const getDayOfWeekName = (dateString: string): string => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const days = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ];
  return days[date.getDay()];
};

export const getShortDayOfWeek = (dateString: string): string => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  return days[date.getDay()];
};

export const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const CATEGORY_COLORS: Record<DinnerCategory, string> = {
  'Pizza': '#f97316', // Orange
  'Hambúrguer': '#ef4444', // Red
  'Sushi / Japonês': '#ec4899', // Pink
  'Comida Caseira / Marmita': '#10b981', // Emerald
  'Massas & Italiano': '#eab308', // Yellow
  'Lanches & Salgados': '#8b5cf6', // Purple
  'Churrasco & Carnes': '#b91c1c', // Dark Red
  'Açaí & Sobremesa': '#a855f7', // Purple/Violet
  'Árabe / Esfiha': '#06b6d4', // Cyan
  'Outros': '#64748b', // Slate
};

export const CATEGORY_EMOJIS: Record<DinnerCategory, string> = {
  'Pizza': '🍕',
  'Hambúrguer': '🍔',
  'Sushi / Japonês': '🍣',
  'Comida Caseira / Marmita': '🍲',
  'Massas & Italiano': '🍝',
  'Lanches & Salgados': '🥪',
  'Churrasco & Carnes': '🥩',
  'Açaí & Sobremesa': '🍨',
  'Árabe / Esfiha': '🥙',
  'Outros': '🍽️',
};

export const ALL_CATEGORIES: DinnerCategory[] = [
  'Pizza',
  'Hambúrguer',
  'Sushi / Japonês',
  'Comida Caseira / Marmita',
  'Massas & Italiano',
  'Lanches & Salgados',
  'Churrasco & Carnes',
  'Açaí & Sobremesa',
  'Árabe / Esfiha',
  'Outros',
];
