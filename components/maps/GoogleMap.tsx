import React, { useState } from "react";
import {
  GoogleMap,
  Marker,
  Circle,
  useLoadScript,
} from "@react-google-maps/api";
import { useMapContext } from "@/context/MapContext";
import { CompanyData } from "@/types";
// import { electrical } from "@/public/assets/icons";
import { Modal } from "@/components/ui/modal"; // Assuming you have a Modal component

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const defaultCenter = {
  lat: 0,
  lng: 0,
};

const GoogleMapComponent: React.FC<{
  apiKey: string;
  companies: CompanyData[];
}> = ({ apiKey, companies }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: ["places"],
  });

  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(
    null
  );
  const { userLocation } = useMapContext();

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  // Custom marker icons (defined after API is loaded)
  // const companyMarkerIcon = {
  //  url: electrical, // Path to your custom icon
  //  scaledSize: new window.google.maps.Size(40, 40), // Resize the icon
  //  origin: new window.google.maps.Point(0, 0), // Origin point
  //  anchor: new window.google.maps.Point(20, 40), // Anchor point
  //};
  //const userMarkerIcon = {
  //  url: "https://maps.google.com/mapfiles/kml/pal2/icon10.png",
  //  scaledSize: new window.google.maps.Size(40, 40),
  //};

  const center = userLocation
    ? { lat: userLocation.lat, lng: userLocation.lng }
    : companies.length > 0
    ? {
        lat: companies[0].location.primary.coordinates.lat,
        lng: companies[0].location.primary.coordinates.long,
      }
    : defaultCenter;

  const handleMarkerClick = (company: CompanyData) => {
    setSelectedCompany(company);
  };

  const handleModalClose = () => {
    setSelectedCompany(null);
  };
  return (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {/* Company markers */}
        {companies.map((company) => (
          <>
            <Marker
              key={company.id}
              position={{
                lat: company.location.primary.coordinates.lat,
                lng: company.location.primary.coordinates.long,
              }}
              onClick={() => handleMarkerClick(company)} // Handle marker click
              title={company.companyName}
            />
            <Circle
              radius={10000}
              options={{
                fillColor: "#4285F4",
                fillOpacity: 0.2,
                strokeColor: "#4285F4",
                strokeOpacity: 0.8,
                strokeWeight: 1,
              }}
            />
          </>
        ))}
      </GoogleMap>
      {/* Modal for company details */}
      {selectedCompany && (
        <Modal isOpen={!!selectedCompany} onClose={handleModalClose}>
          <div className="p-4">
            <h2 className="text-xl font-bold">{selectedCompany.companyName}</h2>
            <p className="text-gray-600">
              Address:{" "}
              {typeof selectedCompany.location.primary.address === "string"
                ? selectedCompany.location.primary.address
                : Object.entries(selectedCompany.location.primary.address)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(", ")}
            </p>
            <p className="text-gray-600">
              Coordinates: {selectedCompany.location.primary.coordinates.lat},{" "}
              {selectedCompany.location.primary.coordinates.long}
            </p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleModalClose}
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default GoogleMapComponent;
