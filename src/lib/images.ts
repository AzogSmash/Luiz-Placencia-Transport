import { CSSProperties } from 'react'

export const IMG: Record<string, string> = {

  // ── Hero ──────────────────────────────────────────────────────────────────
  "Mercedes Clase E · Place Vendôme":
    "https://images.unsplash.com/photo-1686199948265-ddc4ebb1cc92?w=1400&q=80&auto=format&fit=crop",

  // ── Véhicules ─────────────────────────────────────────────────────────────
  "Tesla Model Y":
    "https://images.unsplash.com/photo-1536883442700-ffaa4d76e372?w=1400&q=80&auto=format&fit=crop",
  "Hyundai Staria":
    "https://images.unsplash.com/photo-1741859765127-fda6acfea347?w=1400&q=80&auto=format&fit=crop",
  "Mercedes Clase V":
    "https://images.unsplash.com/photo-1534756287545-6b3a471d4e0e?w=1400&q=80&auto=format&fit=crop",
  "Toyota Proace":
    "https://images.unsplash.com/photo-1627031779530-1ea70d30a3b0?w=1400&q=80&auto=format&fit=crop",

  // ── Intérieur ─────────────────────────────────────────────────────────────
  "Interior cabina trasera":
    "https://images.unsplash.com/photo-1760161339261-56487b766a17?w=1400&q=80&auto=format&fit=crop",
  "Interior cabina trasera Clase S":
    "https://images.unsplash.com/photo-1760161339261-56487b766a17?w=1400&q=80&auto=format&fit=crop",

  // ── Aéroport ──────────────────────────────────────────────────────────────
  "Mercedes en zona de embarque CDG":
    "https://images.unsplash.com/photo-1551432615-469d73f41b97?w=1400&q=80&auto=format&fit=crop",
  "Mercedes Clase E · CDG Terminal 2E":
    "https://images.unsplash.com/photo-1551432615-469d73f41b97?w=1400&q=80&auto=format&fit=crop",

  // ── Disneyland ────────────────────────────────────────────────────────────
  "Llegada Disneyland Hotel":
    "https://images.unsplash.com/photo-1742079727590-4f7682f67d89?w=1400&q=80&auto=format&fit=crop",

  // ── Paris / City tour ─────────────────────────────────────────────────────
  "Torre Eiffel desde Trocadéro":
    "https://images.unsplash.com/photo-1565881606991-789a8dff9dbb?w=1400&q=80&auto=format&fit=crop",

  // ── Excursions ────────────────────────────────────────────────────────────
  "Castillo de Versalles":
    "https://images.unsplash.com/photo-1591828353335-197466da2a4e?w=1400&q=80&auto=format&fit=crop",
  "Castillo de Chenonceau":
    "https://images.unsplash.com/photo-1756307400556-e7dc592739b9?w=1400&q=80&auto=format&fit=crop",

  // ── Événements / Bodas ────────────────────────────────────────────────────
  "Cortejo en Place de l'Opéra":
    "https://images.unsplash.com/photo-1516536900061-d881b27e8ff8?w=1400&q=80&auto=format&fit=crop",
  "Cortejo Place de l'Opéra":
    "https://images.unsplash.com/photo-1516536900061-d881b27e8ff8?w=1400&q=80&auto=format&fit=crop",

  // ── Carte / Zone de service ───────────────────────────────────────────────
  "Mapa Île-de-France · cobertura":
    "https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b?w=1400&q=80&auto=format&fit=crop",
}

export function bg(label: string): CSSProperties {
  return IMG[label] ? { backgroundImage: `url('${IMG[label]}')` } : {}
}
