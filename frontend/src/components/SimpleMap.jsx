// ============================================
// SIMPLE WORKING MAP - Week 4
// src/components/SimpleMap.jsx
// ============================================

import { useEffect, useRef } from 'react';

function SimpleMap({ userLocation }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    // Only run this once when component mounts
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    console.log('🗺️ Initializing Leaflet map...');

    // Load Leaflet dynamically
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    
    script.onload = () => {
      console.log('✅ Leaflet loaded successfully');
      
      const L = window.L;
      
      // Initialize map
      const map = L.map(mapContainerRef.current).setView([6.5244, 3.3792], 12);
      
      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      // Safe zones data
      const safeZones = [
        { name: "Lagos State Police Command", type: "🚓 Police", lat: 6.4541, lng: 3.3947, color: '#3B82F6' },
        { name: "Ikoyi Police Station", type: "🚓 Police", lat: 6.4541, lng: 3.4316, color: '#3B82F6' },
        { name: "Victoria Island Police", type: "🚓 Police", lat: 6.4280, lng: 3.4219, color: '#3B82F6' },
        { name: "LUTH Hospital", type: "🏥 Hospital", lat: 6.4985, lng: 3.3669, color: '#EF4444' },
        { name: "LASUTH Hospital", type: "🏥 Hospital", lat: 6.5244, lng: 3.3792, color: '#EF4444' },
        { name: "Reddington Hospital", type: "🏥 Hospital", lat: 6.4289, lng: 3.4219, color: '#EF4444' },
        { name: "US Consulate", type: "🏛️ Embassy", lat: 6.4265, lng: 3.4207, color: '#10B981' },
        { name: "British High Commission", type: "🏛️ Embassy", lat: 6.4290, lng: 3.4305, color: '#10B981' }
      ];

      // Add markers for safe zones
      safeZones.forEach(zone => {
        const marker = L.marker([zone.lat, zone.lng]).addTo(map);
        marker.bindPopup(`
          <div style="padding: 8px;">
            <div style="font-weight: bold; color: ${zone.color}; margin-bottom: 5px;">
              ${zone.type}
            </div>
            <div style="font-size: 14px; margin-bottom: 3px;">
              ${zone.name}
            </div>
          </div>
        `);
        markersRef.current.push({ marker, type: 'safeZone' });
      });

      mapInstanceRef.current = map;
      console.log('✅ Map initialized with', safeZones.length, 'safe zones');
    };

    document.head.appendChild(script);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update user location when it changes
  useEffect(() => {
    if (!mapInstanceRef.current || !userLocation) return;

    console.log('📍 Adding user marker:', userLocation);

    const L = window.L;
    const map = mapInstanceRef.current;

    // Remove old user marker if exists
    const oldUserMarker = markersRef.current.find(m => m.type === 'user');
    if (oldUserMarker) {
      map.removeLayer(oldUserMarker.marker);
      markersRef.current = markersRef.current.filter(m => m.type !== 'user');
    }

    // Add new user marker
    const userMarker = L.marker([userLocation.latitude, userLocation.longitude]).addTo(map);
    userMarker.bindPopup(`
      <div style="padding: 8px; text-align: center;">
        <div style="font-weight: bold; color: #8B7BC7; margin-bottom: 5px;">
          📍 Your Location
        </div>
        <div style="font-size: 12px;">
          ${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}
        </div>
      </div>
    `).openPopup();

    markersRef.current.push({ marker: userMarker, type: 'user' });

    // Center map on user
    map.setView([userLocation.latitude, userLocation.longitude], 14);
    
    console.log('✅ User marker added and centered');
  }, [userLocation]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div 
        ref={mapContainerRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          borderRadius: '1rem',
          zIndex: 1
        }}
      />
      
      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '12px 15px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 1000,
        fontSize: '13px',
        border: '2px solid #e5e7eb'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>
          🗺️ Map Legend
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#8B7BC7' }}></div>
            <span>Your Location</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#3B82F6' }}></div>
            <span>🚓 Police</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#EF4444' }}></div>
            <span>🏥 Hospital</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#10B981' }}></div>
            <span>🏛️ Embassy</span>
          </div>
        </div>
      </div>

      {/* Location Badge */}
      {userLocation && (
        <div style={{
          position: 'absolute',
          top: '15px',
          left: '15px',
          background: 'linear-gradient(135deg, #8B7BC7 0%, #6B5B97 100%)',
          color: 'white',
          padding: '10px 15px',
          borderRadius: '10px',
          fontSize: '13px',
          fontWeight: '600',
          boxShadow: '0 4px 12px rgba(139, 123, 199, 0.4)',
          zIndex: 1000
        }}>
          📍 {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
        </div>
      )}
    </div>
  );
}

export default SimpleMap;