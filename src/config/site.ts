/**
 * src/config/site.ts — Configuración central de Brújula Europa.
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
import suizaImg from '../assets/photos/suiza.jpg';
import islandiaImg from '../assets/photos/islandia.jpg';
import carreteraImg from '../assets/photos/alquiler-carretera.jpg';
import marImg from '../assets/photos/alquiler-mar.jpg';

/* ------------------------------------------------------------------ */
/* Negocio                                                             */
/* ------------------------------------------------------------------ */

export const site = {
  name: 'Brújula Europa',
  domain: 'https://brujulaeuropa.com',
  description:
    'Viajes a medida y alquiler de coches, campers, veleros y yates por Europa, con asesor personal. Consulta por WhatsApp y paga en euros con un enlace seguro de Stripe: tarjeta, Apple Pay, Google Pay o a plazos con Klarna.',

  /** ⚠️ RELLENAR — WhatsApp del asesor en formato internacional, solo dígitos (sin +, espacios ni guiones). */
  whatsappPhone: '34600000000',
  /** ⚠️ RELLENAR — El mismo número, tal y como se muestra al usuario. */
  whatsappDisplay: '+34 600 000 000',
  /** ⚠️ RELLENAR — Correo de atención al cliente. */
  supportEmail: 'hola@brujulaeuropa.com',
  /** ⚠️ RELLENAR — Teléfono de atención. */
  phone: '+34 600 000 000',
  /** Horario de atención humana. */
  hours: 'Lunes a viernes, de 9:00 a 19:00 (CET)',

  legal: {
    /** ⚠️ RELLENAR — Razón social exacta, tal y como figura en Stripe. */
    company: 'Brújula Europa S.L.',
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
    lastUpdated: '10 de noviembre de 2026',
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
  general: 'Hola, estoy en Europa y me gustaría hablar con un asesor de Brújula Europa para organizar un viaje.',
  hero: 'Hola, estoy en Europa y quiero organizar un viaje a medida con Brújula Europa. ¿Me ayudas?',
  faq: 'Hola, tengo una pregunta antes de reservar con Brújula Europa:',
  closing: 'Hola, quiero diseñar un viaje a medida por Europa. Te cuento lo que tengo en mente:',
  rentals: 'Hola, estoy en Europa y quiero consultar el alquiler de un vehículo. Destino, fechas y número de personas:',
} as const;

/* ------------------------------------------------------------------ */
/* Precios                                                             */
/* ------------------------------------------------------------------ */

const euroNumber = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0, useGrouping: 'always' });

/** 1690 → «1.690 €» (con espacio de no separación para que el € no salte de línea). */
export function formatPrice(value: number, separator = ' '): string {
  return `${euroNumber.format(value)}${separator}€`;
}

/** Mensaje de WhatsApp de cada experiencia: incluye el nombre exacto y el precio desde. */
export function experienceMessage(title: string, priceFrom: number): string {
  return `Hola, estoy en Europa y quiero consultar disponibilidad y tarifa para la experiencia: ${title} (Desde ${formatPrice(priceFrom, ' ')})`;
}

/* ------------------------------------------------------------------ */
/* Catálogo                                                            */
/* ------------------------------------------------------------------ */

export interface Experience {
  id: string;
  title: string;
  region: string;
  duration: string;
  /** Frase gancho de la ruta. */
  highlight: string;
  /** Qué incluye (3 puntos, cortos). */
  includes: [string, string, string];
  /** Precio orientativo por persona en euros. */
  priceFrom: number;
  image: ImageMetadata;
  imageAlt: string;
  /** Encuadre de la foto en la tarjeta (valor CSS object-position). */
  imagePosition?: string;
  whatsappText: string;
}

/** Crea una experiencia y genera su mensaje de WhatsApp a partir del título y el precio. */
function experience(data: Omit<Experience, 'whatsappText'> & { whatsappText?: string }): Experience {
  return { ...data, whatsappText: data.whatsappText ?? experienceMessage(data.title, data.priceFrom) };
}

