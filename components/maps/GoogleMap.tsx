import {
  GoogleMap,
  Marker,
  Circle,
  useLoadScript,
} from "@react-google-maps/api";
import { useRef, useEffect } from "react";
import { useMapContext } from "@/context/MapContext";
import { CompanyData } from "@/types";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194,
};

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = [
  "places",
];

interface GoogleMapComponentProps {
  apiKey: string;
  companies: CompanyData[];
  selectedCompany?: CompanyData;
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  apiKey,
  companies,
  selectedCompany,
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  });

  const { userLocation, error, loading } = useMapContext();
  const mapRef = useRef<google.maps.Map | null>(null);
  const center = userLocation || defaultCenter;

  // Pan to selected company when it changes
  useEffect(() => {
    if (selectedCompany && mapRef.current) {
      const lat = selectedCompany.location?.primary.coordinates?.lat;
      const lng = selectedCompany.location?.primary.coordinates?.long;
      if (typeof lat === "number" && typeof lng === "number") {
        mapRef.current.panTo({ lat, lng });
      }
    }
  }, [selectedCompany]);

  if (loadError || error) return <div></div>;
  if (!isLoaded || loading) return <div></div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
      onLoad={(map) => {
        mapRef.current = map;
      }}
    >
      {/* <Marker position={center} title="You" /> */}
      <Circle
        center={center}
        radius={200}
        options={{
          strokeColor: "#0000FF",
          strokeOpacity: 0.8,
          strokeWeight: 1,
          fillColor: "#0000FF",
          fillOpacity: 0.35,
        }}
      />
      {/* Company markers */}
      {companies.map((provider) => (
        <div key={provider._id}>
          <Marker
            icon={{
              url:
                selectedCompany?._id === provider._id
                  ? "http://maps.google.com/mapfiles/kml/pushpin/grn-pushpin.png"
                  : "http://maps.google.com/mapfiles/kml/pushpin/blue-pushpin.png",
              scaledSize: new window.google.maps.Size(50, 50),
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 50),
            }}
            position={{
              lat: provider.location?.primary.coordinates?.lat,
              lng: provider.location?.primary.coordinates?.long,
            }}
            // onClick={() => handleMarkerClick(provider)}
            title={provider.providerName}
          />
          {selectedCompany?._id === provider._id && (
            <Circle
              center={{
                lat: provider.location?.primary.coordinates.lat,
                lng: provider.location?.primary.coordinates.long,
              }}
              radius={500}
              options={{
                fillColor: "#FFD700",
                fillOpacity: 0.4,
                strokeColor: "#FFD700",
                strokeOpacity: 0.8,
                strokeWeight: 2,
              }}
            />
          )}
        </div>
      ))}
    </GoogleMap>
  );
};

export default GoogleMapComponent;
