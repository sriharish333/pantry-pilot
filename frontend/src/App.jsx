import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ReceiptScanner from './components/ReceiptScanner';
import SmartPantry from './components/SmartPantry';
import AIPredictions from './components/AIPredictions';
import Recommendations from './components/Recommendations';
import SavingsInsights from './components/SavingsInsights';
import VerificationModal from './components/VerificationModal';
import { api } from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pantryItems, setPantryItems] = useState([]);
  const [predictions, setPredictions] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [insights, setInsights] = useState(null);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshAllData = async () => {
    try {
      const [pantryRes, predRes, recRes, alertRes, insightRes] = await Promise.all([
        api.getPantry(),
        api.getPredictions(),
        api.getRecommendations(),
        api.getAlerts(),
        api.getInsights()
      ]);

      setPantryItems(pantryRes.items || []);
      setPredictions(predRes);
      setRecommendations(recRes);
      setAlerts(alertRes.alerts || []);
      setInsights(insightRes);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const handleResetData = async () => {
    await api.resetData();
    await refreshAllData();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        alertCount={alerts.length}
        onResetData={handleResetData}
        onOpenVerify={() => setIsVerifyOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-bold text-slate-700">Connecting to PantryPilot Engine...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard
                pantryItems={pantryItems}
                predictions={predictions}
                insights={insights}
                alerts={alerts}
                setActiveTab={setActiveTab}
                onOpenVerify={() => setIsVerifyOpen(true)}
              />
            )}

            {activeTab === 'scanner' && (
              <ReceiptScanner
                onItemsAdded={refreshAllData}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'pantry' && (
              <SmartPantry
                pantryItems={pantryItems}
                onRefresh={refreshAllData}
              />
            )}

            {activeTab === 'predictions' && (
              <AIPredictions
                predictions={predictions}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'recommendations' && (
              <Recommendations
                recommendations={recommendations}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'insights' && (
              <SavingsInsights
                insights={insights}
                onOpenVerify={() => setIsVerifyOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Verifiable Computation Modal */}
      <VerificationModal
        isOpen={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>PantryPilot – Smart Pantry Assistant • Hackathon MVP</span>
          <span>FastAPI + React Vite + Cryptographic SHA-256 Verifier</span>
        </div>
      </footer>
    </div>
  );
}
