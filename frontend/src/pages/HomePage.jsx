import { Link } from 'react-router-dom';
import { Heart, MapPin, Bell, Users, AlertCircle, Phone, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Lumina Guard Logo Component
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

function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/70 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <LuminaLogo className="h-10 w-10" />
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Lumina Guard
                </span>
                <p className="text-xs text-gray-500 -mt-1">Your Circle of Light</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-6 py-2 text-gray-700 hover:text-purple-600 font-semibold transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="inline-block mb-6">
            <LuminaLogo className="h-24 w-24 mx-auto animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Safety,
            <span className="block bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Always Protected
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Lumina Guard is a globally trusted women's safety platform with real-time SOS alerts, 
            intelligent location tracking, and instant emergency notifications. Your circle of light, 
            protecting you 24/7, anywhere in the world.
          </p>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-semibold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <Shield className="mr-2 h-5 w-5" />
              Join Lumina Guard
            </Link>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
          Comprehensive Protection Features
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Designed for women worldwide, powered by cutting-edge technology
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-100">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">One-Touch SOS</h3>
            <p className="text-gray-600 leading-relaxed">
              Instant emergency alerts with a single tap. Your precise location is immediately 
              shared with your trusted emergency contacts, no matter where you are globally.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-100">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mb-4">
              <MapPin className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Location Tracking</h3>
            <p className="text-gray-600 leading-relaxed">
              Advanced real-time tracking during emergencies with route history. Your guardians 
              see your exact location with battery-optimized precision technology.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-100">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mb-4">
              <Bell className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Multi-Channel Alerts</h3>
            <p className="text-gray-600 leading-relaxed">
              Simultaneous email, SMS, and in-app notifications to your safety circle with 
              real-time tracking links. Global delivery infrastructure ensures instant reach.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-100">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Safety Circle Network</h3>
            <p className="text-gray-600 leading-relaxed">
              Build your trusted network of guardians. Unlimited emergency contacts with 
              intelligent notification prioritization based on availability and proximity.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-100">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Global Safe Zones</h3>
            <p className="text-gray-600 leading-relaxed">
              Interactive worldwide map showing police stations, hospitals, embassies, and 
              verified safe locations. Community-driven safety ratings by region.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-100">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-rose-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Community Safety Hub</h3>
            <p className="text-gray-600 leading-relaxed">
              Anonymous incident reporting, safety tips, and collective awareness. Help create 
              safer communities worldwide through shared knowledge and support.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-12 text-white">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">195+</div>
              <div className="text-purple-100">Countries Supported</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-purple-100">Global Coverage</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">&lt;2s</div>
              <div className="text-purple-100">Average Alert Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to Feel Safer, Everywhere?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join women worldwide who trust Lumina Guard for their safety
          </p>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-semibold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Create Free Account
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <LuminaLogo className="h-8 w-8" />
            <span className="text-xl font-bold">Lumina Guard</span>
          </div>
          <p className="text-center text-gray-400">
            Your Circle of Light, Always Protecting | Global Women's Safety Platform
          </p>
          <p className="text-center text-gray-500 mt-2 text-sm">
            © 2024 Lumina Guard | Dilwado Internship Project
          </p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;