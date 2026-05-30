import { BarChart3, TrendingDown, Leaf, Droplets, Trees, Award } from 'lucide-react';
import { getUserData } from '../utils/pointsSystem';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function Impact() {
  const userData = getUserData();

  // Mock weekly data for the chart
  const weeklyData = [
    { day: 'Mon', items: 2, co2: 1.0 },
    { day: 'Tue', items: 3, co2: 1.5 },
    { day: 'Wed', items: 1, co2: 0.5 },
    { day: 'Thu', items: 4, co2: 2.0 },
    { day: 'Fri', items: 2, co2: 1.0 },
    { day: 'Sat', items: 3, co2: 1.5 },
    { day: 'Sun', items: userData.weeklyStats.itemsThisWeek, co2: userData.weeklyStats.co2ThisWeek }
  ];

  // Mock monthly trend data
  const monthlyData = [
    { week: 'Week 1', co2: 5.5 },
    { week: 'Week 2', co2: 7.2 },
    { week: 'Week 3', co2: 6.8 },
    { week: 'Week 4', co2: userData.co2Saved }
  ];

  // Environmental equivalents
  const treesEquivalent = (userData.co2Saved / 21).toFixed(1); // 1 tree absorbs ~21kg CO2/year
  const waterSaved = (userData.itemsClassified * 50).toFixed(0); // ~50L per item
  const energySaved = (userData.itemsClassified * 0.5).toFixed(1); // ~0.5 kWh per item

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="flex justify-center">
          <BarChart3 className="w-16 h-16 text-[#4CAF50]" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Environmental Impact
        </h2>
        <p className="text-lg text-gray-600">
          Your contribution to a greener planet
        </p>
      </div>

      {/* Impact Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-green-400 to-green-600 text-white rounded-xl p-6 shadow-lg">
          <TrendingDown className="w-8 h-8 mb-3" />
          <p className="text-sm opacity-90 mb-1">CO₂ Reduced</p>
          <p className="text-3xl font-bold">{userData.co2Saved.toFixed(1)} kg</p>
          <p className="text-xs opacity-80 mt-2">All time</p>
        </div>

        <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-xl p-6 shadow-lg">
          <Droplets className="w-8 h-8 mb-3" />
          <p className="text-sm opacity-90 mb-1">Water Saved</p>
          <p className="text-3xl font-bold">{waterSaved} L</p>
          <p className="text-xs opacity-80 mt-2">Estimated</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-xl p-6 shadow-lg">
          <Trees className="w-8 h-8 mb-3" />
          <p className="text-sm opacity-90 mb-1">Trees Equivalent</p>
          <p className="text-3xl font-bold">{treesEquivalent}</p>
          <p className="text-xs opacity-80 mt-2">Trees planted</p>
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">This Week's Activity</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="day" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #4CAF50',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="items" fill="#4CAF50" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-center text-sm text-gray-600 mt-2">
          Items classified per day
        </p>
      </div>

      {/* CO2 Reduction Trend */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">CO₂ Reduction Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="week" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #4CAF50',
                borderRadius: '8px'
              }}
            />
            <Line
              type="monotone"
              dataKey="co2"
              stroke="#4CAF50"
              strokeWidth={3}
              dot={{ fill: '#4CAF50', r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-center text-sm text-gray-600 mt-2">
          CO₂ saved (kg) by week
        </p>
      </div>

      {/* Weekly Stats */}
      <div className="bg-green-50 rounded-xl p-6 shadow-md mb-8">
        <h3 className="text-xl font-bold text-[#2E7D32] mb-4">📊 This Week's Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{userData.weeklyStats.itemsThisWeek}</p>
            <p className="text-sm text-gray-600">Items Classified</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{userData.weeklyStats.pointsThisWeek}</p>
            <p className="text-sm text-gray-600">Points Earned</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center col-span-2 md:col-span-1">
            <p className="text-2xl font-bold text-gray-900">{userData.weeklyStats.co2ThisWeek.toFixed(1)} kg</p>
            <p className="text-sm text-gray-600">CO₂ Reduced</p>
          </div>
        </div>
      </div>

      {/* Environmental Equivalents */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">🌍 Real-World Impact</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
            <Trees className="w-12 h-12 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900">
                Your impact equals planting {treesEquivalent} trees
              </p>
              <p className="text-sm text-gray-600">
                Each tree absorbs about 21kg of CO₂ per year
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
            <Droplets className="w-12 h-12 text-blue-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900">
                You've saved {waterSaved} liters of water
              </p>
              <p className="text-sm text-gray-600">
                Enough to take {(parseInt(waterSaved) / 80).toFixed(0)} showers!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg">
            <Leaf className="w-12 h-12 text-yellow-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900">
                {energySaved} kWh of energy conserved
              </p>
              <p className="text-sm text-gray-600">
                Enough to power a laptop for {(parseFloat(energySaved) * 20).toFixed(0)} hours
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Award className="w-8 h-8" />
          <h3 className="text-xl font-bold">Eco Achievements</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">🌱</div>
            <p className="text-xs">First Steps</p>
          </div>
          <div className={`rounded-lg p-3 text-center ${userData.itemsClassified >= 10 ? 'bg-white bg-opacity-20' : 'bg-black bg-opacity-20'}`}>
            <div className="text-2xl mb-1">♻️</div>
            <p className="text-xs">Recycler</p>
          </div>
          <div className={`rounded-lg p-3 text-center ${userData.itemsClassified >= 50 ? 'bg-white bg-opacity-20' : 'bg-black bg-opacity-20'}`}>
            <div className="text-2xl mb-1">🏆</div>
            <p className="text-xs">Champion</p>
          </div>
          <div className={`rounded-lg p-3 text-center ${userData.itemsClassified >= 100 ? 'bg-white bg-opacity-20' : 'bg-black bg-opacity-20'}`}>
            <div className="text-2xl mb-1">👑</div>
            <p className="text-xs">Legend</p>
          </div>
        </div>
      </div>

      {/* Share Impact */}
      <div className="mt-8 text-center">
        <button className="px-8 py-4 bg-[#4CAF50] text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-[#45a049] transition-all transform hover:scale-105">
          Share Your Impact 📱
        </button>
        <p className="text-sm text-gray-600 mt-2">
          Inspire others to join the zero-waste movement!
        </p>
      </div>
    </div>
  );
}
