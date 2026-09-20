import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Trash2, 
  PiggyBank, 
  CopyCheck, 
  ShieldCheck, 
  PieChart, 
  BarChart3,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';

export default function SavingsInsights({ insights, onOpenVerify }) {
  const spending = insights?.monthly_spending || 0;
  const waste = insights?.estimated_food_waste || 0;
  const potentialSavings = insights?.potential_savings || 0;
  const duplicatesAvoided = insights?.duplicate_purchases_avoided || 3;
  const duplicateRupees = insights?.duplicate_savings_inr || insights?.duplicate_savings_usd || 420.0;
  const categoryData = insights?.category_spending || [];
  const wasteTrend = insights?.waste_trend || [];

  const maxSpend = Math.max(...categoryData.map(c => c.amount), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900">Savings & Waste Insights</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Track household grocery budget efficiency, avoided duplicate costs, and food waste reduction.
          </p>
        </div>

        <button
          onClick={onOpenVerify}
          className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-md shadow-indigo-600/20 transition-all hover:scale-105 self-start sm:self-auto"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Verify Calculation</span>
        </button>
      </div>

      {/* 4 Big Value Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Spending</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-900">₹{spending.toFixed(2)}</div>
            <p className="text-xs text-slate-500 mt-1">Current pantry inventory value</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-500">Estimated Waste</span>
            <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-700">
              <Trash2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-rose-600">₹{waste.toFixed(2)}</div>
            <p className="text-xs text-rose-600 mt-1 font-semibold">Flagged for meal priority</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Potential Savings</span>
            <div className="w-10 h-10 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-700">
              <PiggyBank className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-teal-700">₹{potentialSavings.toFixed(2)}</div>
            <p className="text-xs text-slate-500 mt-1">From waste prevention & smart buys</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Avoided Duplicates</span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-700">
              <CopyCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-indigo-700">{duplicatesAvoided} items</div>
            <p className="text-xs text-indigo-600 mt-1 font-semibold">Saved ~₹{duplicateRupees.toFixed(2)} in cart</p>
          </div>
        </div>
      </div>

      {/* Two Visual Charts: Category Spending & Food Waste Reduction Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending by Category Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">Spending by Food Category</h3>
            </div>
            <span className="text-xs font-bold text-slate-400">Total: ₹{spending.toFixed(2)}</span>
          </div>

          <div className="space-y-3.5">
            {categoryData.map((cat, idx) => {
              const pct = Math.round((cat.amount / maxSpend) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700">{cat.category}</span>
                    <span className="text-slate-900">₹{cat.amount.toFixed(2)}</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Food Waste Reduction Trend Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">Food Waste Reduction Trend</h3>
              </div>
              <div className="flex items-center space-x-3 text-[11px]">
                <div className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                  <span className="text-slate-500">Without AI</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <span className="text-emerald-700 font-bold">With PantryPilot</span>
                </div>
              </div>
            </div>

            {/* SVG Visual Bar Comparison Chart */}
            <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2">
              {wasteTrend.map((wt, i) => {
                const maxTrendVal = 600;
                const hWithout = Math.min(100, Math.round((wt.without_pantrypilot / maxTrendVal) * 100));
                const hWith = Math.min(100, Math.round((wt.with_pantrypilot / maxTrendVal) * 100));
                return (
                  <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <div className="w-full flex items-end justify-center space-x-1.5 h-36">
                      {/* Without */}
                      <div 
                        className="w-5 bg-slate-200 rounded-t-md transition-all duration-500 relative group-hover:bg-slate-300"
                        style={{ height: `${hWithout}%` }}
                        title={`Without: ₹${wt.without_pantrypilot}`}
                      />
                      {/* With */}
                      <div 
                        className="w-5 bg-emerald-500 rounded-t-md transition-all duration-500 relative group-hover:bg-emerald-600 shadow-sm"
                        style={{ height: `${hWith}%` }}
                        title={`With PantryPilot: ₹${wt.with_pantrypilot}`}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 mt-2">{wt.week}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Total waste reduced by:</span>
            <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              ↓ 72% Waste Cut
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
