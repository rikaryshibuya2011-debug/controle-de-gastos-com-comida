import React, { useState, useEffect, useMemo } from 'react';
import { DinnerOrder } from './types';
import { INITIAL_ORDERS } from './data/mockData';
import {
  calculateStats,
  analyzePeaks,
  getDayOfWeekBreakdown,
  getCategoryBreakdown,
  getDailySpendingTimeline,
  getPaymentMethodBreakdown,
} from './utils/analytics';
import { exportToCSV, exportToJSON } from './utils/export';
import { Header } from './components/Header';
import { MetricsCards } from './components/MetricsCards';
import { DepositorBalance } from './components/DepositorBalance';
import { PeakBanner } from './components/PeakBanner';
import { SpendingCharts } from './components/SpendingCharts';
import { OrderTable } from './components/OrderTable';
import { OrderFormModal } from './components/OrderFormModal';
import { BudgetModal } from './components/BudgetModal';
import { DesktopAppModal } from './components/DesktopAppModal';
import { getTodayDateString } from './utils/formatters';

declare global {
  interface Window {
    api?: {
      store: {
        get: (key: string) => Promise<any>;
        set: (key: string, val: any) => Promise<void>;
      }
    }
  }
}

const STORAGE_KEY = 'controle_janta_pedidos_v2';
const BUDGET_STORAGE_KEY = 'controle_janta_budget_v2';

export default function App() {
  const [orders, setOrders] = useState<DinnerOrder[]>([]);
  const [monthlyBudget, setMonthlyBudget] = useState<number>(800);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from Electron Store or LocalStorage
  useEffect(() => {
    async function loadData() {
      try {
        if (window.api && window.api.store) {
          const savedOrders = await window.api.store.get(STORAGE_KEY);
          if (savedOrders) setOrders(JSON.parse(savedOrders));
          
          const savedBudget = await window.api.store.get(BUDGET_STORAGE_KEY);
          if (savedBudget) setMonthlyBudget(parseFloat(savedBudget));
        } else {
          // Fallback para navegador
          const localOrders = localStorage.getItem(STORAGE_KEY);
          if (localOrders) setOrders(JSON.parse(localOrders));
          
          const localBudget = localStorage.getItem(BUDGET_STORAGE_KEY);
          if (localBudget) setMonthlyBudget(parseFloat(localBudget));
        }
      } catch (e) {
        console.error('Error loading data:', e);
      } finally {
        setIsLoaded(true);
      }
    }
    loadData();
  }, []);

  // Modals state
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<DinnerOrder | null>(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isDesktopModalOpen, setIsDesktopModalOpen] = useState(false);

  // Save to Electron Store & LocalStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const ordersStr = JSON.stringify(orders);
      localStorage.setItem(STORAGE_KEY, ordersStr);
      if (window.api && window.api.store) {
        window.api.store.set(STORAGE_KEY, ordersStr);
      }
    } catch (e) {
      console.error('Error saving orders:', e);
    }
  }, [orders, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      const budgetStr = monthlyBudget.toString();
      localStorage.setItem(BUDGET_STORAGE_KEY, budgetStr);
      if (window.api && window.api.store) {
        window.api.store.set(BUDGET_STORAGE_KEY, budgetStr);
      }
    } catch (e) {
      console.error('Error saving budget:', e);
    }
  }, [monthlyBudget, isLoaded]);

  // Analytics computation
  const stats = useMemo(() => calculateStats(orders), [orders]);
  const peakAnalysis = useMemo(() => analyzePeaks(orders), [orders]);
  const dayOfWeekData = useMemo(() => getDayOfWeekBreakdown(orders), [orders]);
  const categoryData = useMemo(() => getCategoryBreakdown(orders), [orders]);
  const dailyTimeline = useMemo(() => getDailySpendingTimeline(orders), [orders]);
  const paymentData = useMemo(() => getPaymentMethodBreakdown(orders), [orders]);

  // Handlers
  const handleOpenNewOrder = () => {
    setEditingOrder(null);
    setIsOrderModalOpen(true);
  };

  const handleEditOrder = (order: DinnerOrder) => {
    setEditingOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleDuplicateOrder = (order: DinnerOrder) => {
    const duplicated: DinnerOrder = {
      ...order,
      id: `ord-${Date.now()}`,
      date: getTodayDateString(),
      createdAt: Date.now(),
      notes: order.notes ? `Repetido: ${order.notes}` : 'Pedido repetido',
    };
    setOrders((prev) => [duplicated, ...prev]);
  };

  const handleDeleteOrder = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este registro de janta?')) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
    }
  };

  const handleSaveOrder = (
    orderData: Omit<DinnerOrder, 'id' | 'createdAt'>,
    editingId?: string
  ) => {
    if (editingId) {
      setOrders((prev) =>
        prev.map((o) => (o.id === editingId ? { ...o, ...orderData } : o))
      );
    } else {
      const newOrder: DinnerOrder = {
        ...orderData,
        id: `ord-${Date.now()}`,
        createdAt: Date.now(),
      };
      setOrders((prev) => [newOrder, ...prev]);
    }
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Deseja apagar todos os dados registrados? Essa ação não pode ser desfeita.'
      )
    ) {
      setOrders([]);
      setMonthlyBudget(800);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* App Header */}
      <Header
        onOpenNewOrder={handleOpenNewOrder}
        onOpenBudget={() => setIsBudgetModalOpen(true)}
        onOpenDesktopModal={() => setIsDesktopModalOpen(true)}
        onExportCSV={() => exportToCSV(orders)}
        onExportJSON={() => exportToJSON(orders)}
        onResetData={handleResetData}
        monthlyBudget={monthlyBudget}
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Row 1: Key Metrics (Total Semana, Total Mês, Média por Janta, Maior Pico) */}
        <MetricsCards
          stats={stats}
          peakAnalysis={peakAnalysis}
          monthlyBudget={monthlyBudget}
        />

        {/* Row 2: Depositor Balances */}
        <DepositorBalance orders={orders} />

        {/* Row 3: Peak Analysis Banner */}
        <PeakBanner
          peakAnalysis={peakAnalysis}
          topCategory={categoryData[0]}
        />

        {/* Row 3: Interactive Charts & Spending Mapping */}
        <SpendingCharts
          dailyData={dailyTimeline}
          dayOfWeekData={dayOfWeekData}
          categoryData={categoryData}
          paymentData={paymentData}
          orders={orders}
        />

        {/* Row 4: Orders Table with Filtering, Sorting and Actions */}
        <OrderTable
          orders={orders}
          onEdit={handleEditOrder}
          onDelete={handleDeleteOrder}
          onDuplicate={handleDuplicateOrder}
          onOpenNew={handleOpenNewOrder}
        />

      </main>

      {/* App Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-900/60 py-6 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-bold text-zinc-400 uppercase tracking-wider text-[11px]">Controle de Pedidos de Janta & Mapeamento de Gastos</span>
          <span className="font-medium text-zinc-500">Armazenamento local em tempo real • Pronto para Desktop</span>
        </div>
      </footer>

      {/* Modals */}
      <OrderFormModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onSave={handleSaveOrder}
        initialData={editingOrder}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        currentBudget={monthlyBudget}
        onSave={(newBudget) => setMonthlyBudget(newBudget)}
      />

      <DesktopAppModal
        isOpen={isDesktopModalOpen}
        onClose={() => setIsDesktopModalOpen(false)}
      />

    </div>
  );
}
