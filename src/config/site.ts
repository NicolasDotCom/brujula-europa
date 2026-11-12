/**
 * src/config/site.ts — Configuración central de Victoria Tours.
 *
 * Edita SOLO este archivo para cambiar datos de contacto, datos fiscales, catálogo y FAQ.
 * Todo lo marcado con «⚠️ RELLENAR» debe sustituirse por datos reales antes de publicar
 * (Stripe revisa la coherencia entre estos datos, el aviso legal y tu cuenta).
 */
import type { ImageMetadata } from 'astro';
import lofotenImg from '../assets/photos/lofoten.jpg';
import toscanaImg from '../assets/photos/toscana.jpg';
import cicladasImg from '../assets/photos/cicladas.jpg';
import dueroImg from '../assets/photos/duero.jpg';
import andaluciaImg from '../assets/photos/andalucia.jpg';
import provenzaImg from '../assets/photos/provenza.jpg';
import australiaImg from '../assets/photos/australia.jpg';
import japonImg from '../assets/photos/japon.jpg';
import suizaImg from '../assets/photos/suiza.jpg';
import islandiaImg from '../assets/photos/islandia.jpg';
import carreteraImg from '../assets/photos/alquiler-carretera.jpg';
import marImg from '../assets/photos/alquiler-mar.jpg';

/* ------------------------------------------------------------------ */
/* Negocio                                                             */
/* ------------------------------------------------------------------ */

export const site = {
  name: 'Victoria Tours',
  /** ⚠️ RELLENAR — Dominio definitivo (cámbialo también en astro.config.mjs → site). */
  domain: 'https://victoriatours.com',
  description:
    'Viajes a medida por Europa, Australia y Asia, viajes a Europa desde Latinoamérica y alquiler de coches, campers y barcos. Asesor personal por WhatsApp y pago seguro en euros con Stripe.',

  /** ⚠️ RELLENAR — WhatsApp del asesor en formato internacional, solo dígitos (sin +, espacios ni guiones). */
  whatsappPhone: '34600000000',
  /** ⚠️ RELLENAR — El mismo número, tal y como se muestra al usuario. */
  whatsappDisplay: '+34 600 000 000',
  /** ⚠️ RELLENAR — Correo de atención al cliente. */
  supportEmail: 'hola@victoriatours.com',
  /** ⚠️ RELLENAR — Teléfono de atención. */
  phone: '+34 600 000 000',
  /** Horario de atención humana. */
  hours: 'Lunes a viernes, de 9:00 a 19:00 (CET)',

  legal: {
    /** ⚠️ RELLENAR — Razón social exacta, tal y como figura en Stripe. */
    company: 'Victoria Tours S.L.',
    /** ⚠️ RELLENAR — NIF/CIF. */
    nifCif: 'B00000000',
    /** ⚠️ RELLENAR — Domicilio fiscal. */
    address: {
      street: 'Calle de Ejemplo 1, 2.º',
      postalCode: '28001',
      city: 'Madrid',
      region: 'Comunidad de Madrid',
      country: 'España',
    },
    /** ⚠️ RELLENAR — Datos registrales (Registro Mercantil). */
    mercantileRegistry: 'Registro Mercantil de Madrid, tomo 00000, folio 00, hoja M-000000',
    /** ⚠️ RELLENAR — Código de agencia de viajes (p. ej. CICMA en Madrid). Obligatorio para vender viajes combinados. */
    travelAgencyLicense: 'CICMA 0000',
    /** ⚠️ RELLENAR — Garantía de insolvencia exigida por la Directiva (UE) 2015/2302. */
    insolvencyGuarantee: '[Entidad aseguradora], póliza n.º 0000000',
    /** Fecha de la última revisión de los textos legales. */
    lastUpdated: '11 de noviembre de 2026',
  },
} as const;

export const fullAddress = `${site.legal.address.street}, ${site.legal.address.postalCode} ${site.legal.address.city}, ${site.legal.address.country}`;

/* ------------------------------------------------------------------ */
/* WhatsApp                                                            */
/* ------------------------------------------------------------------ */

/** Devuelve el enlace wa.me con el mensaje prellenado y correctamente codificado. */
export function getWhatsAppUrl(customMessage: string): string {
  return `https://wa.me/${site.whatsappPhone}?text=${encodeURIComponent(customMessage)}`;
}

