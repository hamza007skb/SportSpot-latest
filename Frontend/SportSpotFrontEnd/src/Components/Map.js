import React, { useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '350px'
};

function Map() {
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAwCW9JNXFX_m7Mz2RTe14aqGjksm6F6zw"
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.error('Error fetching location');
        }
      );
    }
  }, []);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={currentLocation}
      zoom={10}
    >
      {/* Additional Components */}
    </GoogleMap>
  );
}

export default Map;
