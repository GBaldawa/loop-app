import React, { useRef, useEffect } from 'react';


// Note: to avoid bundler/transpilation issues you can load Mapbox GL JS from the CDN
// via a <script> tag in `index.html` and its CSS via a <link>. This component will
// use the global `window.mapboxgl` if available. This avoids transpiling Mapbox's
// worker bundle and keeps build simple.


const MapboxMap = ({ token, center = [-74.5, 40], zoom = 9, style = 'mapbox://styles/mapbox/streets-v12' }) => {
 const mapContainer = useRef(null);
 const mapRef = useRef(null);


 useEffect(() => {
   if (!mapContainer.current) return;
   if (!token) {
     console.warn('Mapbox token is missing. Set VITE_MAPBOX_TOKEN in .env.local or pass token prop.');
     return;
   }


   const mapbox = (typeof window !== 'undefined' && window.mapboxgl) ? window.mapboxgl : null;
   if (!mapbox) {
     console.warn('Mapbox GL JS not found on window.mapboxgl. Add the CDN <script> for mapbox-gl in your index.html to avoid bundling/transpilation.');
     return;
   }


   mapbox.accessToken = token;


   // Initialize map
   mapRef.current = new mapbox.Map({
     container: mapContainer.current,
     style,
     center,
     zoom,
   });


   // Add navigation controls (zoom/rotation)
   mapRef.current.addControl(new mapbox.NavigationControl());


   return () => {
     if (mapRef.current) {
       mapRef.current.remove();
       mapRef.current = null;
     }
   };
 }, [token, center, zoom, style]);


 return (
   <div
     ref={mapContainer}
     style={{ width: '100%', height: '60vh', minHeight: '300px' }}
     aria-label="Map"
   />
 );
};


export default MapboxMap;
