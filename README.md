# Victoria Tours

Landing estática de viajes a medida por Europa, Australia y Asia, viajes a Europa desde
Latinoamérica (Brasil, Colombia, Argentina, Chile y Perú, con vuelo incluido) y alquiler de
vehículos (coches, campers, veleros, yates…). Conversión 100 % por WhatsApp y cobro con enlaces
de pago de Stripe en euros (tarjeta, Apple Pay, Google Pay y Klarna).

- **Stack:** Astro 7 (salida estática) + Tailwind CSS 4. 0 KB de JS de frameworks: solo dos
  scripts en línea de menos de 1 KB (aviso de cookies y cierre del menú móvil, que es un
  popover nativo).
- **Rendimiento (Lighthouse 13.5, build local):** escritorio 100 · 100 · 100 · 100;
  móvil 98 · 100 · 100 · 100 (LCP 2,5 s en 4G simulado, CLS 0, TBT 0).
- **Fuentes autoalojadas** (sin Google Fonts, sin peticiones a terceros): Newsreader estática
  (22 KB) para titulares y Albert Sans (22 KB) para texto.
- **Imágenes:** AVIF con respaldo WebP, responsive, generadas por Astro en el build.

## Comandos

```bash
npm install
npm run dev        # desarrollo en http://localhost:4321
npm run build      # genera dist/
npm run preview    # sirve dist/
npm test           # build + preview + Playwright (escritorio 1440×900 y móvil 390×844)
```

Las pruebas usan el Chrome instalado en el sistema (`channel: 'chrome'`) y el puerto 4329.

## Dónde se edita cada cosa

| Qué | Archivo |
| --- | --- |
| WhatsApp, correo, teléfono, horario, datos fiscales y legales | `src/config/site.ts` → `site` |
| Mensajes prellenados de WhatsApp por botón | `src/config/site.ts` → `whatsappMessages` |
| Catálogo de 10 experiencias (8 en Europa y 2 fuera: qué incluye, foto, tarjeta grande…) | `src/config/site.ts` → `experiences` (`group`, `featured`) |
| Viajes desde Latinoamérica (ciudades de salida, ruta, vuelo) | `src/config/site.ts` → `latamTrips` y `latamPerks` |
| Alquiler de vehículos (tierra y mar) | `src/config/site.ts` → `rentalCategories` y `rentalPerks` |
| Opiniones de clientes | `src/config/site.ts` → `testimonials` |
| Preguntas frecuentes | `src/config/site.ts` → `faqs` |
| Créditos de las fotos | `src/config/photos.ts` |
| Colores y tipografía | `src/styles/global.css` (`@theme`) y `astro.config.mjs` (`fonts`) |
| Logotipo en la web | `src/components/Logo.astro` y el `<symbol id="i-logo">` de `src/layouts/BaseLayout.astro` |
| Textos legales | `src/pages/*.astro` |

La web no publica precios: el asesor envía el presupuesto por WhatsApp. Los mensajes se generan
solos a partir de los datos, para que el asesor sepa qué te interesa:

- Experiencia: «Hola, estoy en Europa y quiero consultar disponibilidad y tarifa para la experiencia: [Título]».
- Salida desde Latinoamérica: «Hola, escribo desde [País] y quiero viajar a Europa: [Ruta], [Días], con vuelo incluido. Fechas y número de viajeros:».
- Alquiler: «Hola, quiero consultar disponibilidad y tarifa para alquilar: [Vehículo]. Destino y fechas:».

## Logotipo y archivos de marca

El logo es una «V» de laurel (victoria) con una estrella de cuatro puntas (rumbo), junto al nombre
en versales: VICTORIA en la serif de los titulares y TOURS espaciado en la sans del texto. La
carpeta `brand/` (no se publica en la web) tiene los archivos para usarlo fuera:

| Archivo | Para qué |
| --- | --- |
| `victoria-tours-logo.svg` / `.png` | Logo horizontal en color, fondo transparente (texto en trazos, no necesita fuentes) |
| `victoria-tours-logo-blanco.svg` / `.png` | Versión clara para fondos oscuros |
| `victoria-tours-simbolo.svg` / `-blanco.svg` | Solo el símbolo |
| `victoria-tours-perfil-640.png` | Foto de perfil de WhatsApp Business y redes (se recorta en círculo sin perder el símbolo) |
| `victoria-tours-icono-512.png` | Icono de marca en Stripe (Configuración → Marca) |

El favicon y el icono de iOS están en `public/`.

## ⚠️ Antes de publicar

1. Busca `⚠️ RELLENAR` en `src/config/site.ts` y `astro.config.mjs` y sustituye: **dominio** (ahora
   `victoriatours.com` provisional, en los dos archivos), número de WhatsApp, teléfono,
   correo, razón social, NIF/CIF, domicilio, datos registrales, **código de agencia de viajes**
   y **garantía de insolvencia** (ambos obligatorios en España para vender viajes combinados).
2. Revisa las ventajas de `rentalPerks` (seguro, recogida, fianza), la tabla de cancelación de
   alquileres en `src/pages/politica-de-reembolsos.astro` y, cada temporada, las rutas aéreas de
   `latamTrips` (las aerolíneas cambian frecuencias).
3. **Opiniones:** las 8 actuales son de EJEMPLO (`example: true`) y el build lo avisa en cada
   ejecución. Publicar reseñas inventadas como reales está prohibido en la UE (Directiva Ómnibus,
   incorporada a la ley española) y se sanciona. Sustitúyelas por opiniones reales, pon
   `example: false` y asegúrate de cumplir lo que dice el texto de la sección («pedimos la opinión
   por correo… solo publicamos las de clientes con reserva confirmada») o cámbialo.
4. Haz revisar los textos legales por un abogado. Son una base sólida y actualizada (LSSI-CE,
   RGPD/LOPDGDD, TRLGDCU y Directiva (UE) 2015/2302), pero dependen de tu situación concreta.
5. La razón social y el dominio deben coincidir con los de tu cuenta de Stripe.
6. Si cambias alguna foto, actualiza `src/config/photos.ts` (las actuales son de Wikimedia
   Commons con licencias CC que exigen atribución, publicada en `/creditos`).

## Despliegue en Cloudflare Pages

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Variable de entorno:** `NODE_VERSION = 24`

`public/_headers` añade cabeceras de seguridad y caché inmutable de un año para `/_astro/*`.
Las URLs no llevan barra final (`/aviso-legal`), así que no hay redirecciones.

## Notas

- `_version-anterior/` guarda la versión previa del proyecto (ignorada por git, no se despliega).
  Puedes borrarla cuando quieras.
- El aviso de cookies guarda la elección en `localStorage` (`vt-cookie-consent`) y emite el
  evento `vt:consent`. Si algún día añades analítica, cárgala solo cuando el valor sea `all`.
