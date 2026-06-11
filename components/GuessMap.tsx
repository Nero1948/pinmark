"use client";

import type { LatLngExpression, Map as LeafletMap, Marker, Polyline, Circle } from "leaflet";
import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

type Coords = { lat: number; lng: number };

type GuessMapProps = {
  answer: Coords | null;
  className?: string;
  disabled: boolean;
  guess: Coords | null;
  onGuessChange: (guess: Coords) => void;
  roundKey: string;
};

const NZ_CENTER: LatLngExpression = [-41.2, 172.8];
const NZ_BOUNDS: [[number, number], [number, number]] = [
  [-48.4, 165.4],
  [-33.4, 179.9]
];

const GUESS_COLOUR = "#ff5a5f";
const ANSWER_COLOUR = "#1f7a49";
const STAR_ZONE_KM = 30;

function makePinHtml(colour: string): string {
  return `<div class="pm-pin-wrap"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 42" width="36" height="42">
    <filter id="shadow"><feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-opacity="0.3"/></filter>
    <path d="M18 0C9 0 2 7 2 16C2 24 10 33 18 42C26 33 34 24 34 16C34 7 27 0 18 0Z" fill="${colour}" filter="url(#shadow)"/>
    <circle cx="18" cy="16" r="7" fill="white" opacity="0.9"/>
  </svg></div>`;
}

export function GuessMap({
  answer,
  className = "",
  disabled,
  guess,
  onGuessChange,
  roundKey
}: GuessMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const guessMarkerRef = useRef<Marker | null>(null);
  const answerMarkerRef = useRef<Marker | null>(null);
  const lineRef = useRef<Polyline | null>(null);
  const zoneCircleRef = useRef<Circle | null>(null);
  const onGuessChangeRef = useRef(onGuessChange);
  const disabledRef = useRef(disabled);
  const [loadFailed, setLoadFailed] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    onGuessChangeRef.current = onGuessChange;
    disabledRef.current = disabled;
  }, [disabled, onGuessChange]);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const L = await import("leaflet");
        if (cancelled || !containerRef.current || mapRef.current) return;

        const map = L.map(containerRef.current, {
          attributionControl: true,
          maxBounds: NZ_BOUNDS,
          maxBoundsViscosity: 0.7,
          minZoom: 4,
          touchZoom: true,
          worldCopyJump: false,
          zoomControl: true
        }).setView(NZ_CENTER, 5);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(map);

        map.on("click", (e) => {
          if (disabledRef.current) return;
          onGuessChangeRef.current({ lat: e.latlng.lat, lng: e.latlng.lng });
        });

        mapRef.current = map;
        setMapReady(true);
        window.setTimeout(() => map.invalidateSize(), 120);
      } catch {
        setLoadFailed(true);
      }
    }

    init();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      guessMarkerRef.current = null;
      answerMarkerRef.current = null;
      lineRef.current = null;
      zoneCircleRef.current = null;
      setMapReady(false);
    };
  }, []);

  useEffect(() => {
    async function updateMarkers() {
      const map = mapRef.current;
      if (!map) return;

      const L = await import("leaflet");

      const guessIcon = L.divIcon({
        className: "pm-marker-wrap",
        html: makePinHtml(GUESS_COLOUR),
        iconAnchor: [18, 42],
        iconSize: [36, 42]
      });
      const answerIcon = L.divIcon({
        className: "pm-marker-wrap",
        html: makePinHtml(ANSWER_COLOUR),
        iconAnchor: [18, 42],
        iconSize: [36, 42]
      });

      if (guess) {
        if (!guessMarkerRef.current) {
          guessMarkerRef.current = L.marker([guess.lat, guess.lng], {
            draggable: !disabled,
            icon: guessIcon,
            interactive: !disabled
          })
            .on("dragend", (e) => {
              if (disabledRef.current) return;
              const { lat, lng } = (e.target as Marker).getLatLng();
              onGuessChangeRef.current({ lat, lng });
            })
            .addTo(map);
        } else {
          guessMarkerRef.current.setLatLng([guess.lat, guess.lng]);
          guessMarkerRef.current.setIcon(guessIcon);
          if (disabled) guessMarkerRef.current.dragging?.disable();
          else guessMarkerRef.current.dragging?.enable();
        }
      } else if (guessMarkerRef.current) {
        guessMarkerRef.current.remove();
        guessMarkerRef.current = null;
      }

      if (answer) {
        if (!answerMarkerRef.current) {
          answerMarkerRef.current = L.marker([answer.lat, answer.lng], {
            icon: answerIcon,
            interactive: false
          }).addTo(map);
        } else {
          answerMarkerRef.current.setLatLng([answer.lat, answer.lng]);
          answerMarkerRef.current.setIcon(answerIcon);
        }

        if (!zoneCircleRef.current) {
          zoneCircleRef.current = L.circle([answer.lat, answer.lng], {
            radius: STAR_ZONE_KM * 1000,
            color: "#ffc83d",
            fillColor: "#ffc83d",
            fillOpacity: 0.12,
            weight: 2,
            opacity: 0.7,
            dashArray: "6 4"
          }).addTo(map);
        }
      } else {
        if (answerMarkerRef.current) {
          answerMarkerRef.current.remove();
          answerMarkerRef.current = null;
        }
        if (zoneCircleRef.current) {
          zoneCircleRef.current.remove();
          zoneCircleRef.current = null;
        }
      }

      if (guess && answer) {
        const pts: LatLngExpression[] = [
          [guess.lat, guess.lng],
          [answer.lat, answer.lng]
        ];
        if (!lineRef.current) {
          lineRef.current = L.polyline(pts, {
            color: "#102331",
            dashArray: "4 8",
            opacity: 0.8,
            weight: 2
          }).addTo(map);
        } else {
          lineRef.current.setLatLngs(pts);
        }
        map.fitBounds(lineRef.current.getBounds().pad(0.25), {
          animate: true,
          maxZoom: 14
        });
      } else if (lineRef.current) {
        lineRef.current.remove();
        lineRef.current = null;
      }
    }

    updateMarkers();
  }, [answer, disabled, guess, mapReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setView(NZ_CENTER, 5, { animate: false });
    window.setTimeout(() => map.invalidateSize(), 80);
  }, [roundKey]);

  if (loadFailed) {
    return (
      <button
        className="pm-map-fallback"
        disabled={disabled}
        onClick={() => onGuessChange({ lat: -41.2, lng: 172.8 })}
        type="button"
      >
        Map failed to load. Tap to place a guess in the middle of Aotearoa.
      </button>
    );
  }

  return <div className={`pm-map ${className}`.trim()} ref={containerRef} />;
}
