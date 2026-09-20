import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Plus, 
  Filter, 
  Trash2, 
  Edit3, 
  Minus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  AlertCircle,
  Calendar,
  Layers,
  X
} from 'lucide-react';
import { api } from '../api';

export default function SmartPantry({ pantryItems, onRefresh }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // New Item Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Produce',
    quantity: 1,
    unit: 'kg',
    price: 3.0,
    purchase_date: new Date().toISOString().split('T')[0],
    expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    min_threshold: 1.0,
    daily_burn_rate: 0.2,
    notes: ''
  });

  // Filter items
  const filteredItems = pantryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCat;
  });

  // Categories list
  const categories = ['All', ...new Set(pantryItems.map(i => i.category))];

  const handleQuantityAdjust = async (item, delta) => {
    const newQty = Math.max(0, Math.round((item.quantity + delta) * 10) / 10);
    try {
      await api.updatePantryItem(item.id, { quantity: newQty });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete ${name} from pantry?`)) {
      try {
        await api.deletePantryItem(id);
        onRefresh();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.updatePantryItem(editingItem.id, formData);
      } else {
        await api.addPantryItem(formData);
      }
      setIsAddModalOpen(false);
      setEditingItem(null);
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to save item');
    }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      price: item.price,
      purchase_date: item.purchase_date,
      expiry_date: item.expiry_date,
      min_threshold: item.min_threshold,
      daily_burn_rate: item.daily_burn_rate,
      notes: item.notes || ''
    });
    setIsAddModalOpen(true);
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Produce',
      quantity: 1,
      unit: 'kg',
      price: 3.0,
      purchase_date: new Date().toISOString().split('T')[0],
      expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      min_threshold: 1.0,
      daily_burn_rate: 0.2,
      notes: ''
    });
    setIsAddModalOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Fresh':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Fresh</span>;
      case 'Expiring Soon':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">Expiring Soon</span>;
      case 'Expired':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">Expired</span>;
      case 'Low Stock':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">Low Stock</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">In Stock</span>;
    }
  };

  const getItemEmoji = (name) => {
    const n = (name || '').toLowerCase();
    if (n.includes('milk')) return '🥛';
    if (n.includes('rice')) return '🍚';
    if (n.includes('tomato')) return '🍅';
    if (n.includes('egg')) return '🥚';
    if (n.includes('bread')) return '🍞';
    if (n.includes('potato')) return '🥔';
    if (n.includes('oil')) return '🛢️';
    if (n.includes('paneer') || n.includes('cheese')) return '🧀';
    if (n.includes('spinach') || n.includes('palak')) return '🥬';
    if (n.includes('banana')) return '🍌';
    if (n.includes('chicken') || n.includes('meat')) return '🍗';
    if (n.includes('quinoa') || n.includes('grain')) return '🌾';
    return '📦';
  };

  const getStatusCount = (status) => {
    if (status === 'All') return pantryItems.length;
    return pantryItems.filter(i => i.status === status).length;
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900">Smart Pantry Inventory</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time track of all ingredients, expiry dates, quantities, and burn rates.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-md shadow-emerald-600/20 transition-all hover:scale-105 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Item Manually</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search groceries by name or category (e.g., Milk, Produce, Rice)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-400">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none text-slate-700 focus:ring-2 focus:ring-emerald-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Filter Pills with Counts */}
        <div className="flex items-center space-x-2 pt-2 border-t border-slate-100 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-400 mr-1 flex items-center">
            <Filter className="w-3.5 h-3.5 mr-1" />
            Filter:
          </span>
          {['All', 'Fresh', 'Expiring Soon', 'Low Stock', 'Expired'].map((status) => {
            const count = getStatusCount(status);
            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                  selectedStatus === status
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{status}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  selectedStatus === status ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Groceries Table / Cards */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Item Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4 text-center">Quantity</th>
                <th className="py-3.5 px-4">Purchase Date</th>
                <th className="py-3.5 px-4">Freshness & Expiry</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Price</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    No items found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl p-1.5 bg-slate-100 rounded-xl flex items-center justify-center">
                          {getItemEmoji(item.name)}
                        </span>
                        <div>
                          <span>{item.name}</span>
                          {item.notes && (
                            <span className="block text-[11px] font-normal text-slate-400 truncate max-w-xs" title={item.notes}>
                              {item.notes}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-semibold text-[11px]">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {/* Quantity Editor Controls */}
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => handleQuantityAdjust(item, -0.5)}
                          className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                          title="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-slate-900 min-w-[3rem] text-center">
                          {item.quantity} {item.unit}
                        </span>
                        <button
                          onClick={() => handleQuantityAdjust(item, 0.5)}
                          className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                          title="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{item.purchase_date}</td>
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-800 font-semibold">{item.expiry_date}</span>
                          <span className={`text-[10px] font-bold ${
                            item.days_left <= 2 ? 'text-rose-600' : item.days_left <= 4 ? 'text-amber-600' : 'text-slate-400'
                          }`}>
                            {item.days_left === 0 ? 'Today' : `${item.days_left}d left`}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              item.days_left <= 1 ? 'bg-rose-500' : item.days_left <= 3 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, Math.max(15, (item.days_left / 14) * 100))}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-slate-900">
                      ₹{Number(item.price).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Edit item details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {editingItem ? `Edit ${editingItem.name}` : 'Add Grocery Item'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Item Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="e.g. Milk, Rice"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="Dairy">Dairy</option>
                    <option value="Dairy & Eggs">Dairy & Eggs</option>
                    <option value="Produce">Produce</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Grains">Grains</option>
                    <option value="Pantry">Pantry</option>
                    <option value="Meat & Poultry">Meat & Poultry</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Quantity</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-center"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Unit</label>
                  <input
                    type="text"
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-center"
                    placeholder="kg, packets, pcs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-right"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Purchase Date</label>
                  <input
                    type="date"
                    required
                    value={formData.purchase_date}
                    onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Estimated Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={formData.expiry_date}
                    onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Low Stock Alert Threshold</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.min_threshold}
                    onChange={(e) => setFormData({ ...formData, min_threshold: parseFloat(e.target.value) || 1 })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Daily Burn Rate (Units/Day)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={formData.daily_burn_rate}
                    onChange={(e) => setFormData({ ...formData, daily_burn_rate: parseFloat(e.target.value) || 0.2 })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Notes / Brand</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="e.g. Organic, whole wheat"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20"
                >
                  {editingItem ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
