"use client"

import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { MAP_CONFIG } from './config'

/**
 * Generic map for the home page. Shows point features from a GeoJSON file in public/
 * (each feature may have "title" and "description" properties for the popup).
 */
export default function MapViewer({ geojsonUrl }: { geojsonUrl: string }) {
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
        const response = await fetch(geojsonUrl)
        if (!response.ok) throw new Error(`${geojsonUrl}: HTTP ${response.status}`)
        map.addSource('points', { type: 'geojson', data: await response.json() })
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e))
        return
      }

      map.addLayer({
        id: 'points-layer',
        type: 'circle',
        source: 'points',
        paint: {
          'circle-radius': 10,
          'circle-color': '#10b981',
          'circle-stroke-width': 3,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.9,
        },
      })

      map.on('click', 'points-layer', (e) => {
        const feature = e.features?.[0]
        if (!feature || feature.geometry.type !== 'Point') return
        const { title = '', description = '' } = feature.properties ?? {}
        const popup = document.createElement('div')
        popup.className = 'text-black text-sm'
        const heading = document.createElement('strong')
        heading.textContent = String(title)
        const body = document.createElement('p')
        body.textContent = String(description)
        popup.append(heading, body)
        new maplibregl.Popup()
          .setLngLat(feature.geometry.coordinates as [number, number])
          .setDOMContent(popup)
          .addTo(map)
      })
      map.on('mouseenter', 'points-layer', () => { map.getCanvas().style.cursor = 'pointer' })
      map.on('mouseleave', 'points-layer', () => { map.getCanvas().style.cursor = '' })
    })

    return () => map.remove()
  }, [geojsonUrl])

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
