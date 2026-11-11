import { defineConfig } from '@playwright/test';

// Las pruebas se ejecutan contra el build de producción (astro build + astro preview),
// en un puerto propio para no chocar con `astro dev` (4321).
const PORT = 4329;

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  fullyParallel: true,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    channel: 'chrome',
    locale: 'es-ES',
  },
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT} --host 127.0.0.1`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
  projects: [
    {
      name: 'desktop',
      use: { viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile',
      use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 },
    },
  ],
});