/** Mensajes prellenados por punto de contacto: el asesor sabe desde dónde escribe cada cliente. */
export const whatsappMessages = {
  general: `Hola, me gustaría hablar con un asesor de ${site.name} para organizar un viaje.`,
  hero: `Hola, quiero organizar un viaje a medida con ${site.name}. ¿Me ayudas?`,
  faq: `Hola, tengo una pregunta antes de reservar con ${site.name}:`,
  closing: 'Hola, quiero diseñar un viaje a medida. Te cuento lo que tengo en mente:',
  rentals: 'Hola, quiero consultar el alquiler de un vehículo en Europa. Destino, fechas y número de personas:',
  latam: 'Hola, escribo desde Latinoamérica y quiero organizar un viaje a Europa. Salgo desde (país y ciudad):',
} as const;

/* ------------------------------------------------------------------ */
/* Mensajes por experiencia                                            */
/* ------------------------------------------------------------------ */

// La web no publica precios: el asesor envía el presupuesto por WhatsApp.

/** Mensaje de WhatsApp de cada experiencia: incluye el nombre exacto de la ruta. */
export function experienceMessage(title: string): string {
  return `Hola, estoy en Europa y quiero consultar disponibilidad y tarifa para la experiencia: ${title}`;
}

/* ------------------------------------------------------------------ */
/* Catálogo                                                            */
/* ------------------------------------------------------------------ */

export interface Experience {
  id: string;
  /** Bloque del catálogo: rutas por Europa o destinos lejanos. */
  group: 'europa' | 'mundo';
  /** Tarjeta grande (las dos primeras de Europa y las de fuera de Europa). */
  featured?: boolean;
  title: string;
  region: string;
  duration: string;
  /** Frase gancho de la ruta. */
  highlight: string;
  /** Qué incluye (3 puntos, cortos). */
  includes: [string, string, string];
  image: ImageMetadata;
  imageAlt: string;
  /** Encuadre de la foto en la tarjeta (valor CSS object-position). */
  imagePosition?: string;
  whatsappText: string;
}

/** Crea una experiencia y genera su mensaje de WhatsApp a partir del título. */
function experience(data: Omit<Experience, 'whatsappText'> & { whatsappText?: string }): Experience {
  return { ...data, whatsappText: data.whatsappText ?? experienceMessage(data.title) };
}

