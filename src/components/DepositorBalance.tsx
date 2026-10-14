import React, { useMemo } from 'react';
import { User, CalendarDays, Calendar, CalendarClock } from 'lucide-react';
import { DinnerOrder } from '../types';
import { getDepositorBreakdown } from '../utils/analytics';
import { formatCurrency } from '../utils/formatters';

interface DepositorBalanceProps {
  orders: DinnerOrder[];
}

export const DepositorBalance: React.FC<DepositorBalanceProps> = ({ orders }) => {
  const breakdown = useMemo(() => getDepositorBreakdown(orders), [orders]);

  // Remove "Desconhecido" se não tiver dinheiro nenhum lá, ou exibe tudo se houver
  const displayData = breakdown.filter(d => d.allTime > 0);

  if (displayData.length === 0) {
    return null; // Não exibe se não houver registros
  }

  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 shadow-xs">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
          <User className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <h2 className="text-lg font-black text-white uppercase tracking-tight font-['Outfit',sans-serif]">
            Gastos por Pessoa
          </h2>
          <p className="text-xs text-zinc-400 font-medium">
            Acompanhe o valor de quem pagou os pedidos
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayData.map((d) => (
          <div key={d.depositor} className="bg-zinc-950 rounded-xl p-4 border border-zinc-800/80 hover:border-emerald-500/30 transition-colors">
            <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-3">
              <span className="font-black text-zinc-200 text-sm uppercase tracking-wider">{d.depositor}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Total: {formatCurrency(d.allTime)}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400">
                  <CalendarDays className="w-3.5 h-3.5" /> Semana
                </div>
                <div className="text-sm font-mono font-black text-white">
                  {formatCurrency(d.thisWeek)}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400">
                  <Calendar className="w-3.5 h-3.5" /> Mês
                </div>
                <div className="text-sm font-mono font-black text-white">
                  {formatCurrency(d.thisMonth)}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400">
                  <CalendarClock className="w-3.5 h-3.5" /> Ano
                </div>
                <div className="text-sm font-mono font-black text-white">
                  {formatCurrency(d.thisYear)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
