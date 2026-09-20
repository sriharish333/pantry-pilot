import React from 'react';
import { 
  Package, 
  Clock, 
  AlertTriangle, 
  Trash2, 
  ScanLine, 
  ShoppingBag, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ChefHat
} from 'lucide-react';

export default function Dashboard({ 
  pantryItems, 
  predictions, 
  insights, 
  alerts, 
  setActiveTab, 
  onOpenVerify 
}) {
  const totalCount = pantryItems.length;
  const expiringCount = pantryItems.filter(i => i.status === 'Expiring Soon' || i.days_left <= 3).length;
  const lowStockCount = pantryItems.filter(i => i.status === 'Low Stock' || i.quantity <= i.min_threshold).length;
  const monthlySpending = insights?.monthly_spending || 0;
  const foodWaste = insights?.estimated_food_waste || 0;
  const potentialSavings = insights?.potential_savings || 0;

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

  return (
    <div className="space-y-6">
      {/* Hero Welcome & Professional Action Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>AI-Driven Smart Pantry • India Edition</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Welcome to PantryPilot
          </h1>
          <p className="mt-2 text-emerald-100 text-sm sm:text-base leading-relaxed">
            Eliminate duplicate shopping trips, prevent food spoilage before expiration, and get cryptographic proof of your household grocery savings.
          </p>
          
          {/* Quick Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('scanner')}
              className="inline-flex items-center space-x-2 bg-white text-emerald-800 hover:bg-emerald-50 px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all hover:scale-105"
            >
              <ScanLine className="w-4 h-4 text-emerald-600" />
              <span>Scan Receipt</span>
            </button>
            <button
              onClick={() => setActiveTab('pantry')}
              className="inline-flex items-center space-x-2 bg-emerald-700/80 hover:bg-emerald-700 text-white border border-emerald-500/50 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>View Pantry</span>
            </button>
            <button
              onClick={() => setActiveTab('recommendations')}
              className="inline-flex items-center space-x-2 bg-emerald-900/60 hover:bg-emerald-900 text-white border border-emerald-500/30 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Get Suggestions</span>
            </button>
            <button
              onClick={onOpenVerify}
              className="inline-flex items-center space-x-2 bg-indigo-900/60 hover:bg-indigo-900 text-indigo-100 border border-indigo-400/40 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-300" />
              <span>Verify Audit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Beginner-Friendly "How PantryPilot Works" 3-Step Banner */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold">GUIDE</span>
            <h3 className="text-sm font-extrabold text-slate-800">How PantryPilot Works in 3 Simple Steps</h3>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
            Beginner Friendly
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
              1
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Scan Grocery Bill</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Upload or click a store bill (Reliance Fresh, DMart). OCR extracts items, quantities, and prices automatically.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
              2
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">AI Tracks Freshness</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Calculates daily burn rates and alerts you days before milk, tomatoes, or bread spoil.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
              3
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Smart Buy / Skip Advice</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Prevents duplicate purchases (e.g. skips rice if 5 kg is in stock) and gives verified proof of savings.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Chef Suggestion: Cook Tonight with Expiring Food */}
      {expiringCount > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-3xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <span className="text-2xl p-2.5 bg-white rounded-2xl shadow-xs">🍳</span>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-extrabold text-amber-950">
                    Smart Chef Suggestion: Cook Tonight with Expiring Groceries
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                    Save ₹85.00
                  </span>
                </div>
                <p className="text-xs text-amber-900/90 mt-1 leading-relaxed">
                  Your <strong>Tomatoes (1 kg)</strong> and <strong>Bread (1 packet)</strong> expire in 2 days! Prepare <strong>Spicy Masala Tomato Toast</strong> or <strong>Egg & Tomato Bhurji</strong> for dinner to enjoy fresh meals and cut waste.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('pantry')}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-colors self-start sm:self-auto flex-shrink-0"
            >
              <span>View Ingredients</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Expiry Alerts Live Ticker Banner */}
      {alerts && alerts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-amber-100 rounded-xl text-amber-700 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-amber-900">Urgent Expiry & Inventory Alerts</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-200 text-amber-800">
                  {alerts.length} active
                </span>
              </div>
              <div className="mt-2 space-y-1.5">
                {alerts.slice(0, 3).map((alert, idx) => (
                  <div key={idx} className="text-xs text-amber-800 flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                    <span><strong>{alert.title}:</strong> {alert.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Pantry Items */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Items</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-slate-900">{totalCount}</div>
            <p className="text-xs text-slate-500 mt-1">Across 5 food categories</p>
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Expiring Soon</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-amber-700">{expiringCount}</div>
            <p className="text-xs text-amber-600 mt-1">Within the next 3 days</p>
          </div>
        </div>

        {/* Running Low */}
        <div className="bg-white rounded-2xl p-5 border border-rose-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Running Low</span>
            <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-rose-700">{lowStockCount}</div>
            <p className="text-xs text-rose-600 mt-1">Needs replenishment soon</p>
          </div>
        </div>

        {/* Monthly Grocery Spending */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Monthly Spending</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-base">
              ₹
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-slate-900">₹{monthlySpending.toFixed(2)}</div>
            <p className="text-xs text-emerald-600 mt-1 flex items-center">
              <TrendingDown className="w-3.5 h-3.5 mr-1" />
              18% lower than avg
            </p>
          </div>
        </div>

        {/* Estimated Food Waste */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Est. Food Waste</span>
            <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center text-red-700">
              <Trash2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-red-600">₹{foodWaste.toFixed(2)}</div>
            <p className="text-xs text-slate-500 mt-1">Protected by AI alerts</p>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Current Stock Highlights with Food Emojis & AI Explanations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Quick Pantry Inventory Overview */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Current Pantry Overview</h2>
              <p className="text-xs text-slate-500">Live stock and freshness status</p>
            </div>
            <button
              onClick={() => setActiveTab('pantry')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
            >
              <span>Manage All ({totalCount})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {pantryItems.slice(0, 5).map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl shadow-xs">
                    {getItemEmoji(item.name)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-500">{item.category} • {item.quantity} {item.unit}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    item.status === 'Expiring Soon'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : item.status === 'Expired'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : item.status === 'Low Stock'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {item.status}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {item.days_left === 0 ? 'Expires today' : `in ${item.days_left} days`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: AI Prediction Quick Teaser */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-700">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">AI Consumption Insights</h2>
              </div>
              <button
                onClick={() => setActiveTab('predictions')}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
              >
                <span>Full Forecast</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              PantryPilot analyzes your household consumption velocity to prevent waste before it happens:
            </p>

            <div className="space-y-3">
              {predictions?.predictions?.slice(0, 3).map((pred, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-emerald-50/50 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                      <span>{getItemEmoji(pred.name)}</span>
                      <span>{pred.name}</span>
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      pred.risk_level === 'High' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {pred.risk_level === 'High' ? 'Waste Risk' : 'Optimal Pace'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 italic">
                    "{pred.explanation}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-slate-700">Cryptographic audit ready</span>
            </div>
            <button
              onClick={onOpenVerify}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              Verify Calculation →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
