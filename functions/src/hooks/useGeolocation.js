import { useState, useEffect } from 'react';

/**
 * Custom hook to get user's current location
 * Returns location coordinates and loading/error states
 */
export const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    // Get current position
    const successHandler = (position) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp
      });
      setLoading(false);
      setError(null);
    };

    const errorHandler = (err) => {
      let errorMessage = 'Unable to retrieve your location';
      
      switch(err.code) {
        case err.PERMISSION_DENIED:
          errorMessage = 'Location permission denied. Please enable location services.';
          break;
        case err.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable.';
          break;
        case err.TIMEOUT:
          errorMessage = 'Location request timed out.';
          break;
        default:
          errorMessage = 'An unknown error occurred.';
      }
      
      setError(errorMessage);
      setLoading(false);
    };

    // Options for geolocation
    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
      ...options
    };

    // Get location
    navigator.geolocation.getCurrentPosition(
      successHandler,
      errorHandler,
      geoOptions
    );

    // Optional: Watch position for continuous updates
    // Uncomment if you want real-time location tracking
    /*
    const watchId = navigator.geolocation.watchPosition(
      successHandler,
      errorHandler,
      geoOptions
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
    */
  }, []);

  return { location, loading, error };
};

/**
 * Request location permission explicitly
 * Useful for showing a button to request permission
 */
export const requestLocationPermission = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
};