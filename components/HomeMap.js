'use client'
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const MAP_HEIGHT = 400

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

export default function HomeMap({ home }) {
  const [position, setPosition] = useState(null)
  const [isExact, setIsExact]   = useState(false)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    // Priority 1: exact coordinates stored in the database
    if (home.latitude && home.longitude) {
      setPosition([parseFloat(home.latitude), parseFloat(home.longitude)])
      setIsExact(true)
      setLoading(false)
      return
    }

    // Priority 2: geocode via server-side proxy (avoids CSP + forbidden User-Agent)
    const q = [home.comuna, home.region, 'Chile'].filter(Boolean).join(', ')
    if (!q.trim()) { setLoading(false); return }

    fetch(`/api/geocode?q=${encodeURIComponent(q)}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)])
          setIsExact(false)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [home.latitude, home.longitude, home.comuna, home.region])

  if (loading) {
    return (
      <div
        className="rounded-2xl bg-gray-100 animate-pulse"
        style={{ height: MAP_HEIGHT }}
      />
    )
  }

  if (!position) return null

  return (
    <MapContainer
      center={position}
      zoom={isExact ? 15 : 12}
      // Explicit pixel height avoids the height:100% collapse caused by
      // the intermediate wrapper that next/dynamic injects.
      style={{ height: MAP_HEIGHT, width: '100%', borderRadius: '1rem' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {isExact ? (
        <Marker position={position} icon={markerIcon} />
      ) : (
        <Circle
          center={position}
          radius={500}
          pathOptions={{ color: '#2A5C45', fillColor: '#2A5C45', fillOpacity: 0.15, weight: 2 }}
        />
      )}
    </MapContainer>
  )
}
