// components/maps/InteractiveMap.tsx
"use client";
import { useState } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { googleMapsConfig } from "@/utils/google-maps/config";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import { PlacesAutocomplete } from "./PlacesAutocomplete";

interface InteractiveMapProps {
  markers?: Array<{
    id: string;
    position: google.maps.LatLngLiteral;
    title?: string;
    content?: string;
  }>;
  onMarkerClick?: (id: string) => void;
  onMapClick?: (location: google.maps.LatLngLiteral) => void;
}

export const InteractiveMap = ({
  markers = [],
  onMarkerClick,
  onMapClick,
}: InteractiveMapProps) => {
  const {
    map,
    onLoad,
    onUnmount,
    selectedPlace,
    setSelectedPlace,
    currentLocation,
    getCurrentLocation,
    panTo,
  } = useGoogleMaps();

  const [activeMarker, setActiveMarker] = useState<string | null>(null);

  const handlePlaceSelected = (place: google.maps.places.PlaceResult) => {
    setSelectedPlace(place);
    if (place.geometry?.location) {
      panTo({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    }
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      onMapClick?.({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-white shadow-md z-10">
        <div className="flex gap-2">
          <PlacesAutocomplete onPlaceSelected={handlePlaceSelected} />
          <button
            onClick={getCurrentLocation}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Current Location
          </button>
        </div>
      </div>

      <div className="flex-1 relative">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={currentLocation || googleMapsConfig.defaultCenter}
          zoom={googleMapsConfig.defaultZoom}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={handleMapClick}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          {selectedPlace && (
            <Marker
              position={{
                lat: selectedPlace.geometry?.location?.lat() || 0,
                lng: selectedPlace.geometry?.location?.lng() || 0,
              }}
              icon={{
                url: "/icons/selected-location.svg",
                scaledSize: new google.maps.Size(32, 32),
              }}
            />
          )}

          {markers.map((marker) => (
            <Marker
              key={marker.id}
              position={marker.position}
              onClick={() => {
                setActiveMarker(marker.id);
                onMarkerClick?.(marker.id);
              }}
            />
          ))}

          {activeMarker && (
            <InfoWindow
              position={
                markers.find((m) => m.id === activeMarker)?.position ||
                googleMapsConfig.defaultCenter
              }
              onCloseClick={() => setActiveMarker(null)}
            >
              <div className="p-2">
                <h3 className="font-bold">
                  {markers.find((m) => m.id === activeMarker)?.title}
                </h3>
                <p>{markers.find((m) => m.id === activeMarker)?.content}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  );
};
