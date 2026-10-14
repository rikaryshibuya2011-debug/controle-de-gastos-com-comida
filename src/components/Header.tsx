import React from 'react';
import {
  UtensilsCrossed,
  Plus,
  Download,
  Target,
  RotateCcw,
} from 'lucide-react';

interface HeaderProps {
  onOpenNewOrder: () => void;
  onOpenBudget: () => void;
  onOpenDesktopModal?: () => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
  onResetData: () => void;
  monthlyBudget: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewOrder,
  onOpenBudget,
  onExportCSV,
  onResetData,
}) => {
  return (
    <header className="bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center text-zinc-950 font-black shadow-lg shadow-orange-500/20 ring-1 ring-orange-400/30 shrink-0">
              <UtensilsCrossed className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase font-['Outfit',sans-serif]">
                  Janta<span className="text-orange-500">.Control</span>
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 font-medium tracking-tight">
                Gestão de pedidos noturnos, totais semanais, mensais e mapeamento de picos
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center flex-wrap gap-2">
            
            {/* Budget Button */}
            <button
              onClick={onOpenBudget}
              title="Ajustar meta mensal de gastos com janta"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800/90 rounded-xl transition-colors border border-zinc-800 cursor-pointer"
            >
              <Target className="w-4 h-4 text-emerald-400" />
              <span>Orçamento</span>
            </button>

            {/* Export Dropdown / Button */}
            <div className="relative group">
              <button
                onClick={onExportCSV}
                title="Exportar pedidos para Excel (CSV)"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800/90 rounded-xl transition-colors border border-zinc-800 cursor-pointer"
              >
                <Download className="w-4 h-4 text-blue-400" />
                <span>Exportar</span>
              </button>
            </div>

            {/* Reset sample button */}
            <button
              onClick={onResetData}
              title="Restaurar dados de exemplo"
              className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 rounded-xl transition-colors border border-transparent hover:border-zinc-800 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Primary Add Button */}
            <button
              onClick={onOpenNewOrder}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-black uppercase tracking-wider text-zinc-950 bg-orange-500 hover:bg-orange-400 rounded-xl shadow-lg shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Novo Pedido</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