/** Catálogo destacado, en el orden en que se muestra (sin precios: los da el asesor). */
export const experiences: Experience[] = [
  /* --- Europa --- */
  experience({
    id: 'andalucia',
    group: 'europa',
    featured: true,
    title: 'Andalucía: Sevilla, Córdoba y Granada',
    region: 'España',
    duration: '7 días',
    highlight: 'Patios en flor, la Mezquita de Córdoba y la Alhambra al atardecer, con tren de alta velocidad entre ciudades.',
    includes: ['Hoteles con encanto en los tres cascos históricos', 'Entradas con hora para la Alhambra y la Mezquita', 'Tren de alta velocidad entre las tres ciudades'],
    image: andaluciaImg,
    imageAlt: 'La Alhambra de Granada al atardecer, con las cumbres nevadas de Sierra Nevada al fondo',
    imagePosition: '50% 45%',
  }),
  experience({
    id: 'provenza',
    group: 'europa',
    featured: true,
    title: 'Provenza y la Costa Azul',
    region: 'Francia',
    duration: '8 días',
    highlight: 'Pueblos de piedra colgados de las colinas, campos de lavanda en julio y el Mediterráneo de Niza a Èze.',
    includes: ['Mas provenzal en el Luberon y hotel frente al mar en Niza', 'Coche de alquiler con la ruta diseñada día a día', 'Mercado de Aix y cata en Châteauneuf-du-Pape'],
    image: provenzaImg,
    imageAlt: 'El pueblo de Gordes, con sus casas de piedra escalonadas sobre la colina, en la Provenza',
    imagePosition: '50% 55%',
  }),
  experience({
    id: 'portugal',
    group: 'europa',
    title: 'Portugal: Lisboa, Oporto y el valle del Duero',
    region: 'Portugal',
    duration: '8 días',
    highlight: 'Tranvías y miradores en Lisboa, la Ribeira de Oporto y un valle de viñedos en terrazas, Patrimonio de la Humanidad.',
    includes: ['Hoteles en Lisboa y Oporto, y una noche en una quinta', 'Tren entre ciudades y crucero por el Duero', 'Visita a dos bodegas de vino de Oporto'],
    image: dueroImg,
    imageAlt: 'Viñedos en terrazas sobre el río Duero y el pueblo de Pinhão, en el norte de Portugal',
    imagePosition: '55% 50%',
  }),
  experience({
    id: 'toscana',
    group: 'europa',
    title: "Toscana lenta: Val d'Orcia y Siena",
    region: 'Italia',
    duration: '7 días',
    highlight: 'Colinas de cipreses, pueblos medievales y cenas largas en un agriturismo.',
    includes: ['Agriturismo en Pienza con desayuno', "Coche de alquiler y rutas por la Val d'Orcia", 'Cata de Brunello en Montalcino'],
    image: toscanaImg,
    imageAlt: "Hilera de cipreses junto a un campo arado con luz dorada de tarde en la Val d'Orcia, Toscana",
    imagePosition: '30% 50%',
  }),
  experience({
    id: 'cicladas',
    group: 'europa',
    title: 'Cícladas a tu ritmo: Paros, Naxos y Folegandros',
    region: 'Grecia',
    duration: '9 días',
    highlight: 'Tres islas unidas en ferri, con calas tranquilas y pueblos encalados al borde del acantilado.',
    includes: ['Hoteles boutique en las tres islas', 'Ferris entre islas con billete reservado', 'Traslados entre puerto y hotel'],
    image: cicladasImg,
    imageAlt: 'Casas blancas de la Chora de Folegandros asomadas a un acantilado sobre el mar Egeo',
    imagePosition: '35% 50%',
  }),
  experience({
    id: 'alpes-suizos',
    group: 'europa',
    title: 'Alpes suizos en tren panorámico',
    region: 'Suiza',
    duration: '6 días',
    highlight: 'Del valle de Lauterbrunnen a los glaciares, por algunas de las vías más bonitas de Europa.',
    includes: ['Swiss Travel Pass de 6 días', 'Hoteles en Lauterbrunnen y Zermatt', 'Asiento reservado en el Glacier Express'],
    image: suizaImg,
    imageAlt: 'Chalet de madera sobre un prado verde frente a las cumbres nevadas del valle de Lauterbrunnen, Suiza',
    imagePosition: '45% 60%',
  }),
  experience({
    id: 'lofoten',
    group: 'europa',
    title: 'Lofoten y el sol de medianoche',
    region: 'Noruega',
    duration: '7 días',
    highlight: 'Pueblos de pescadores entre picos que caen al mar, con luz casi infinita en verano.',
    includes: ['Rorbuer, las cabañas de pescadores, frente al fiordo', 'Coche de alquiler y ruta diseñada día a día', 'Salida en barco por el Reinefjord'],
    image: lofotenImg,
    imageAlt: 'Casas rojas y blancas de Reine junto al agua, bajo picos iluminados por el atardecer en las islas Lofoten',
    imagePosition: '40% 60%',
  }),
  experience({
    id: 'islandia',
    group: 'europa',
    title: 'Islandia: costa sur y laguna glaciar',
    region: 'Islandia',
    duration: '8 días',
    highlight: 'Cascadas, playas de arena negra e icebergs a la deriva en Jökulsárlón.',
    includes: ['Granjas y hoteles rurales seleccionados', 'Todoterreno con seguro a todo riesgo', 'Navegación entre icebergs'],
    image: islandiaImg,
    imageAlt: 'Icebergs azulados flotando en la laguna glaciar de Jökulsárlón bajo un cielo nublado, Islandia',
    imagePosition: '50% 70%',
  }),

  /* --- Más allá de Europa --- */
  experience({
    id: 'australia',
    group: 'mundo',
    featured: true,
    title: 'Australia: Sídney, la Gran Barrera y Uluru',
    region: 'Australia',
    duration: '15 días',
    highlight: 'La bahía de Sídney, un día en el arrecife de coral y el amanecer en el desierto rojo, con los vuelos internos ya resueltos.',
    includes: ['Vuelos internos entre Sídney, Cairns y Uluru', 'Barco y snorkel en la Gran Barrera de Coral', 'Amanecer en Uluru con guía local'],
    image: australiaImg,
    imageAlt: 'La Ópera de Sídney y el puente de la bahía vistos desde el agua en un día soleado',
    imagePosition: '40% 40%',
  }),
  experience({
    id: 'japon',
    group: 'mundo',
    featured: true,
    title: 'Japón esencial: Tokio, Hakone y Kioto',
    region: 'Asia · Japón',
    duration: '12 días',
    highlight: 'Del neón de Tokio a las calles de madera de Kioto, con una noche en un ryokan junto a las aguas termales de Hakone.',
    includes: ['Tren bala con asientos reservados', 'Noche en ryokan con onsen y cena kaiseki', 'Guía local en Kioto y Nara'],
    image: japonImg,
    imageAlt: 'Calle empedrada de Yasaka-dori con casas de madera y farolillos, y la pagoda de Yasaka al fondo, en Kioto',
    imagePosition: '50% 30%',
  }),
];

