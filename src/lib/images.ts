import { CSSProperties } from 'react'

export const IMG: Record<string, string> = {

  // ── Hero ──────────────────────────────────────────────────────────────────
  "Mercedes Clase E · Place Vendôme":
    "/services/hero.jpg",

  // ── Véhicules ─────────────────────────────────────────────────────────────
  "Mercedes Clase V": "/vehicles/mercedesV.png",
  "Hyundai Staria":   "/vehicles/hyunddai.png",
  "Tesla Model Y":    "/vehicles/modelY.jpg",
  "Mercedes Clase S": "/vehicles/classeS.jpg",

  // ── Intérieur ─────────────────────────────────────────────────────────────
  "Interior cabina trasera":
    "/services/interior.jpg",
  "Interior cabina trasera Clase S":
    "/services/interior.jpg",

  // ── Aéroport ──────────────────────────────────────────────────────────────
  "Avión llegando al tarmac":
    "/services/airport.jpg",
  "Ryanair despegando en Beauvais":
    "/services/beauvais.jpg",

  // ── Disneyland ────────────────────────────────────────────────────────────
  "Llegada Disneyland Hotel":
    "https://images.unsplash.com/photo-1742079727590-4f7682f67d89?w=1400&q=80&auto=format&fit=crop",

  // ── Paris / City tour ─────────────────────────────────────────────────────
  "Torre Eiffel desde Trocadéro":
    "/services/city-tour.jpg",

  // ── Excursions ────────────────────────────────────────────────────────────
  "Castillo de Versalles":
    "https://images.unsplash.com/photo-1591828353335-197466da2a4e?w=1400&q=80&auto=format&fit=crop",
  "Canales de Ámsterdam":
    "/services/amsterdam.jpg",
  "Mont-Saint-Michel":
    "/services/mont-saint-michel.jpg",

  // ── Événements / Bodas ────────────────────────────────────────────────────
  "Cortejo en Place de l'Opéra":
    "https://images.unsplash.com/photo-1516536900061-d881b27e8ff8?w=1400&q=80&auto=format&fit=crop",
  "Cortejo Place de l'Opéra":
    "https://images.unsplash.com/photo-1516536900061-d881b27e8ff8?w=1400&q=80&auto=format&fit=crop",

  // ── Carte / Zone de service ───────────────────────────────────────────────
  "Mapa Île-de-France · cobertura": "/bg/paris.png",
}

export function bg(label: string): CSSProperties {
  return IMG[label] ? { backgroundImage: `url('${IMG[label]}')` } : {}
}