/**
 * Catálogo destacado. Los precios son orientativos («desde», por persona en habitación doble,
 * sin vuelos internacionales): ajústalos a tus tarifas reales.
 */
export const experiences: Experience[] = [
  experience({
    id: 'lofoten',
    title: 'Lofoten y el sol de medianoche',
    region: 'Noruega',
    duration: '7 días',
    highlight: 'Pueblos de pescadores entre picos que caen al mar, con luz casi infinita en verano.',
    includes: ['Rorbuer, las cabañas de pescadores, frente al fiordo', 'Coche de alquiler y ruta diseñada día a día', 'Salida en barco por el Reinefjord'],
    priceFrom: 1690,
    image: lofotenImg,
    imageAlt: 'Casas rojas y blancas de Reine junto al agua, bajo picos iluminados por el atardecer en las islas Lofoten',
    imagePosition: '40% 60%',
  }),
  experience({
    id: 'toscana',
    title: "Toscana lenta: Val d'Orcia y Siena",
    region: 'Italia',
    duration: '7 días',
    highlight: 'Colinas de cipreses, pueblos medievales y cenas largas en un agriturismo.',
    includes: ['Agriturismo en Pienza con desayuno', "Coche de alquiler y rutas por la Val d'Orcia", 'Cata de Brunello en Montalcino'],
    priceFrom: 1490,
    image: toscanaImg,
    imageAlt: "Hilera de cipreses junto a un campo arado con luz dorada de tarde en la Val d'Orcia, Toscana",
    imagePosition: '30% 50%',
  }),
  experience({
    id: 'cicladas',
    title: 'Cícladas a tu ritmo: Paros, Naxos y Folegandros',
    region: 'Grecia',
    duration: '9 días',
    highlight: 'Tres islas unidas en ferri, con calas tranquilas y pueblos encalados al borde del acantilado.',
    includes: ['Hoteles boutique en las tres islas', 'Ferris entre islas con billete reservado', 'Traslados entre puerto y hotel'],
    priceFrom: 1850,
    image: cicladasImg,
    imageAlt: 'Casas blancas de la Chora de Folegandros asomadas a un acantilado sobre el mar Egeo',
    imagePosition: '35% 50%',
  }),
  experience({
    id: 'duero',
    title: 'Oporto y el valle del Duero',
    region: 'Portugal',
    duration: '5 días',
    highlight: 'La ciudad de los azulejos y un valle de viñedos en terrazas, Patrimonio de la Humanidad.',
    includes: ['Hotel en Oporto y noche en una quinta del Duero', 'Crucero por el río y visita a dos bodegas', 'Tren panorámico de Oporto a Pinhão'],
    priceFrom: 890,
    image: dueroImg,
    imageAlt: 'Viñedos en terrazas sobre el río Duero y el pueblo de Pinhão, en el norte de Portugal',
    imagePosition: '55% 50%',
  }),
  experience({
    id: 'alpes-suizos',
    title: 'Alpes suizos en tren panorámico',
    region: 'Suiza',
    duration: '6 días',
    highlight: 'Del valle de Lauterbrunnen a los glaciares, por algunas de las vías más bonitas de Europa.',
    includes: ['Swiss Travel Pass de 6 días', 'Hoteles en Lauterbrunnen y Zermatt', 'Asiento reservado en el Glacier Express'],
    priceFrom: 2190,
    image: suizaImg,
    imageAlt: 'Chalet de madera sobre un prado verde frente a las cumbres nevadas del valle de Lauterbrunnen, Suiza',
    imagePosition: '45% 60%',
  }),
  experience({
    id: 'islandia',
    title: 'Islandia: costa sur y laguna glaciar',
    region: 'Islandia',
    duration: '8 días',
    highlight: 'Cascadas, playas de arena negra e icebergs a la deriva en Jökulsárlón.',
    includes: ['Granjas y hoteles rurales seleccionados', 'Todoterreno con seguro a todo riesgo', 'Navegación entre icebergs'],
    priceFrom: 2150,
    image: islandiaImg,
    imageAlt: 'Icebergs azulados flotando en la laguna glaciar de Jökulsárlón bajo un cielo nublado, Islandia',
    imagePosition: '50% 70%',
  }),
];

