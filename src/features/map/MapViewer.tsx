"use client"

import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { MAP_CONFIG } from './config'

/**
 * Generic map. Shows point features from a GeoJSON file: a file in public/ or a live file published by a project
 * (read in the browser on every visit, so the map is always current). Each feature may have "title",
 * "description" and "url" properties for the popup. With `fit`, the map zooms to the points.
 */
export default function MapViewer({
  geojsonUrl,
  color = '#10b981',
  fit = false,
}: {
  geojsonUrl: string
  color?: string
  fit?: boolean
}) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_CONFIG.style,
      center: MAP_CONFIG.center,
      zoom: MAP_CONFIG.zoom,
      minZoom: MAP_CONFIG.minZoom,
      maxZoom: MAP_CONFIG.maxZoom,
    })
    map.addControl(new maplibregl.NavigationControl(), 'bottom-left')

    map.on('load', async () => {
      try {
        const response = await fetch(geojsonUrl, { cache: 'no-store' })
        if (!response.ok) throw new Error(`${geojsonUrl}: HTTP ${response.status}`)
        const data = await response.json()
        map.addSource('points', { type: 'geojson', data })
        if (fit && Array.isArray(data.features) && data.features.length > 0) {
          const bounds = new maplibregl.LngLatBounds()
          for (const feature of data.features) {
            if (feature.geometry?.type === 'Point') bounds.extend(feature.geometry.coordinates as [number, number])
          }
          if (!bounds.isEmpty()) map.fitBounds(bounds, { padding: 48, maxZoom: 7, duration: 0 })
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e))
        return
      }

      map.addLayer({
        id: 'points-layer',
        type: 'circle',
        source: 'points',
        paint: {
          'circle-radius': 8,
          'circle-color': color,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.9,
        },
      })

      map.on('click', 'points-layer', (e) => {
        const feature = e.features?.[0]
        if (!feature || feature.geometry.type !== 'Point') return
        const { title = '', description = '', url = '' } = feature.properties ?? {}
        const popup = document.createElement('div')
        popup.className = 'text-black text-sm'
        const heading = document.createElement('strong')
        heading.textContent = String(title)
        const body = document.createElement('p')
        body.textContent = String(description)
        popup.append(heading, body)
        if (typeof url === 'string' && url.startsWith('https://')) {
          const link = document.createElement('a')
          link.href = url
          link.target = '_blank'
          link.rel = 'noopener noreferrer'
          link.textContent = 'Open the live panel'
          link.className = 'underline'
          popup.append(link)
        }
        new maplibregl.Popup({ maxWidth: '320px' })
          .setLngLat(feature.geometry.coordinates as [number, number])
          .setDOMContent(popup)
          .addTo(map)
      })
      map.on('mouseenter', 'points-layer', () => { map.getCanvas().style.cursor = 'pointer' })
      map.on('mouseleave', 'points-layer', () => { map.getCanvas().style.cursor = '' })
    })

    return () => map.remove()
  }, [geojsonUrl, color, fit])

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div ref={mapContainer} className="w-full h-full rounded-xl overflow-hidden shadow-2xl" />
      {error && (
        <p className="absolute bottom-3 right-3 text-xs text-red-400 bg-black/70 px-3 py-1 rounded">
          Map data could not be loaded ({error})
        </p>
      )}
    </div>
  )
}