/* ------------------------------------------------------------------ */
/* Viajes a Europa desde Latinoamérica                                 */
/* ------------------------------------------------------------------ */

/** Mensaje de WhatsApp de cada salida: país de origen, ruta y duración. */
export function latamMessage(country: string, route: string, duration: string): string {
  return `Hola, escribo desde ${country} y quiero viajar a Europa: ${route}, ${duration}, con vuelo incluido. Fechas y número de viajeros:`;
}

export interface LatamTrip {
  id: string;
  country: string;
  /** Ciudades de salida con vuelo directo o la mejor conexión. */
  cities: string;
  /** Puerta de entrada a Europa. */
  gateway: string;
  flightTime: string;
  route: string;
  duration: string;
  whatsappText: string;
}

function latamTrip(data: Omit<LatamTrip, 'whatsappText'>): LatamTrip {
  return { ...data, whatsappText: latamMessage(data.country, data.route, data.duration) };
}

/**
 * Salidas desde Latinoamérica, con vuelo de ida y vuelta incluido. Revisa las rutas aéreas cada
 * temporada (las aerolíneas cambian frecuencias).
 */
export const latamTrips: LatamTrip[] = [
  latamTrip({
    id: 'brasil',
    country: 'Brasil',
    cities: 'São Paulo, Río de Janeiro y otras capitales',
    gateway: 'Lisboa',
    flightTime: 'unas 10 h',
    route: 'Lisboa, Oporto y Madrid',
    duration: '12 días',
  }),
  latamTrip({
    id: 'colombia',
    country: 'Colombia',
    cities: 'Bogotá y Medellín',
    gateway: 'Madrid',
    flightTime: 'unas 10 h',
    route: 'Madrid, Andalucía y Lisboa',
    duration: '12 días',
  }),
  latamTrip({
    id: 'argentina',
    country: 'Argentina',
    cities: 'Buenos Aires',
    gateway: 'Madrid o Roma',
    flightTime: 'unas 12 h',
    route: 'Roma, Florencia, Venecia y Barcelona',
    duration: '14 días',
  }),
  latamTrip({
    id: 'chile',
    country: 'Chile',
    cities: 'Santiago',
    gateway: 'Madrid',
    flightTime: 'unas 13 h',
    route: 'Madrid, Barcelona y París',
    duration: '14 días',
  }),
  latamTrip({
    id: 'peru',
    country: 'Perú',
    cities: 'Lima',
    gateway: 'Madrid',
    flightTime: 'unas 12 h',
    route: 'Madrid, Toledo, Sevilla y Granada',
    duration: '12 días',
  }),
];

/** Lo que resuelve la agencia para quien viaja desde Latinoamérica. */
export const latamPerks = [
  {
    icon: 'passport',
    text: 'Sin visado para estancias turísticas de hasta 90 días en el espacio Schengen. Antes de pagar te enviamos por escrito los requisitos de entrada vigentes.',
  },
  { icon: 'plane', text: 'Vuelo de ida y vuelta incluido desde tu ciudad, con las conexiones más cómodas.' },
  { icon: 'lock', text: 'Pagas en euros con tarjeta internacional, Apple Pay o Google Pay, con un enlace seguro de Stripe.' },
] as const;

/* ------------------------------------------------------------------ */
/* Alquiler de vehículos (tierra y agua)                               */
/* ------------------------------------------------------------------ */

/** Mensaje de WhatsApp de cada vehículo: nombre exacto y hueco para destino y fechas. */
export function rentalMessage(name: string): string {
  return `Hola, quiero consultar disponibilidad y tarifa para alquilar: ${name}. Destino y fechas:`;
}

export interface RentalOption {
  id: string;
  name: string;
  detail: string;
  whatsappText: string;
}

