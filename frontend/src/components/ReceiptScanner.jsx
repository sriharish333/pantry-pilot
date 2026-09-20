import React, { useState, useEffect } from 'react';
import { 
  ScanLine, 
  UploadCloud, 
  FileText, 
  Check, 
  Plus, 
  Trash2, 
  Sparkles, 
  Receipt, 
  CheckCircle2, 
  AlertCircle,
  Camera,
  RefreshCw
} from 'lucide-react';
import { api } from '../api';

export default function ReceiptScanner({ onItemsAdded, setActiveTab }) {
  const [presets, setPresets] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState('freshmart');
  const [scanning, setScanning] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    loadPresets();
    // Auto-load initial preset so demo is ready right away
    handleScanPreset('freshmart');
  }, []);

  const loadPresets = async () => {
    try {
      const res = await api.getReceiptPresets();
      setPresets(res.presets);
    } catch (err) {
      console.error(err);
    }
  };

  const handleScanPreset = async (presetId) => {
    setSelectedPreset(presetId);
    setScanning(true);
    setStatusMessage(null);
    try {
      const res = await api.scanReceipt(presetId);
      setExtractedData(res);
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: 'error', text: 'Failed to parse receipt preset.' });
    } finally {
      setScanning(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const processFile = async (file) => {
    setScanning(true);
    setStatusMessage(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.scanReceipt(formData);
      setExtractedData(res);
      setStatusMessage({ type: 'success', text: `Scanned ${file.name} successfully!` });
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: 'error', text: 'Failed to process receipt image. Using fallback preset.' });
      handleScanPreset('freshmart');
    } finally {
      setScanning(false);
    }
  };

  const handleItemChange = (index, field, value) => {
    if (!extractedData) return;
    const updatedItems = [...extractedData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'quantity' || field === 'price' ? parseFloat(value) || 0 : value
    };
    
    // Recalculate total
    const newTotal = updatedItems.reduce((sum, item) => sum + (item.price || 0), 0);
    setExtractedData({
      ...extractedData,
      items: updatedItems,
      total_amount: Math.round(newTotal * 100) / 100,
      item_count: updatedItems.length
    });
  };

  const handleRemoveItem = (index) => {
    if (!extractedData) return;
    const updatedItems = extractedData.items.filter((_, idx) => idx !== index);
    const newTotal = updatedItems.reduce((sum, item) => sum + (item.price || 0), 0);
    setExtractedData({
      ...extractedData,
      items: updatedItems,
      total_amount: Math.round(newTotal * 100) / 100,
      item_count: updatedItems.length
    });
  };

  const handleAddNewItem = () => {
    if (!extractedData) return;
    const newItem = {
      name: 'New Item',
      category: 'Produce',
      quantity: 1.0,
      unit: 'kg',
      price: 2.50,
      confidence: 1.0
    };
    const updatedItems = [...extractedData.items, newItem];
    const newTotal = updatedItems.reduce((sum, item) => sum + (item.price || 0), 0);
    setExtractedData({
      ...extractedData,
      items: updatedItems,
      total_amount: Math.round(newTotal * 100) / 100,
      item_count: updatedItems.length
    });
  };

  const handleConfirmAndAdd = async () => {
    if (!extractedData || extractedData.items.length === 0) return;
    setConfirming(true);
    try {
      const res = await api.confirmReceipt({
        store_name: extractedData.store_name,
        items: extractedData.items,
        total_amount: extractedData.total_amount
      });
      setStatusMessage({ type: 'success', text: res.message });
      if (onItemsAdded) {
        await onItemsAdded();
      }
      setTimeout(() => {
        setActiveTab('pantry');
      }, 1200);
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: 'error', text: 'Error adding items to pantry.' });
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <ScanLine className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900">Receipt OCR Scanner</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Capture or upload grocery receipts to automatically extract items, quantities, and prices.
          </p>
        </div>

        {/* Preset Selector for Instant Hackathon Demonstration */}
        <div className="flex items-center space-x-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 pl-2">Sample Bills:</span>
          <button
            onClick={() => handleScanPreset('freshmart')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedPreset === 'freshmart'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Reliance Fresh
          </button>
          <button
            onClick={() => handleScanPreset('trader_joes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedPreset === 'trader_joes'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            DMart
          </button>
          <button
            onClick={() => handleScanPreset('costco')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedPreset === 'costco'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            BigBasket
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-2xl flex items-center space-x-3 text-sm font-medium ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Upload Zone & OCR Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload & Raw Receipt View */}
        <div className="lg:col-span-1 space-y-4">
          <div 
            className={`border-2 border-dashed rounded-3xl p-6 text-center transition-colors bg-white ${
              dragActive ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-300 hover:border-slate-400'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              const file = e.dataTransfer.files?.[0];
              if (file) processFile(file);
            }}
          >
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <UploadCloud className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Upload Receipt Image</h3>
            <p className="text-xs text-slate-500 mt-1">PNG, JPG or camera capture</p>
            <label className="mt-4 inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer hover:bg-slate-800 transition-colors">
              <Camera className="w-4 h-4" />
              <span>Browse or Take Photo</span>
              <input 
                type="file" 
                accept="image/*" 
                capture="environment"
                className="hidden" 
                onChange={handleFileUpload}
              />
            </label>
          </div>

          {/* OCR Raw Text Terminal Preview */}
          <div className="bg-slate-900 text-slate-200 rounded-3xl p-4 text-xs font-mono shadow-inner border border-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-slate-400 font-sans font-semibold text-[11px]">OCR Engine Terminal</span>
              </div>
              <span className="text-slate-500 text-[10px]">{extractedData?.ocr_engine || 'Ready'}</span>
            </div>
            <pre className="whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed text-[11px] text-slate-300">
              {scanning ? 'Processing image with OCR heuristics...' : (extractedData?.raw_text || 'No receipt loaded.')}
            </pre>
          </div>
        </div>

        {/* Extracted Editable Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <span>{extractedData?.store_name || 'Supermarket Receipt'}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {extractedData?.item_count || 0} items detected
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review and edit extracted values before adding to pantry
                </p>
              </div>

              <button
                onClick={handleAddNewItem}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            {/* Editable Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                    <th className="pb-3 font-semibold">Item Name</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold w-20">Quantity</th>
                    <th className="pb-3 font-semibold w-20">Unit</th>
                    <th className="pb-3 font-semibold w-24">Price (₹)</th>
                    <th className="pb-3 font-semibold w-10 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {extractedData?.items?.map((item, idx) => (
                    <tr key={idx} className="group hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 pr-2">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                          className="w-full font-medium text-slate-800 bg-transparent focus:bg-white border-transparent focus:border-slate-300 rounded-lg px-2 py-1 focus:ring-1 focus:ring-emerald-500 outline-none"
                        />
                      </td>
                      <td className="py-2.5 pr-2">
                        <select
                          value={item.category}
                          onChange={(e) => handleItemChange(idx, 'category', e.target.value)}
                          className="font-medium text-slate-700 bg-transparent focus:bg-white border-transparent focus:border-slate-300 rounded-lg px-2 py-1 outline-none"
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
                      </td>
                      <td className="py-2.5 pr-2">
                        <input
                          type="number"
                          step="0.1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                          className="w-16 font-medium text-slate-800 bg-transparent focus:bg-white border-transparent focus:border-slate-300 rounded-lg px-2 py-1 outline-none text-center"
                        />
                      </td>
                      <td className="py-2.5 pr-2">
                        <input
                          type="text"
                          value={item.unit}
                          onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                          className="w-16 font-medium text-slate-800 bg-transparent focus:bg-white border-transparent focus:border-slate-300 rounded-lg px-2 py-1 outline-none text-center"
                        />
                      </td>
                      <td className="py-2.5 pr-2">
                        <input
                          type="number"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => handleItemChange(idx, 'price', e.target.value)}
                          className="w-20 font-semibold text-slate-900 bg-transparent focus:bg-white border-transparent focus:border-slate-300 rounded-lg px-2 py-1 outline-none text-right"
                        />
                      </td>
                      <td className="py-2.5 text-center">
                        <button
                          onClick={() => handleRemoveItem(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table Footer with Total & Confirm Button */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Bill:</span>
              <span className="text-2xl font-extrabold text-slate-900">
                ₹{(extractedData?.total_amount || 0).toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleConfirmAndAdd}
              disabled={confirming || !extractedData || extractedData.items.length === 0}
              className="inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{confirming ? 'Adding to Pantry...' : 'Confirm & Add to Pantry'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
