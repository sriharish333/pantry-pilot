import React from 'react';
import { 
  Sparkles, 
  Clock, 
  AlertTriangle, 
  TrendingDown, 
  Flame, 
  Calendar, 
  ArrowRight,
  ShieldAlert,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export default function AIPredictions({ predictions, setActiveTab }) {
  const predictionList = predictions?.predictions || [];
  const wasteRiskItems = predictions?.waste_risk_items || [];
  const futureNeeds = predictions?.future_needs || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
            <Sparkles className="w-5 h-5 text-emerald-600" />
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900">AI Consumption & Expiry Predictor</h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Machine learning consumption velocity model forecasting depletion timelines and food spoilage risks.
        </p>
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Expiring Soon</span>
            <div className="text-2xl font-extrabold text-slate-900">
              {predictions?.expiring_soon_count || 0} Items
            </div>
            <p className="text-xs text-amber-600 mt-0.5">Under 3 days shelf life</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-700 flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Waste Risk Items</span>
            <div className="text-2xl font-extrabold text-slate-900">
              {wasteRiskItems.length} Items
            </div>
            <p className="text-xs text-rose-600 mt-0.5">Spoils before full depletion</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-700 flex-shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Replenishment Needed</span>
            <div className="text-2xl font-extrabold text-slate-900">
              {futureNeeds.length} Staples
            </div>
            <p className="text-xs text-indigo-600 mt-0.5">Depleting within 5 days</p>
          </div>
        </div>
      </div>

      {/* Main Predictions Grid with Natural Language Explanations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Detailed Item Cards */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <span>Item-by-Item Consumption Velocity</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {predictionList.length} monitored
            </span>
          </h2>

          <div className="space-y-4">
            {predictionList.map((item) => {
              const daysLeft = item.days_left;
              const daysToDeplete = item.days_to_deplete;
              const willSpoilBeforeDepletion = daysLeft < daysToDeplete && item.potential_waste_qty > 0;

              return (
                <div 
                  key={item.item_id} 
                  className={`bg-white rounded-3xl p-5 border shadow-sm transition-all hover:shadow-md ${
                    willSpoilBeforeDepletion 
                      ? 'border-rose-200 ring-1 ring-rose-100' 
                      : 'border-slate-200/80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-800 text-base">
                        {item.name[0]}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{item.name}</h3>
                        <p className="text-xs text-slate-500">
                          {item.category} • In stock: <strong>{item.quantity} {item.unit}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-start sm:self-auto">
                      <span className="text-xs font-bold px-3 py-1 rounded-xl bg-slate-100 text-slate-700">
                        Burn: {item.burn_rate} {item.unit}/day
                      </span>
                      <span className={`text-xs font-bold px-3 py-1 rounded-xl ${
                        willSpoilBeforeDepletion 
                          ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                          : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      }`}>
                        {willSpoilBeforeDepletion ? '⚠️ Spoilage Risk' : '✅ Balanced Pace'}
                      </span>
                    </div>
                  </div>

                  {/* AI Explanation Callout */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs text-slate-800 flex items-start space-x-2.5">
                    <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-emerald-900 block mb-0.5">AI Usage Analysis:</span>
                      <p className="italic text-slate-700 leading-relaxed">
                        "{item.explanation}"
                      </p>
                    </div>
                  </div>

                  {/* Visual Comparison: Days to Expiry vs Days to Depletion */}
                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block font-medium">Days Remaining:</span>
                      <span className="text-sm font-bold text-slate-800">
                        {daysLeft === 0 ? 'Today' : `${daysLeft} days`}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Depletion Est.:</span>
                      <span className="text-sm font-bold text-slate-800">
                        ~{Math.round(daysToDeplete)} days
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Waste Risk Qty:</span>
                      <span className={`text-sm font-bold ${item.potential_waste_qty > 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                        {item.potential_waste_qty > 0 ? `${item.potential_waste_qty} ${item.unit}` : '0 (Safe)'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Waste Loss Risk:</span>
                      <span className={`text-sm font-bold ${item.potential_waste_cost > 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                        ₹{item.potential_waste_cost.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Upcoming Grocery Needs & Replenishment Timeline */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">Future Grocery Needs</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Predictive replenishment timeline so you never run out of daily cooking essentials.
            </p>

            <div className="space-y-3">
              {futureNeeds.length === 0 ? (
                <p className="text-xs text-slate-400">All pantry essentials currently well-stocked!</p>
              ) : (
                futureNeeds.map((need, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-indigo-950">{need.name}</h4>
                      <p className="text-[11px] text-indigo-700">
                        Needed in <strong>{need.needed_in_days} days</strong>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold px-2.5 py-1 rounded-xl bg-indigo-600 text-white">
                        +{need.recommended_quantity} {need.unit}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setActiveTab('recommendations')}
              className="mt-5 w-full inline-flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors"
            >
              <span>View Buy / Don't Buy List</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* AI Decision Principles Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-md">
            <h4 className="text-sm font-bold flex items-center space-x-2 text-emerald-400 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>How PantryPilot Predicts</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every grocery item is assigned an empirical daily burn rate (&beta;) derived from household size and purchase intervals. If remaining days D is less than Q / &beta;, PantryPilot flags a spoilage hazard and triggers priority alerts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