export interface RentalCategory {
  id: 'carretera' | 'mar';
  title: string;
  intro: string;
  icon: 'car' | 'sailboat';
  image: ImageMetadata;
  imageAlt: string;
  caption: string;
  options: RentalOption[];
}

function rental(data: Omit<RentalOption, 'whatsappText'>): RentalOption {
  return { ...data, whatsappText: rentalMessage(data.name) };
}

export const rentalCategories: RentalCategory[] = [
  {
    id: 'carretera',
    title: 'Por carretera',
    intro: 'Para hacer la ruta a tu ritmo, parar donde quieras y llegar a los pueblos donde no llega el tren.',
    icon: 'car',
    image: carreteraImg,
    imageAlt: 'Curvas del paso del Stelvio subiendo entre montañas nevadas en los Alpes italianos',
    caption: 'Paso del Stelvio, Italia',
    options: [
      rental({ id: 'coche', name: 'Coche de alquiler', detail: 'Del utilitario al descapotable, con recogida en aeropuerto o estación.' }),
      rental({ id: '4x4', name: 'Todoterreno 4x4', detail: 'Para Islandia, las Highlands escocesas o los puertos alpinos.' }),
      rental({ id: 'camper', name: 'Camper o autocaravana', detail: 'Cama, cocina y la libertad de dormir donde te pille el atardecer.' }),
      rental({ id: 'minivan', name: 'Minivan con conductor', detail: 'Hasta 8 personas, para traslados y excursiones sin preocuparte de aparcar.' }),
    ],
  },
  {
    id: 'mar',
    title: 'Por mar',
    intro: 'Calas a las que solo se llega en barco, islas a tu aire y atardeceres fondeados lejos del puerto.',
    icon: 'sailboat',
    image: marImg,
    imageAlt: 'Yates y veleros amarrados en el puerto de Hvar, junto a los tejados rojos del pueblo y el Adriático',
    caption: 'Puerto de Hvar, Croacia',
    options: [
      rental({ id: 'lancha', name: 'Lancha sin titulación', detail: 'Pequeñas embarcaciones para recorrer calas por tu cuenta, según la normativa de cada país.' }),
      rental({ id: 'velero', name: 'Velero', detail: 'Con patrón, o sin él si tienes la titulación náutica que corresponde.' }),
      rental({ id: 'catamaran', name: 'Catamarán', detail: 'Más espacio y estabilidad a bordo, ideal para familias y grupos de amigos.' }),
      rental({ id: 'yate', name: 'Yate con tripulación', detail: 'Patrón y tripulación profesional, con la ruta que tú elijas.' }),
    ],
  },
];

/** Ventajas comunes a todos los alquileres. */
export const rentalPerks = [
  { icon: 'pin', text: 'Recogida en aeropuerto, estación, puerto o en tu alojamiento' },
  { icon: 'shield', text: 'Seguro y asistencia 24 h incluidos en cada alquiler' },
  { icon: 'steering', text: 'Con conductor o patrón profesional, si lo prefieres' },
  { icon: 'key', text: 'La fianza se bloquea en tu tarjeta, no se cobra' },
] as const;

/* ------------------------------------------------------------------ */
/* Opiniones de clientes                                               */
/* ------------------------------------------------------------------ */

export interface Testimonial {
  name: string;
  city: string;
  /** Viaje o servicio contratado y fecha. */
  trip: string;
  rating: 1 | 2 | 3 | 4 | 5;
  quote: string;
  /**
   * ⚠️ true = opinión de EJEMPLO. Publicar opiniones inventadas como reales está prohibido en la UE
   * (Directiva Ómnibus). Sustitúyelas por opiniones reales y pon `example: false`.
   * Mientras quede alguna en true, el build muestra un aviso.
   */
  example: boolean;
}

