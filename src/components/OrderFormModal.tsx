import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Save,
  Utensils,
  DollarSign,
  Calendar,
  Tag,
  CreditCard,
  Users,
  FileText,
  User,
} from 'lucide-react';
import { DinnerOrder, DinnerCategory, PaymentMethod } from '../types';
import {
  ALL_CATEGORIES,
  CATEGORY_EMOJIS,
  getTodayDateString,
  getDayOfWeekName,
} from '../utils/formatters';

interface OrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: Omit<DinnerOrder, 'id' | 'createdAt'>, editingId?: string) => void;
  initialData?: DinnerOrder | null;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  'Pix',
  'Cartão de Crédito',
  'Cartão de Débito',
  'Vale Refeição (VR/VA)',
  'Dinheiro',
];

export const OrderFormModal: React.FC<OrderFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [date, setDate] = useState<string>(getTodayDateString());
  const [restaurant, setRestaurant] = useState<string>('');
  const [dish, setDish] = useState<string>('');
  const [category, setCategory] = useState<DinnerCategory>('Pizza');
  const [amount, setAmount] = useState<string>('');
  const [deliveryFee, setDeliveryFee] = useState<string>('0');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Pix');
  const [peopleCount, setPeopleCount] = useState<number>(1);
  const [rating, setRating] = useState<number>(5);
  const [notes, setNotes] = useState<string>('');
  const [depositor, setDepositor] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setDate(initialData.date);
      setRestaurant(initialData.restaurant);
      setDish(initialData.dish);
      setCategory(initialData.category);
      setAmount(initialData.amount.toString());
      setDeliveryFee((initialData.deliveryFee || 0).toString());
      setPaymentMethod(initialData.paymentMethod);
      setPeopleCount(initialData.peopleCount || 1);
      setRating(initialData.rating || 5);
      setNotes(initialData.notes || '');
      setDepositor(initialData.depositor || '');
    } else {
      setDate(getTodayDateString());
      setRestaurant('');
      setDish('');
      setCategory('Pizza');
      setAmount('');
      setDeliveryFee('0');
      setPaymentMethod('Pix');
      setPeopleCount(1);
      setRating(5);
      setNotes('');
      setDepositor('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numericAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert('Por favor, informe um valor válido para o pedido de janta.');
      return;
    }

    const numericDelivery = parseFloat(deliveryFee.replace(',', '.')) || 0;

    onSave(
      {
        date: date || getTodayDateString(),
        restaurant: restaurant.trim() || 'Restaurante / Delivery',
        dish: dish.trim() || 'Janta',
        category,
        amount: numericAmount,
        deliveryFee: numericDelivery,
        paymentMethod,
        peopleCount: Number(peopleCount) || 1,
        rating,
        notes: notes.trim(),
        depositor: depositor.trim(),
      },
      initialData?.id
    );

    onClose();
  };

  const dayName = getDayOfWeekName(date);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 w-full max-w-lg overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-zinc-950 border-b border-zinc-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-zinc-950 font-black shadow-md shadow-orange-500/20 shrink-0">
              <Utensils className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight text-white font-['Outfit',sans-serif]">
                {initialData ? 'Editar Pedido de Janta' : 'Novo Pedido de Janta'}
              </h3>
              <p className="text-xs text-zinc-400 font-medium">
                Cadastre o valor, data e itens para mapear seus gastos
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-zinc-100">
          
          {/* Row 1: Date & Day indicator */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-orange-400" />
                Data da Janta *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-800 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm bg-zinc-950 text-white font-medium"
              />
              {date && (
                <span className="text-[11px] font-bold text-orange-400 mt-1 block">
                  {dayName}
                </span>
              )}
            </div>

            {/* Total Amount in R$ */}
            <div>
              <label className="block text-[11px] font-black text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                Valor Total (R$) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 font-mono font-bold text-sm">
                  R$
                </span>
                <input
                  type="text"
                  required
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-zinc-800 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-base font-mono font-black text-white bg-zinc-950 placeholder:text-zinc-600"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Restaurant & Dish */}
          <div>
            <label className="block text-[11px] font-black text-zinc-400 uppercase tracking-wider mb-1.5">
              Restaurante / Local
            </label>
            <input
              type="text"
              placeholder="Ex: Pizzaria Bella, iFood Burger, Sushiya..."
              value={restaurant}
              onChange={(e) => setRestaurant(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-zinc-800 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm bg-zinc-950 text-white placeholder:text-zinc-600 font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black text-zinc-400 uppercase tracking-wider mb-1.5">
              Prato / O que você pediu?
            </label>
            <input
              type="text"
              placeholder="Ex: Pizza Calabresa Grande + Refri, Combo Smash..."
              value={dish}
              onChange={(e) => setDish(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-zinc-800 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm bg-zinc-950 text-white placeholder:text-zinc-600 font-medium"
            />
          </div>

          {/* Row 3: Category & Payment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-blue-400" />
                Categoria *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DinnerCategory)}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-800 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm bg-zinc-950 text-zinc-200 font-bold"
              >
                {ALL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_EMOJIS[cat]} {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-black text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-purple-400" />
                Forma de Pagamento
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-800 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm bg-zinc-950 text-zinc-200 font-bold"
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Divisão (Pessoas) e Depositante */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-zinc-400" />
                Divisão (Pessoas)
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={peopleCount}
                onChange={(e) => setPeopleCount(parseInt(e.target.value) || 1)}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-800 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm bg-zinc-950 text-white font-bold"
              />
            </div>
            
            <div>
              <label className="block text-[11px] font-black text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                Quem Pagou (Depositante)
              </label>
              <input
                type="text"
                placeholder="Ex: Nude, Sbb..."
                value={depositor}
                onChange={(e) => setDepositor(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-800 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm bg-zinc-950 text-white font-medium placeholder:text-zinc-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-zinc-400" />
              Observações
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Janta com amigos, promoção de cupom..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-zinc-800 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm bg-zinc-950 text-white placeholder:text-zinc-600 resize-none font-medium"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-zinc-800 text-zinc-300 hover:bg-zinc-800 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-zinc-950 text-xs font-black uppercase tracking-wider shadow-lg shadow-orange-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{initialData ? 'Atualizar Pedido' : 'Salvar Pedido'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
