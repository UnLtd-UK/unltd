/**
 * MapView — MapLibre GL JS map of Hope Map entries.
 * Centred on the UK with markers for each person.
 */

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { HopeMapPerson, HopeMapTagConfig } from '../../data/hopeMap';

interface MapViewProps {
    entries: HopeMapPerson[];
    tags: Record<string, HopeMapTagConfig>;
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
function buildPopupHTML(person: HopeMapPerson, tags: Record<string, HopeMapTagConfig>): string {
    const tagPills = person.tags
        .map((slug) => {
            const tag = tags[slug];
            if (!tag) return '';
            return `<span style="display:inline-flex;align-items:center;border-radius:9999px;padding:2px 8px;font-size:11px;font-weight:500;background:rgba(139,92,246,0.15);color:rgb(196,181,253);">${escapeHTML(tag.label)}</span>`;
        })
        .filter(Boolean)
        .join(' ');

    return `
        <div style="max-width:280px;font-family:inherit;">
            <h3 style="margin:0 0 2px;font-size:15px;font-weight:600;color:#1e1b4b;">${escapeHTML(person.name)}</h3>
            <p style="margin:0 0 6px;font-size:13px;font-weight:500;color:#5b21b6;">${escapeHTML(person.organisation)}</p>
            <p style="margin:0 0 4px;font-size:12px;color:#6d28d9;display:flex;align-items:center;gap:4px;">
                <svg width="12" height="12" viewBox="0 0 384 512" fill="#7c3aed"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>
                ${escapeHTML(person.location)}
            </p>
            <p style="margin:0 0 6px;font-size:13px;color:#4c1d95;line-height:1.4;">${escapeHTML(person.description)}</p>
            <blockquote style="margin:0 0 8px;padding-left:10px;border-left:2px solid #f59e0b;">
                <p style="margin:0;font-size:12px;font-style:italic;color:#92400e;line-height:1.4;">&ldquo;${escapeHTML(person.actOfHope)}&rdquo;</p>
            </blockquote>
            <div style="margin-bottom:8px;display:flex;flex-wrap:wrap;gap:4px;">${tagPills}</div>
            <a href="${escapeHTML(person.websiteUrl)}" target="_blank" rel="noopener noreferrer" style="font-size:13px;font-weight:500;color:#d97706;text-decoration:none;">Visit website &rarr;</a>
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
    [2, 61],     // east north — just above Shetland
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

export default function MapView({ entries, tags, compact = false }: MapViewProps) {
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
                .setHTML(buildPopupHTML(person, tags));

            const marker = new maplibregl.Marker({ element: el })
                .setLngLat([person.coordinates.lng, person.coordinates.lat])
                .setPopup(popup)
                .addTo(map.current!);

            markersRef.current.push(marker);
        });
    }, [entries, tags]);

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