export const testimonials: Testimonial[] = [
  {
    name: 'Marta G.',
    city: 'Madrid',
    trip: 'Lofoten · julio de 2026',
    rating: 5,
    quote:
      'Reservamos Lofoten con muy poco margen porque se nos cayó otro plan, y aun así nos encontraron un rorbu en Reine con vistas al fiordo. A mitad de viaje cambió el tiempo y nuestra asesora nos rehízo la ruta del día siguiente por WhatsApp en diez minutos. El pago lo hice desde el móvil, en la cola del aeropuerto.',
    example: true,
  },
  {
    name: 'Valentina y Camilo',
    city: 'Medellín',
    trip: 'Madrid, Andalucía y Lisboa · abril de 2026',
    rating: 5,
    quote:
      'Era nuestro primer viaje a Europa y nos daba miedo todo: la escala, qué nos iban a preguntar en migración, si el seguro alcanzaba. Nos mandaron una lista con los papeles que había que llevar y nos consiguieron vuelo directo desde Medellín. Lo único, la diferencia horaria: a veces nos contestaban cuando acá era de madrugada, pero siempre contestaron.',
    example: true,
  },
  {
    name: 'Javier y Noelia',
    city: 'Barcelona',
    trip: 'Camper en Islandia · octubre de 2026',
    rating: 5,
    quote:
      'Nos daba respeto el tema del seguro de la camper (todo el mundo te habla de la grava y del viento). Nos explicaron qué cubría cada opción sin intentar colarnos la más cara. La fianza nos la liberaron a los pocos días de devolverla.',
    example: true,
  },
  {
    name: 'Andrés R.',
    city: 'Lyon',
    trip: 'Velero con patrón en Mallorca · junio de 2026',
    rating: 4,
    quote:
      'Lo mejor fue no tener que hablar con cinco empresas distintas: velero con patrón, coche en Palma y dos noches en Sóller, todo en el mismo chat. El patrón nos llevó a calas que no salían en ninguna guía. Una pega: el primer presupuesto tardó un día entero en llegar, en plena temporada.',
    example: true,
  },
  {
    name: 'Florencia P.',
    city: 'Berlín',
    trip: 'Toscana lenta · mayo de 2026',
    rating: 5,
    quote:
      'Soy argentina, vivo en Berlín y la verdad me daba desconfianza pagar con un link que te mandan por WhatsApp. Antes me pasaron todo por escrito, y el enlace era de Stripe con el nombre de la agencia, así que tranquila. Fui con mis viejos y el agriturismo de Pienza fue lo que más les gustó.',
    example: true,
  },
  {
    name: 'Sergio T.',
    city: 'Valencia',
    trip: 'Japón esencial · octubre de 2026',
    rating: 5,
    quote:
      'Doce días en Japón sin pelearme con ninguna web en japonés. Los trenes iban reservados, el ryokan de Hakone tenía onsen privado (muy recomendable) y la guía de Kioto nos llevó a Fushimi Inari a primera hora, antes de que llegaran los autobuses. Ya estamos mirando Corea con ellos.',
    example: true,
  },
  {
    name: 'Iñaki L.',
    city: 'Bruselas',
    trip: 'Alpes suizos en tren · septiembre de 2026',
    rating: 5,
    quote:
      'Pagué en tres plazos con Klarna, que en septiembre se agradece. El Glacier Express es tal cual te lo pintan, y lo de reservar el asiento con antelación fue un acierto.',
    example: true,
  },
  {
    name: 'Carlos M.',
    city: 'Lisboa',
    trip: 'Catamarán en las Cícladas · agosto de 2026',
    rating: 5,
    quote:
      'Éramos ocho y alquilamos un catamarán con patrón por las Cícladas. Un día sopló el meltemi y no se pudo salir de Naxos; nos reorganizaron el itinerario y nos devolvieron la noche de hotel que no usamos sin tener que reclamarlo dos veces.',
    example: true,
  },
];

/* ------------------------------------------------------------------ */
/* Preguntas frecuentes                                                */
/* ------------------------------------------------------------------ */

export interface Faq {
  question: string;
  /** HTML de confianza (escrito por nosotros): admite enlaces y <strong>. */
  answerHtml: string;
}

