import React from 'react';
import {
  CalendarDays,
  CalendarRange,
  TrendingUp,
  Flame,
  CreditCard,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { formatCurrency, formatDateBR } from '../utils/formatters';
import { PeakAnalysis } from '../types';

interface MetricsCardsProps {
  stats: {
    thisWeekTotal: number;
    thisWeekCount: number;
    prevWeekTotal: number;
    weekGrowth: number;
    thisMonthTotal: number;
    thisMonthCount: number;
    prevMonthTotal: number;
    monthGrowth: number;
    grandTotal: number;
    totalOrders: number;
    averagePerOrder: number;
    monthAveragePerOrder: number;
  };
  peakAnalysis: PeakAnalysis;
  monthlyBudget: number;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({
  stats,
  peakAnalysis,
  monthlyBudget,
}) => {
  const budgetUsagePercent = monthlyBudget > 0 ? (stats.thisMonthTotal / monthlyBudget) * 100 : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* 1. Total da Semana */}
      <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 relative overflow-hidden group hover:border-orange-500/50 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400">
            Total da Semana
          </span>
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center border border-orange-500/20">
            <CalendarDays className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4">
          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight font-['Outfit',sans-serif]">
            {formatCurrency(stats.thisWeekTotal)}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1.5 font-bold text-zinc-400">
              <ShoppingBag className="w-3.5 h-3.5 text-zinc-500" />
              {stats.thisWeekCount} {stats.thisWeekCount === 1 ? 'pedido' : 'pedidos'}
            </span>

            {stats.prevWeekTotal > 0 && (
              <span
                className={`inline-flex items-center gap-0.5 font-black uppercase tracking-wider px-2 py-0.5 rounded-md text-[10px] ${
                  stats.weekGrowth > 0
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}
              >
                {stats.weekGrowth > 0 ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {Math.abs(stats.weekGrowth).toFixed(0)}% vs sem. ant.
              </span>
            )}
          </div>
        </div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-orange-500" />
      </div>

      {/* 2. Total do Mês */}
      <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 relative overflow-hidden group hover:border-blue-500/50 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400">
            Total do Mês Atual
          </span>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <CalendarRange className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4">
          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight font-['Outfit',sans-serif]">
            {formatCurrency(stats.thisMonthTotal)}
          </div>
          
          {/* Budget progress */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5 font-bold">
              <span>Meta: {formatCurrency(monthlyBudget)}</span>
              <span className="font-mono text-zinc-300">{budgetUsagePercent.toFixed(0)}%</span>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  budgetUsagePercent < 70
                    ? 'bg-emerald-500'
                    : budgetUsagePercent < 90
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(budgetUsagePercent, 100)}%` }}
              />
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500" />
      </div>

      {/* 3. Média por Janta */}
      <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 relative overflow-hidden group hover:border-emerald-500/50 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400">
            Média por Pedido
          </span>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4">
          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight font-['Outfit',sans-serif]">
            {formatCurrency(stats.averagePerOrder)}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-zinc-400 font-medium">
            <span>Acumulado:</span>
            <span className="font-bold text-zinc-200">
              {formatCurrency(stats.grandTotal)} ({stats.totalOrders} pedidos)
            </span>
          </div>
        </div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
      </div>

      {/* 4. Pico de Gasto */}
      <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 relative overflow-hidden group hover:border-rose-500/50 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400">
            Maior Pico Individual
          </span>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
            <Flame className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4">
          <div className="text-3xl sm:text-4xl font-black text-rose-400 tracking-tight font-['Outfit',sans-serif]">
            {peakAnalysis.highestOrder
              ? formatCurrency(peakAnalysis.highestOrder.amount)
              : 'R$ 0,00'}
          </div>
          <div className="mt-3 text-xs text-zinc-400 truncate">
            {peakAnalysis.highestOrder ? (
              <span className="truncate block" title={`${peakAnalysis.highestOrder.restaurant} - ${formatDateBR(peakAnalysis.highestOrder.date)}`}>
                <span className="font-bold text-zinc-200">{peakAnalysis.highestOrder.restaurant}</span> • {formatDateBR(peakAnalysis.highestOrder.date)}
              </span>
            ) : (
              <span>Nenhum pedido cadastrado</span>
            )}
          </div>
        </div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500" />
      </div>

    </div>
  );
};
