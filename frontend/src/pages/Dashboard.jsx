import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, AlertCircle, Bell, MapPin, Shield, Activity, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Lumina Logo Component
function LuminaLogo({ className = "h-8 w-8" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 10 C30 25, 10 35, 10 50 C10 65, 25 80, 50 90 C75 80, 90 65, 90 50 C90 35, 70 25, 50 10 Z" 
            fill="#8B7BC7" opacity="0.2"/>
      <path d="M30 40 Q50 25, 70 40 L70 45 Q50 30, 30 45 Z" fill="#8B7BC7"/>
      <path d="M30 55 Q50 70, 70 55 L70 50 Q50 65, 30 50 Z" fill="#9FB5A4"/>
      <circle cx="50" cy="50" r="8" fill="#E8B4C8"/>
      <path d="M47 48 L49 52 L53 47" stroke="white" strokeWidth="2" fill="none"/>
    </svg>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/70 backdrop-blur-lg shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <LuminaLogo className="h-10 w-10" />
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Lumina Guard
                </span>
                <p className="text-xs text-gray-500 -mt-0.5">Safety Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full">
                <User className="h-5 w-5 text-purple-600" />
                <span className="text-gray-900 font-medium">{user?.name}</span>
              </div>

              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-purple-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            Your personal safety dashboard - Protected by your circle of light
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">0</span>
            </div>
            <h3 className="text-gray-600 font-semibold">Active Alerts</h3>
            <p className="text-sm text-gray-500 mt-1">No active SOS alerts</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                <Bell className="h-6 w-6 text-indigo-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">0</span>
            </div>
            <h3 className="text-gray-600 font-semibold">Safety Contacts</h3>
            <p className="text-sm text-gray-500 mt-1">Week 9 feature</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-teal-100 rounded-xl flex items-center justify-center">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">-</span>
            </div>
            <h3 className="text-gray-600 font-semibold">Safe Zones</h3>
            <p className="text-sm text-gray-500 mt-1">Week 4 map feature</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl flex items-center justify-center">
                <Activity className="h-6 w-6 text-rose-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">0%</span>
            </div>
            <h3 className="text-gray-600 font-semibold">Safety Score</h3>
            <p className="text-sm text-gray-500 mt-1">Week 6 feature</p>
          </div>
        </div>

        {/* Main Dashboard Card - SOS Preview */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border-2 border-purple-200 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Shield className="h-12 w-12 text-purple-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Emergency SOS Coming in Week 3! 🚨
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Your one-touch emergency button with real-time location tracking will be available here.
              Instantly alert your safety circle with precise location data and live tracking capabilities.
            </p>
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
              <h3 className="font-bold text-gray-900 mb-3 text-lg">✅ Completed Features:</h3>
              <div className="grid md:grid-cols-2 gap-3 text-left max-w-2xl mx-auto">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span className="text-gray-700">Secure User Authentication</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  <span className="text-gray-700">Protected Dashboard Access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span className="text-gray-700">Modern Glass Morphism UI</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  <span className="text-gray-700">Global Brand Identity</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Preview Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
            <TrendingUp className="h-8 w-8 mb-3 opacity-90" />
            <h3 className="text-xl font-bold mb-2">Week 3: SOS Button</h3>
            <p className="opacity-90 text-sm">
              One-touch emergency alerts with geolocation capture and instant notification dispatch to your safety circle.
            </p>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <MapPin className="h-8 w-8 mb-3 opacity-90" />
            <h3 className="text-xl font-bold mb-2">Week 4: Live Map</h3>
            <p className="opacity-90 text-sm">
              Interactive Leaflet maps displaying your location, safe zones, and nearby emergency services with real-time updates.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white shadow-lg">
            <Activity className="h-8 w-8 mb-3 opacity-90" />
            <h3 className="text-xl font-bold mb-2">Week 5: Real-Time Tracking</h3>
            <p className="opacity-90 text-sm">
              Socket.io powered live location updates enabling your guardians to track your movement during active alerts.
            </p>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Confirm Logout
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to leave your dashboard?
              </p>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;