export const faqs: Faq[] = [
  {
    question: '¿Cómo funciona el pago con un enlace de Stripe en WhatsApp?',
    answerHtml:
      'Cuando tu viaje está confirmado, tu asesor te envía por WhatsApp un enlace de pago oficial de Stripe con el importe exacto y el nombre del viaje. Lo abres desde el móvil, eliges cómo pagar (tarjeta, Apple Pay, Google Pay o Klarna) y en segundos recibes el justificante por correo. La reserva queda confirmada a tu nombre.',
  },
  {
    question: '¿Es seguro pagar desde un enlace recibido por chat?',
    answerHtml: `Sí, siempre que el enlace sea de Stripe. Comprueba que la dirección empieza por <strong>https://buy.stripe.com</strong> o <strong>https://checkout.stripe.com</strong> y que en la página aparece «${site.name}». Nunca te pediremos los datos de tu tarjeta por mensaje ni transferencias a cuentas personales.`,
  },
  {
    question: '¿Puedo pagar a plazos con Klarna?',
    answerHtml:
      'Sí, si resides en uno de los países europeos donde opera Klarna. Al abrir el enlace de pago la verás como una opción más, que te permite fraccionar el importe en cuotas según las modalidades disponibles y sujeto a su aprobación. Antes de confirmar ves el calendario de pagos y cualquier coste. Desde Latinoamérica puedes pagar con tarjeta, Apple Pay o Google Pay.',
  },
  {
    question: '¿En qué moneda se cobra?',
    answerHtml:
      'Siempre en euros (€). El precio que te confirma tu asesor es el que pagas, sin comisiones añadidas por nuestra parte. Si tu tarjeta está asociada a una cuenta en otra moneda, tu banco aplicará su propio tipo de cambio.',
  },
  {
    question: '¿Cuánto tarda en responder el asesor?',
    answerHtml: `En horario de atención (${site.hours.charAt(0).toLowerCase()}${site.hours.slice(1)}) te responde una persona, normalmente en pocos minutos. Si escribes fuera de ese horario, te contestamos a primera hora del siguiente día laborable.`,
  },
  {
    question: '¿Puedo cambiar o cancelar mi reserva?',
    answerHtml:
      'Sí. Puedes pedir cambios de fecha o de viajeros según disponibilidad, y cancelar en cualquier momento antes de la salida. Las condiciones de cada viaje te las enviamos por escrito antes de pagar, y las devoluciones se hacen por el mismo método de pago en Stripe. Tienes todos los detalles en la <a href="/politica-de-reembolsos">política de reembolsos</a>.',
  },
  {
    question: '¿Por qué no publicáis precios?',
    answerHtml:
      'Porque cada viaje es a medida: el precio depende de las fechas, la temporada, la antelación y el número de viajeros. Escríbenos por WhatsApp y tu asesor te envía un presupuesto cerrado en euros, sin compromiso.',
  },
  {
    question: '¿El presupuesto incluye los vuelos?',
    answerHtml:
      'Depende del viaje. En las rutas por Europa, Australia y Asia, el presupuesto incluye lo que indica cada ruta (alojamiento, transporte interno, traslados y actividades) pero no los vuelos internacionales; tu asesor puede buscarlos y añadirlos. En los viajes desde Latinoamérica, el vuelo de ida y vuelta desde tu ciudad sí está incluido.',
  },
  {
    question: '¿Necesito visado para viajar a Europa desde Latinoamérica?',
    answerHtml:
      'Con pasaporte de Brasil, Colombia, Argentina, Chile o Perú no necesitas visado para estancias turísticas de hasta 90 días (dentro de un periodo de 180) en el espacio Schengen. El pasaporte debe seguir vigente al menos tres meses después de tu salida de Europa, y necesitarás la autorización electrónica ETIAS cuando sea obligatoria. Antes de pagar te enviamos por escrito los requisitos actualizados para tu caso.',
  },
  {
    question: '¿Qué necesito para alquilar un coche, una camper o un barco?',
    answerHtml:
      'Para vehículos de carretera, carné de conducir en vigor (normalmente con al menos un año de antigüedad) y una tarjeta a nombre del conductor principal para la fianza; la edad mínima suele estar entre 21 y 25 años según la categoría. Para llevar un velero o un yate sin patrón necesitas la titulación náutica que corresponda; si no la tienes, lo alquilamos con patrón. Te confirmamos los requisitos exactos antes de pagar.',
  },
  {
    question: '¿Cómo funciona la fianza del alquiler?',
    answerHtml:
      'La fianza se bloquea en tu tarjeta al recoger el vehículo o al embarcar, pero no se cobra: se libera al devolverlo en las condiciones pactadas. El importe depende del vehículo y te lo indicamos por escrito antes de reservar. Suele requerir tarjeta de crédito, no de débito.',
  },
  {
    question: '¿Necesito dar mis datos para pedir información?',
    answerHtml:
      'No. Consultar es gratis y sin compromiso: solo tienes que escribirnos por WhatsApp. Te pediremos los datos de los viajeros únicamente cuando decidas reservar, y los tratamos según nuestra <a href="/privacidad">política de privacidad</a>.',
  },
];
