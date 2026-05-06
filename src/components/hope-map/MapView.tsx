/**
 * MapView — MapLibre GL JS map of Hope Map entries.
 * Centred on the UK with markers for each person.
 */

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { HopeMapPerson } from '../../data/hopeMap';

interface MapViewProps {
    entries: HopeMapPerson[];
    compact?: boolean;
}

/** Escape HTML special characters to prevent XSS in popup content */
function escapeHTML(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/** Build HTML string for a marker popup */
function buildPopupHTML(person: HopeMapPerson): string {

    const avatarHTML = person.imageUrl
        ? `<img src="${escapeHTML(person.imageUrl)}" alt="${escapeHTML(person.name)}" style="width:44px;height:44px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid rgba(109,40,217,0.4);" />`
        : `<div style="width:44px;height:44px;border-radius:50%;background:rgba(109,40,217,0.2);border:2px solid rgba(109,40,217,0.4);flex-shrink:0;display:flex;align-items:center;justify-content:center;"><svg width="20" height="20" viewBox="0 0 448 512" fill="#7c3aed"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg></div>`;

    return `
        <div style="padding:18px 20px 16px;font-family:inherit;min-width:240px;max-width:300px;">
            <div style="margin-bottom:12px;display:flex;align-items:flex-start;gap:10px;padding-right:20px;">
                ${avatarHTML}
                <div style="min-width:0;">
                <h3 style="margin:0 0 2px;font-size:15px;font-weight:700;color:#1e1b4b;line-height:1.3;">${escapeHTML(person.name)}</h3>
                <p style="margin:0;font-size:13px;font-weight:600;color:#6d28d9;">${escapeHTML(person.organisation)}</p>                <p style="margin:0;font-size:12px;font-style:italic;color:#7c3aed;opacity:0.75;">${escapeHTML(person.tagline)}</p>            </div>
            </div>
            <p style="margin:0 0 10px;font-size:12px;color:#7c3aed;display:flex;align-items:center;gap:4px;">
                <svg width="11" height="11" viewBox="0 0 384 512" fill="#7c3aed" style="flex-shrink:0;"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>
                ${escapeHTML(person.location)}
            </p>
            <div style="margin:0 0 14px;padding:10px 12px;background:rgba(245,158,11,0.08);border-left:3px solid #f59e0b;border-radius:0 6px 6px 0;">
                <p style="margin:0;font-size:12px;font-style:italic;color:#78350f;line-height:1.5;">&ldquo;${escapeHTML(person.quote)}&rdquo;</p>
            </div>
            <a href="${escapeHTML(person.websiteUrl)}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:600;color:#d97706;text-decoration:none;padding:5px 10px;background:rgba(245,158,11,0.08);border-radius:6px;transition:background 0.15s;">Visit website <svg width="11" height="11" viewBox="0 0 512 512" fill="#d97706"><path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"/></svg></a>
        </div>
    `;
}

/**
 * PAN LIMITS — how far the user can drag/scroll the map.
 * Format: [[southwest lng, southwest lat], [northeast lng, northeast lat]]
 * Keep these tight around the UK_CUTOUT to avoid empty violet space.
 */
const UK_MAX_BOUNDS: [[number, number], [number, number]] = [
    [-11, 49.7],   // west south — just south of Cornwall
    [2, 56.4],     // east north — just above Shetland
];

/**
 * UK CUTOUT — the shape that is "revealed" through the mask.
 * This is a polygon tracing the coastline (loosely) in the sea around
 * the British Isles. Everything OUTSIDE this shape gets the violet overlay.
 * Format: [longitude, latitude] — traces clockwise from south Cornwall.
 */
const UK_CUTOUT: [number, number][] = [
    [-6, 49.0],     // South of Cornwall — start point
    [-11, 51.0],    // Atlantic west of Cork, Ireland
    [-11.5, 54.0],  // Atlantic west of Galway
    [-11, 56.0],    // Atlantic west of Donegal
    [-9.5, 58.0],   // Northwest of Scotland (Outer Hebrides)
    [-7, 59.5],     // North of Shetland
    [-3, 61.5],     // Far north — above Shetland
    [0, 61.0],      // Northeast — descending east of Shetland
    [3, 58.0],      // North Sea, east of Aberdeen
    [3, 55.0],      // North Sea, east of Newcastle
    [2.5, 52.0],    // North Sea, east of Norfolk
    [2, 51.1],      // English Channel, east of Dover
    [0, 50.5],      // South of English Channel
    [-6, 49.0],     // Back to start — south of Cornwall
];

/**
 * WORLD RING — covers the entire world so the mask fills everything.
 * The UK_CUTOUT is punched out of this as a "hole", creating an
 * inverted polygon: world = violet, UK cutout = visible map.
 * You should never need to change this.
 */
const WORLD_RING: [number, number][] = [
    [-180, -90],   // Bottom-left (far west, south pole)
    [180, -90],    // Bottom-right (far east, south pole)
    [180, 90],     // Top-right (far east, north pole)
    [-180, 90],    // Top-left (far west, north pole)
    [-180, -90],   // Close ring — back to start
];

export default function MapView({ entries, compact = false }: MapViewProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const markersRef = useRef<maplibregl.Marker[]>([]);

    // Initialise map on mount
    useEffect(() => {
        if (!mapContainer.current || map.current) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: 'https://tiles.openfreemap.org/styles/liberty',
            center: [-2.5, 54.5],
            zoom: compact ? 4.8 : 5.5,
            maxBounds: UK_MAX_BOUNDS,
            minZoom: 4.5,
            maxZoom: 14,
        });

        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

        // After the style loads, add an opaque mask over everything outside the UK
        map.current.on('style.load', () => {
            const m = map.current;
            if (!m) return;

            m.addSource('uk-mask', {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'Polygon',
                        // Outer ring covers the world; inner ring (hole) reveals the UK
                        coordinates: [WORLD_RING, UK_CUTOUT],
                    },
                },
            });

            m.addLayer({
                id: 'uk-mask-fill',
                type: 'fill',
                source: 'uk-mask',
                paint: {
                    'fill-color': '#2F0D68',
                    'fill-opacity': 1,
                },
            });

            // Restyle water layers to match the brand palette
            const waterColour = '#2F0D68';
            for (const layer of m.getStyle().layers) {
                const id = layer.id;
                if (id === 'water') {
                    m.setPaintProperty(id, 'fill-color', waterColour);
                } else if (id.startsWith('waterway') && layer.type === 'line') {
                    m.setPaintProperty(id, 'line-color', waterColour);
                }
            }
            // Also tint the base background so any gaps match the mask
            // m.setPaintProperty('background', 'background-color', '#2F0D68');
            m.setPaintProperty('background', 'background-color', '#FFFFFF');
        });

        return () => {
            map.current?.remove();
            map.current = null;
        };
    }, [compact]);

    // Add/update markers when entries change
    useEffect(() => {
        if (!map.current) return;

        // Remove existing markers
        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];

        entries.forEach((person) => {
            // Create custom marker element — scale is applied to inner element
            // to avoid conflicting with MapLibre's positioning transform on the outer element
            const el = document.createElement('div');
            el.className = 'hope-map-marker';
            el.style.cssText = 'width:28px;height:28px;cursor:pointer;';

            const inner = document.createElement('div');
            inner.style.cssText = 'width:100%;height:100%;border-radius:50%;background:#7c3aed;border:3px solid #c4b5fd;display:flex;align-items:center;justify-content:center;transition:transform 0.15s ease;';
            inner.innerHTML = '<svg width="14" height="14" viewBox="0 0 512 512" fill="white"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>';
            el.appendChild(inner);

            el.addEventListener('mouseenter', () => { inner.style.transform = 'scale(1.3)'; });
            el.addEventListener('mouseleave', () => { inner.style.transform = 'scale(1)'; });

            const popup = new maplibregl.Popup({ offset: 20, maxWidth: '320px' })
                .setHTML(buildPopupHTML(person));

            const marker = new maplibregl.Marker({ element: el })
                .setLngLat([person.coordinates.lng, person.coordinates.lat])
                .setPopup(popup)
                .addTo(map.current!);

            markersRef.current.push(marker);
        });
    }, [entries]);

    return (
        <div
            ref={mapContainer}
            className="w-full rounded-lg overflow-hidden ring-1 ring-violet-700/50"
            style={{ height: compact ? 'max(400px, 65vh)' : 'calc(100vh - 10rem)' }}
            aria-label="Hope Map showing locations of social entrepreneurs across the UK"
            role="application"
        />
    );
}
