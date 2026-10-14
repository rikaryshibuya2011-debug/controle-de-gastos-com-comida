import { DinnerOrder } from '../types';
import { formatDateBR, formatCurrency, getDayOfWeekName } from './formatters';

export function exportToCSV(orders: DinnerOrder[]): void {
  // Add UTF-8 BOM so Microsoft Excel handles Brazilian Portuguese accents (ç, ã, é) correctly
  const BOM = '\uFEFF';
  const headers = [
    'ID',
    'Data',
    'Dia da Semana',
    'Restaurante / Local',
    'Prato / Descrição',
    'Categoria',
    'Valor (R$)',
    'Taxa Entrega (R$)',
    'Forma de Pagamento',
    'Pessoas',
    'Avaliação',
    'Observações',
  ];

  const rows = orders.map((order) => [
    order.id,
    formatDateBR(order.date),
    getDayOfWeekName(order.date),
    `"${(order.restaurant || '').replace(/"/g, '""')}"`,
    `"${(order.dish || '').replace(/"/g, '""')}"`,
    order.category,
    order.amount.toFixed(2).replace('.', ','),
    (order.deliveryFee || 0).toFixed(2).replace('.', ','),
    order.paymentMethod,
    order.peopleCount || 1,
    order.rating ? `${order.rating} estrelas` : 'N/A',
    `"${(order.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent =
    BOM +
    headers.join(';') +
    '\n' +
    rows.map((row) => row.join(';')).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `controle_pedidos_janta_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(orders: DinnerOrder[]): void {
  const jsonStr = JSON.stringify(orders, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `backup_pedidos_janta_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
