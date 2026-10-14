import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Edit2,
  Trash2,
  Copy,
  Calendar,
  Sparkles,
  UtensilsCrossed,
  CreditCard,
  Flame,
  Plus,
  User,
} from 'lucide-react';
import { DinnerOrder, FilterState } from '../types';
import {
  formatCurrency,
  formatDateBR,
  getDayOfWeekName,
  getShortDayOfWeek,
  CATEGORY_EMOJIS,
  ALL_CATEGORIES,
} from '../utils/formatters';
import { parseDate, getWeekStartAndEnd } from '../utils/analytics';

interface OrderTableProps {
  orders: DinnerOrder[];
  onEdit: (order: DinnerOrder) => void;
  onDelete: (id: string) => void;
  onDuplicate: (order: DinnerOrder) => void;
  onOpenNew: () => void;
}

export const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  onEdit,
  onDelete,
  onDuplicate,
  onOpenNew,
}) => {
  const [filter, setFilter] = useState<FilterState>({
    period: 'all',
    category: 'all',
    paymentMethod: 'all',
    searchQuery: '',
    sortBy: 'date_desc',
  });

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const { start: weekStart, end: weekEnd } = getWeekStartAndEnd(now);

    const monthStart = new Date(currentYear, currentMonth, 1);
    const monthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

    const prevMonthStart = new Date(currentYear, currentMonth - 1, 1);
    const prevMonthEnd = new Date(currentYear, currentMonth, 0, 23, 59, 59);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return orders
      .filter((order) => {
        const orderDate = parseDate(order.date);

        // Period filter
        if (filter.period === 'this_week') {
          if (orderDate < weekStart || orderDate > weekEnd) return false;
        } else if (filter.period === 'this_month') {
          if (orderDate < monthStart || orderDate > monthEnd) return false;
        } else if (filter.period === 'last_month') {
          if (orderDate < prevMonthStart || orderDate > prevMonthEnd) return false;
        } else if (filter.period === 'last_30_days') {
          if (orderDate < thirtyDaysAgo || orderDate > now) return false;
        }

        // Category filter
        if (filter.category !== 'all' && order.category !== filter.category) {
          return false;
        }

        // Payment method filter
        if (
          filter.paymentMethod !== 'all' &&
          order.paymentMethod !== filter.paymentMethod
        ) {
          return false;
        }

        // Search query
        if (filter.searchQuery.trim()) {
          const query = filter.searchQuery.toLowerCase();
          const matchRestaurant = order.restaurant?.toLowerCase().includes(query);
          const matchDish = order.dish?.toLowerCase().includes(query);
          const matchNotes = order.notes?.toLowerCase().includes(query);
          const matchCategory = order.category?.toLowerCase().includes(query);
          if (!matchRestaurant && !matchDish && !matchNotes && !matchCategory) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (filter.sortBy === 'date_desc') {
          return b.date.localeCompare(a.date);
        } else if (filter.sortBy === 'date_asc') {
          return a.date.localeCompare(b.date);
        } else if (filter.sortBy === 'amount_desc') {
          return b.amount - a.amount;
        } else if (filter.sortBy === 'amount_asc') {
          return a.amount - b.amount;
        }
        return 0;
      });
  }, [orders, filter]);

  // Total for the filtered rows
  const filteredTotal = filteredOrders.reduce((sum, o) => sum + o.amount, 0);

  // Identify peak threshold in current table (e.g. > R$ 100 or top 10%)
  const maxAmountInList = Math.max(...orders.map((o) => o.amount), 0);

  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xs overflow-hidden">
      
      {/* Controls / Filter Bar */}
      <div className="p-4 sm:p-5 border-b border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-tight font-['Outfit',sans-serif]">
              Tabela de Pedidos de Janta
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-zinc-800 text-zinc-300 border border-zinc-700">
              {filteredOrders.length} {filteredOrders.length === 1 ? 'registro' : 'registros'}
            </span>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar restaurante, prato..."
              value={filter.searchQuery}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, searchQuery: e.target.value }))
              }
              className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-zinc-800 text-xs text-white focus:outline-hidden focus:ring-1 focus:ring-orange-500 focus:border-orange-500 bg-zinc-950 placeholder:text-zinc-500 font-medium"
            />
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          
          {/* Period Selector */}
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl text-xs font-bold border border-zinc-800">
            <button
              onClick={() => setFilter((p) => ({ ...p, period: 'all' }))}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer uppercase tracking-wider text-[11px] ${
                filter.period === 'all'
                  ? 'bg-orange-500 text-zinc-950 shadow-xs font-black'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter((p) => ({ ...p, period: 'this_week' }))}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer uppercase tracking-wider text-[11px] ${
                filter.period === 'this_week'
                  ? 'bg-orange-500 text-zinc-950 shadow-xs font-black'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Esta Semana
            </button>
            <button
              onClick={() => setFilter((p) => ({ ...p, period: 'this_month' }))}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer uppercase tracking-wider text-[11px] ${
                filter.period === 'this_month'
                  ? 'bg-orange-500 text-zinc-950 shadow-xs font-black'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Este Mês
            </button>
            <button
              onClick={() => setFilter((p) => ({ ...p, period: 'last_month' }))}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer uppercase tracking-wider text-[11px] ${
                filter.period === 'last_month'
                  ? 'bg-orange-500 text-zinc-950 shadow-xs font-black'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Mês Passado
            </button>
          </div>

          {/* Category Filter */}
          <select
            value={filter.category}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, category: e.target.value }))
            }
            className="px-3 py-2 rounded-xl border border-zinc-800 text-xs font-bold bg-zinc-950 text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-orange-500"
          >
            <option value="all">Todas as Categorias</option>
            {ALL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_EMOJIS[cat]} {cat}
              </option>
            ))}
          </select>

          {/* Sort Filter */}
          <select
            value={filter.sortBy}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, sortBy: e.target.value as any }))
            }
            className="px-3 py-2 rounded-xl border border-zinc-800 text-xs font-bold bg-zinc-950 text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-orange-500"
          >
            <option value="date_desc">📅 Data (Mais recentes)</option>
            <option value="date_asc">📅 Data (Mais antigos)</option>
            <option value="amount_desc">🔥 Valor (Maior / Picos)</option>
            <option value="amount_asc">💰 Valor (Menor primeiro)</option>
          </select>

        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-zinc-950 text-zinc-400 font-black uppercase tracking-wider text-[11px] border-b border-zinc-800">
            <tr>
              <th className="py-3.5 px-4">Data & Dia</th>
              <th className="py-3.5 px-4">Restaurante & Prato</th>
              <th className="py-3.5 px-4">Categoria</th>
              <th className="py-3.5 px-4">Pagamento</th>
              <th className="py-3.5 px-4">Depositante</th>
              <th className="py-3.5 px-4 text-right">Valor Total</th>
              <th className="py-3.5 px-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/80">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-zinc-500">
                  <div className="flex flex-col items-center justify-center">
                    <UtensilsCrossed className="w-10 h-10 text-zinc-700 mb-2" />
                    <p className="font-bold text-zinc-300 uppercase">Nenhum pedido encontrado</p>
                    <p className="text-xs text-zinc-500 mt-1 mb-3">Tente alterar os filtros ou adicione uma nova janta.</p>
                    <button
                      onClick={onOpenNew}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-black uppercase tracking-wider text-zinc-950 bg-orange-500 hover:bg-orange-400 rounded-xl shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Adicionar Pedido
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const isPeak = order.amount >= maxAmountInList * 0.8 && order.amount > 80;
                return (
                  <tr
                    key={order.id}
                    className="hover:bg-zinc-800/40 transition-colors group"
                  >
                    {/* Date & Day */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-white">
                        {formatDateBR(order.date)}
                      </div>
                      <div className="text-[11px] text-zinc-400 font-medium">
                        {getDayOfWeekName(order.date)}
                      </div>
                    </td>

                    {/* Restaurant & Dish */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-bold text-white truncate" title={order.restaurant}>
                        {order.restaurant || 'Restaurante'}
                      </div>
                      <div className="text-xs text-zinc-400 truncate" title={order.dish}>
                        {order.dish || 'Janta'}
                      </div>
                      {order.notes && (
                        <div className="text-[11px] text-zinc-500 italic truncate mt-0.5">
                          "{order.notes}"
                        </div>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-zinc-950 text-zinc-200 border border-zinc-800">
                        <span>{CATEGORY_EMOJIS[order.category] || '🍽️'}</span>
                        <span>{order.category}</span>
                      </span>
                    </td>

                    {/* Payment */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="text-xs font-bold text-zinc-300">
                        {order.paymentMethod}
                      </div>
                      {order.peopleCount && order.peopleCount > 1 && (
                        <div className="text-[11px] text-zinc-500">
                          {order.peopleCount} pessoas ({formatCurrency(order.amount / order.peopleCount)}/cad)
                        </div>
                      )}
                    </td>

                    {/* Depositor */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {order.depositor ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <User className="w-3.5 h-3.5" />
                          {order.depositor}
                        </span>
                      ) : (
                        <span className="text-[11px] text-zinc-600 font-medium italic">-</span>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {isPeak && (
                          <span
                            title="Pico alto de gasto"
                            className="inline-flex items-center gap-0.5 text-[10px] font-black uppercase text-rose-400 bg-rose-500/10 border border-rose-500/30 px-1.5 py-0.5 rounded-md"
                          >
                            <Flame className="w-3 h-3 text-rose-400" /> Pico
                          </span>
                        )}
                        <span className="font-mono font-black text-white text-sm sm:text-base">
                          {formatCurrency(order.amount)}
                        </span>
                      </div>
                      {order.deliveryFee ? (
                        <div className="text-[11px] text-zinc-500">
                          taxa: {formatCurrency(order.deliveryFee)}
                        </div>
                      ) : null}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100">
                        <button
                          onClick={() => onDuplicate(order)}
                          title="Duplicar este pedido para hoje"
                          className="p-1.5 text-zinc-400 hover:text-orange-400 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit(order)}
                          title="Editar pedido"
                          className="p-1.5 text-zinc-400 hover:text-blue-400 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(order.id)}
                          title="Excluir pedido"
                          className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          {filteredOrders.length > 0 && (
            <tfoot className="bg-zinc-950 font-bold text-white border-t-2 border-zinc-800">
              <tr>
                <td colSpan={5} className="py-4 px-4 text-xs sm:text-sm uppercase tracking-wider font-black text-zinc-300">
                  Total dos Pedidos Filtrados ({filteredOrders.length} {filteredOrders.length === 1 ? 'pedido' : 'pedidos'})
                </td>
                <td className="py-4 px-4 text-right text-base sm:text-lg text-orange-400 font-mono font-black">
                  {formatCurrency(filteredTotal)}
                </td>
                <td className="py-4 px-4"></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

    </div>
  );
};
