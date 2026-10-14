import {
  DinnerOrder,
  DaySpending,
  DayOfWeekSpending,
  CategorySpending,
  PeakAnalysis,
} from '../types';
import {
  CATEGORY_COLORS,
  formatDateBR,
  getDayOfWeekName,
  getShortDayOfWeek,
} from './formatters';

export function getWeekStartAndEnd(date: Date = new Date()): { start: Date; end: Date } {
  const current = new Date(date);
  const day = current.getDay(); // 0 = Sunday, 1 = Monday
  // Consider Monday as week start
  const diffToMonday = current.getDate() - day + (day === 0 ? -6 : 1);
  
  const start = new Date(current.setDate(diffToMonday));
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
}

export function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
}

export function calculateStats(orders: DinnerOrder[]) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed
  
  const { start: weekStart, end: weekEnd } = getWeekStartAndEnd(now);
  
  // Previous week for comparison
  const prevWeekStart = new Date(weekStart);
  prevWeekStart.setDate(prevWeekStart.getDate() - 7);
  const prevWeekEnd = new Date(weekEnd);
  prevWeekEnd.setDate(prevWeekEnd.getDate() - 7);

  // Month start and end
  const monthStart = new Date(currentYear, currentMonth, 1);
  const monthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

  // Previous month
  const prevMonthStart = new Date(currentYear, currentMonth - 1, 1);
  const prevMonthEnd = new Date(currentYear, currentMonth, 0, 23, 59, 59);

  let thisWeekTotal = 0;
  let thisWeekCount = 0;
  let prevWeekTotal = 0;

  let thisMonthTotal = 0;
  let thisMonthCount = 0;
  let prevMonthTotal = 0;

  let grandTotal = 0;

  orders.forEach((order) => {
    const orderDate = parseDate(order.date);
    grandTotal += order.amount;

    // Week check
    if (orderDate >= weekStart && orderDate <= weekEnd) {
      thisWeekTotal += order.amount;
      thisWeekCount += 1;
    } else if (orderDate >= prevWeekStart && orderDate <= prevWeekEnd) {
      prevWeekTotal += order.amount;
    }

    // Month check
    if (orderDate >= monthStart && orderDate <= monthEnd) {
      thisMonthTotal += order.amount;
      thisMonthCount += 1;
    } else if (orderDate >= prevMonthStart && orderDate <= prevMonthEnd) {
      prevMonthTotal += order.amount;
    }
  });

  const averagePerOrder = orders.length > 0 ? grandTotal / orders.length : 0;
  const monthAveragePerOrder = thisMonthCount > 0 ? thisMonthTotal / thisMonthCount : 0;

  return {
    thisWeekTotal,
    thisWeekCount,
    prevWeekTotal,
    weekGrowth: prevWeekTotal > 0 ? ((thisWeekTotal - prevWeekTotal) / prevWeekTotal) * 100 : 0,
    thisMonthTotal,
    thisMonthCount,
    prevMonthTotal,
    monthGrowth: prevMonthTotal > 0 ? ((thisMonthTotal - prevMonthTotal) / prevMonthTotal) * 100 : 0,
    grandTotal,
    totalOrders: orders.length,
    averagePerOrder,
    monthAveragePerOrder,
  };
}

export function analyzePeaks(orders: DinnerOrder[]): PeakAnalysis {
  if (orders.length === 0) {
    return {
      highestOrder: null,
      highestDay: null,
      peakDayOfWeek: 'Nenhum',
      peakDayTotal: 0,
      weekendSharePercentage: 0,
      averageWeeklySpending: 0,
    };
  }

  // Find highest single order
  let highestOrder: DinnerOrder | null = null;
  orders.forEach((order) => {
    if (!highestOrder || order.amount > highestOrder.amount) {
      highestOrder = order;
    }
  });

  // Group by date to find highest day
  const dayTotals: Record<string, number> = {};
  orders.forEach((order) => {
    dayTotals[order.date] = (dayTotals[order.date] || 0) + order.amount;
  });

  let highestDateStr = '';
  let highestDayTotal = 0;
  Object.entries(dayTotals).forEach(([dateStr, total]) => {
    if (total > highestDayTotal) {
      highestDayTotal = total;
      highestDateStr = dateStr;
    }
  });

  const highestDay = highestDateStr
    ? {
        date: highestDateStr,
        total: highestDayTotal,
        dayOfWeek: getDayOfWeekName(highestDateStr),
      }
    : null;

  // Group by day of week (0 to 6)
  const dayOfWeekNames = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ];
  const dowTotals = [0, 0, 0, 0, 0, 0, 0];
  let weekendTotal = 0;
  let totalSpending = 0;

  orders.forEach((order) => {
    const d = parseDate(order.date);
    const dayIdx = d.getDay();
    dowTotals[dayIdx] += order.amount;
    totalSpending += order.amount;

    if (dayIdx === 0 || dayIdx === 5 || dayIdx === 6) {
      // Friday, Saturday, Sunday
      weekendTotal += order.amount;
    }
  });

  let maxDowIdx = 0;
  let maxDowTotal = 0;
  dowTotals.forEach((total, idx) => {
    if (total > maxDowTotal) {
      maxDowTotal = total;
      maxDowIdx = idx;
    }
  });

  const weekendSharePercentage =
    totalSpending > 0 ? (weekendTotal / totalSpending) * 100 : 0;

  return {
    highestOrder,
    highestDay,
    peakDayOfWeek: dayOfWeekNames[maxDowIdx],
    peakDayTotal: maxDowTotal,
    weekendSharePercentage,
    averageWeeklySpending: totalSpending / 4,
  };
}

