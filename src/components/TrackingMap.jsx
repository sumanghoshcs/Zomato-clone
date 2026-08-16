import React from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const shopIcon = new L.divIcon({
  className: "zomato-tracking-icon",
  html: '<div class="t-icon t-shop">🍽️</div>',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const homeIcon = new L.divIcon({
  className: "zomato-tracking-icon",
  html: '<div class="t-icon t-home">🏠</div>',
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

const bikeIcon = new L.divIcon({
  className: "zomato-tracking-icon",
  html: '<div class="t-icon t-bike">🛵</div>',
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

const pulseIcon = new L.divIcon({
  className: "zomato-tracking-icon",
  html: '<div class="t-pulse"></div>',
  iconSize: [54, 54],
  iconAnchor: [27, 27],
});

export const TrackingMap = React.memo(function TrackingMap({
  from,
  to,
  driver,
  arrived,
  delivered,
  route,
  height = "h-80",
}) {
  if (!from || !to) {
    return (
      <div
        className={`${height} w-full rounded-2xl border border-gray-700 bg-[#1c1c20] flex items-center justify-center`}
      >
        <p className="text-sm text-gray-500">Preparing live tracking…</p>
      </div>
    );
  }

  const coords =
    route && route.length >= 2 ? route : [[from.lat, from.lng], [to.lat, to.lng]];

  return (
    <div className={`${height} w-full rounded-2xl overflow-hidden border border-gray-700 relative z-0`}>
      <MapContainer
        bounds={coords}
        boundsOptions={{ padding: [36, 36] }}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", background: "#1c1c20" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Polyline
          positions={coords}
          pathOptions={{ color: "#8b8b93", weight: 4, dashArray: "7 9", opacity: 0.9 }}
        />
        <Marker position={[to.lat, to.lng]} icon={homeIcon} />
        {(arrived || delivered) && (
          <Marker position={[to.lat, to.lng]} icon={pulseIcon} />
        )}
        <Marker position={[from.lat, from.lng]} icon={shopIcon} />
        {driver && !delivered && (
          <Marker position={[driver.lat, driver.lng]} icon={bikeIcon} />
        )}
      </MapContainer>
    </div>
  );
});

export default TrackingMap;
