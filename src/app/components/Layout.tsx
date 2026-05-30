import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Camera, Trophy, Map, BarChart3 } from 'lucide-react';

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/camera', icon: Camera, label: 'Scan' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { path: '/map', icon: Map, label: 'Map' },
    { path: '/impact', icon: BarChart3, label: 'Impact' }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            Zero-Waste Vision 🌍
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto px-2">
          <div className="flex justify-around items-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center py-3 px-4 transition-colors ${
                    isActive
                      ? 'text-[#4CAF50]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