/** Precio más bajo del catálogo (se usa en textos y datos estructurados). */
export const lowestPrice = Math.min(...experiences.map((e) => e.priceFrom));

/* ------------------------------------------------------------------ */
/* Alquiler de vehículos (tierra y agua)                               */
/* ------------------------------------------------------------------ */

/** Mensaje de WhatsApp de cada vehículo: nombre exacto, precio por día y hueco para destino y fechas. */
export function rentalMessage(name: string, priceFrom: number): string {
  return `Hola, estoy en Europa y quiero consultar disponibilidad y tarifa para alquilar: ${name} (Desde ${formatPrice(priceFrom, ' ')}/día). Destino y fechas:`;
}

export interface RentalOption {
  id: string;
  name: string;
  detail: string;
  /** Precio orientativo por día en euros. */
  priceFrom: number;
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
  return { ...data, whatsappText: rentalMessage(data.name, data.priceFrom) };
}

/** Precios orientativos «desde» por día (temporada baja): ajústalos a tus tarifas reales. */
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
      rental({ id: 'coche', name: 'Coche de alquiler', detail: 'Del utilitario al descapotable, con recogida en aeropuerto o estación.', priceFrom: 39 }),
      rental({ id: '4x4', name: 'Todoterreno 4x4', detail: 'Para Islandia, las Highlands escocesas o los puertos alpinos.', priceFrom: 79 }),
      rental({ id: 'camper', name: 'Camper o autocaravana', detail: 'Cama, cocina y la libertad de dormir donde te pille el atardecer.', priceFrom: 95 }),
      rental({ id: 'minivan', name: 'Minivan con conductor', detail: 'Hasta 8 personas, para traslados y excursiones sin preocuparte de aparcar.', priceFrom: 290 }),
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
      rental({ id: 'lancha', name: 'Lancha sin titulación', detail: 'Pequeñas embarcaciones para recorrer calas por tu cuenta, según la normativa de cada país.', priceFrom: 150 }),
      rental({ id: 'velero', name: 'Velero', detail: 'Con patrón, o sin él si tienes la titulación náutica que corresponde.', priceFrom: 320 }),
      rental({ id: 'catamaran', name: 'Catamarán', detail: 'Más espacio y estabilidad a bordo, ideal para familias y grupos de amigos.', priceFrom: 650 }),
      rental({ id: 'yate', name: 'Yate con tripulación', detail: 'Patrón y tripulación profesional, con la ruta que tú elijas.', priceFrom: 1200 }),
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
    answerHtml:
      'Sí, siempre que el enlace sea de Stripe. Comprueba que la dirección empieza por <strong>https://buy.stripe.com</strong> o <strong>https://checkout.stripe.com</strong> y que en la página aparece «Brújula Europa». Nunca te pediremos los datos de tu tarjeta por mensaje ni transferencias a cuentas personales.',
  },
  {
    question: '¿Puedo pagar a plazos con Klarna?',
    answerHtml:
      'Sí. Al abrir el enlace de pago verás Klarna como una opción más, que te permite fraccionar el importe en cuotas según las modalidades disponibles y sujeto a su aprobación. Antes de confirmar ves el calendario de pagos y cualquier coste, sin sorpresas.',
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
    question: '¿Los precios incluyen los vuelos?',
    answerHtml:
      'Los precios «desde» incluyen lo que indica cada ruta: alojamiento, transporte interno, traslados y actividades. Los vuelos internacionales no están incluidos por defecto, pero tu asesor puede buscarlos y añadirlos a tu presupuesto.',
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
