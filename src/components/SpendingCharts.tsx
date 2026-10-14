import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  ReferenceLine,
  AreaChart,
  Area,
} from 'recharts';
import {
  DaySpending,
  DayOfWeekSpending,
  CategorySpending,
  DinnerOrder,
} from '../types';
import {
  formatCurrency,
  formatDateBR,
  CATEGORY_EMOJIS,
} from '../utils/formatters';
import {
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
  CreditCard,
  Flame,
  Info,
} from 'lucide-react';

interface SpendingChartsProps {
  dailyData: DaySpending[];
  dayOfWeekData: DayOfWeekSpending[];
  categoryData: CategorySpending[];
  paymentData: { method: string; total: number; count: number; percentage: number }[];
  orders: DinnerOrder[];
}

export const SpendingCharts: React.FC<SpendingChartsProps> = ({
  dailyData,
  dayOfWeekData,
  categoryData,
  paymentData,
  orders,
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'dayOfWeek' | 'category' | 'payment'>('timeline');

  // Compute average daily spending for reference line
  const averageDaily =
    dailyData.length > 0
      ? dailyData.reduce((acc, d) => acc + d.total, 0) / dailyData.length
      : 0;

  // Custom tooltip for daily chart
  const CustomDailyTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: DaySpending = payload[0].payload;
      return (
        <div className="bg-zinc-950 text-zinc-100 p-3.5 rounded-xl shadow-2xl border border-zinc-800 text-xs">
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <span className="font-bold text-white">{data.formattedDate}</span>
            <span className="text-zinc-400 font-bold uppercase text-[10px]">{data.dayOfWeek}</span>
          </div>
          <div className="text-lg font-black text-orange-400 font-['Outfit',sans-serif]">
            {formatCurrency(data.total)}
          </div>
          <div className="text-zinc-400 mt-1 flex items-center justify-between gap-2">
            <span>{data.ordersCount} {data.ordersCount === 1 ? 'pedido' : 'pedidos'}</span>
            {data.isPeak && (
              <span className="text-rose-400 font-black flex items-center gap-1 uppercase text-[10px]">
                <Flame className="w-3 h-3" /> Pico de gasto!
              </span>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for day of week chart
  const CustomDowTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: DayOfWeekSpending = payload[0].payload;
      return (
        <div className="bg-zinc-950 text-zinc-100 p-3.5 rounded-xl shadow-2xl border border-zinc-800 text-xs">
          <div className="font-bold text-white mb-1 uppercase tracking-wider text-[11px]">{data.dayName}</div>
          <div className="text-lg font-black text-amber-400 font-['Outfit',sans-serif]">
            {formatCurrency(data.total)}
          </div>
          <div className="text-zinc-400 mt-1">
            {data.count} pedidos • {data.percentage.toFixed(1)}% do total
          </div>
          {data.isPeak && (
            <div className="text-rose-400 font-black mt-1 flex items-center gap-1 uppercase text-[10px]">
              <Flame className="w-3.5 h-3.5" /> Dia de maior pico da semana
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for category chart
  const CustomCategoryTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: CategorySpending = payload[0].payload;
      return (
        <div className="bg-zinc-950 text-zinc-100 p-3.5 rounded-xl shadow-2xl border border-zinc-800 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-white mb-1">
            <span>{CATEGORY_EMOJIS[data.category] || '🍽️'}</span>
            <span>{data.category}</span>
          </div>
          <div className="text-lg font-black text-orange-400 font-['Outfit',sans-serif]">
            {formatCurrency(data.total)}
          </div>
          <div className="text-zinc-400 mt-1">
            {data.count} pedidos • {data.percentage.toFixed(1)}% dos gastos
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xs overflow-hidden">
      
      {/* Header with Navigation Tabs */}
      <div className="p-4 sm:p-5 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-tight font-['Outfit',sans-serif]">
            Mapeamento Visual de Gastos & Picos
          </h2>
          <p className="text-xs text-zinc-400 font-medium">
            Acompanhe a distribuição temporal, dias de maior consumo e tipos de comida
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-zinc-950 p-1 rounded-xl gap-1 self-start sm:self-auto overflow-x-auto max-w-full border border-zinc-800">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'timeline'
                ? 'bg-orange-500 text-zinc-950 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Picos Diários</span>
          </button>

          <button
            onClick={() => setActiveTab('dayOfWeek')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'dayOfWeek'
                ? 'bg-orange-500 text-zinc-950 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Dias da Semana</span>
          </button>

          <button
            onClick={() => setActiveTab('category')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'category'
                ? 'bg-orange-500 text-zinc-950 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <PieChartIcon className="w-3.5 h-3.5" />
            <span>Categorias</span>
          </button>

          <button
            onClick={() => setActiveTab('payment')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'payment'
                ? 'bg-orange-500 text-zinc-950 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Pagamentos</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="p-4 sm:p-6">
        {orders.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6">
            <BarChart3 className="w-12 h-12 text-zinc-700 mb-2" />
            <p className="text-sm font-bold text-zinc-300 uppercase">Nenhum dado para exibir gráficos</p>
            <p className="text-xs text-zinc-500 mt-1">Adicione seu primeiro pedido de janta para ver as análises e picos.</p>
          </div>
        ) : (
          <>
            {/* TAB 1: DAILY TIMELINE & PEAKS */}
            {activeTab === 'timeline' && (
              <div>
                <div className="flex items-center justify-between mb-4 text-xs text-zinc-400">
                  <span className="font-bold text-zinc-300">
                    Evolução diária com destaque para dias de pico (&gt; R$ {averageDaily.toFixed(0)})
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-3 h-3 rounded-xs bg-orange-500 inline-block" />
                      Gasto Diário
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="w-3 h-3 rounded-xs bg-rose-500 inline-block" />
                      Pico
                    </span>
                    <span className="inline-flex items-center gap-1 text-zinc-500">
                      <span className="w-4 h-0.5 border-t border-dashed border-zinc-600 inline-block" />
                      Média ({formatCurrency(averageDaily)})
                    </span>
                  </span>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                      <XAxis
                        dataKey="dayLabel"
                        tickLine={false}
                        axisLine={{ stroke: '#3f3f46' }}
                        tick={{ fill: '#a1a1aa', fontSize: 11 }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={{ stroke: '#3f3f46' }}
                        tick={{ fill: '#a1a1aa', fontSize: 11 }}
                        tickFormatter={(val) => `R$${val}`}
                      />
                      <Tooltip content={<CustomDailyTooltip />} />
                      {averageDaily > 0 && (
                        <ReferenceLine
                          y={averageDaily}
                          stroke="#71717a"
                          strokeDasharray="4 4"
                          label={{
                            value: 'Média',
                            position: 'insideTopRight',
                            fill: '#a1a1aa',
                            fontSize: 10,
                          }}
                        />
                      )}
                      <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                        {dailyData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.isPeak ? '#f43f5e' : '#f97316'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* TAB 2: DAY OF WEEK PEAKS */}
            {activeTab === 'dayOfWeek' && (
              <div>
                <div className="mb-4 text-xs text-zinc-400">
                  <span className="font-bold text-zinc-300">
                    Volume acumulado por dia da semana (Segunda a Domingo)
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                  <div className="lg:col-span-2 h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dayOfWeekData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                        <XAxis
                          dataKey="shortName"
                          tickLine={false}
                          axisLine={{ stroke: '#3f3f46' }}
                          tick={{ fill: '#a1a1aa', fontSize: 12, fontWeight: 700 }}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={{ stroke: '#3f3f46' }}
                          tick={{ fill: '#a1a1aa', fontSize: 11 }}
                          tickFormatter={(val) => `R$${val}`}
                        />
                        <Tooltip content={<CustomDowTooltip />} />
                        <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                          {dayOfWeekData.map((entry, index) => (
                            <Cell
                              key={`dow-${index}`}
                              fill={entry.isPeak ? '#ef4444' : '#3b82f6'}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* List ranking */}
                  <div className="space-y-2 bg-zinc-950/80 p-4 rounded-xl border border-zinc-800">
                    <span className="text-xs font-black uppercase tracking-wider text-zinc-400 block mb-2">
                      Ranking por Dia
                    </span>
                    {[...dayOfWeekData]
                      .sort((a, b) => b.total - a.total)
                      .map((d, i) => (
                        <div key={d.dayName} className="flex items-center justify-between text-xs py-1.5 border-b border-zinc-900 last:border-0">
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] ${
                                i === 0
                                  ? 'bg-rose-500 text-zinc-950'
                                  : i === 1
                                  ? 'bg-orange-500 text-zinc-950'
                                  : 'bg-zinc-800 text-zinc-300'
                              }`}
                            >
                              {i + 1}
                            </span>
                            <span className={`font-bold ${d.isPeak ? 'text-rose-400' : 'text-zinc-300'}`}>
                              {d.dayName}
                            </span>
                          </div>
                          <span className="font-mono font-bold text-white">
                            {formatCurrency(d.total)}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CATEGORY MAPPING */}
            {activeTab === 'category' && (
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-6 h-72 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={65}
                          outerRadius={95}
                          paddingAngle={3}
                          dataKey="total"
                          nameKey="category"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cat-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomCategoryTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Category Legend & Details */}
                  <div className="lg:col-span-6 space-y-2 max-h-72 overflow-y-auto pr-1">
                    {categoryData.map((cat) => (
                      <div
                        key={cat.category}
                        className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/80 hover:bg-zinc-950 transition-colors text-xs border border-zinc-800"
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-3.5 h-3.5 rounded-md shrink-0"
                            style={{ backgroundColor: cat.color }}
                          />
                          <span className="font-bold text-zinc-200 flex items-center gap-1.5">
                            <span>{CATEGORY_EMOJIS[cat.category] || '🍽️'}</span>
                            <span>{cat.category}</span>
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-white block">
                            {formatCurrency(cat.total)}
                          </span>
                          <span className="text-[11px] text-zinc-500 font-medium">
                            {cat.count} {cat.count === 1 ? 'pedido' : 'pedidos'} ({cat.percentage.toFixed(0)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: PAYMENT METHODS */}
            {activeTab === 'payment' && (
              <div className="space-y-3 max-w-2xl mx-auto py-2">
                <div className="text-xs text-zinc-400 mb-2">
                  <span className="font-bold text-zinc-300">
                    Distribuição de gastos por forma de pagamento
                  </span>
                </div>

                {paymentData.map((p) => (
                  <div key={p.method} className="bg-zinc-950/80 p-3.5 rounded-xl border border-zinc-800">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-zinc-200 flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-orange-400" />
                        {p.method}
                      </span>
                      <span className="font-mono font-bold text-white">
                        {formatCurrency(p.total)}{' '}
                        <span className="text-zinc-400 font-normal">({p.percentage.toFixed(1)}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                        style={{ width: `${p.percentage}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-1.5 text-right font-medium">
                      {p.count} {p.count === 1 ? 'pedido' : 'pedidos'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
};
