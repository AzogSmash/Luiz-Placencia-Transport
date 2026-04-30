import { CSSProperties } from 'react'

export const IMG: Record<string, string> = {
  "Mercedes Clase E · Place Vendôme":   "https://images.unsplash.com/photo-1563720223185-11003d516935?w=1400&q=80&auto=format&fit=crop",
  "Mercedes en zona de embarque CDG":   "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1400&q=80&auto=format&fit=crop",
  "Llegada Disneyland Hotel":           "https://images.unsplash.com/photo-1531315396756-905d68d21b56?w=1400&q=80&auto=format&fit=crop",
  "Torre Eiffel desde Trocadéro":       "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1400&q=80&auto=format&fit=crop",
  "Interior cabina trasera":            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=80&auto=format&fit=crop",
  "Castillo de Versalles":              "https://images.unsplash.com/photo-1591289009723-aef022f0c0ad?w=1400&q=80&auto=format&fit=crop",
  "Cortejo en Place de l'Opéra":        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1400&q=80&auto=format&fit=crop",
  "Mercedes Clase E":                   "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=1400&q=80&auto=format&fit=crop",
  "Mercedes Clase V":                   "https://images.unsplash.com/photo-1609520505218-7421df17ed5b?w=1400&q=80&auto=format&fit=crop",
  "Mercedes Clase S":                   "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1400&q=80&auto=format&fit=crop",
  "Mercedes Clase E · CDG Terminal 2E": "https://images.unsplash.com/photo-1563720223185-11003d516935?w=1400&q=80&auto=format&fit=crop",
  "Interior cabina trasera Clase S":    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=80&auto=format&fit=crop",
  "Castillo de Chenonceau":             "https://images.unsplash.com/photo-1591289009723-aef022f0c0ad?w=1400&q=80&auto=format&fit=crop",
  "Cortejo Place de l'Opéra":           "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1400&q=80&auto=format&fit=crop",
  "Mapa Île-de-France · cobertura":     "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1400&q=80&auto=format&fit=crop",
}

export function bg(label: string): CSSProperties {
  return IMG[label] ? { backgroundImage: `url('${IMG[label]}')` } : {}
}
