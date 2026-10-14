import React, { useState } from 'react';
import { X, Target, Save, Check } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBudget: number;
  onSave: (newBudget: number) => void;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  currentBudget,
  onSave,
}) => {
  const [budgetVal, setBudgetVal] = useState<string>(currentBudget.toString());

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(budgetVal.replace(',', '.'));
    if (!isNaN(parsed) && parsed > 0) {
      onSave(parsed);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="px-6 py-4.5 bg-zinc-950 border-b border-zinc-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-zinc-950 font-black shadow-md shadow-orange-500/20 shrink-0">
              <Target className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-white font-['Outfit',sans-serif]">
                Orçamento Mensal de Janta
              </h3>
              <p className="text-xs text-zinc-400 font-medium">
                Defina um teto de gastos para o mês
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-zinc-100">
          <div>
            <label className="block text-[11px] font-black text-zinc-400 uppercase tracking-wider mb-2">
              Meta Máxima Mensal (R$)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 font-mono font-bold text-sm">
                R$
              </span>
              <input
                type="text"
                required
                value={budgetVal}
                onChange={(e) => setBudgetVal(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-zinc-800 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-lg font-mono font-black text-white bg-zinc-950 placeholder:text-zinc-600"
              />
            </div>
            <p className="text-xs text-zinc-500 mt-2 font-medium">
              Você receberá avisos visuais na barra de progresso conforme se aproximar do limite.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            {[600, 800, 1000, 1500].map((quick) => (
              <button
                type="button"
                key={quick}
                onClick={() => setBudgetVal(quick.toString())}
                className="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 text-xs font-black uppercase text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-orange-500 transition-colors cursor-pointer"
              >
                R$ {quick}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-zinc-800 text-zinc-300 hover:bg-zinc-800 text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-zinc-950 text-xs font-black uppercase tracking-wider shadow-lg shadow-orange-500/25 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Orçamento</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
