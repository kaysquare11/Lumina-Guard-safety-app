import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, AlertCircle, Bell, MapPin, Shield, Activity, AlertOctagon, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sosAPI } from '../services/Api';
import SimpleMap from '../components/SimpleMap';

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
  
  // SOS Button States
  const [sosLoading, setSosLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSOSClick = async () => {
    setSosLoading(true);
    setLocationStatus('requesting');
    setAlertMessage('Requesting your location...');
    setShowAlert(true);

    if (!navigator.geolocation) {
      setLocationStatus('error');
      setAlertMessage('Geolocation is not supported by your browser');
      setSosLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        setUserLocation({ latitude, longitude, accuracy });
        console.log('🗺️ User location captured:', { latitude, longitude, accuracy });

        setLocationStatus('success');
        setAlertMessage(`Location captured: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);

        try {
          const response = await sosAPI.trigger({
            latitude,
            longitude,
            message: 'Emergency SOS Alert triggered'
          });

          if (response.data.success) {
            setLocationStatus('success');
            setAlertMessage('✅ SOS Alert sent successfully! Your safety circle has been notified.');
            
            setTimeout(() => {
              setShowAlert(false);
            }, 5000);
          }
        } catch (error) {
          console.error('SOS Error:', error);
          setLocationStatus('error');
          setAlertMessage(`Failed to send alert: ${error.response?.data?.message || 'Please try again'}`);
        } finally {
          setSosLoading(false);
        }
      },
      (error) => {
        setSosLoading(false);
        setLocationStatus('error');

        switch (error.code) {
          case error.PERMISSION_DENIED:
            setAlertMessage('❌ Location access denied. Please enable location permissions in your browser settings.');
            break;
          case error.POSITION_UNAVAILABLE:
            setAlertMessage('❌ Location information unavailable. Please check your device settings.');
            break;
          case error.TIMEOUT:
            setAlertMessage('❌ Location request timed out. Please try again.');
            break;
          default:
            setAlertMessage('❌ An unknown error occurred. Please try again.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
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
            Welcome back, {user?.name}! 
          </h1>
          <p className="text-gray-600">
            Your personal safety dashboard - Protected by your circle of light
          </p>
        </div>

        {/* Alert Notification */}
        {showAlert && (
          <div className={`mb-6 p-4 rounded-xl border-2 animate-slideDown ${
            locationStatus === 'success' 
              ? 'bg-green-50 border-green-500' 
              : locationStatus === 'error'
              ? 'bg-red-50 border-red-500'
              : 'bg-blue-50 border-blue-500'
          }`}>
            <div className="flex items-start space-x-3">
              {locationStatus === 'success' && <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />}
              {locationStatus === 'error' && <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />}
              {locationStatus === 'requesting' && (
                <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full flex-shrink-0 mt-0.5"></div>
              )}
              <div className="flex-1">
                <p className={`font-semibold ${
                  locationStatus === 'success' ? 'text-green-800' : 
                  locationStatus === 'error' ? 'text-red-800' : 'text-blue-800'
                }`}>
                  {alertMessage}
                </p>
              </div>
              <button
                onClick={() => setShowAlert(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* SOS BUTTON */}
        <div className="mb-8 bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 border-2 border-red-200 shadow-xl">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-6">
              <AlertOctagon className="h-16 w-16 text-red-600 mx-auto mb-4 animate-pulse" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Emergency SOS</h2>
              <p className="text-gray-600">
                Press this button in case of emergency. Your location will be captured and sent to your safety circle.
              </p>
            </div>

            <button
              onClick={handleSOSClick}
              disabled={sosLoading}
              className="group relative w-64 h-64 mx-auto rounded-full bg-gradient-to-br from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div className="absolute inset-0 rounded-full bg-red-400 opacity-75 animate-ping"></div>
              <div className="absolute inset-0 rounded-full bg-red-400 opacity-50 animate-pulse"></div>
              
              <div className="relative z-10 flex flex-col items-center justify-center h-full">
                {sosLoading ? (
                  <>
                    <div className="animate-spin h-16 w-16 border-4 border-white border-t-transparent rounded-full mb-4"></div>
                    <span className="text-white font-bold text-xl">Sending...</span>
                  </>
                ) : (
                  <>
                    <Shield className="h-20 w-20 text-white mb-4" />
                    <span className="text-white font-bold text-3xl">SOS</span>
                    <span className="text-white/90 text-sm mt-2">EMERGENCY</span>
                  </>
                )}
              </div>
            </button>

            <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-6 text-left">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
                How it works:
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="font-bold mr-2">1.</span>
                  <span>Tap the SOS button above</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">2.</span>
                  <span>Allow location access when prompted</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">3.</span>
                  <span>Your location is captured and sent to the server</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">4.</span>
                  <span>Emergency contacts will be notified (Week 10 feature)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">0</span>
            </div>
            <h3 className="text-gray-600 font-semibold">Active Alerts</h3>
            <p className="text-sm text-gray-500 mt-1">No active SOS alerts</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                <Bell className="h-6 w-6 text-indigo-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">0</span>
            </div>
            <h3 className="text-gray-600 font-semibold">Safety Contacts</h3>
            <p className="text-sm text-gray-500 mt-1">Week 9 feature</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-teal-100 rounded-xl flex items-center justify-center">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">-</span>
            </div>
            <h3 className="text-gray-600 font-semibold">Safe Zones</h3>
            <p className="text-sm text-gray-500 mt-1">Week 4 - Coming soon</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl flex items-center justify-center">
                <Activity className="h-6 w-6 text-rose-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">✅</span>
            </div>
            <h3 className="text-gray-600 font-semibold">SOS System</h3>
            <p className="text-sm text-green-600 mt-1 font-semibold">Active & Ready</p>
          </div>
        </div>

        {/* Interactive Map */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-2 border-purple-200 mb-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              <MapPin className="h-6 w-6 mr-2 text-purple-600" />
              Interactive Safety Map
            </h2>
            <p className="text-gray-600">
              {userLocation 
                ? "Your location and nearby safe zones are displayed below. Click markers for details."
                : "Click the SOS button above to see your location on the map."}
            </p>
          </div>
          
          <div className="h-[500px] rounded-xl overflow-hidden border-2 border-purple-200">
            <SimpleMap userLocation={userLocation} />
          </div>

          <div className="mt-4 grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-2xl">🚓</span>
                <span className="font-bold text-blue-900">3 Police Stations</span>
              </div>
              <p className="text-sm text-blue-700">Emergency: 112</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-2xl">🏥</span>
                <span className="font-bold text-red-900">3 Hospitals</span>
              </div>
              <p className="text-sm text-red-700">24/7 Emergency Care</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-2xl">🏛️</span>
                <span className="font-bold text-green-900">2 Embassies</span>
              </div>
              <p className="text-sm text-green-700">Consular Services</p>
            </div>
          </div>
        </div>

        {/* Feature Status */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-xl p-6 text-white shadow-lg">
            <CheckCircle className="h-8 w-8 mb-3 opacity-90" />
            <h3 className="text-xl font-bold mb-2">✅ Week 3 Complete</h3>
            <p className="opacity-90 text-sm">
              SOS button with geolocation capture is fully functional!
            </p>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <MapPin className="h-8 w-8 mb-3 opacity-90" />
            <h3 className="text-xl font-bold mb-2">🚧 Week 4: Live Map</h3>
            <p className="opacity-90 text-sm">
              In progress: Interactive maps with safe zone markers using Leaflet.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white shadow-lg">
            <Activity className="h-8 w-8 mb-3 opacity-90" />
            <h3 className="text-xl font-bold mb-2">Week 5: Real-Time</h3>
            <p className="opacity-90 text-sm">
              Coming: Socket.io for live location tracking during alerts.
            </p>
          </div>
        </div>
      </div>

      {/* Logout Modal */}
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

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Dashboard;