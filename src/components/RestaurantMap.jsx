import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const deliveryIcon = new L.divIcon({
  className: "zomato-map-pin",
  html: '<span class="zomato-pin">📍</span>',
  iconSize: [34, 34],
  iconAnchor: [17, 32],
  popupAnchor: [0, -32],
});

export default function RestaurantMap({ lat, lng, name, height = "h-72", zoom = 15 }) {
  if (lat == null || lng == null) {
    return (
      <div
        className={`${height} w-full rounded-2xl border border-gray-700 bg-[#1c1c20] flex items-center justify-center`}
      >
        <p className="text-sm text-gray-500">Map preview unavailable</p>
      </div>
    );
  }
  return (
    <div className={`${height} w-full rounded-2xl overflow-hidden border border-gray-700 relative z-0`}>
      <MapContainer
        center={[lat, lng]}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", background: "#1c1c20" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={[lat, lng]} icon={deliveryIcon}>
          {name && <Popup>{name}</Popup>}
        </Marker>
      </MapContainer>
    </div>
  );
}
