// import { useState } from "react";
import {
  GoogleMap,
  Marker,
  Circle,
  useLoadScript,
} from "@react-google-maps/api";
import { useMapContext } from "@/context/MapContext";
import { CompanyData } from "@/types";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const defaultCenter = {
  lat: 7.8731, // Default latitude
  lng: 80.7718, // Default longitude
};

const GoogleMapComponent: React.FC<{
  apiKey: string;
  companies: CompanyData[];
  selectedCompany?: CompanyData;
}> = ({ apiKey, companies, selectedCompany }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: ["places"],
  });

  // const [showCompany, setShowCompany] = useState<CompanyData | null>(null);
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

  //const handleMarkerClick = (company: CompanyData) => {
  //  setShowCompany(company);
  // };

  // const handleModalClose = () => {
    // setShowCompany(null);
  // };

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
        <Marker position={center} title="You" />
        {/* Company markers */}
        {companies.map((company) => (
          <div key={company._id}>
            <Marker
              icon={{
                url:
                  selectedCompany?._id === company._id
                    ? "http://maps.google.com/mapfiles/kml/pushpin/grn-pushpin.png"
                    : "http://maps.google.com/mapfiles/kml/pushpin/blue-pushpin.png",
                scaledSize: new window.google.maps.Size(50, 50), // Set the size of the icon
                origin: new window.google.maps.Point(0, 0), // Origin point
                anchor: new window.google.maps.Point(15, 50), // Anchor point
              }}
              position={{
                lat: company.location.primary.coordinates.lat,
                lng: company.location.primary.coordinates.long,
              }}
              // onClick={() => handleMarkerClick(company)} // Handle marker click
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
          </div>
        ))}
      </GoogleMap>
      {/* Modal for company details */}
      {/* showCompany && (
        <Modal isOpen={!!showCompany} onClose={handleModalClose}>
          <ModalBackdrop />
          <ModalContent className="">
            <ModalHeader>
              <Heading>{showCompany.companyName}</Heading>
            </ModalHeader>
            <ModalBody className="">
              Address:{" "}
              {typeof showCompany.location.primary.address === "string"
                ? showCompany.location.primary.address
                : Object.entries(showCompany.location.primary.address)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(", ")}
            </ModalBody>
            <ModalFooter className="">
              <Button variant="outline" className="" onPress={handleModalClose}>
                <ButtonText>Cancel</ButtonText>
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      ) */}
    </>
  );
};

export default GoogleMapComponent;
