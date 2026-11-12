// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Salida 100 % estática para Cloudflare Pages.
// - build.format "file" + trailingSlash "never": /aviso-legal se sirve sin redirección 308.
// - inlineStylesheets "always": cero hojas de estilo bloqueantes (el CSS va en el HTML).
// - Fuentes autoalojadas (RGPD: ninguna petición a Google Fonts) con fallbacks métricos
//   generados por Astro para evitar saltos de maquetación (CLS) al cargar la tipografía.
export default defineConfig({
  site: 'https://victoriatours.com', // ⚠️ RELLENAR: dominio definitivo (igual que site.domain)
  output: 'static',
  trailingSlash: 'never',
  // La compresión de Astro elimina los espacios con salto de línea antes de enlaces en línea
  // («conforme a los<a>términos»). Cloudflare ya sirve el HTML con Brotli.
  compressHTML: false,
  build: {
    format: 'file',
    inlineStylesheets: 'always',
  },
  fonts: [
    {
      // Newsreader estática: corte óptico de titular (opsz 40), peso 400, subconjunto latino: ~22 KB.
      provider: fontProviders.local(),
      name: 'Newsreader Display',
      cssVariable: '--font-newsreader',
      fallbacks: ['Georgia', 'serif'],
      options: {
        variants: [
          { src: ['./src/assets/fonts/newsreader-display-normal.woff2'], weight: '400', style: 'normal' },
          { src: ['./src/assets/fonts/newsreader-display-italic.woff2'], weight: '400', style: 'italic' },
        ],
      },
    },
    {
      // Albert Sans variable recortada a los pesos usados (400–600) y a latín: ~22 KB.
      provider: fontProviders.local(),
      name: 'Albert Sans',
      cssVariable: '--font-albert',
      fallbacks: ['Arial', 'sans-serif'],
      options: {
        variants: [
          { src: ['./src/assets/fonts/albert-sans-400-600.woff2'], weight: '400 600', style: 'normal' },
        ],
      },
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
