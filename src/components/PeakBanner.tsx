import React from 'react';
import {
  Flame,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Calendar,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { PeakAnalysis, CategorySpending } from '../types';
import { formatCurrency, formatDateBR } from '../utils/formatters';

interface PeakBannerProps {
  peakAnalysis: PeakAnalysis;
  topCategory?: CategorySpending;
}

export const PeakBanner: React.FC<PeakBannerProps> = ({
  peakAnalysis,
  topCategory,
}) => {
  if (!peakAnalysis.highestDay && !peakAnalysis.highestOrder) {
    return null;
  }

  const isWeekendHeavy = peakAnalysis.weekendSharePercentage > 50;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        
        {/* Main highlight */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500 text-zinc-950 flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20 font-black">
            <Flame className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight font-['Outfit',sans-serif]">
                Mapeamento & Análise de Picos de Consumo
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/30">
                Dia de Pico: <strong className="text-white ml-0.5">{peakAnalysis.peakDayOfWeek}</strong>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 leading-relaxed max-w-3xl font-medium">
              Seu maior volume de gastos com janta concentra-se em <span className="font-bold text-zinc-200">{peakAnalysis.peakDayOfWeek}</span> ({formatCurrency(peakAnalysis.peakDayTotal)} acumulados). 
              {isWeekendHeavy && (
                <span> <strong className="text-orange-400 font-bold">{peakAnalysis.weekendSharePercentage.toFixed(0)}%</strong> do seu orçamento de janta é consumido no fim de semana (Sex, Sáb, Dom).</span>
              )}
            </p>
          </div>
        </div>

        {/* Quick Highlights badges */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
          
          {peakAnalysis.highestDay && (
            <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs">
              <span className="text-zinc-500 block font-black uppercase tracking-wider text-[10px]">Dia mais caro</span>
              <span className="font-bold text-zinc-200 block truncate">
                {formatDateBR(peakAnalysis.highestDay.date)} ({peakAnalysis.highestDay.dayOfWeek.split('-')[0]})
              </span>
              <span className="text-rose-400 font-black font-['Outfit',sans-serif] block text-base mt-0.5">
                {formatCurrency(peakAnalysis.highestDay.total)}
              </span>
            </div>
          )}

          {topCategory && (
            <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs">
              <span className="text-zinc-500 block font-black uppercase tracking-wider text-[10px]">Categoria líder</span>
              <span className="font-bold text-zinc-200 block truncate max-w-[130px]" title={topCategory.category}>
                {topCategory.category}
              </span>
              <span className="text-orange-400 font-black font-['Outfit',sans-serif] block text-base mt-0.5">
                {formatCurrency(topCategory.total)} ({topCategory.percentage.toFixed(0)}%)
              </span>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
