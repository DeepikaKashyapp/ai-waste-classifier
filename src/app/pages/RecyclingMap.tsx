import { useState } from 'react';
import { MapPin, Navigation, Clock, Package, Phone, ExternalLink } from 'lucide-react';
import { getRecyclingCenters, type RecyclingCenter } from '../utils/pointsSystem';

export default function RecyclingMap() {
  const [centers] = useState<RecyclingCenter[]>(getRecyclingCenters());
  const [selectedCenter, setSelectedCenter] = useState<RecyclingCenter | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="flex justify-center">
          <MapPin className="w-16 h-16 text-[#4CAF50]" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Recycling Centers
        </h2>
        <p className="text-lg text-gray-600">
          Find specialized recycling facilities near you
        </p>
      </div>

      {/* Map Placeholder */}
      <div className="relative bg-gray-200 rounded-xl overflow-hidden shadow-lg mb-6" style={{ height: '400px' }}>
        {/* Mock Map with Pins */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-blue-50 to-green-100">
          {/* Mock map pins */}
          <div className="absolute top-1/4 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
            <button
              onClick={() => setSelectedCenter(centers[0])}
              className="relative hover:scale-110 transition-transform"
            >
              <MapPin className="w-8 h-8 text-red-500 fill-red-500 drop-shadow-lg" />
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                {centers[0].name}
              </div>
            </button>
          </div>
          
          <div className="absolute top-1/2 left-2/3">
            <button
              onClick={() => setSelectedCenter(centers[1])}
              className="relative hover:scale-110 transition-transform"
            >
              <MapPin className="w-8 h-8 text-red-500 fill-red-500 drop-shadow-lg" />
            </button>
          </div>
          
          <div className="absolute bottom-1/3 left-1/2">
            <button
              onClick={() => setSelectedCenter(centers[2])}
              className="relative hover:scale-110 transition-transform"
            >
              <MapPin className="w-8 h-8 text-red-500 fill-red-500 drop-shadow-lg" />
            </button>
          </div>
          
          <div className="absolute top-2/3 right-1/4">
            <button
              onClick={() => setSelectedCenter(centers[3])}
              className="relative hover:scale-110 transition-transform"
            >
              <MapPin className="w-8 h-8 text-red-500 fill-red-500 drop-shadow-lg" />
            </button>
          </div>
          
          <div className="absolute bottom-1/4 left-1/4">
            <button
              onClick={() => setSelectedCenter(centers[4])}
              className="relative hover:scale-110 transition-transform"
            >
              <MapPin className="w-8 h-8 text-red-500 fill-red-500 drop-shadow-lg" />
            </button>
          </div>

          {/* Current Location */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-lg animate-pulse" />
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-2">
          <button className="p-2 hover:bg-gray-100 rounded">
            <Navigation className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Selected Center Details */}
      {selectedCenter && (
        <div className="bg-green-50 border-2 border-[#4CAF50] rounded-xl p-6 shadow-lg mb-6 animate-in fade-in duration-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-[#2E7D32]">{selectedCenter.name}</h3>
            <button
              onClick={() => setSelectedCenter(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">{selectedCenter.address}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Navigation className="w-5 h-5 text-gray-600 flex-shrink-0" />
              <p className="text-gray-700">{selectedCenter.distance} km away</p>
            </div>
            
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">{selectedCenter.hours}</p>
            </div>
            
            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-700 font-semibold mb-1">Accepts:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedCenter.types.map((type, index) => (
                    <span
                      key={index}
                      className="bg-white px-3 py-1 rounded-full text-sm text-gray-700 border border-gray-300"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex gap-3">
            <button className="flex-1 px-4 py-2 bg-[#4CAF50] text-white font-semibold rounded-lg hover:bg-[#45a049] transition-all flex items-center justify-center gap-2">
              <Navigation className="w-4 h-4" />
              Get Directions
            </button>
            <button className="px-4 py-2 bg-white text-[#4CAF50] font-semibold rounded-lg border-2 border-[#4CAF50] hover:bg-green-50 transition-all">
              <Phone className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Centers List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900">Nearby Centers</h3>
        {centers.map((center) => (
          <div
            key={center.id}
            onClick={() => setSelectedCenter(center)}
            className={`bg-white rounded-lg p-4 shadow-md border-2 cursor-pointer transition-all hover:shadow-lg ${
              selectedCenter?.id === center.id
                ? 'border-[#4CAF50] bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-bold text-gray-900">{center.name}</h4>
                <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                  <Navigation className="w-4 h-4" />
                  {center.distance} km away
                </p>
              </div>
              <ExternalLink className="w-5 h-5 text-gray-400" />
            </div>
            
            <p className="text-sm text-gray-700 mb-2">{center.address}</p>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <Clock className="w-4 h-4" />
              {center.hours}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {center.types.slice(0, 3).map((type, index) => (
                <span
                  key={index}
                  className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-700"
                >
                  {type}
                </span>
              ))}
              {center.types.length > 3 && (
                <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-700">
                  +{center.types.length - 3} more
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Info Card */}
      <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
        <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Hazardous Materials</h3>
        <p className="text-yellow-800 text-sm">
          Never dispose of hazardous materials in regular trash. Use specialized centers to protect the environment and comply with local regulations.
        </p>
      </div>
    </div>
  );
}
