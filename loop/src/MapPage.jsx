import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Filter, X, ChevronLeft, Clock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MapboxMap from './components/MapboxMap';

const MapPage = ({ requests = [], availableItems = [], userLocation = { lat: 40.7128, lng: -74.0060 } }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [mapCenter, setMapCenter] = useState([userLocation.lng, userLocation.lat]);
  const [mapZoom, setMapZoom] = useState(12);
  const mapRef = useRef(null);

  // Mapbox token - you'll need to set this in your environment
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

  // Convert requests to map markers with real coordinates
  const mapMarkers = requests.map(request => {
    // Use request coordinates if available, otherwise generate random nearby coordinates
    const lat = request.lat || (userLocation.lat + (Math.random() - 0.5) * 0.1);
    const lng = request.lng || (userLocation.lng + (Math.random() - 0.5) * 0.1);
    
    return {
      id: request.id,
      name: request.requesterName,
      itemName: request.itemName,
      description: request.description,
      location: request.location,
      lat,
      lng,
      status: request.status,
      neededFrom: request.neededFrom,
      neededUntil: request.neededUntil,
      category: request.category,
      distance: calculateDistance(userLocation.lat, userLocation.lng, lat, lng)
    };
  });

  // Calculate distance between two points
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c * 0.621371).toFixed(1); // Convert to miles
  }

  // Filter markers based on search
  const filteredMarkers = mapMarkers.filter(marker => 
    marker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    marker.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    marker.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle map click to select request
  const handleMapClick = (event) => {
    const { lng, lat } = event.lngLat;
    
    // Find the closest marker to the click
    let closestMarker = null;
    let closestDistance = Infinity;
    
    filteredMarkers.forEach(marker => {
      const distance = Math.sqrt(
        Math.pow(marker.lng - lng, 2) + Math.pow(marker.lat - lat, 2)
      );
      if (distance < closestDistance) {
        closestDistance = distance;
        closestMarker = marker;
      }
    });
    
    // If click is close enough to a marker, select it
    if (closestMarker && closestDistance < 0.01) {
      setSelectedRequest(closestMarker);
    } else {
      setSelectedRequest(null);
    }
  };

  // Request card component
  const RequestCard = ({ request, onClose }) => {
    if (!request) return null;
    
    const getStatusColor = (status) => {
      switch (status) {
        case 'pending': return '#fbbf24';
        case 'accepted': return '#10b981';
        case 'completed': return '#6b7280';
        case 'cancelled': return '#ef4444';
        default: return '#6b7280';
      }
    };

    const getStatusText = (status) => {
      switch (status) {
        case 'pending': return 'Looking for lender';
        case 'accepted': return 'Request accepted';
        case 'completed': return 'Completed';
        case 'cancelled': return 'Cancelled';
        default: return status;
      }
    };
    
    return (
      <div style={{
        position: 'absolute',
        bottom: '1rem',
        left: '1rem',
        right: '1rem',
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '1rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        zIndex: 20,
        maxHeight: '50vh',
        overflow: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.75rem',
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#111827',
          }}>
            {request.itemName}
          </h3>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            padding: '0.25rem',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            color: '#6B7280',
          }}>
            <X size={20} />
          </button>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.5rem',
        }}>
          <User size={16} color="#6B7280" />
          <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
            {request.name}
          </span>
          <span style={{
            backgroundColor: getStatusColor(request.status),
            color: 'white',
            padding: '0.125rem 0.5rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: '500',
          }}>
            {getStatusText(request.status)}
          </span>
        </div>

        {request.description && (
          <p style={{
            margin: '0.5rem 0',
            fontSize: '0.875rem',
            color: '#4b5563',
            lineHeight: '1.4',
          }}>
            {request.description}
          </p>
        )}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '0.75rem',
          fontSize: '0.75rem',
          color: '#6b7280',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <MapPin size={12} />
            <span>{request.distance} miles away</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={12} />
            <span>{new Date(request.neededFrom).toLocaleDateString()}</span>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '0.75rem',
        }}>
          <button style={{
            flex: 1,
            padding: '0.75rem',
            backgroundColor: '#F3F4F6',
            color: '#111827',
            border: 'none',
            borderRadius: '0.75rem',
            fontSize: '0.9375rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}>
            View Details
          </button>
          <button style={{
            flex: 1,
            padding: '0.75rem',
            backgroundColor: '#9333EA',
            color: 'white',
            border: 'none',
            borderRadius: '0.75rem',
            fontSize: '0.9375rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}>
            Accept Request
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      position: 'relative',
      height: '100vh',
      width: '100%',
      overflow: 'hidden',
      backgroundColor: '#F9FAFB',
    }}>
      {/* Header */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}>
        <button 
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.5rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChevronLeft size={24} color="#4B5563" />
        </button>
        
        <div style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}>
          <Search size={18} color="#9CA3AF" style={{
            position: 'absolute',
            left: '0.75rem',
          }} />
          <input
            type="text"
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 2.5rem',
              borderRadius: '0.75rem',
              border: '1px solid #E5E7EB',
              backgroundColor: '#F3F4F6',
              fontSize: '0.9375rem',
              outline: 'none',
            }}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '0.75rem',
                background: 'none',
                border: 'none',
                padding: '0.25rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={18} color="#9CA3AF" />
            </button>
          )}
        </div>
        
        <button style={{
          background: 'none',
          border: 'none',
          padding: '0.5rem',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Filter size={20} color="#4B5563" />
        </button>
      </div>

      {/* Map */}
      <div style={{
        position: 'absolute',
        top: '4rem',
        left: 0,
        right: 0,
        bottom: 0,
      }}>
        <MapboxMap
          token={MAPBOX_TOKEN}
          center={mapCenter}
          zoom={mapZoom}
          style="mapbox://styles/mapbox/streets-v12"
        />
        
        {/* Custom markers overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
        }}>
          {filteredMarkers.map(marker => (
            <div
              key={marker.id}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -100%)',
                pointerEvents: 'auto',
                cursor: 'pointer',
              }}
              onClick={() => setSelectedRequest(marker)}
            >
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                backgroundColor: marker.status === 'pending' ? '#9333EA' : '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translate(-50%, -100%) scale(1.1)'}
              onMouseLeave={(e) => e.target.style.transform = 'translate(-50%, -100%) scale(1)'}
            >
              <MapPin size={16} color="white" fill="currentColor" />
            </div>
            </div>
          ))}
        </div>
      </div>

      {/* Request Card */}
      <RequestCard 
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)} 
      />

      {/* Stats overlay */}
      <div style={{
        position: 'absolute',
        top: '5rem',
        right: '1rem',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '0.75rem',
        padding: '0.75rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        zIndex: 5,
      }}>
        <div style={{
          fontSize: '0.875rem',
          color: '#6B7280',
          marginBottom: '0.25rem',
        }}>
          Active Requests
        </div>
        <div style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#111827',
        }}>
          {filteredMarkers.length}
        </div>
      </div>
    </div>
  );
};

export default MapPage;