export function getDayOfWeekBreakdown(orders: DinnerOrder[]): DayOfWeekSpending[] {
  const days = [
    { name: 'Segunda-feira', short: 'Seg', idx: 1 },
    { name: 'Terça-feira', short: 'Ter', idx: 2 },
    { name: 'Quarta-feira', short: 'Qua', idx: 3 },
    { name: 'Quinta-feira', short: 'Qui', idx: 4 },
    { name: 'Sexta-feira', short: 'Sex', idx: 5 },
    { name: 'Sábado', short: 'Sáb', idx: 6 },
    { name: 'Domingo', short: 'Dom', idx: 0 },
  ];

  const grandTotal = orders.reduce((sum, o) => sum + o.amount, 0);

  const result = days.map((d) => {
    const matching = orders.filter((o) => parseDate(o.date).getDay() === d.idx);
    const total = matching.reduce((sum, o) => sum + o.amount, 0);
    return {
      dayName: d.name,
      shortName: d.short,
      total,
      count: matching.length,
      percentage: grandTotal > 0 ? (total / grandTotal) * 100 : 0,
      isPeak: false,
    };
  });

  const maxTotal = Math.max(...result.map((r) => r.total));
  if (maxTotal > 0) {
    result.forEach((r) => {
      if (r.total === maxTotal) r.isPeak = true;
    });
  }

  return result;
}

export function getCategoryBreakdown(orders: DinnerOrder[]): CategorySpending[] {
  const grandTotal = orders.reduce((sum, o) => sum + o.amount, 0);
  const catMap: Record<string, { total: number; count: number }> = {};

  orders.forEach((order) => {
    if (!catMap[order.category]) {
      catMap[order.category] = { total: 0, count: 0 };
    }
    catMap[order.category].total += order.amount;
    catMap[order.category].count += 1;
  });

  const list: CategorySpending[] = Object.entries(catMap)
    .map(([cat, data]) => ({
      category: cat as any,
      total: data.total,
      count: data.count,
      percentage: grandTotal > 0 ? (data.total / grandTotal) * 100 : 0,
      color: CATEGORY_COLORS[cat as any] || '#94a3b8',
    }))
    .sort((a, b) => b.total - a.total);

  return list;
}

export function getDailySpendingTimeline(orders: DinnerOrder[]): DaySpending[] {
  const map: Record<string, { total: number; count: number }> = {};

  orders.forEach((o) => {
    if (!map[o.date]) {
      map[o.date] = { total: 0, count: 0 };
    }
    map[o.date].total += o.amount;
    map[o.date].count += 1;
  });

  const sortedDates = Object.keys(map).sort();
  if (sortedDates.length === 0) return [];

  // Compute average to mark peak days (e.g. > 1.4x daily average)
  const totalAmount = Object.values(map).reduce((acc, v) => acc + v.total, 0);
  const avgAmount = totalAmount / sortedDates.length;

  return sortedDates.map((dateStr) => {
    const data = map[dateStr];
    return {
      date: dateStr,
      dayLabel: dateStr.split('-').slice(1).join('/'), // MM/DD
      formattedDate: formatDateBR(dateStr),
      dayOfWeek: getShortDayOfWeek(dateStr),
      total: data.total,
      ordersCount: data.count,
      isPeak: data.total > avgAmount * 1.35,
    };
  });
}

export function getPaymentMethodBreakdown(orders: DinnerOrder[]) {
  const map: Record<string, { total: number; count: number }> = {};
  const grandTotal = orders.reduce((acc, o) => acc + o.amount, 0);

  orders.forEach((o) => {
    const method = o.paymentMethod || 'Pix';
    if (!map[method]) {
      map[method] = { total: 0, count: 0 };
    }
    map[method].total += o.amount;
    map[method].count += 1;
  });

  return Object.entries(map)
    .map(([method, data]) => ({
      method,
      total: data.total,
      count: data.count,
      percentage: grandTotal > 0 ? (data.total / grandTotal) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);
}

export interface DepositorBreakdown {
  depositor: string;
  thisWeek: number;
  thisMonth: number;
  thisYear: number;
  allTime: number;
}

export function getDepositorBreakdown(orders: DinnerOrder[]): DepositorBreakdown[] {
  const map: Record<string, DepositorBreakdown> = {};
  
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const { start: weekStart, end: weekEnd } = getWeekStartAndEnd(now);
  
  const monthStart = new Date(currentYear, currentMonth, 1);
  const monthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

  const yearStart = new Date(currentYear, 0, 1);
  const yearEnd = new Date(currentYear, 11, 31, 23, 59, 59);

  orders.forEach((o) => {
    const depositor = o.depositor?.trim() || 'Desconhecido';
    if (!map[depositor]) {
      map[depositor] = {
        depositor,
        thisWeek: 0,
        thisMonth: 0,
        thisYear: 0,
        allTime: 0,
      };
    }
    
    const orderDate = parseDate(o.date);
    
    if (orderDate >= weekStart && orderDate <= weekEnd) {
      map[depositor].thisWeek += o.amount;
    }
    if (orderDate >= monthStart && orderDate <= monthEnd) {
      map[depositor].thisMonth += o.amount;
    }
    if (orderDate >= yearStart && orderDate <= yearEnd) {
      map[depositor].thisYear += o.amount;
    }
    
    map[depositor].allTime += o.amount;
  });

  return Object.values(map).sort((a, b) => b.allTime - a.allTime);
}
