import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, MapPin, Calendar, RefreshCw } from 'lucide-react';

export default function GoldPriceApp() {
  const [goldPrices, setGoldPrices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = "Tadepalligudem, West Godavari, AP";

  useEffect(() => {
    fetchGoldPrices();
  }, []);

  const fetchGoldPrices = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/gold-prices.json');

      if (!response.ok) {
        throw new Error('Failed to fetch prices');
      }

      const data = await response.json();
      setGoldPrices(data);
    } catch (err) {
      setError('Unable to load gold prices. Please try again later.');
      console.error('Error fetching prices:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin text-amber-500 mx-auto mb-4" size={48} />
          <p className="text-xl text-gray-700 font-semibold">Loading gold prices...</p>
        </div>
      </div>
    );
  }

  if (error || !goldPrices) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Unable to Load Prices</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchGoldPrices}
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-lg font-semibold hover:from-yellow-500 hover:to-amber-600 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const lastUpdated = new Date(goldPrices.lastUpdated).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Today's Gold Rates</h1>
              <div className="flex items-center text-gray-600">
                <MapPin size={18} className="mr-2" />
                <span>{location}</span>
              </div>
            </div>
            <button
              onClick={fetchGoldPrices}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar size={16} className="mr-2" />
            <span>Last Updated: {lastUpdated}</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-1">22 Carat Gold</h2>
                <p className="text-yellow-100 text-sm">Per Gram</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1">
                <span className="text-2xl">💍</span>
              </div>
            </div>
            <div className="mb-4">
              <div className="text-4xl font-bold mb-2">
                ₹{goldPrices.gold22k.current.toLocaleString('en-IN')}
              </div>
              <div className="flex items-center">
                {goldPrices.gold22k.change >= 0 ? (
                  <ArrowUpRight size={20} className="mr-1" />
                ) : (
                  <ArrowDownRight size={20} className="mr-1" />
                )}
                <span className="font-semibold">
                  ₹{Math.abs(goldPrices.gold22k.change)} ({Math.abs(goldPrices.gold22k.changePercent)}%)
                </span>
                <span className="ml-2 text-yellow-100">vs yesterday</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white border-opacity-20">
              <div>
                <p className="text-yellow-100 text-sm mb-1">10 Grams</p>
                <p className="text-xl font-bold">
                  ₹{(goldPrices.gold22k.current * 10).toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-yellow-100 text-sm mb-1">100 Grams</p>
                <p className="text-xl font-bold">
                  ₹{(goldPrices.gold22k.current * 100).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-1">24 Carat Gold</h2>
                <p className="text-orange-100 text-sm">Per Gram</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1">
                <span className="text-2xl">👑</span>
              </div>
            </div>
            <div className="mb-4">
              <div className="text-4xl font-bold mb-2">
                ₹{goldPrices.gold24k.current.toLocaleString('en-IN')}
              </div>
              <div className="flex items-center">
                {goldPrices.gold24k.change >= 0 ? (
                  <ArrowUpRight size={20} className="mr-1" />
                ) : (
                  <ArrowDownRight size={20} className="mr-1" />
                )}
                <span className="font-semibold">
                  ₹{Math.abs(goldPrices.gold24k.change)} ({Math.abs(goldPrices.gold24k.changePercent)}%)
                </span>
                <span className="ml-2 text-orange-100">vs yesterday</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white border-opacity-20">
              <div>
                <p className="text-orange-100 text-sm mb-1">10 Grams</p>
                <p className="text-xl font-bold">
                  ₹{(goldPrices.gold24k.current * 10).toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-orange-100 text-sm mb-1">100 Grams</p>
                <p className="text-xl font-bold">
                  ₹{(goldPrices.gold24k.current * 100).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">📌 Important Notes</h3>
          <ul className="space-y-2 text-gray-600">
            <li>• Prices are indicative and may vary by jeweler</li>
            <li>• Making charges and GST are additional</li>
            <li>• Prices updated automatically once daily</li>
            <li>• Data fetched from reliable sources via Gemini AI</li>
          </ul>
        </div>
      </div>
    </div>
  );
}