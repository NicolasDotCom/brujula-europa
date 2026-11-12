/**
 * Créditos fotográficos. Las fotos proceden de Wikimedia Commons con licencias Creative Commons
 * que exigen atribución: se listan en /creditos y se enlazan desde el pie de página.
 * Si sustituyes una foto por otra propia, elimina su entrada aquí.
 */
export interface PhotoCredit {
  subject: string;
  usedIn: string;
  author: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
}

export const photoCredits: PhotoCredit[] = [
  {
    subject: 'Glacier Express sobre el viaducto de Landwasser (Suiza)',
    usedIn: 'Portada',
    author: 'Daniel Schwen',
    license: 'CC BY-SA 2.5',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.5/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:CH_Landwasser_2.jpg',
  },
  {
    subject: 'Reine junto a Gravdalsbukta, Lofoten (Noruega)',
    usedIn: 'Lofoten y el sol de medianoche',
    author: 'Ximonic (Simo Räsänen)',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Houses_of_Reine_by_Gravdalsbukta,_Moskenes,_Nordland,_Norway,_2022_June.jpg',
  },
  {
    subject: "Sombras largas en la Val d'Orcia (Italia)",
    usedIn: "Toscana lenta: Val d'Orcia y Siena",
    author: 'Albarubescens',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Il_momento_delle_ombre_lunghe_in_Val_d%27Orcia.jpg',
  },
  {
    subject: 'Chora de Folegandros (Grecia)',
    usedIn: 'Cícladas a tu ritmo',
    author: 'Etienne O. Dallaire',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Chora,_Folegandros,_Greece.jpg',
  },
  {
    subject: 'Valle del Duero en Pinhão (Portugal)',
    usedIn: 'Portugal: Lisboa, Oporto y el valle del Duero',
    author: 'peuplier (Suiza romanda)',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Portugal_Vall%C3%A9e_du_Douro_(8121915978).jpg',
  },
  {
    subject: 'Valle de Lauterbrunnen desde Mürren (Suiza)',
    usedIn: 'Alpes suizos en tren panorámico',
    author: 'Ximonic (Simo Räsänen)',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:View_to_Lauterbrunnen_valley_at_M%C3%BCrren,_Bern,_Switzerland,_2012_August.jpg',
  },
  {
    subject: 'Laguna glaciar de Jökulsárlón (Islandia)',
    usedIn: 'Islandia: costa sur y laguna glaciar',
    author: 'Jakub Hałun',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:J%C3%B6kuls%C3%A1rl%C3%B3n_glacier_lagoon,_Iceland,_20240719_0935_2448.jpg',
  },
  {
    subject: 'La Alhambra desde el mirador de San Nicolás, Granada (España)',
    usedIn: 'Andalucía: Sevilla, Córdoba y Granada',
    author: 'Diego Delso',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Granada_-_View_from_Mirador_de_San_Nicol%C3%A1s_-_02.jpg',
  },
  {
    subject: 'Gordes, Vaucluse (Francia)',
    usedIn: 'Provenza y la Costa Azul',
    author: 'kallerna',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Gordes_view_1.jpg',
  },
  {
    subject: 'Ópera de Sídney y Harbour Bridge (Australia)',
    usedIn: 'Australia: Sídney, la Gran Barrera y Uluru',
    author: 'DXR',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Sydney_Opera_House_and_Harbour_Bridge,_southeast_view_20230224_1.jpg',
  },
  {
    subject: 'Yasaka-dori y la pagoda de Yasaka, Kioto (Japón)',
    usedIn: 'Japón esencial: Tokio, Hakone y Kioto',
    author: 'Basile Morin',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Yasaka-dori_early_morning_with_street_lanterns_and_the_Tower_of_Yasaka_(Hokan-ji_Temple),_Kyoto,_Japan.jpg',
  },
  {
    subject: 'Paso del Stelvio desde Bormio (Italia)',
    usedIn: 'Alquiler por carretera',
    author: 'kallerna',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Stelvio_Pass_Bormio_side_2.jpg',
  },
  {
    subject: 'Yates en el puerto de Hvar (Croacia)',
    usedIn: 'Alquiler por mar',
    author: 'Schorle',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Hvar_yachten.JPG',
  },
  {
    subject: 'Barcos rabelo frente a la Ribeira de Oporto (Portugal)',
    usedIn: 'Sección de contacto',
    author: 'Jakub Hałun',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Rabelo_boats_and_Ribeira_seen_from_Cais_de_Gaia,_20250605_1623_9879.jpg',
  },
];
