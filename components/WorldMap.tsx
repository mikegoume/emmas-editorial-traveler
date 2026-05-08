"use client";

import type { WPDestination } from "@/lib/graphql";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

const createCustomIcon = () =>
  L.divIcon({
    className: "",
    html: `<div style="
      width:14px;height:14px;
      background:#3d6660;
      border:2px solid white;
      border-radius:50%;
      box-shadow:0 2px 8px rgba(0,0,0,0.3);
      cursor:pointer;
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10],
  });

function FitBounds({ destinations }: { destinations: WPDestination[] }) {
  const map = useMap();
  useEffect(() => {
    const valid = destinations.filter(
      (d) => d.destinationDetails?.latitude && d.destinationDetails?.longitude,
    );
    if (valid.length === 0) return;
    if (valid.length === 1) {
      map.setView(
        [
          valid[0].destinationDetails!.latitude!,
          valid[0].destinationDetails!.longitude!,
        ],
        6,
      );
      return;
    }
    const bounds = valid.map((d) => [
      d.destinationDetails!.latitude!,
      d.destinationDetails!.longitude!,
    ]) as [number, number][];
    map.fitBounds(bounds, { padding: [60, 60] });
  }, [map, destinations]);
  return null;
}

export default function WorldMap({
  destinations,
}: {
  destinations: WPDestination[];
}) {
  const validDestinations = destinations.filter(
    (d) => d.destinationDetails?.latitude && d.destinationDetails?.longitude,
  );

  if (validDestinations.length === 0) {
    return (
      <div
        style={{ height: "500px" }}
        className="w-full bg-surface-container-low rounded-lg flex items-center justify-center border border-outline-variant/10"
      >
        <p className="text-outline font-body italic text-sm">
          No destinations with coordinates yet. Add latitude & longitude in
          WordPress.
        </p>
      </div>
    );
  }

  return (
    // Explicit height is required — Leaflet ignores aspect-ratio CSS
    <div
      style={{ height: "500px" }}
      className="w-full rounded-lg overflow-hidden border border-outline-variant/10 shadow-sm"
    >
      <MapContainer
        center={[30, 20]}
        zoom={2}
        minZoom={2}
        maxZoom={18}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%" }} // ← must be inline, not Tailwind
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <FitBounds destinations={validDestinations} />

        {validDestinations.map((dest) => {
          const lat = dest.destinationDetails!.latitude!;
          const lng = dest.destinationDetails!.longitude!;
          const region = dest.regions?.nodes[0];
          const image =
            dest.destinationDetails?.heroImage?.node?.sourceUrl ??
            dest.featuredImage?.node?.sourceUrl;

          return (
            <Marker
              key={dest.id}
              position={[lat, lng]}
              icon={createCustomIcon()}
            >
              <Popup maxWidth={220} minWidth={220}>
                <div className="font-sans">
                  {image && (
                    <img
                      src={image}
                      alt={dest.title}
                      style={{
                        width: "100%",
                        height: "112px",
                        objectFit: "cover",
                        borderRadius: "8px 8px 0 0",
                        marginBottom: "10px",
                      }}
                    />
                  )}
                  <div style={{ padding: "0 4px 4px" }}>
                    {region && (
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: "#3d6660",
                        }}
                      >
                        {region.name}
                      </span>
                    )}
                    <h3
                      style={{
                        fontWeight: 700,
                        fontSize: "15px",
                        margin: "2px 0 4px",
                        lineHeight: 1.3,
                        color: "#1a1a1a",
                      }}
                    >
                      {dest.title}
                    </h3>
                    {dest.destinationDetails?.excerpt && (
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#666",
                          marginBottom: "10px",
                          lineHeight: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {dest.destinationDetails.excerpt}
                      </p>
                    )}
                    <a
                      href={`/destinations/${dest.slug}`}
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#3d6660",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      Explore →
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
