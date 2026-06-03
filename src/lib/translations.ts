export type Lang = 'es' | 'fr' | 'en'

export const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: 'es', label: 'ES', flag: 'es' },
  { code: 'fr', label: 'FR', flag: 'fr' },
  { code: 'en', label: 'EN', flag: 'gb' },
]

export const translations = {
  es: {
    nav: {
      home: 'Inicio', services: 'Servicios', book: 'Reserva', contact: 'Contacto',
      myAccount: 'Mi cuenta', signIn: 'Iniciar sesión', signOut: 'Salir', bookBtn: 'Reservar',
      closeMenu: 'Cerrar menú', openMenu: 'Abrir menú',
    },
    hero: {
      tag: 'Chófer privado VTC · Disponible 24/7',
      heading1: 'París, a su', heading2: 'ritmo.',
      description: 'Traslados al aeropuerto, recorridos privados y excursiones por Francia y Europa. Discreción, puntualidad y un servicio impecable a bordo de vehículos premium.',
      cta1: 'Reservar un trayecto', cta2: 'Ver servicios',
      nextRide: 'Próximo trayecto',
      stats: [
        { k: '20 +',    v: 'Años de experiencia' },
        { k: '3 000',   v: 'Trayectos realizados' },
        { k: '4.8 / 5', v: 'Valoración clientes'  },
      ],
    },
    cta: {
      eyebrow: '¿Preparado para su próximo trayecto?',
      heading1: 'Reserve en 60 segundos.',
      heading2: 'Confirmación inmediata.',
      btn1: 'Solicitar presupuesto', btn2: 'WhatsApp directo',
    },
    footer: {
      description: 'Chófer privado en París. Traslados, city tours y excursiones por Francia y Europa.',
      navTitle: 'Navegación', servicesTitle: 'Servicios', contactTitle: 'Contacto',
      navLinks: [
        { href: '/', label: 'Inicio' }, { href: '/servicios', label: 'Servicios' },
        { href: '/reserva', label: 'Reserva' }, { href: '/contacto', label: 'Contacto' },
      ],
      servicesList: ['Aeropuertos', 'Disneyland', 'City tour París', 'Excursiones', 'Disposición'],
      legal: 'Aviso legal', privacy: 'Política de privacidad', cgv: 'CGV',
      design: 'Diseño & desarrollo',
    },
  },
  fr: {
    nav: {
      home: 'Accueil', services: 'Services', book: 'Réservation', contact: 'Contact',
      myAccount: 'Mon compte', signIn: 'Se connecter', signOut: 'Déconnexion', bookBtn: 'Réserver',
      closeMenu: 'Fermer le menu', openMenu: 'Ouvrir le menu',
    },
    hero: {
      tag: 'Chauffeur privé VTC · Disponible 24h/24',
      heading1: 'Paris, à votre', heading2: 'rythme.',
      description: "Transferts aéroport, circuits privés et excursions en France et en Europe. Discrétion, ponctualité et un service impeccable à bord de véhicules premium.",
      cta1: 'Réserver un trajet', cta2: 'Voir les services',
      nextRide: 'Prochain trajet',
      stats: [
        { k: '20 +',    v: "Ans d'expérience"  },
        { k: '3 000',   v: 'Trajets effectués'  },
        { k: '4.8 / 5', v: 'Note clients'       },
      ],
    },
    cta: {
      eyebrow: 'Prêt pour votre prochain trajet ?',
      heading1: 'Réservez en 60 secondes.',
      heading2: 'Confirmation immédiate.',
      btn1: 'Demander un devis', btn2: 'WhatsApp direct',
    },
    footer: {
      description: 'Chauffeur privé à Paris. Transferts, city tours et excursions en France et en Europe.',
      navTitle: 'Navigation', servicesTitle: 'Services', contactTitle: 'Contact',
      navLinks: [
        { href: '/', label: 'Accueil' }, { href: '/servicios', label: 'Services' },
        { href: '/reserva', label: 'Réservation' }, { href: '/contacto', label: 'Contact' },
      ],
      servicesList: ['Aéroports', 'Disneyland', 'City tour Paris', 'Excursions', 'Mise à disposition'],
      legal: 'Mentions légales', privacy: 'Politique de confidentialité', cgv: 'CGV',
      design: 'Conception & développement',
    },
  },
  en: {
    nav: {
      home: 'Home', services: 'Services', book: 'Book', contact: 'Contact',
      myAccount: 'My account', signIn: 'Sign in', signOut: 'Sign out', bookBtn: 'Book now',
      closeMenu: 'Close menu', openMenu: 'Open menu',
    },
    hero: {
      tag: 'Private VTC chauffeur · Available 24/7',
      heading1: 'Paris, at your', heading2: 'pace.',
      description: 'Airport transfers, private tours and excursions across France and Europe. Discretion, punctuality and impeccable service aboard premium vehicles.',
      cta1: 'Book a ride', cta2: 'View services',
      nextRide: 'Next ride',
      stats: [
        { k: '20 +',    v: 'Years of experience' },
        { k: '3 000',   v: 'Trips completed'     },
        { k: '4.8 / 5', v: 'Client rating'       },
      ],
    },
    cta: {
      eyebrow: 'Ready for your next ride?',
      heading1: 'Book in 60 seconds.',
      heading2: 'Instant confirmation.',
      btn1: 'Get a quote', btn2: 'WhatsApp us',
    },
    footer: {
      description: 'Private chauffeur in Paris. Transfers, city tours and excursions across France and Europe.',
      navTitle: 'Navigation', servicesTitle: 'Services', contactTitle: 'Contact',
      navLinks: [
        { href: '/', label: 'Home' }, { href: '/servicios', label: 'Services' },
        { href: '/reserva', label: 'Book' }, { href: '/contacto', label: 'Contact' },
      ],
      servicesList: ['Airports', 'Disneyland', 'Paris city tour', 'Excursions', 'At disposal'],
      legal: 'Legal notice', privacy: 'Privacy policy', cgv: 'T&Cs',
      design: 'Design & development',
    },
  },
}
