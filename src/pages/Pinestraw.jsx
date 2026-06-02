import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Leaf, Package, MapPin, Phone, Mail, ClipboardList, CheckCircle, Clock, Truck } from 'lucide-react';

const LOGO = 'https://media.base44.com/images/public/6a1da1101f26862b7b863a4a/21ffdd64d_Screenshot2026-06-01at100515PM.png';

const statusConfig = {
  pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-700', label: 'Pending' },
  scheduled: { icon: Truck, color: 'bg-blue-100 text-blue-700', label: 'Scheduled' },
  delivered: { icon: CheckCircle, color: 'bg-green-100 text-green-700', label: 'Delivered' },
};

function OrderForm() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ customer_name: '', address: '', phone: '', email: '', bales: 1, special_instructions: '' });
  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: (data) => base44.entities.PinestrawOrder.create(data),
    onSuccess: () => { queryClient.invalidateQueries(['pinestraw']); setSubmitted(true); }
  });

  if (submitted) return (
    <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
      <h3 className="font-bold text-green-800 text-xl">Order Submitted!</h3>
      <p className="text-green-700 mt-2">Thank you! A troop member will contact you to confirm delivery.</p>
      <button onClick={() => setSubmitted(false)} className="mt-4 text-sm text-green-600 underline">Place another order</button>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h2 className="font-bold text-[#1a2744] text-xl mb-5 flex items-center gap-2">
        <Leaf className="w-5 h-5 text-green-600" /> Place Your Order
      </h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Full Name *</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" value={form.customer_name} onChange={e => setForm(f => ({...f, customer_name: e.target.value}))} placeholder="John Smith" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Phone Number</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} placeholder="(770) 555-0100" />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Email Address</label>
          <input type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder="you@example.com" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Delivery Address *</label>
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" value={form.address} onChange={e => setForm(f => ({...f, address: e.target.value}))} placeholder="123 Main St, Cumming, GA 30041" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Number of Bales *</label>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setForm(f => ({...f, bales: Math.max(1, f.bales - 1)}))} className="w-10 h-10 rounded-lg border border-gray-300 font-bold text-lg hover:bg-gray-50">−</button>
            <span className="text-2xl font-bold text-[#1a2744] w-10 text-center">{form.bales}</span>
            <button type="button" onClick={() => setForm(f => ({...f, bales: f.bales + 1}))} className="w-10 h-10 rounded-lg border border-gray-300 font-bold text-lg hover:bg-gray-50">+</button>
            <span className="text-sm text-gray-500 ml-2">bale{form.bales !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Special Instructions / Delivery Notes</label>
          <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" rows={3} value={form.special_instructions} onChange={e => setForm(f => ({...f, special_instructions: e.target.value}))} placeholder="Gate code, where to place the pine straw, access notes..." />
        </div>
        <button
          onClick={() => mutation.mutate(form)}
          disabled={!form.customer_name || !form.address || !form.bales || mutation.isPending}
          className="w-full py-3 bg-[#1a2744] hover:bg-[#1a2744]/90 text-white rounded-lg font-bold text-sm disabled:opacity-50 transition-colors"
        >
          {mutation.isPending ? 'Submitting...' : '🌿 Submit Pine Straw Order'}
        </button>
      </div>
    </div>
  );
}

function AdminView() {
  const queryClient = useQueryClient();
  const [show, setShow] = useState(false);

  const { data: orders = [] } = useQuery({
    queryKey: ['pinestraw'],
    queryFn: () => base44.entities.PinestrawOrder.list('-created_date', 200),
    enabled: show,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.PinestrawOrder.update(id, { status }),
    onSuccess: () => queryClient.invalidateQueries(['pinestraw'])
  });

  const totalBales = orders.reduce((sum, o) => sum + (o.bales || 0), 0);
  const pending = orders.filter(o => o.status === 'pending').length;

  if (!show) return (
    <div className="mt-4 text-center">
      <button onClick={() => setShow(true)} className="text-sm text-[#1a2744] underline font-semibold">
        🔒 View Orders (Admin)
      </button>
    </div>
  );

  return (
    <div className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-[#1a2744] text-white p-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5" />
          <h2 className="font-bold text-lg">Order Management</h2>
        </div>
        <div className="flex gap-4 text-sm">
          <span className="bg-white/20 px-3 py-1 rounded-full">{orders.length} orders</span>
          <span className="bg-[#FFD700] text-[#1a2744] font-bold px-3 py-1 rounded-full">{totalBales} bales total</span>
          {pending > 0 && <span className="bg-red-500 px-3 py-1 rounded-full">{pending} pending</span>}
        </div>
      </div>
      <div className="overflow-x-auto">
        {orders.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No orders yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Address</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Bales</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Notes</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map(order => {
                const cfg = statusConfig[order.status] || statusConfig.pending;
                const Icon = cfg.icon;
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[#1a2744]">{order.customer_name}</p>
                      {order.phone && <p className="text-xs text-gray-400">{order.phone}</p>}
                      {order.email && <p className="text-xs text-gray-400">{order.email}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                        <span className="text-gray-700">{order.address}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-[#1a2744] text-lg">{order.bales}</span>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-gray-600 text-xs">{order.special_instructions || '—'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status || 'pending'}
                        onChange={e => updateMutation.mutate({ id: order.id, status: e.target.value })}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border-0 ${cfg.color}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default function Pinestraw() {
  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1a2744] text-white py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <img src={LOGO} alt="Troop 1099" className="w-20 h-20 mx-auto mb-4 rounded-full bg-white p-2 object-contain" />
          <h1 className="text-3xl font-bold">Pine Straw Fundraiser</h1>
          <p className="text-white/70 mt-2 max-w-lg mx-auto">Support Troop 1099 by ordering pine straw delivered straight to your door. All proceeds go directly to troop activities and equipment.</p>
          <div className="flex flex-wrap gap-4 justify-center mt-6">
            <div className="bg-white/10 rounded-lg px-4 py-2 text-sm">
              <span className="text-[#FFD700] font-bold">📦</span> Fresh pine straw bales
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-2 text-sm">
              <span className="text-[#FFD700] font-bold">🚚</span> Delivered by scouts
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-2 text-sm">
              <span className="text-[#FFD700] font-bold">💛</span> Supports the troop
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <OrderForm />
        <AdminView />
      </div>
    </div>
  );
}